# DevKofi Decisions

## Confirmed

### AI operating system is canonical

- Date: 2026-08-25
- Source: explicit user approval of the migration plan.
- Decision: the `setup-workspace` operating model is DevKofi's single canonical AI delivery workflow.
- Consequence: `AGENTS.md` is canonical, `CLAUDE.md` is a thin compatibility entry point, and delivery uses `/morning-brief` plus `/ticket` → `/spec` → `/plan` → `/implement-plan`.

### Preserve DevKofi safeguards

- Date: 2026-08-25
- Source: approved migration plan plus existing repository operating rules.
- Decision: retain the useful Grill/approval gate, TDD-first execution, verification evidence, focused scope, and conditional frontend design review inside the new operating model.
- Consequence: the migration changes orchestration, not the quality/safety bar.

### Legacy workflow is inactive but retained

- Date: 2026-08-25
- Source: approved migration plan.
- Decision: existing `RUN_WORKFLOW.md`, `WORK_REQUEST.md`, `_workflow` and older `_spec`/`_task`/`_progress`-style artifacts remain in the repository for history/compatibility but are no longer the active orchestration path.
- Consequence: no destructive legacy cleanup is part of this migration.

### Existing application conventions remain authoritative

Repository documentation currently establishes JavaScript application code, service/hook separation for frontend API work, TanStack Query for server state, Redux Toolkit for global client/UI/auth state, and backend MVC-style boundaries. The new AI operating system does not override those application conventions.

## Unresolved

- Whether Tailwind 4's presence in `client/package.json` represents an intentional styling migration or unused tooling; `README.md` still states SCSS Modules only.
- Whether `README.md` should be updated from Node 18+ to match the root package engine requirement of Node 20.x.
- Current production/staging deployment health and which documented backend host is canonical.

## Historical

The repository previously used a large `RUN_WORKFLOW.md` / run-artifact orchestration with `AGENTS.md` and `CLAUDE.md` routing into it. Those files are preserved but superseded as the canonical AI operating model by the 2026-08-25 decision above.
