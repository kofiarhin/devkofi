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
| `server/data/templates.json` | `backend-worker` | `TASK-001` | `claimed` | `2026-05-15` | after TASK-001 done | Backend data source. |
| `server/controllers/templatesController.js` | `backend-worker` | `TASK-001` | `claimed` | `2026-05-15` | after TASK-001 done | Backend controller. |
| `server/routes/templateRoutes.js` | `backend-worker` | `TASK-001` | `claimed` | `2026-05-15` | after TASK-001 done | Backend route. |
| `server/app.js` | `backend-worker` | `TASK-001` | `claimed` | `2026-05-15` | after TASK-001 done | App route mount. |
| `server/tests/templates.test.js` | `backend-worker` | `TASK-001` | `claimed` | `2026-05-15` | after TASK-001 done | Endpoint test. |
| `client/src/services/templateService.js` | `frontend-worker` | `TASK-002` | `claimed` | `2026-05-15` | after TASK-002 done | Frontend service. |
| `client/src/hooks/queries/useTemplates.js` | `frontend-worker` | `TASK-002` | `claimed` | `2026-05-15` | after TASK-002 done | React Query hook. |
| `client/src/Pages/Templates/Templates.jsx` | `frontend-worker` | `TASK-002` | `claimed` | `2026-05-15` | after TASK-002 done | Templates page UI. |
| `_parallel/claims.md` | `orchestrator` | `TASK-003` | `claimed` | `2026-05-15` | final workflow completion | Workflow artifact. |
| `_parallel/locks.md` | `orchestrator` | `TASK-003` | `claimed` | `2026-05-15` | final workflow completion | Workflow artifact. |
| `_parallel/agent-status.md` | `orchestrator` | `TASK-003` | `claimed` | `2026-05-15` | final workflow completion | Workflow artifact. |
| `_progress/progress.md` | `orchestrator` | `TASK-003` | `claimed` | `2026-05-15` | final workflow completion | Workflow artifact. |
| `_handoff/current.md` | `orchestrator` | `TASK-003` | `claimed` | `2026-05-15` | final workflow completion | Workflow artifact. |

## Released Locks

| Path or glob | Released by | Task ID | Final task status | Released | Notes |
| --- | --- | --- | --- | --- | --- |
