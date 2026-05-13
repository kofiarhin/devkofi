# Release Notes: GitHub Template Actions

## Request

Implement GitHub-backed template actions on the DevKofi templates page.

## User-Facing Changes

- Added the Codex Workflow Kit to the templates catalog.
- GitHub-backed templates can now show:
  - `Use Template`
  - `GitHub`
  - `Download`
- Existing templates without GitHub template URLs continue to show `Request this template`.

## Developer Changes

- Added optional `githubUrl`, `templateUrl`, and `releaseUrl` data fields to one template object.
- Updated `Templates.jsx` to render conditional primary and secondary actions.
- Added action-group and secondary-action CSS inside the existing inline style block.

## New Routes/APIs

none

## New Env Vars

none

## Database/Schema Changes

none

## Dependencies Added/Removed

none

## Test Commands Run

- `node -e "JSON.parse(require('fs').readFileSync('server/data/templates.json','utf8')); console.log('templates json ok')"` - passed
- `npx eslint client/src/Pages/Templates/Templates.jsx` - passed
- `npx jest server/tests/templates.test.js --runInBand --forceExit` - passed
- `npm run build --prefix client` - passed
- `npm run lint --prefix client` - failed on unrelated existing files outside this workflow
- `npx eslint src/Pages/Templates/Templates.jsx` from `client/` - passed

## Known Limitations

Full client lint still fails on unrelated existing files. The edited templates page lints cleanly.

## Follow-Up Work

- Clean existing client lint failures.
- Optional: add RTL coverage for template-card action variants.

## Suggested Commit Message

`feat: add github-backed template actions`
