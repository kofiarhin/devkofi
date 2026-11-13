#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
cd "$ROOT"
source "$ROOT/scripts/deploy.conf"

log() { printf '[deploy] %s\n' "$*"; }
fail() { printf '[deploy] ERROR: %s\n' "$*" >&2; exit 1; }

mode="${1:-deploy}"
case "$mode" in deploy|--check|--rollback) ;; *) fail "Use --check or --rollback";; esac
for cmd in git curl node flock cmp; do command -v "$cmd" >/dev/null || fail "Missing $cmd"; done
read -r -a dk <<< "$DEPLOY_DOCKER"
[[ ${#dk[@]} -gt 0 ]] || fail "Docker command not configured"
"${dk[@]}" info >/dev/null || fail "Docker unavailable"
[[ "$DEPLOY_PROJECT" == devkofi && "$DEPLOY_BRANCH" == main ]] || fail "Unexpected project configuration"
[[ "$DEPLOY_FRONTEND_SERVICE" == devkofi-frontend && "$DEPLOY_API_SERVICE" == devkofi-api ]] || fail "Unexpected service configuration"
[[ "$DEPLOY_FRONTEND_IMAGE" == devkofi-frontend && "$DEPLOY_API_IMAGE" == devkofi-api ]] || fail "Unexpected image configuration"
[[ "$DEPLOY_KEEP_RELEASES" =~ ^[0-9]+$ && "$DEPLOY_KEEP_RELEASES" -ge 3 ]] || fail "Keep at least three releases"
[[ "$DEPLOY_HEALTH_RETRIES" =~ ^[0-9]+$ && "$DEPLOY_HEALTH_RETRIES" -gt 0 ]] || fail "Invalid retry count"
[[ "$DEPLOY_HEALTH_DELAY" =~ ^[0-9]+$ && "$DEPLOY_HEALTH_DELAY" -gt 0 ]] || fail "Invalid retry delay"
[[ "$DEPLOY_ENV_FILE" == /* ]] &&
  sudo -n test -f "$DEPLOY_ENV_FILE" &&
  sudo -n test ! -L "$DEPLOY_ENV_FILE" ||
  fail "Missing/unsafe external production env file"
[[ "${DEVKOFI_FRONTEND_PORT:-8082}" == 8082 && "${DEVKOFI_PORT:-4001}" == 4001 ]] || fail "Unexpected production port"
[[ "$(git rev-parse --show-toplevel)" == "$ROOT" ]] || fail "Incorrect Git repository"
[[ "$(git branch --show-current)" == main ]] || fail "Expected main branch"
case "$(git remote get-url origin)" in
  https://github.com/kofiarhin/devkofi|https://github.com/kofiarhin/devkofi.git|git@github.com:kofiarhin/devkofi|git@github.com:kofiarhin/devkofi.git) ;;
  *) fail "Incorrect Git origin";;
esac
[[ -z "$(git status --porcelain)" ]] || fail "Dirty working tree; preserve changes"

# Prevent a development .env from changing production Compose interpolation.
export DEVKOFI_ENV_FILE="$DEPLOY_ENV_FILE"
compose=("${dk[@]}" compose --env-file /dev/null -p devkofi -f "$ROOT/compose.yaml")
if [[ "${dk[0]}" == sudo ]]; then
  compose=(sudo --preserve-env=DEVKOFI_ENV_FILE "${compose[@]:1}")
fi
"${compose[@]}" config --quiet || fail "Invalid Compose configuration"
state="$ROOT/.deploy-state"
[[ ! -L "$state" ]] || fail "Unsafe deploy-state symlink"
mkdir -p -m 700 "$state"
chmod 700 "$state"
exec 9>"$state/deploy.lock"
flock -n 9 || fail "Deployment already running"

services=(devkofi-frontend devkofi-api)
images=(devkofi-frontend devkofi-api)
ids=()
old_images=()
test_network=""
test_mongo=""
rollback_needed=false
rollback_file="$state/rollback.yaml"

write_overlay() {
  local dest="$1" front="$2" api="$3" tmp
  tmp="$(mktemp "$state/overlay.XXXXXXXX")"
  chmod 600 "$tmp"
  printf 'services:\n  devkofi-frontend:\n    image: %s\n    pull_policy: never\n  devkofi-api:\n    image: %s\n    pull_policy: never\n' "$front" "$api" > "$tmp"
  mv -f "$tmp" "$dest"
}
health_once() {
  local svc cid status
  for svc in "${services[@]}"; do
    mapfile -t running < <("${dk[@]}" ps -q --filter label=com.docker.compose.project=devkofi --filter "label=com.docker.compose.service=$svc")
    [[ ${#running[@]} -eq 1 ]] || return 1
    cid="${running[0]}"
    status="$("${dk[@]}" inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$cid")" || return 1
    [[ "$status" == healthy ]] || return 1
  done
  curl -fsS --max-time 5 http://127.0.0.1:8082/ >/dev/null || return 1
  curl -fsS --max-time 5 http://127.0.0.1:4001/health | node -e '
let s="";process.stdin.on("data",x=>s+=x).on("end",()=>{try{const j=JSON.parse(s);process.exit(j.message==="ok"&&j.db===1?0:1)}catch{process.exit(1)}})' || return 1
  curl -fLsS --max-redirs 3 --max-time 10 https://devkofi.com/ >/dev/null || return 1
  curl -fLsS --max-redirs 3 --max-time 10 https://devkofi.com/health | node -e '
let s="";process.stdin.on("data",x=>s+=x).on("end",()=>{try{const j=JSON.parse(s);process.exit(j.message==="ok"&&j.db===1?0:1)}catch{process.exit(1)}})' || return 1
}
wait_healthy() {
  local i
  for ((i=0;i<DEPLOY_HEALTH_RETRIES;i++)); do
    if health_once; then return 0; fi
    sleep "$DEPLOY_HEALTH_DELAY"
  done
  return 1
}
restore_previous() {
  [[ -s "$rollback_file" ]] || return 1
  "${compose[@]}" -f "$rollback_file" up -d --no-deps --no-build "${services[@]}" || return 1
  wait_healthy || return 1
  cp "$rollback_file" "$state/active.yaml"
  chmod 600 "$state/active.yaml"
  log "Both previous services restored and healthy"
}
on_exit() {
  local rc=$? n
  trap - EXIT
  set +e
  if [[ "$rollback_needed" == true ]]; then
    log "Cutover failed; attempting rollback of both services"
    restore_previous || log "CRITICAL: rollback failed; inspect production immediately"
  fi
  [[ -z "$test_mongo" ]] || "${dk[@]}" rm -f "$test_mongo" >/dev/null 2>&1
  if [[ -n "$test_network" ]]; then
    for n in 1 2 3; do "${dk[@]}" network rm "$test_network" >/dev/null 2>&1 && break; sleep 1; done
  fi
  exit "$rc"
}
trap on_exit EXIT
trap "exit 130" INT
trap "exit 143" TERM

# Manual recovery must work even when one of the live containers is stopped.
if [[ "$mode" == --rollback ]]; then
  [[ -s "$rollback_file" && -f "$state/active.yaml" ]] || fail "No tracked rollback release saved"
  restore_previous || fail "Rollback failed; inspect the live services"
  exit 0
fi

for svc in "${services[@]}"; do
  mapfile -t running < <("${dk[@]}" ps -q --filter label=com.docker.compose.project=devkofi --filter "label=com.docker.compose.service=$svc")
  [[ ${#running[@]} -eq 1 ]] || fail "Expected exactly one running $svc container"
  cid="${running[0]}"
  live_files="$("${dk[@]}" inspect -f '{{index .Config.Labels "com.docker.compose.project.config_files"}}' "$cid")"
  if [[ "$live_files" != "$ROOT/compose.yaml" ]]; then
    [[ "$live_files" != *,* && -f "$live_files" ]] || fail "$svc uses an unexpected Compose configuration"
    cmp -s "$live_files" "$ROOT/compose.yaml" || fail "$svc live Compose file differs; review before migration"
  fi
  ids+=("$cid")
  id="$("${dk[@]}" inspect -f '{{.Image}}' "$cid")"
  [[ "$id" == sha256:* ]] || fail "No live image ID for $svc"
  old_images+=("$id")
done

[[ "$("${dk[@]}" inspect -f '{{.HostConfig.NetworkMode}}' "${ids[1]}")" == host ]] || fail "API network configuration drift"
"${dk[@]}" inspect -f '{{json .NetworkSettings.Ports}}' "${ids[0]}" | node -e '
let s="";process.stdin.on("data",x=>s+=x).on("end",()=>{const p=JSON.parse(s)["8080/tcp"]||[];process.exit(p.length===1&&p[0].HostIp==="127.0.0.1"&&p[0].HostPort==="8082"?0:1)})' || fail "Unexpected frontend port exposure"

if [[ "$mode" != --rollback && -f "$state/active.yaml" ]]; then
  for i in 0 1; do
    expected="$("${compose[@]}" -f "$state/active.yaml" config --format json | node -e '
let s="";process.stdin.on("data",x=>s+=x).on("end",()=>console.log(JSON.parse(s).services[process.argv[1]].image))' "${services[$i]}")"
    saved="$("${dk[@]}" image inspect -f '{{.Id}}' "$expected")" || fail "Saved active image missing"
    [[ "$saved" == "${old_images[$i]}" ]] || fail "Live image drift detected for ${services[$i]}"
  done
fi

if [[ "$mode" == --check ]]; then
  health_once || fail "Existing DevKofi health checks failed"
  log "Preflight passed: $(git rev-parse --short HEAD)"
  exit 0
fi
log "Fetching latest main"
previous_commit="$(git rev-parse HEAD)"
git fetch --quiet origin main
git merge --ff-only refs/remotes/origin/main || fail "Fast-forward failed"
[[ -z "$(git diff --name-only "$previous_commit" HEAD -- compose.yaml scripts/deploy.sh scripts/deploy.conf)" ]] || fail "Deploy config/script changed since preflight; review and rerun"
[[ -z "$(git status --porcelain)" ]] || fail "Working tree changed unexpectedly"
commit="$(git rev-parse HEAD)"
short="${commit:0:12}"
front="devkofi-frontend:release-$short"
api="devkofi-api:release-$short"
candidate="$state/candidate.yaml"

log "Running frontend lint and Vitest in Docker"
"${dk[@]}" build -f Dockerfile.verify --target client-test -t "devkofi-verify-client:$short" .
write_overlay "$candidate" "$front" "$api"
"${compose[@]}" -f "$candidate" config --quiet || fail "Candidate Compose invalid"
log "Building both production images"
"${compose[@]}" -f "$candidate" build "${services[@]}"
log "Running backend Jest against an isolated disposable MongoDB"
"${dk[@]}" build -f Dockerfile.verify --target api-test -t "devkofi-verify-api:$short" .
test_network="devkofi-ci-$short-$$"
"${dk[@]}" network create --internal "$test_network" >/dev/null
# mongod needs 500 MiB free for index builds; its 200 MiB journal shares this tmpfs.
test_mongo="$("${dk[@]}" run -d --rm --name "devkofi-test-mongo-$short-$$" --network "$test_network" --network-alias test-mongo -e GLIBC_TUNABLES=glibc.pthread.rseq=1 --memory 768m --pids-limit 256 --tmpfs /data/db:rw,size=1g mongo:8 --quiet)"
ready=false
for ((n=0;n<30;n++)); do
  if "${dk[@]}" exec "$test_mongo" mongosh --quiet --eval 'db.adminCommand({ping:1}).ok' 2>/dev/null | grep -qx 1; then ready=true; break; fi
  sleep 2
done
[[ "$ready" == true ]] || fail "Isolated MongoDB not ready"
"${dk[@]}" run --rm --network "$test_network" \
  -e NODE_ENV=test -e MONGO_URI=mongodb://test-mongo:27017/devkofi_deploy_ephemeral \
  -e MONGO_URI_TEST=mongodb://test-mongo:27017/devkofi_deploy_ephemeral \
  -e JWT_SECRET=devkofi-deploy-test-only-secret \
  -e ADMIN_EMAIL=admin-ci@example.com -e ADMIN_PASSWORD=ci-test-password \
  -e CLIENT_URL=http://localhost:5173 -e IDEAHUB_API_URL=http://127.0.0.1:3999 \
  --memory 1g --pids-limit 256 "devkofi-verify-api:$short" npm test -- --runInBand
"${dk[@]}" rm -f "$test_mongo" >/dev/null
test_mongo=""
"${dk[@]}" network rm "$test_network" >/dev/null
test_network=""

stamp="$(date -u +%Y%m%d%H%M%S)"
old_front="devkofi-frontend:rollback-$stamp-${old_images[0]:7:12}"
old_api="devkofi-api:rollback-$stamp-${old_images[1]:7:12}"
"${dk[@]}" tag "${old_images[0]}" "$old_front"
"${dk[@]}" tag "${old_images[1]}" "$old_api"
write_overlay "$rollback_file" "$old_front" "$old_api"
log "Replacing only DevKofi frontend and API"
rollback_needed=true
"${compose[@]}" -f "$candidate" up -d --no-deps --no-build "${services[@]}" || fail "Compose cutover failed"
wait_healthy || fail "Health checks failed"
mv -f "$candidate" "$state/active.yaml"
rollback_needed=false

# No global prune. Keep the current and latest two release tags per service.
for i in 0 1; do
  svc="${services[$i]}"
  image="${images[$i]}"
  active="$("${dk[@]}" ps -q --filter label=com.docker.compose.project=devkofi --filter "label=com.docker.compose.service=$svc" | head -n1)"
  while IFS= read -r cid; do
    [[ -n "$cid" && "$cid" != "$active" ]] || continue
    oneoff="$("${dk[@]}" inspect -f '{{index .Config.Labels "com.docker.compose.oneoff"}}' "$cid")"
    [[ "$oneoff" == false || "$oneoff" == False ]] || continue
    "${dk[@]}" rm "$cid" >/dev/null 2>&1 || true
  done < <("${dk[@]}" ps -aq --filter label=com.docker.compose.project=devkofi --filter "label=com.docker.compose.service=$svc" --filter status=exited)
  mapfile -t tags < <("${dk[@]}" image ls --format '{{.Repository}}:{{.Tag}}' --filter "reference=$image:release-*")
  kept=0
  for tag in "${tags[@]}"; do
    [[ "$tag" == "$image:release-"* ]] || continue
    if [[ "$tag" == "$image:release-$short" ]]; then kept=$((kept+1)); continue; fi
    kept=$((kept+1))
    (( kept <= DEPLOY_KEEP_RELEASES )) && continue
    "${dk[@]}" image rm "$tag" >/dev/null 2>&1 || true
  done
done
"${dk[@]}" image rm "devkofi-verify-client:$short" "devkofi-verify-api:$short" >/dev/null 2>&1 || true
log "DEPLOYED DevKofi $short; both previous images retained for rollback"
