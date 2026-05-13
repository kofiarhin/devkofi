# Task Memory

Store vertical task plans in this folder.

Agents must create a saved task plan here before implementation. Use filenames that match the related detailed spec when practical, for example:

```txt
_task/2026-05-10-add-dark-theme.md
```

Default execution mode is `complete-workflow`: after the task plan is created, execute all generated tasks sequentially until the request/spec is complete or a stop condition is reached.

Execution modes:

- `plan-only`: ask questions, write the detailed spec, write the task plan derived from it, then stop.
- `single-task`: execute only the next ready task through the full 3-pass hardening loop, update artifacts, then stop.
- `complete-workflow`: execute all generated tasks sequentially until the request/spec is complete or a stop condition is reached.

Use `single-task` only when the user explicitly asks for controlled one-task execution.

Task plans must be derived from the saved detailed spec, not from the raw request alone. Each task plan must cite or reference the detailed spec sections used to derive the plan, especially:

- Current State Analysis.
- Affected Surfaces.
- Dependency And Integration Map.
- Data And State Impact.
- UX / API / Workflow Expectations.
- Execution Strategy.
- Verification Strategy.
- Acceptance Criteria.
- Edge Cases And Failure Modes.
- Risks And Mitigations.
- Assumptions.
- Open Questions.
- Task Extraction Notes.

Each task must include:

- Task ID.
- Status.
- Objective.
- Detailed spec sections used or referenced.
- Files likely affected.
- Checklist.
- Iteration plan for Iteration 1 Build, Iteration 2 Refine, and Iteration 3 Polish.
- Acceptance criteria.
- Acceptance result.
- Verification commands.
- Stop condition.
- Out-of-scope items.

Each iteration plan must include:

- Goal.
- Changes made.
- Verification command/result.
- Review findings.
- Acceptance status.
- Remaining issues.
- Next action.

## Task Status Transitions

Every task must move through:

```txt
Planned -> Ready -> In Progress -> Verified -> Reviewed -> Done
```

Allowed terminal states:

- `Done`
- `Blocked`
- `Needs Human Review`

Rules:

- A task cannot be `Done` unless all three iterations are complete, verification was attempted in each iteration, the task was reviewed in each iteration, and final acceptance is complete.
- A task cannot move to `Reviewed` unless verification was attempted.
- If verification cannot run, the task can be `Needs Human Review`, not `Done`.
- A task cannot be `Done` unless every required acceptance criterion is checked `[x]`.
- If any acceptance result is `[ ]` or `[~]`, the task must be `Blocked` or `Needs Human Review`.
- If required iteration evidence is missing, the task cannot be `Done` and workflow health must be `Partial` or `Failed`.

Acceptance results use:

```md
Acceptance result:
- [x] Criterion met
- [ ] Criterion not met
- [~] Partially met with notes
```

Copy or summarize acceptance results in `_progress/progress.md`.

Tasks should be Ralph Wiggum-style: small, literal, sequential, and easy to verify.

Continue to the next task automatically only when the current task is `Done` after Build -> Refine -> Polish. Stop if a task is `Blocked`, `Needs Human Review`, remains failed after iteration-level failure recovery, becomes risky or unclear, or requires external access.

## Dirty Worktree Protection

Before implementation, run:

```bash
git status --short
```

Document existing dirty files, files planned for the workflow, and overlap risk. If dirty files overlap with planned files, stop and ask before editing. If dirty files are unrelated, continue but document them. Never overwrite user changes or clean/reset files unless explicitly instructed.

## Failure Recovery

When verification fails, identify the failing command, capture the error, classify the failure as in-scope or unrelated, fix only in-scope failures, rerun the exact failing command, and stop with `Needs Human Review` if targeted recovery cannot prove the task.
