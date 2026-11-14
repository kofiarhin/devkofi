# Standalone DevKofi deployment — Beast

Manual Docker Compose deployment for the **existing** `devkofi` project (frontend and API). Merge and production execution require separate approval. No Nginx, DNS, secrets or database migration is part of this implementation.

## Preconditions

- Use a clean checkout on `main` with Git `origin` pointing to `kofiarhin/devkofi`.
- The live containers must be on Compose project `devkofi`: frontend on loopback port 8082, backend using host networking on port 4001.
- The recorded live Compose file is `/home/ubuntu/apps/devkofi-docker/compose.yaml`, while a development checkout may be `/home/ubuntu/projects/devkofi`. The script permits a different checkout only when its Compose file is **identical** to the live one; otherwise stop and review before migrating.
- Production environment file stays at `/etc/devkofi/production.env`, outside Git. `DEVKOFI_ENV_FILE` may override only after live verification. Never print secrets.
- Requires Git, Docker Compose, curl, Node, flock and noninteractive sudo Docker (`DEVKOFI_DOCKER=docker` for approved direct Docker access). Check disk and memory first.

## Commands

```bash
npm run deploy:check
npm run deploy
npm run deploy:rollback
```

`deploy:check` checks clean Git, project identity, Compose configuration, live service labels, expected ports and both local/public health routes. It does not build or restart services. After a `deploy.sh` cutover or rollback the live labels list `compose.yaml` plus the tracked `.deploy-state` overlay; that pair is accepted only while `.deploy-state/active.yaml` matches the live images.

`deploy` fetches and fast-forwards `main`; validates frontend ESLint and Vitest in a Docker stage; builds both version-tagged production images (Vite build included); runs backend Jest in Docker using a new disposable MongoDB container isolated on a Docker-internal network. The test database `devkofi_deploy_ephemeral` is **not** the real production database `devkofi_test`. No production environment values are passed to tests.

Only after every check passes does it tag both previous live images and recreate the two DevKofi services, verify Docker health and local/public HTTP endpoints, and retain both rollback images. Failed cutovers attempt to restore both prior images.

`deploy:rollback` restores the saved previous image pair; it does not reverse any database changes. No schema migrations are in scope.

Cleanup targets only stopped DevKofi service containers and old DevKofi release images; no global prune, volume deletion or unrelated app changes.

**First run:** inspect the live Compose configuration and run `npm run deploy:check`. If it blocks on Compose mismatch, do not bypass. Production deployment still needs explicit approval and live verification. Reconcile the Beast VPS profile after a permanent release.

CI runs a Docker frontend lint/Vitest stage and production Vite build. The backend CI test container uses a test-only glibc rseq setting for compatibility with GitHub's newer Linux kernel; production MongoDB is unchanged.

**Verification update (12 Nov 2026):** The repair on `fix/deploy-vitest-suite` passes all 163 frontend tests locally and in the Docker client-test stage, with lint passing in both environments. See [per-file causes and verification](../verification/deployment-vitest.md). These are local branch results, not a CI result or production release. Keep the deployment test gate intact; CI and production approval remain required. The CI production Vite build is checked separately even when a test job fails.

Manual rollback can recover even when a current service container is stopped, provided a previous release was successfully saved by this script. Test MongoDB and Jest containers have memory/pid limits. Public HTTPS checks follow at most three redirects.
