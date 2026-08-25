# DevKofi AI Operating Guide

`AGENTS.md` is the canonical operating guide for AI work in this repository. `CLAUDE.md` is a compatibility entry point and must defer here.

The canonical operating loop is:

```text
/morning-brief
  ↓
human selects or refines one outcome
  ↓
/ticket
  ↓
/spec
  ↓
/plan
  ↓
explicit implementation approval
  ↓
/implement-plan
  ↓
RED → GREEN → REFACTOR → VERIFY
  ↓
review + project-memory sync
```

`RUN_WORKFLOW.md`, `WORK_REQUEST.md`, `_workflow/`, `_spec/`, `_task/`, `_progress/`, `_review/`, `_summary/`, `_release/`, and related legacy workflow artifacts are retained for history/compatibility but are not the active orchestration path. Do not create new competing workflow state there unless the user explicitly requests legacy workflow work.

## Project Context

DevKofi is a MERN mentorship platform with a Vite/React learning portal and an Express/MongoDB API. It onboards mentees, presents curriculum/pricing, handles mentorship/contact/newsletter intake, provides authenticated templates/portal experiences, and supports mentorship-team administration.

Repository-backed stack:

- Frontend: React 19, Vite 7, React Router 7, TanStack Query 5, Redux Toolkit, Framer Motion.
- Styling: the repository README documents SCSS Modules as the convention. Tailwind 4 tooling is present in `client/package.json`; do not introduce Tailwind-based styling into existing surfaces unless a ticket/spec explicitly resolves that convention.
- Backend: Node.js, Express 5, MongoDB/Mongoose 8, CommonJS, JWT/bcrypt, Nodemailer.
- Testing: Vitest/Testing Library on the client; Jest/Supertest on the server.
- Package manager: npm.
- Documented deployment targets: Vercel for the frontend and Heroku/Render for the backend. Treat current deployment state as unverified unless inspected.

Useful commands from current package manifests:

```bash
npm run dev
npm test
npm run test:client
npm --prefix client run lint
npm --prefix client run build
```

There is no configured TypeScript/type-check command in the inspected package manifests.

## Sources of Truth

Use this precedence for repository work:

1. hard safety/permission boundaries and an approved execution contract;
2. the user's latest explicit instruction;
3. this `AGENTS.md` operating guide;
4. `roadmap.md` and `review.md`;
5. relevant `context/*.md` and real files under `customers/`;
6. the active ticket → spec → plan chain;
7. current repository/test evidence;
8. legacy workflow documents only when they do not conflict with the sources above.

When documentation conflicts with current code or package manifests, record the conflict instead of silently choosing a story that is convenient.

## Operator Flow

Use `/morning-brief` for read-only orientation. It may inspect project context, Git/GitHub state, roadmap priorities, verification evidence, risks, and real customer signals, then recommend at most one next ticket outcome.

A morning brief does not edit files, create tickets automatically, authorize implementation, activate routines, commit, push, merge, or deploy.

## Delivery Flow

After the user selects an outcome:

1. `/ticket` defines **what should change and why**. One ticket equals one outcome and one visible finish line.
2. `/spec` defines the repository-grounded technical contract for the approved ticket.
3. `/plan` defines the smallest ordered implementation slices. Testable slices use RED → GREEN → REFACTOR → VERIFY.
4. `/implement-plan` executes only an approved plan, verifies the result, reviews the diff, and synchronizes project memory from observed evidence.

Do not collapse ticket, spec, plan, and implementation into a single speculative step.

## Grill and Approval Gate

For clear read-only/reversible work, proceed without unnecessary questions.

For materially ambiguous, state-changing, destructive, costly, credential-sensitive, deployment, dependency, data-model, authentication, payment, permission, security, Git-write, routine/schedule, or external-service work:

- inspect available repository context first;
- ask exactly one material question at a time only when the answer would materially change the outcome;
- include a recommended answer and the main consequence;
- before implementation, present a concise Shared Understanding covering goal, scope, requirements, technical approach, risks/assumptions, acceptance criteria, and verification;
- require explicit approval of that plan before changing state.

A material change to approved scope, architecture, dependencies, migrations, authentication, payments, permissions, risk, acceptance criteria, destructive behavior, or external actions invalidates prior approval and requires a revised plan.

## Working Rules

- Inspect current files, repository state, and relevant project documents before making claims or edits.
- Keep changes small, focused, reviewable, and inside the active ticket.
- Preserve unrelated and uncommitted work. Never discard, reset, overwrite, or clean user changes automatically.
- Existing project conventions override generic stack preferences.
- JavaScript is the current project language; do not introduce TypeScript without an approved migration.
- Keep API/data access out of React components. Use services/hooks and TanStack Query for server state.
- Use Redux Toolkit only for global client-only state such as auth/session metadata or UI state; do not duplicate server records into Redux without a documented reason.
- Preserve the server's route/controller/model/service/utility boundaries and keep routes thin.
- Keep environment-specific values and secrets in environment configuration; never hard-code or expose credentials.
- Do not add dependencies, migrations, authentication changes, payment logic, permission changes, or external services without explicit approval.
- For frontend UI changes, use the existing design conventions. If `.agents/skills/design-taste-frontend/SKILL.md` is relevant and present, use it only for the frontend UI surface and do not let it bypass this operating flow.

## Testing and Verification

Use TDD by default for testable behavior:

```text
RED → GREEN → REFACTOR → VERIFY
```

For every testable implementation slice:

- write/update the smallest behavior test first;
- run it and confirm a meaningful failure for the missing behavior;
- implement the smallest passing change;
- rerun and confirm green;
- refactor only within scope and keep tests green;
- run targeted neighboring/regression checks.

After implementation, run only checks relevant to the changed areas, including lint/build when configured and relevant. Never claim a test, lint, build, preview, deployment, commit, push, or release passed unless it was actually run/inspected.

For user-facing work, inspect the actual flow at desktop and mobile widths when browser tooling is available. Check relevant loading, empty, error, success, keyboard/accessibility, console, and network states.

Report checks as `Passed`, `Failed`, or `Not run` with the command/evidence.

## Review Standard

Use `review.md`. Classify findings as:

- `Must fix`: blocks completion or creates material product/security/reliability risk.
- `Should fix`: important quality issue that does not block the stated outcome.
- `Okay to ship`: verified, in scope, and consistent with project standards.

Unexpected files, scope creep, secret exposure, broken role/auth behavior, failed required verification, and undocumented material architecture changes are `Must fix` until resolved or explicitly re-approved.

## Permissions

### Safe / read-only

May proceed when relevant:

- inspect files, code, docs, history, branches, issues, pull requests, and current configuration;
- analyze product/repository state;
- run non-destructive local tests/checks when the environment allows;
- propose tickets, specs, plans, reviews, and documentation changes without applying them.

### Approval required

Require explicit approval before:

- creating/editing/deleting repository files;
- installing/removing dependencies or changing lockfiles;
- migrations, authentication, payments, permissions, security-sensitive behavior, or customer-data behavior;
- Git commits, branch pushes, pull-request creation, or other GitHub writes;
- activating routines/schedules;
- changing external-service configuration or deployment behavior.

### Human-owned

Do not perform without a separate explicit human decision and an environment that permits it:

- production deployment or release;
- merge to the protected/default branch;
- destructive production/customer-data operations;
- live billing/customer-data policy decisions;
- credential sharing;
- security-policy ownership decisions.

## Project Memory

Keep these files aligned only from evidence:

- `context/current-state.md`: what is proposed, implemented, verified, released, or unresolved;
- `context/architecture.md`: intended versus implemented architecture;
- `context/decisions.md`: confirmed decisions and unresolved material questions;
- `context/lessons.md`: concise repository-specific lessons learned from actual implementation/review;
- `roadmap.md`: ordered outcomes and completion status.

A morning brief, ticket, spec, or plan is not implementation evidence.

## Completion

Work is complete only when the approved outcome is delivered, acceptance criteria are evaluated, relevant checks are run or explicitly reported as unavailable, the diff is reviewed against `review.md`, human-review items are disclosed, and project memory is synchronized where truth changed.

Never equate `implemented`, `verified`, `committed`, `pushed`, `merged`, `deployed`, and `released`.
