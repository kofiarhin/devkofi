# DevKofi — Beast Docker deployment (frontend + API)

## Scope and approvals

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
