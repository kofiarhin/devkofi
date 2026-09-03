# DevKofi Decisions

## Confirmed

### Admin foundation scope and content lifecycle

- Date: 2026-09-03
- Source: Kofi explicitly requested implementation of `docs/ADMIN_FOUNDATION_SPEC.md` and `docs/ADMIN_FOUNDATION_IMPLEMENTATION_PLAN.md`.
- Decision: complete the admin foundation around existing operational records and article management; do not introduce registered member/customer accounts in this milestone.
- Decision: DevKofi Admin may act as a second compatible writer to `blogposts`; articles use draft, published, and archived states, while public readers remain restricted to published records.
- Decision: contact messages use read/unread and archive/restore behavior; newsletter removal is confirmation-protected hard deletion.
- Consequence: merge and deployment remain separate approval gates, and production authentication remains unverified until deployed runtime evidence exists.


### Project showcase placement and media — issue #38

- Source: Kofi approved the placement matrix, generated/uploaded the Agent System cover (merged in PR #39), then explicitly approved the remaining implementation plan in conversation.
- Home: Hibachi, Brain, ThriftChef only; Systems uses introductory copy and a link instead of a second gallery.
- Work: Hibachi, Brain, LeadRadar, Forge, ThriftChef. Engineering Systems: AI Dev Workspace, Codex Workflow Kit, Agent System, Context API, Ideas Hub. Each project has one primary listing across these two pages.
- Project card artwork stays fully visible in a 16:9 frame. Cloudinary variants use layout-matched `srcSet`/`sizes`; unsafe or ambiguous URL shapes pass through unchanged.
- An unavailable derived image falls back to the original once, then to a labelled placeholder. Existing source assets and the private Hibachi repository boundary are preserved.
- Authorized route: separate branch and draft PR, with no merge/deployment. See `spec/038-project-showcase.md` and `plans/038-project-showcase.md`.

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
