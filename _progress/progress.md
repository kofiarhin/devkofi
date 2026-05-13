# Progress Log

Agents must read this file before planning and before touching code for each task.

Append a new entry after each task. Do not replace previous entries except to correct factual errors.

This file is append-only task history. `_handoff/current.md` is the live resume state for the active workflow, and `_summary/` is completed workflow history.

If `_handoff/current.md` conflicts with this file, trust this file for completed task history and update handoff accordingly.

## Task Status Transitions

Every task must move through:

```txt
Planned -> Ready -> In Progress -> Verified -> Reviewed -> Done
```

Allowed terminal states:

- `Done`
- `Blocked`
- `Needs Human Review`

If verification cannot run, record the task as `Needs Human Review`, not `Done`.

Every task must record explicit acceptance results. A task cannot be `Done` unless every required acceptance criterion is checked `[x]`; any `[ ]` or `[~]` result means the task is `Blocked` or `Needs Human Review`.

Every executable task must complete Iteration 1 Build, Iteration 2 Refine, and Iteration 3 Polish before it can be marked `Done`. Record separate evidence for each iteration: goal, changes made, verification command/result, review findings, acceptance status, remaining issues, and next action.

If verification fails during any iteration, record the failure recovery protocol result inside that iteration: failing command, captured error, in-scope/unrelated classification, targeted fix attempt, exact rerun result, and final task status.

Dirty worktree protection must be documented before implementation: existing dirty files, files planned for the workflow, and overlap risk.

## Execution Modes

Default execution mode is `complete-workflow`.

- `plan-only`: ask questions, write spec, write task plan, then stop.
- `single-task`: execute only the next ready task through the full 3-pass hardening loop, update artifacts, then stop.
- `complete-workflow`: execute all generated tasks sequentially until the request/spec is complete or a stop condition is reached; each executable task must complete the full 3-pass hardening loop before the next task starts.
- `parallel-workflow`: orchestrator plans tasks, creates queue/claims/locks, assigns safe tasks to worker agents, then performs merge review and final artifacts.
- `parallel-worker`: worker claims and executes exactly one eligible parallel-safe task, records final status, releases locks, and stops.
- `parallel-orchestrator`: orchestrator validates queue/claims/locks, reviews worker outputs, runs final verification, and completes final artifacts.

Do not stop after `TASK-001` unless execution mode is explicitly `single-task` or a stop condition is reached.

## Entry Template

### `<YYYY-MM-DD HH:MM>` - `<TASK-ID>`

- Status: `<Done / Blocked / Needs Human Review>`
- Lifecycle transition reached: `<Planned -> Ready -> In Progress -> Verified -> Reviewed -> Done, or terminal stop>`
- Files changed: `<paths or none>`
- Dirty worktree protection: `<initial status, planned files, overlap risk>`
- Parallel metadata: `Priority=<P0/P1/P2>; Parallel safe=<yes/no>; Depends on=<task ids or none>; Blocks=<task ids or none>; File locks=<paths>; Claim status=<unclaimed/claimed/in-progress/done/blocked/needs-review>; Claimed by=<agent>; Agent role=<role>; Merge risk=<low/medium/high>`
- Parallel claim/lock status: `<claim recorded, active locks, released locks, unexpected overlap, or not applicable for sequential mode>`
- Worker status: `<orchestrator/worker id, one claimed task, current iteration, final status, or not applicable>`
- Merge review status: `<pending/passed/needs-review/failed/not applicable>`
- Iteration evidence:
  - Iteration 1 - Build: `<goal, changes made, verification command/result, review findings, acceptance status, remaining issues, next action>`
  - Iteration 2 - Refine: `<goal, changes made, verification command/result, review findings, acceptance status, remaining issues, next action>`
  - Iteration 3 - Polish: `<goal, changes made, verification command/result, review findings, acceptance status, remaining issues, final verdict>`
- Acceptance result: `<all criteria [x], or list unmet/partial criteria>`
- Verification result: `<commands and result, or why verification could not run>`
- Failure recovery notes: `<none, or failing command/error/classification/fix/rerun/final result>`
- Review result: `<reviewed / issues found / not reviewed with reason>`
- Blockers: `<none or details>`
- Next step: `<next task, review, summary, or stop reason>`

After appending each task entry, update `_handoff/current.md` with the latest current state.
