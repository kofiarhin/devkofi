# Parallel File Locks

Use this file to prevent overlapping edits in parallel execution modes.

## Lock Rules

- File locks must be declared before editing.
- No two active workers may hold overlapping file locks.
- If a task needs a locked file owned by another worker, the worker must stop or choose another eligible task.
- If unexpected file overlap appears, the worker must stop, mark the task `needs-review`, and update this file plus `_parallel/claims.md`.
- Locks are released only after the worker records final task status.

## Active Locks

| Path or glob | Locked by | Task ID | Claim status | Acquired | Expected release | Notes |
| --- | --- | --- | --- | --- | --- | --- |

## Released Locks

| Path or glob | Released by | Task ID | Final task status | Released | Notes |
| --- | --- | --- | --- | --- | --- |
| `server/data/templates.json` | `backend-worker` | `TASK-001` | `done` | `2026-05-15` | Backend data source. |
| `server/controllers/templatesController.js` | `backend-worker` | `TASK-001` | `done` | `2026-05-15` | Backend controller. |
| `server/routes/templateRoutes.js` | `backend-worker` | `TASK-001` | `done` | `2026-05-15` | Backend route. |
| `server/app.js` | `backend-worker` | `TASK-001` | `done` | `2026-05-15` | App route mount. |
| `server/tests/templates.test.js` | `backend-worker` | `TASK-001` | `done` | `2026-05-15` | Endpoint test. |
| `client/src/services/templateService.js` | `frontend-worker` | `TASK-002` | `done` | `2026-05-15` | Frontend service. |
| `client/src/hooks/queries/useTemplates.js` | `frontend-worker` | `TASK-002` | `done` | `2026-05-15` | React Query hook. |
| `client/src/Pages/Templates/Templates.jsx` | `frontend-worker` | `TASK-002` | `done` | `2026-05-15` | Templates page UI. |
| `_parallel/claims.md` | `orchestrator` | `TASK-003` | `done` | `2026-05-15` | Workflow artifact. |
| `_parallel/locks.md` | `orchestrator` | `TASK-003` | `done` | `2026-05-15` | Workflow artifact. |
| `_parallel/agent-status.md` | `orchestrator` | `TASK-003` | `done` | `2026-05-15` | Workflow artifact. |
| `_progress/progress.md` | `orchestrator` | `TASK-003` | `done` | `2026-05-15` | Workflow artifact. |
| `_handoff/current.md` | `orchestrator` | `TASK-003` | `done` | `2026-05-15` | Workflow artifact. |
