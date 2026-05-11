# Work Request

This file is auto-managed by the workflow. It stores the latest active work request, usually copied from the user's direct Codex prompt.

Users do not need to edit this file manually. You may edit it when you want to stage a request before asking the agent to run the workflow.

The workflow will ask clarifying questions, run dirty worktree protection, generate a saved spec in `_spec/`, create a vertical task plan in `_task/`, execute tasks one by one until the request is complete or stopped, record acceptance results, update `_progress/progress.md` and `_handoff/current.md` after each task, run a final diff audit, write a workflow review in `_review/`, create release notes in `_release/`, and write a final summary in `_summary/`.

## Request

`workflow add a contact form empty state`

## Question Preference

Choose one:

- `ask questions`: default. Ask focused questions until about 90% understanding before writing the spec.
- `skip questions`: do not ask questions; generate a best-effort spec and record assumptions.

Default: `ask questions`

## Optional Execution Preference

Choose one:

- `plan-only`: ask questions, write spec, write task plan, then stop.
- `single-task`: ask questions, write spec, write task plan, execute only the next ready task, verify and review it, update artifacts, then stop.
- `complete-workflow`: ask questions, write spec, write task plan, then execute all generated tasks sequentially until the request/spec is complete or a stop condition is reached.

Default: `complete-workflow`

## Optional Context

- User or business goal: Add a helpful empty state to the contact form before users begin typing.
- Target users: Visitors using the current contact form/page.
- Expected behavior: Use the current contact form/page in the app. If no contact form exists, create a small UI-only contact section where it naturally fits. Show the empty state before the user types anything.
- UI expectations: Display the exact message: "Start by entering your details and message."
- API expectations: UI-only for now. Do not connect new backend/contact submission behavior.
- Data model expectations: No data model changes.
- Edge cases: `<Failure states, empty states, permissions, limits>`
- Constraints: `<Do not change X / must use Y / no new dependencies>`
- Success criteria: The current contact page shows the empty state before any contact form input is entered, and hides it once the user types or uses a prompt chip.
- Preferred verification: Frontend test and build where practical.
- Dirty worktree notes: `<Existing dirty files, planned files, overlap risk>`
- Release notes expectations: Document the contact form empty state and that there are no backend changes.

## Out Of Scope

- `<File, feature, API, behavior, or area that should stay untouched>`
