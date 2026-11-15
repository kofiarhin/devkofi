# DevKofi — Automatic CI-gated Beast production deployment
**Status:** Proposed implementation specification; not implemented or approved for production activation  
**Date:** 15 November 2026  
**Repository:** `kofiarhin/devkofi` · default branch `main`  
**Reference implementation:** EscoWear GitHub Actions → Beast release pipeline, not a drop-in copy

## 1. Outcome

After a reviewed pull request is merged into `main`, GitHub Actions must run the existing DevKofi CI suite and, **only when the complete CI run succeeds for that exact commit**, automatically trigger a single, tightly scoped production deployment on Beast. The deployment must perform its own exact-commit verification, full existing Docker checks, paired frontend/API release, health checks, and safe rollback. GitHub must report the result. A CI failure, invalid event, missing credential, stale commit, unsafe workspace, or failed deployment preflight must **not** change live services.

Target flow:

```text
Feature branch -> reviewed PR -> separately approved merge to main
    -> CI: backend Jest + disposable MongoDB
         + deploy-script checks + frontend Docker lint/Vitest/build
    -> successful main CI run for immutable commit SHA
    -> deploy.yml validates event, CI jobs and current main HEAD
    -> restricted SSH session to Beast
    -> deploy script validates SHA/CI again and executes Docker gates
    -> paired frontend/API cutover -> health verification
    -> success or paired rollback -> GitHub Actions result
```

This is automation after an owner-approved merge, **not** authorization to merge, manually deploy, or change VPS production configuration during specification.

## 2. Verified codebase baseline

Inspected on `main` at `9514a4ed2280c3ed01e77eaa4adc7e4eb96e0c04`:

| File | Evidence |
| --- | --- |
| `.github/workflows/ci.yml` | CI runs on `pull_request`, `push` to `main`/`master`, and dispatch; jobs: `validate_backend` (Jest + MongoDB 8 service), `verify_deploy_scripts` (Bash, label tests, artifacts), `verify_frontend_docker` (Docker lint/Vitest and production Vite build). No production deploy job exists. |
| `package.json` | `deploy`, `deploy:check`, `deploy:rollback`, and `test:deploy` invoke the existing scripts. |
| `scripts/deploy.sh` | Checks branch/origin/clean tree/Compose topology, takes `flock`, fast-forwards `origin/main`, builds/test images, uses disposable MongoDB, snapshots both prior images, switches only DevKofi frontend and API, checks local/public health, and restores both previous images on cutover/health failure. Does **not** currently enforce successful GitHub CI for exact release SHA. |
| `scripts/deploy.conf` | Project `devkofi`; `main`; Docker `sudo -n docker`; external `/etc/devkofi/production.env`; 3 release tags; frontend 8082 and API 4001. |
| `compose.yaml` | Paired `devkofi-frontend` and `devkofi-api`; API uses host network, loopback port and externally managed production env. |
| `scripts/tests/deploy-compose-label.test.mjs` | Six regression cases for accepted base/candidate/rollback labels, external migration path, and rejection of unknown labels. |
| `docs/deployment/beast-docker.md` | Documents Docker topology and old controlled cutover. Must be updated to distinguish historical manual setup from current deployment operation. |

Operator-supplied history in IdeaHub `projects/devkofi.md` records a successful controlled Docker release and healthy frontend/API images at `9514a4e` on 14 November 2026. This is **not** a fresh VPS inspection. GitHub source is not proof of current SSH identity, sudo rules, external env-file permissions, running checkout path, free disk space, production Nginx configuration, or rollback inventory.

## 3. Scope

**In scope**
- Introduce `.github/workflows/deploy.yml` for an automatic deploy following `main` CI success.
- Add narrowly scoped, fail-closed release eligibility validation and tests (`scripts/check-ci.*` or equivalent), invoked by both GitHub and Beast.
- Extend `scripts/deploy.sh` to accept/check the exact requested commit, reject stale or unauthorized deployments, and preserve all existing preflight, tests, image pairs, rollback and cleanup protections.
- Provision a *separate* DevKofi restricted SSH deployment identity on Beast and GitHub Actions secrets; record non-secret setup instructions.
- Update `docs/deployment/beast-docker.md` with provisioning, observability, manual recovery, troubleshooting, rollback and token renewal.
- Test positive and negative conditions before enabling unattended releases; complete one approved controlled end-to-end validation release.

**Out of scope**
- Product/frontend/backend feature changes; data migrations; production database alterations; authentication/email/product changes; Nginx/DNS/TLS/firewall/public-port changes; removing PM2 or other apps; global Docker prune; modifying EscoWear infrastructure; introducing a new deployment platform; automated Git merges; making unrelated GitHub Actions changes.
- Granting GitHub-hosted runners Docker or root access to Beast; putting production environment secrets inside the Git checkout or GitHub job logs.
- Treating a successful workflow as automatic security, database, customer data, or business acceptance.

## 4. Exact trigger and CI contract

1. Keep `ci.yml` as the authoritative CI gate. Restrict the new `deploy.yml` trigger to `workflow_run` with `workflows: ["CI"]`, `types: [completed]`, `branches: [main]`. Its deploy job checks `workflow_run.event == "push"`, `workflow_run.conclusion == "success"`, the upstream `head_branch == "main"`, the exact repository name and full SHA; reject PR CI, dispatch CI, other repos/branches, failed/cancelled/skipped/neutral conclusions and untrusted reruns as appropriate.
2. Explicitly check all required upstream jobs (`validate_backend`, `verify_deploy_scripts`, `verify_frontend_docker`) completed successfully for the same upstream workflow run. If jobs are added/renamed later, update a maintained allowlist or required-job manifest; fail closed on missing jobs. The CI workflow's overall success is necessary but not the only evidence.
3. Before using SSH, query the authoritative remote `main` ref; require `workflow_run.head_sha == current refs/heads/main SHA`. Check again on Beast immediately before any production mutation. Do **not** deploy a later `main` tip under an older CI run.
4. Use the upstream `workflow_run.head_sha`, not the deploy workflow checkout's `github.sha` or a moving branch name, as the candidate. Validate exact 40-hex format and equality with verified refs. Never accept an arbitrary release SHA from an untrusted event payload or PR-supplied script.
5. Set one fixed `production` deployment concurrency group, `cancel-in-progress: false`; do not interrupt an executing production cutover. The final main-tip equality check must skip an old queued run in favor of a newer commit. Retain Beast `flock` protection across all manual and automatic releases.
6. Require minimal GitHub Actions permissions (at least `contents: read`, `actions: read` if job lookup uses its workflow token), job timeouts, pinned third-party action commit SHAs, no untrusted command interpolation, and no automatic invocation for pull requests. An optional protected GitHub `production` environment can provide audit/secret scoping, but environment rules must not silently block the requested fully automatic outcome.
7. GitHub branch/ruleset protection for `main` should require the CI job results, block direct pushes except explicitly reviewed emergency procedure, and retain manual merge approval. **Confirm current repo ruleset capabilities/permissions before enabling.** The upstream workflow currently also runs on `master`; this spec's production trigger is `main` only.

## 5. Trust boundary and credential plan

**Preferred architecture:** GitHub Actions runner opens a *single restricted SSH command* on Beast; it does not have arbitrary interactive shell, GitHub write access, host-wide sudo, or access to production secrets. GitHub runner passes only the already validated immutable SHA and minimal non-secret run context. Beast performs privileged, scoped operations through an allowlisted deployment wrapper.

- Create a dedicated `devkofi-deploy` service identity/key, **separate from EscoWear's** key and account. Disable password auth and interactive/port-forwarding capabilities for that key; use SSH `authorized_keys` restrictions/forced-command dispatcher with strict SHA validation. Confirm actual UID and file ownership before choosing final OS setup; no assumptions about existing permissions.
- Limit writable filesystem scope to a reviewed DevKofi-only deployment checkout and its owned state. Use a deploy-only checkout under an agreed path (preferred `/home/ubuntu/deploy/devkofi` only if host review shows migration is safe); **do not silently move** the live `/home/ubuntu/projects/devkofi` checkout or destroy it. Inspect `.deploy-state` overlays, live Compose labels, config path and rollback files before selecting a path.
- Only the approved deployment wrapper may execute the DevKofi `npm run deploy` and scoped `sudo -n docker` operations; inspect whether any necessary sudo permission is broader than the wrapper promises. If least privilege cannot be demonstrated, stop activation and present a reduced-permission design for approval.
- Store private SSH key, dedicated CI-read token (if Beast needs GitHub Actions API access), VPS hostname, SSH user, and pinned host key in GitHub Actions encrypted secrets/approved configuration. Never store, echo, commit, or transmit private keys/tokens in chat, CLI history, source, logs, or IdeaHub. Use `StrictHostKeyChecking=yes` with independently verified host key, never `ssh-keyscan` alone as trust.
- Use a read-only, short-lived or expiry-managed fine-grained CI-check credential for Beast only if required. Scope to `kofiarhin/devkofi` Actions/metadata read; no source write, admin, secrets or broader repositories. Capture expiry and renewal ownership outside secrets. Fail closed if missing, expired, unauthorized or unable to reach GitHub.
- Keep production `/etc/devkofi/production.env` root-owned and outside Git; do not change the file or print values. Reuse safe Compose env forwarding and existing loopback/Nginx topology. Never give the CI runner direct read access to this file.
- Ensure untrusted code from a PR can never run with production deployment credentials; the privileged workflow checks out only trusted merged `main` code and uses a reviewed wrapper at a controlled location. `workflow_run` is privileged: do not process artifacts/caches/scripts supplied by an unmerged PR.

## 6. Beast deployment script behavior

The script remains the canonical release executor; no replacement pipeline:

**Preflight / identity**
- Validate branch = `main`, origin = exactly `kofiarhin/devkofi`, clean working tree, expected root, paths, Compose labels, env-file safety, service names/ports/network, current image-pair and rollback state.
- In automated mode require `DEVKOFI_EXPECTED_SHA` (40-hex) and trusted CI evidence; operator/manual mode must remain explicitly authorized and protected by the same production release gate. Avoid treating a CI bypass environment flag as an authorization.
- Resolve candidate with `git fetch origin main` and fast-forward-only. Refuse dirty/unexpected paths. Before performing any build or cutover, require local `HEAD == expected SHA == origin/main == GitHub main SHA`. Check remote tip again immediately before switch. If a newer main commit arrived, skip/fail stale candidate rather than upgrade to it or roll back a separate newer release.
- Keep the code's existing safeguard against changed deployment files between preflight and fetch; when the first automation release itself modifies deployment scripts, use a separately verified bootstrap path rather than blindly bypassing this guard.

**Release**
- Build frontend client test image and require lint + full Vitest; build frontend/API images; run backend Jest in dedicated ephemeral isolated MongoDB (never `devkofi_test` production data, regardless of misleading shared name), isolated network, bounded memory/tmpfs. Keep current backend test image env test-only.
- Validate each production image's non-root readability/configuration before cutover where useful (informed by EscoWear's permission regressions); do not copy its exact chmod change without checking DevKofi's Dockerfiles.
- Save both previous image IDs/tags and a valid rollback overlay, then replace only `devkofi-frontend` and `devkofi-api` using existing Compose overlays, `--no-deps --no-build`, without modifying other project containers.
- Require both containers healthy and the existing loopback/public checks for `https://devkofi.com/`, `/health` and healthy MongoDB. Extend with safe read-only `/blog` or `/api/blog` smoke only if endpoint contract and IdeaHub API availability are verified, without exposing private data or causing writes. Use bounded retries.
- On cutover/health failure, attempt **paired** rollback to the saved frontend/API images and verify restored health. If rollback itself fails, emit critical status, preserve all evidence and never pretend release succeeded.
- Keep only scoped, reviewed image cleanup after verified success; preserve all running, active, and rollback images and do not invoke global Docker prune. Do not delete existing state/worktrees/old images during bootstrap.
- Emit structured, sanitized release evidence: commit SHA, run link, stage, preflight/CI/test results, image tags/IDs, health status, rollback status, start/end time; no token, env value, session cookie or sensitive API output. Explicit exit codes distinguish skip (stale/duplicate), gate failure, deploy failure, rollback failure.

## 7. Bootstrap and migration safety

The first merge containing this pipeline must not unintentionally deploy the automation bootstrap before Beast is prepared. Deployment may be disabled through an explicitly reviewed repository/environment activation gate or deployed in a non-mutating smoke mode initially. **Do not rely on a script preflight that is known to reject changed deployment files as the sole bootstrap safeguard.**

Owner-reviewed deployment activation sequence:

1. Read-only audit Beast: running container IDs/images/Compose labels, checkout and branch/dirty status, `.deploy-state`, rollback overlays, disk free and Docker storage, available tools, current sudo privileges, separate operator account options, SSH configuration, Nginx/PM2 dependency boundaries, public health and current GitHub CI. Do not print secret values.
2. Resolve the *single* canonical deployment checkout and strategy for preserving or safely migrating existing `.deploy-state` and Compose label absolute paths. Existing `scripts/tests/deploy-compose-label.test.mjs` hardcodes `/home/ubuntu/projects/devkofi`; parameterize it if a separate checkout is adopted, while keeping label spoofing protections. A normal repo commit does not make a copied state overlay safe.
3. Create constrained identity/host key verification, noninteractive service scoped sudo permissions, and GitHub secret configuration under **separate explicit infrastructure/credential approval**. Check ability to use a noninteractive, secure deploy command without touching EscoWear or other services.
4. Test CI gate, missing/expired auth, wrong SHA, PR/dispatch trigger, stale queued run, lock contention, stopped/failed health and rollback with mocks or staging, **not** by deliberately crashing production.
5. Land the workflow/scripts in one reviewed PR; keep the automated job inert until credentials, policies, checkout, bootstrap checks and recovery route are verified.
6. Enable automation only with explicit owner release approval, then use one small reviewed change to exercise PR CI → main CI → queued deploy → Beast gates → paired cutover → health → public smoke → evidence. Confirm no unrelated containers were restarted.
7. Maintain emergency manual `npm run deploy:check`/`npm run deploy:rollback` access through an authorized operator. Document exact recovery if CI or credential provisioning is down.

## 8. Verification and acceptance matrix

| Scenario | Required result |
| --- | --- |
| PR opened/updated | CI runs; production deploy job **does not** deploy. |
| Merge to `main`, all required CI jobs pass | Exactly one eligible automatic deploy for exact SHA; both services updated after preflight/tests; health green. |
| One CI job fails, is cancelled, skipped, or missing | Deploy blocked; live images unchanged. |
| CI success from `master`, PR, dispatch or foreign repository | No deploy. |
| Older passing run finishes after newer `main` commit | Old run skipped/blocked; never deploy newer unverified SHA. |
| `main` moves after GitHub-side eligibility check | Beast-side last-minute SHA check rejects stale release. |
| Invalid SHA, bad GitHub token, bad/missing SSH secret, untrusted host key | Fail closed before any production change; do not leak secret. |
| Dirty checkout, changed scripts, unexpected Compose labels or env symlink | Fail safely without overwriting operator work or cutting over. |
| Concurrent deploy or manual lock held | Serialized/blocked, never overlapping Docker builds/cutovers. |
| Frontend lint/Vitest, Docker build or isolated Jest fails | No service replacement; log failure and preserve live services. |
| New frontend or API fails health after cutover | Both services revert to saved pair; rollback health recorded; GitHub job fails. |
| Rollback also fails | Critical failure with explicit manual recovery steps, no green conclusion. |
| Valid successful cutover | HTTPS home + API health + database response pass; correct image SHA; two services healthy; other apps untouched. |
| Operator manual recovery | Runbook allows scoped rollback with same production safety gates; no dependency on GitHub runner staying online. |
| Audit logs | No secrets printed; exact commit/run and release/rollback outcomes identifiable. |

**Required test additions:** focused unit/fixture tests for API eligibility and SHA/current-tip checks; job-list completeness; cancellation/rerun semantics; shell syntax and negative preflight; identity/command allowlisting; concurrency; mocked rollback; existing deploy label regressions; real repo CI; one approved live integration smoke. Do not claim pass until actual evidence is collected.

## 9. Implementation artifacts

- **New:** `.github/workflows/deploy.yml` — workflow-run trigger, immutable SHA gate, job verification, concurrency, minimal permissions, SSH invocation and cleanup.
- **New:** `scripts/check-ci.cjs` or a comparably scoped maintained checker with tests in `scripts/tests/`, used by both workflow and Beast.
- **Update:** `scripts/deploy.sh` and possibly `scripts/deploy.conf` — automated SHA mode, CI enforcement, stale-run prevention, structured evidence, retain rollback.
- **Update:** `.github/workflows/ci.yml` only if a small verified change is needed to give an unambiguous required-job contract; do not weaken tests.
- **Update:** `docs/deployment/beast-docker.md` — operator runbook, SSH setup, secret names, workflow gate, bootstrap, manual recovery, observability and expiry rotation.
- **Optional:** dedicated deployment permissions/forced-command script under `scripts/` if infrastructure audit supports it.
- **No default dependencies, data migrations, application routes, customer records, secrets, Nginx/ports, or other projects changed.**

## 10. Failure modes and operations

- **GitHub/SSH unavailable:** job red; live unchanged; retry later only after rechecking exact main SHA; never deploy an outdated run by hand without new verification.
- **CI passes but Beast build/test fails:** job red; untouched live containers; inspect logs and disk/permissions; repair through a new reviewed PR, not a silent bypass.
- **Health degradation:** automatic paired rollback and red job; page operator on rollback failure. Browser smoke and sustained monitoring are separate from instantaneous health.
- **Low disk:** block early based on audited build headroom; do not prune unrelated projects or delete rollback assets without separate approval.
- **New scripts/identity not yet active:** bootstrap job must remain disabled/no-op; do not change live services or SSH config implicitly by merging documentation.
- **Noisy workflow re-runs:** duplicate same-SHA release must be idempotent or explicitly skip with traceable status; no repeat image churn by default.
- **Credentials:** record expiration/rotation owner and rehearsal; avoid EscoWear's CI-token renewal becoming a shared secret or dependency.

## 11. Material decisions to confirm before implementation

1. **Deployment checkout/identity:** Prefer dedicated `/home/ubuntu/deploy/devkofi` with separate restricted `devkofi-deploy` identity **if Beast audit establishes safe handling of current Compose labels and `.deploy-state`**. Otherwise preserve `/home/ubuntu/projects/devkofi` temporarily and design restricted access there. Never guess.
2. **Activation:** Recommend merged but inactive bootstrap until VPS identity, CI token, checks and rollback are verified. Enabling actual automatic production release requires separate approval because a merge would thereafter become a production trigger.
3. **Branch protection:** Require CI checks on `main` if GitHub repository policy permits. Confirm whether changes to rulesets are separately authorized.
4. **Freshness/duplicate behavior:** Recommend fail/skip stale runs and no-op duplicate SHA; choose structured status that makes skipped deployments observable without implying a successful release.
5. **CI credential lifetime:** Prefer short-lived scoped read access with documented renewal and redacted handling; implementation must confirm precise available GitHub API authentication mode.

These are explicit implementation-readiness gates, not permission to invent production host facts.

## 12. Done definition

**Specified** when this document is reviewed and material decisions resolved. **Implemented** when code and mock/CI tests exist on an isolated feature branch. **Verified** when branch CI and negative cases pass. **Approved to merge** only by owner. **Activated** only after separately approved Beast identity/credential configuration. **Deployed/runtime verified** only when a real `main` merge triggers GitHub Actions, the exact SHA is deployed, both containers and public frontend/API/DB health pass, rollback evidence is present, and no other apps are affected.

Source of truth: GitHub for code/CI, Beast for live runtime, Linear for execution state, IdeaHub for durable design/decisions. Keep these states distinct.
