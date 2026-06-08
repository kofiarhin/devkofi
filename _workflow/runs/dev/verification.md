# Deployment Verification

## Result

Passed.

## Deployment Output

- `git merge dev`: `Already up to date.`
- `heroku stack:set heroku-24 -a devkofi-api`: stack set; redeploy required.
- Deployment commit: `ee6093b`.
- `git push heroku main`: exit 0.
- Build stack: `Heroku-24`.
- Buildpack: `heroku/nodejs`.
- Node resolved: `20.20.2`.
- npm installed: `10.9.8`.
- Dependency install: 138 packages installed.
- Build: `Build succeeded!`
- Process type: `web`.
- Release: `v200`.
- Deploy verification: `done`.

## Runtime Output

- Active stack: `heroku-24`.
- Current release: `v200 Deploy ee6093b5`.
- Dyno: `web.1: up`.
- Startup command: `npm run start:server`.
- Server: started on Heroku-assigned port.
- Database: connected to MongoDB.
- State: `starting -> up`.
- Node one-off check: `v20.20.2`.
- npm one-off check: `10.9.8`.
- HTTP check: `HTTP_STATUS=200`.
- Response size: `CONTENT_LENGTH=7106`.
- Recent router checks: repeated `GET /api/projects` status 200.

## Error Review

- Startup errors: None.
- Dependency-load errors: None.
- Node execution errors: None.
- Environment-variable startup errors: None.
- Process crashes: None. Status 143 entries correspond to normal restart/idling.
- Deployment failures: None.

## Warnings

- Heroku reports Node 20.20.2 is EOL and may become a future build error.
- npm audit reports 4 moderate and 4 high vulnerabilities.
- `NPM_CONFIG_PRODUCTION=true` emits the npm recommendation to use
  `--omit=dev`.

## Command Recovery Notes

- A concurrent Node check failed because Eco permits one one-off dyno; serial
  retry passed.
- A PowerShell Start-Job wrapper around `heroku logs --tail` timed out; a finite
  `Select-Object -First 30` tail and `--num` log checks completed.
- Parallel local Git audit commands timed out; serial retries completed cleanly.
