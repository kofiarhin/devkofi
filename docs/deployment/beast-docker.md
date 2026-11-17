# DevKofi — Beast Docker deployment (frontend + API)

## Scope and approvals

Sections from "Design" to "Rollback" record the original Docker setup and the completed manual cutover; they are history, not current operating steps. Current releases use `scripts/deploy.sh` and are described in "Releases" below.

This repository change only prepares Docker support. It does not authorize a Git push, production deployment, Nginx edit, PM2 stop, or secret change. Obtain explicit approval for each consequential action in the production cutover plan.

Compose runs two services: `devkofi-frontend` (static React build served by non-root nginx) and `devkofi-api` (Express).

## Design

- Node 20, matching root `package.json` engine constraint.
- Frontend: `nginxinc/nginx-unprivileged` on container port 8080, published only on `127.0.0.1:${DEVKOFI_FRONTEND_PORT:-8082}`. It runs as uid 101 with all capabilities dropped and a read-only filesystem (stock `nginx` cannot start without `CHOWN`/`SETUID`).
- The client is built with `VITE_API_URL=""` (same-origin), so the browser calls `/api/...` on `devkofi.com` and Beast's Nginx routes it to the API container. Override with `--build-arg VITE_API_URL=...` only for a different topology.
- Frontend nginx uses `absolute_redirect off` so directory redirects (e.g. `/projects` → `/projects/`) stay on the public HTTPS origin, returns real 404s for missing `/assets/*`, caches hashed assets for a year and never caches `index.html`.
- The API listens on `127.0.0.1:4001` by default, while existing PM2 may continue on port 4000.
- Host networking is intentional: IdeaHub currently listens only on host loopback (`127.0.0.1:3000`). Docker bridge networking would break that connection. Host networking sacrifices network isolation, so the API must remain bound to loopback.
- No published Docker ports. The service has a read-only filesystem, dropped capabilities, a non-root user, a 300 MB memory limit, and rotated logs.
- The container health check requires a connected MongoDB and `/health` returning `message: "ok"`. A fake database URI will not produce a healthy container.

## Prepare and verify (non-production)

1. Inspect current VPS services, Git state, Node runtime, Nginx configuration, and current environment variable **names** without printing values.
2. Check the image build: `docker build -t devkofi-api:check .`.
3. Run existing backend tests (`npm test`) and frontend build (`npm --prefix client run build`) in a suitable development/CI environment. Report failed or unavailable checks rather than claiming success.
4. For an isolated smoke test, use a temporary MongoDB test instance and test-only credentials. Use an approved loopback port not already in use. Never point smoke tests at production data.
5. Check the API `/health`, `/api/projects`, `/api/blog`, logs, restarts, and IdeaHub connectivity. Confirm loopback-only binding with `ss -ltnp`.
6. Check the frontend: SPA routes return `index.html`, `/projects` redirects to the relative `/projects/`, a missing `/assets/x.js` returns 404, and the container is healthy.
7. Compose reads `.env` in the project directory for variable interpolation. Run Compose from a clean checkout without a `.env`, or pass `--env-file <empty file>`; a development `.env` with non-`KEY=VALUE` lines makes Compose fail to parse it.

Never run the server test suite with an environment that points at the production database: some tests delete collections (for example `NewsletterSubscriber.deleteMany({})`).

Note: `server/config/db.js` exits the process when MongoDB is unreachable, so the API container restarts until the database is reachable (`restart: unless-stopped`). This matches the previous PM2 behaviour.

## Proposed production cutover (separate approval required)

1. Record PM2 state, listening ports, Nginx configuration, and public health/response baselines for DevKofi and other hosted sites.
2. Confirm the exact production environment-file path without exposing its contents. Set `DEVKOFI_ENV_FILE` to that absolute path for Compose. Ensure the path is not inside the Git repository.
3. Build from a reviewed, approved Git commit on Beast. Use the commit SHA to identify the image; do not deploy an unreviewed moving branch.
4. Start Docker on loopback port 4001 while PM2 stays on 4000. For example, with the approved environment-file path configured, run `docker compose up -d --build`. Do not use this example until the deployment is approved.
5. Verify MongoDB state (`db: 1`), API endpoints, IdeaHub blog responses, container health, logs, and restart count.
6. Back up only the relevant Nginx site configuration to an approved safe location. Change the DevKofi `/api/` and `/health` proxy targets from port 4000 to 4001 and replace the static `/var/www/devkofi` root with a `location /` proxy to `127.0.0.1:8082`. Keep the Certbot TLS blocks unchanged. Check `nginx -t`, then reload Nginx. Do not change unrelated virtual hosts.
7. Verify public URLs, HTTPS, redirects, API responses, and other hosted sites against baseline.
8. Keep PM2 serving port 4000 and `/var/www/devkofi` as the immediate rollback target. Removing PM2 or the old static files requires separate approval.
9. Run and verify the established Beast profile updater after verified permanent infrastructure changes. Update the relevant Linear issue with actual results.

## Rollback

If the Docker cutover fails, restore the approved backed-up Nginx site configuration, validate with `nginx -t`, reload Nginx, and confirm PM2 still serves DevKofi on port 4000 and `/var/www/devkofi` still serves the frontend. Do not delete the container, PM2 process, or backup as part of automatic rollback.

## Known limitations

- Host networking reduces container network isolation.
- A successful Docker image build is not proof of runtime connectivity.
- A production-like smoke test needs a reachable non-production MongoDB; fake credentials are insufficient for a healthy `/health`.
- Verify Node 20 behavior against the live application's dependencies and runtime before cutover.

## Releases (`scripts/deploy.sh`)

`npm run deploy:check` (read-only preflight), `npm run deploy` and `npm run deploy:rollback` run on Beast. Every release, manual or automatic, must pass `scripts/check-ci.cjs`: the commit must be the current tip of `main` and the CI workflow's push run for that exact commit must have passed every job (anonymous public GitHub API; any GitHub error or rate limit refuses the release). There is no bypass flag.

A release also refuses to start when the checkout or Docker data filesystem has less than `DEPLOY_MIN_FREE_MB` (3072 MB) free, and it re-reads `origin/main` just before switching containers. Manual and automatic releases share the host lock `/home/ubuntu/.devkofi-deploy.lock`. After success it keeps the newest `DEPLOY_KEEP_RELEASES` release tags and rollback tags per service, plus the pair named in `.deploy-state/rollback.yaml`; there is no global prune.

Exit codes: `0` released, `1` failed with live services unchanged or restored, `64` bad input, `65` CI not passed, `69` GitHub unavailable, `70` rollback failed (critical), `73` another release holds the lock, `75` skipped (stale commit or already live), `76` the commit changes deployment tooling and must be released by hand (wrapper only). Each run ends with one sanitized `[deploy] RESULT ...` line.

## Automatic CI-gated releases (IDE-142, active since 2026-11-17)

Flow: merge to `main` → CI → `.github/workflows/deploy.yml` (`workflow_run`) checks event, branch, repository and every CI job → SSH as `devkofi-deploy` → forced command `devkofi-deploy-ssh` → `sudo -u ubuntu devkofi-deploy-run deploy <sha> <run-id>` → `deploy.sh` with `DEVKOFI_EXPECTED_SHA`.

Status: active. Phase 2 (account, SSH, sudoers, release checkout, secrets) and Phase 3 (wrapper release of d8b4083, rollback to the 9514a4e images and forward again) were completed on 2026-11-17, and `DEVKOFI_AUTO_DEPLOY` is now `true`. Setting it to anything else switches automatic releases off again. It needs the `Production` environment secrets `BEAST_HOST`, `BEAST_KNOWN_HOSTS` (independently verified host key line, never only `ssh-keyscan`) and `DEVKOFI_DEPLOY_SSH_KEY` (dedicated key, not EscoWear's). Missing secrets fail the job before anything on Beast runs.

Why a separate checkout: `/home/ubuntu/projects/devkofi` is writable by `beast-agent` and `ubuntu` has full sudo, so releasing from it as `ubuntu` would give `beast-agent` root. Automatic releases run only from `/home/ubuntu/deploy/devkofi` (inside the private `/home/ubuntu/deploy`, mode 700), with logs and lock in `/home/ubuntu/deploy/devkofi-automation`. Anything merged to `main` still runs as `ubuntu` on Beast, so merge rights are effectively host-admin rights; require CI on `main` and keep merges owner-approved.

Templates in `scripts/beast/` are **not installed** by merging. Provisioning (Phase 2, separate approval for account, SSH, sudoers and secrets):

1. Create the `devkofi-deploy` system user (no password, `/bin/sh`), install its public key in `authorized_keys` with `restrict`.
2. Install `devkofi-deploy-ssh` and `devkofi-deploy-run` root-owned 0755 in `/usr/local/sbin`, `sudoers.devkofi-deploy` as `/etc/sudoers.d/devkofi-deploy` (0440, `visudo -cf`), `sshd-devkofi-deploy.conf` as `/etc/ssh/sshd_config.d/99-devkofi-deploy.conf` (`sshd -t`, then reload).
3. Clone `https://github.com/kofiarhin/devkofi.git` to `/home/ubuntu/deploy/devkofi` on `main` at the live commit. Copy `.deploy-state/active.yaml` and `rollback.yaml` from the old checkout into a new mode-700 `.deploy-state`. Do not move or delete the old checkout.
4. Run `ssh devkofi-deploy@<host> check`. The preflight accepts the old checkout's Compose labels (`DEPLOY_LEGACY_ROOT`) only when the copied `active.yaml` matches the live image IDs and both `compose.yaml` files are identical.
5. Set the three secrets.

Activation (Phase 3, separate approval): merge, verify `check`, release once through the wrapper so containers are relabelled to the new checkout, then set `DEVKOFI_AUTO_DEPLOY=true` and exercise the full chain with one small reviewed change. From then on, run manual `deploy:check`/`deploy`/`deploy:rollback` only from `/home/ubuntu/deploy/devkofi`.

Commits that change `compose.yaml`, `scripts/deploy.sh`, `scripts/deploy.conf`, `scripts/deploy-compose-label.sh` or `scripts/check-ci.cjs` are never released unattended: the wrapper exits 76 and the job goes red. Release them by hand, exactly as for PR #72: `git merge --ff-only origin/main` in the release checkout, `npm run deploy:check`, then `npm run deploy` (the CI gate still applies). This includes the first release of this change.

### Recovery

- Workflow red, exit 73: another release was running; re-run the job after it ends.
- Workflow red, exit 76: release by hand as above.
- Workflow red, exit 65/69/1: live services were not changed or were restored. Read the full log in `/home/ubuntu/deploy/devkofi-automation/logs/`, fix through a reviewed PR; never deploy an older run by hand.
- Exit 70: production may be degraded. Run `npm run deploy:rollback` from the release checkout, check `docker ps` and `https://devkofi.com/health`.
- GitHub or the deploy key unavailable: an authorized operator can still run `npm run deploy:check` and `npm run deploy:rollback` on Beast. `npm run deploy` still requires CI to have passed.
- Low disk: free space only with an approved, DevKofi-scoped cleanup; never delete the live or rollback images.
- Rotating the deploy key: generate a new key, replace the `authorized_keys` line and `DEVKOFI_DEPLOY_SSH_KEY` together, then run `check`. No CI token exists to renew.
