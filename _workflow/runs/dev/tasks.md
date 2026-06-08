# Task Plan: Fix Project List Loading

- Spec file used: `_workflow/runs/dev/spec.md`
- Planning date: 2026-06-08
- Explicit spec approval: User replied `approve spec`
- Progress and summary files read: No prior run-scoped progress or summary existed.
- Spec sections used: Current State Analysis, Affected Surfaces, Dependency And Integration Map, UX/API/Workflow Expectations, Execution Strategy, Verification Strategy, Acceptance Criteria, Edge Cases And Failure Modes, Risks And Mitigations, Assumptions, Open Questions, and Task Extraction Notes.

## TASK-001: Restore project records from API to gallery

- Status: Done
- Objective: Make local and configured deployed project requests resolve correctly and prove that successful data renders while failures remain explicit.
- Files likely affected:
  - `client/src/hooks/useProjects.js`
  - `client/vite.config.js`
  - `client/tests/projects.test.js` or a focused new client test
  - `server/tests/projects.test.js` if backend contract coverage is required
- Checklist:
  - Add a failing endpoint-resolution/request regression test.
  - Add local Vite `/api` proxy behavior.
  - Normalize configured API base URLs.
  - Preserve TanStack Query and UI state behavior.
  - Verify project rendering and error handling.
  - Run client tests, build, and relevant server verification.
- Applied skill: design-taste-frontend

### Iteration 1 Build
- Goal: Reproduce and fix the local request-routing failure.
- Changes made: Added a testable project URL builder and Vite `/api` proxy to port 5000.
- Test plan: Add endpoint-resolution assertions and verify Vite proxy configuration.
- Red phase evidence: Focused suite failed because `getProjectsUrl` and the proxy were absent.
- Green phase evidence: Focused suite passed 8 of 8 after implementation.
- Refactor phase evidence: Minimal implementation retained; focused suite passed again.
- Test commands run: `npm run test -- --run tests/projects.test.js` three times.
- Verification command/result: Passed.
- Review findings: Existing query behavior and API contract preserved.
- Acceptance status: Local routing and endpoint construction accepted.
- Remaining issues: Request and rendered-state proof remained.
- Next action: Iteration 2.

### Iteration 2 Refine
- Goal: Harden configured deployment URLs and request failures.
- Changes made: Exported the request function, added explicit base URL support, and prevented React Query context from being treated as a URL.
- Test plan: Cover trailing slash, non-2xx response, and returned payload.
- Red phase evidence: Two tests failed because `getProjects` was not exported.
- Green phase evidence: Focused suite passed 10 of 10 after export and callback wrapper.
- Refactor phase evidence: Nullish/non-string base handling added; focused suite passed again.
- Test commands run: `npm run test -- --run tests/projects.test.js` three times.
- Verification command/result: Passed.
- Review findings: Success payload and server error text are preserved.
- Acceptance status: Configured URL and request behavior accepted.
- Remaining issues: Rendered-state and full verification remained.
- Next action: Iteration 3.

### Iteration 3 Polish
- Goal: Prove rendered project records and complete full verification.
- Changes made: Added page-level success/error tests and a `Try again` action wired to `refetch`.
- Test plan: Component/integration coverage plus full client test/build and relevant server route check.
- Red phase evidence: Retry control was absent; one initial success assertion was also corrected after identifying ambiguous test data.
- Green phase evidence: Page tests passed 2 of 2 after adding retry behavior.
- Refactor phase evidence: Simplified `onClick` to use `refetch` directly; combined focused suite passed 12 of 12.
- Test commands run: Page test Red/Green, combined focused suite, client build, scoped lint, full client suite, live API/browser checks.
- Verification command/result: Focused tests, build, scoped lint, live proxy, rendered page, and browser console passed.
- Review findings: 13 unrelated legacy full-suite failures and 36 unrelated repository-wide lint errors remain.
- Acceptance status: Complete.
- Remaining issues: Exact deployed URL was not provided; live deployment was not checked.
- Next action: Final workflow artifacts.

### Test Plan
- Focused Vitest tests for project endpoint construction and request behavior.
- Projects page render/error state coverage where feasible.
- Full client test suite.
- Client production build.
- Relevant server project endpoint verification.

### Acceptance Criteria
- [x] Local Vite development routes `/api/projects` to the Express backend.
- [x] Configured API bases with or without a trailing slash resolve correctly.
- [x] Successful project data renders on the Projects page.
- [x] Request failures render the existing explicit error state and retry action.
- [x] Relevant focused tests and client build pass.
- [x] No unrelated behavior or files are changed.

### Acceptance Result
- [x] All criteria met.

### Verification Commands
- `npm run test:client -- --run`
- `npm run build --prefix client`
- Relevant focused test commands identified during implementation.

### Stop Condition
- Stop as `Needs Human Review` if project loading cannot be proven or verification remains failed after targeted recovery.

### Out Of Scope
- Project page redesign, project content edits, database changes, auth changes, and broad API-client refactoring.
