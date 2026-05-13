# Work Request

This file is auto-managed by the workflow. It stores the latest active work request, usually copied from the user's direct Codex prompt.

Users do not need to edit this file manually. You may edit it when you want to stage a request before asking the agent to run the workflow.

The workflow will ask clarifying questions, run dirty worktree protection, generate a saved spec in `_spec/`, create a vertical task plan in `_task/`, execute tasks one by one until the request is complete or stopped, record acceptance results, update `_progress/progress.md` and `_handoff/current.md` after each task, run a final diff audit, write a workflow review in `_review/`, create release notes in `_release/`, and write a final summary in `_summary/`.

## Request

Build the Templates data flow:

Create a templates JSON data source and expose it through a backend endpoint, then update the Templates page to fetch and render templates from that endpoint.

Requirements:
- Create a templates.json file with at least 3 template objects.
- Each template should include id, title, description, category, and tags.
- Create a backend GET endpoint for templates, likely GET /api/templates.
- The endpoint should read from templates.json and return the template list as JSON.
- Update client/src/Pages/Templates/Templates.jsx to fetch templates from the endpoint.
- Render responsive template cards.
- Include loading and error states.
- Keep it small and clean.

Execution mode: parallel-workflow
Default worker count: 3

Follow the workflow exactly:
- detailed spec
- task plan
- parallel safety/claims/locks if safe
- Build -> Refine -> Polish for each task
- progress
- handoff
- review
- release notes
- summary
- health check

## Question Preference

Choose one:

- `ask questions`: default. Ask focused questions until about 90% understanding before writing the spec.
- `skip questions`: do not ask questions; generate a best-effort spec and record assumptions.

Default: `ask questions`

Clarifying handling:

- No follow-up questions were asked because the direct prompt gave concrete API, data, UI, and workflow requirements and explicitly requested execution. Remaining minor choices are recorded as assumptions in the spec.

## Optional Execution Preference

Choose one:

- `plan-only`: ask questions, write spec, write task plan, then stop.
- `single-task`: ask questions, write spec, write task plan, execute only the next ready task, verify and review it, update artifacts, then stop.
- `complete-workflow`: ask questions, write spec, write task plan, then execute all generated tasks sequentially until the request/spec is complete or a stop condition is reached.

Default: `complete-workflow`

Selected: `parallel-workflow`

## Optional Context

- User or business goal: Templates should come from the backend instead of local placeholder component data.
- Target users: Visitors browsing the Templates page and developers maintaining the template list.
- Expected behavior: `GET /api/templates` returns JSON template objects; the Templates page fetches them and renders responsive cards.
- UI expectations: Responsive cards, loading state, error state, clean small implementation.
- API expectations: Public unauthenticated `GET /api/templates`, JSON response from `server/data/templates.json`.
- Data model expectations: Each template has `id`, `title`, `description`, `category`, and `tags`.
- Edge cases: Empty data should not crash the page; failed fetch should show an error state.
- Constraints: No hard-coded frontend API URL; use the shared frontend API client and existing React Query pattern; preserve unrelated dirty files.
- Success criteria: Endpoint returns at least 3 templates and Templates page renders fetched cards with loading and error states.
- Preferred verification: Targeted backend endpoint test if practical, targeted frontend lint, client build, and final diff audit.
- Dirty worktree notes: Initial status had pre-existing dirty workflow files: `RUN_WORKFLOW.md`, `WORK_REQUEST.md`, `_handoff/current.md`, `_progress/progress.md`, `_task/README.md`, `docs/PROMPTS.md`, and untracked `_parallel/`. Implementation files planned for this request were not dirty before editing.
- Release notes expectations: Note new `/api/templates` endpoint and frontend data-flow change.

## Out Of Scope

- Deployment changes.
- Database/schema changes.
- New dependencies.
- Large UI redesign outside the Templates page.
- Refactoring unrelated API routes or frontend pages.
