# Parallel Claims

Use this file to coordinate task claims in `parallel-workflow` and `parallel-worker` modes.

## Claim Rules

- P0 tasks are claimed before P1 tasks; P1 tasks are claimed before P2 tasks.
- Among same-priority tasks, claim the task with the lowest dependency risk and lowest merge risk first.
- A worker can claim exactly one task at a time.
- Claim status values: `unclaimed`, `claimed`, `in-progress`, `done`, `blocked`, `needs-review`.
- A worker must record the claim before editing.
- A worker must record final status before releasing locks.

## Claim Table

| Task ID | Priority | Parallel safe | Depends on | Blocks | File locks | Claim status | Claimed by | Agent role | Merge risk | Started | Finished | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `TASK-001` | `P0` | `yes` | `none` | `TASK-003` | `server/data/templates.json`; `server/controllers/templatesController.js`; `server/routes/templateRoutes.js`; `server/app.js`; `server/tests/templates.test.js` | `done` | `backend-worker` | `parallel-worker` | `low` | `2026-05-15` | `2026-05-15` | Backend JSON endpoint slice. Jest endpoint test passed. |
| `TASK-002` | `P0` | `yes` | `none` | `TASK-003` | `client/src/services/templateService.js`; `client/src/hooks/queries/useTemplates.js`; `client/src/Pages/Templates/Templates.jsx` | `done` | `frontend-worker` | `parallel-worker` | `low` | `2026-05-15` | `2026-05-15` | Frontend fetch/render slice. ESLint + client build passed. |
| `TASK-003` | `P1` | `no` | `TASK-001`, `TASK-002` | `final response` | `_parallel/claims.md`; `_parallel/locks.md`; `_parallel/agent-status.md`; `_progress/progress.md`; `_handoff/current.md`; `_review/2026-05-15-build-templates-data-flow.md`; `_release/build-templates-data-flow.md`; `_summary/2026-05-15-build-templates-data-flow.md` | `done` | `orchestrator` | `orchestrator` | `medium` | `2026-05-15` | `2026-05-15` | Final merge review and workflow artifacts complete. |

## Claim History

- `2026-05-15`: `orchestrator` created queue from `_task/2026-05-15-build-templates-data-flow.md`.
- `2026-05-15`: `orchestrator` claimed `TASK-003` workflow artifact ownership.
- `2026-05-15`: `orchestrator` pre-claimed `TASK-001` for `backend-worker` with backend file locks.
- `2026-05-15`: `orchestrator` pre-claimed `TASK-002` for `frontend-worker` with frontend file locks.
- `2026-05-15`: `backend-worker` completed `TASK-001` and released backend file locks.
- `2026-05-15`: `frontend-worker` completed `TASK-002` and released frontend file locks.
- `2026-05-15`: `orchestrator` completed `TASK-003` merge review and workflow artifacts.
