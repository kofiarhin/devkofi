# Work Request

This file is auto-managed by the workflow. It stores the latest active work request, usually copied from the user's direct Codex prompt.

Users do not need to edit this file manually. You may edit it when you want to stage a request before asking the agent to run the workflow.

The workflow will ask clarifying questions, run dirty worktree protection, generate a saved spec in `_spec/`, create a vertical task plan in `_task/`, execute tasks one by one until the request is complete or stopped, record acceptance results, update `_progress/progress.md` and `_handoff/current.md` after each task, run a final diff audit, write a workflow review in `_review/`, create release notes in `_release/`, and write a final summary in `_summary/`.

## Request

Add placeholder content to the Templates page using three sample template cards.

## Question Preference

Choose one:

- `ask questions`: default. Ask focused questions until about 90% understanding before writing the spec.
- `skip questions`: do not ask questions; generate a best-effort spec and record assumptions.

Default: `ask questions`

Clarifying answer received:

- Use three sample template cards.

## Optional Execution Preference

Choose one:

- `plan-only`: ask questions, write spec, write task plan, then stop.
- `single-task`: ask questions, write spec, write task plan, execute only the next ready task, verify and review it, update artifacts, then stop.
- `complete-workflow`: ask questions, write spec, write task plan, then execute all generated tasks sequentially until the request/spec is complete or a stop condition is reached.

Default: `complete-workflow`

## Optional Context

- User or business goal: `<Why this matters>`
- Target users: `<Who uses this>`
- Expected behavior: `<What should happen>`
- UI expectations: Add responsive, accessible placeholder cards to `client/src/Pages/Templates/Templates.jsx`.
- API expectations: `<Endpoints, payloads, errors, auth, permissions>`
- Data model expectations: `<Fields, relationships, migrations, defaults>`
- Edge cases: `<Failure states, empty states, permissions, limits>`
- Constraints: Preserve existing dirty files and workflow artifacts; only update required workflow artifacts plus `client/src/Pages/Templates/Templates.jsx` for this workflow test.
- Success criteria: `/templates` renders three sample template cards with polished placeholder content and no backend/API changes.
- Preferred verification: `<Test command, manual check, build command>`
- Dirty worktree notes: Pre-existing dirty files were present before this workflow. User explicitly approved proceeding carefully while preserving existing dirty files and only editing required workflow artifacts plus `client/src/Pages/Templates/Templates.jsx`.
- Release notes expectations: `<User-facing changes, developer changes, known limitations>`

## Out Of Scope

- Backend/API changes.
- Deployment changes.
- New dependencies.
- Editing files outside required workflow artifacts and `client/src/Pages/Templates/Templates.jsx`.
