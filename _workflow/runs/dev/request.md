# Active Request

Fix the Projects page so the repository's project list loads and displays in both local development and deployed environments.

## Source

- Raw user request: "the list of projects are not showing please fix it."
- Follow-up: "ok proceed"
- Assumption accepted for specification: the issue should be fixed for both local and deployed use.

## Shared Understanding Handoff

### Original Request

The list of projects is not showing and needs to be fixed.

### Confirmed Understanding

- The backend already exposes `GET /api/projects`.
- The backend controller returns 15 records from `server/data/projects.data.json`.
- The Projects page fetches data through `client/src/hooks/useProjects.js`.
- The hook uses `VITE_API_URL` when configured and otherwise requests the relative path `/api/projects`.
- `client/vite.config.js` currently has no development proxy, so a missing `VITE_API_URL` sends the request to the frontend origin rather than the local Express server.
- The fix should restore the existing project gallery rather than redesign it.

### Decisions Made

- Support both local development and deployed environments.
- Preserve the existing backend response contract and project data.
- Add focused automated coverage for project API URL resolution/loading behavior.
- Preserve the existing loading, error, empty, filtering, and project display states.

### Assumptions

- The deployed frontend supplies `VITE_API_URL`, or same-origin deployment intentionally serves `/api`.
- Local frontend development runs on Vite and the backend runs on port 5000.
- No authentication is required for `GET /api/projects`.
- The report concerns data loading, not project filtering or visual layout.

### In Scope

- Diagnose and fix frontend-to-backend project request routing.
- Add or update tests that reproduce the missing-list failure.
- Verify the project API and client build/tests.
- Make only minimal UI error-state changes if required to expose a retry path or actionable failure.

### Out Of Scope

- Projects page redesign.
- Changes to project content.
- Database migration or replacing the JSON data source.
- Unrelated API, authentication, navigation, or deployment work.

### Acceptance Criteria

- The Projects page receives and renders the existing project records during local development without requiring a manually hard-coded URL.
- A configured deployed API base URL continues to work.
- Failed project requests retain a clear error state and do not appear as an empty successful list.
- Relevant automated tests and the client production build pass.
- No unrelated files or behavior are changed.

### Risks And Edge Cases

- Trailing slashes in `VITE_API_URL` can produce malformed double-slash paths.
- CORS must allow the deployed frontend origin when the API is cross-origin.
- A same-origin production deployment must continue to use `/api/projects`.
- Backend/database startup behavior may affect broad server tests even though project data is file-backed.

### Remaining Open Questions

- The exact affected deployed URL was not provided. Deployment-specific verification may be limited to configuration behavior and local automated checks.

### Normalized Workflow Request

Fix project list loading end to end by making project API URL resolution reliable in local and deployed environments, preserving the existing project gallery behavior, adding regression tests, and verifying the relevant client and server paths.
