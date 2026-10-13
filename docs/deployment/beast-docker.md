# DevKofi API — Beast Docker deployment

## Scope and approvals

This repository change only prepares Docker support. It does not authorize a Git push, production deployment, Nginx edit, PM2 stop, or secret change. Obtain explicit approval for each consequential action in the production cutover plan.

The React client is not included in this API container. Keep its existing hosting unchanged.

## Design

- Node 20, matching root `package.json` engine constraint.
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

## Proposed production cutover (separate approval required)

1. Record PM2 state, listening ports, Nginx configuration, and public health/response baselines for DevKofi and other hosted sites.
2. Confirm the exact production environment-file path without exposing its contents. Set `DEVKOFI_ENV_FILE` to that absolute path for Compose. Ensure the path is not inside the Git repository.
3. Build from a reviewed, approved Git commit on Beast. Use the commit SHA to identify the image; do not deploy an unreviewed moving branch.
4. Start Docker on loopback port 4001 while PM2 stays on 4000. For example, with the approved environment-file path configured, run `docker compose up -d --build`. Do not use this example until the deployment is approved.
5. Verify MongoDB state (`db: 1`), API endpoints, IdeaHub blog responses, container health, logs, and restart count.
6. Back up only the relevant Nginx site configuration to an approved safe location. Change the DevKofi API proxy target from port 4000 to 4001, check `nginx -t`, then reload Nginx. Do not change unrelated virtual hosts.
7. Verify public URLs, HTTPS, redirects, API responses, and other hosted sites against baseline.
8. Keep PM2 serving port 4000 as the immediate rollback target. Removing PM2 requires separate approval.
9. Run and verify the established Beast profile updater after verified permanent infrastructure changes. Update the relevant Linear issue with actual results.

## Rollback

If the Docker cutover fails, restore the approved backed-up Nginx site configuration, validate with `nginx -t`, reload Nginx, and confirm PM2 still serves DevKofi on port 4000. Do not delete the container, PM2 process, or backup as part of automatic rollback.

## Known limitations

- Host networking reduces container network isolation.
- A successful Docker image build is not proof of runtime connectivity.
- A production-like smoke test needs a reachable non-production MongoDB; fake credentials are insufficient for a healthy `/health`.
- Verify Node 20 behavior against the live application's dependencies and runtime before cutover.
