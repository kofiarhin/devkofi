# Work Request

This file is auto-managed by the workflow. It stores the latest active work request, usually copied from the user's direct Codex prompt.

## Request

Implement GitHub-backed template actions on the DevKofi templates page.

Repository: `kofiarhin/devkofi`

Goal:
Update the existing templates system so templates can optionally link to GitHub, GitHub template generation, and release downloads instead of only showing "Request this template".

Requested files to inspect first:
- `server/data/templates.json`
- `client/src/Pages/Templates/Templates.jsx`
- `client/src/services/templateService.js`
- `client/src/hooks/queries/useTemplates.js`

Requirements:
- Add a `codex-workflow-kit` template object to `server/data/templates.json` with GitHub, template generation, and latest release URLs.
- In `Templates.jsx`, destructure optional `githubUrl`, `templateUrl`, and `releaseUrl` from each template.
- Show "Use Template" as the primary external CTA when `templateUrl` exists.
- Keep "Request this template" linking to `/contact` when `templateUrl` does not exist.
- Show "GitHub" as a secondary external CTA when `githubUrl` exists.
- Show "Download" as a secondary external CTA when `releaseUrl` exists.
- Add `.template-card__actions` and secondary action styles in the existing inline style block.
- Preserve loading, error, and empty states.
- Existing templates without GitHub fields must still show "Request this template".
- Do not change the backend controller unless required.
- Do not add a database.
- Do not introduce Axios or new dependencies.

Validation:
- Ensure JSON is valid.
- Ensure Vite build passes.
- Ensure no JSX syntax errors.
- Run existing frontend/backend checks available in the repo where practical.

Expected result:
- The Codex Workflow Kit card appears on `/templates` with "Use Template", "GitHub", and "Download".
- Existing template cards still show "Request this template".

## Question Preference

Clarifying questions were not asked because the request includes the exact data, UI behavior, constraints, and validation expectations needed to proceed safely. Remaining minor assumptions are recorded in the saved spec.

## Execution Preference

Selected: `complete-workflow`

## Out Of Scope

- Backend controller changes unless verification reveals they are required.
- Database persistence for templates.
- New dependencies.
- Deployment configuration changes.
