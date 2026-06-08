# Fix Project List Loading

## 1. Metadata
- Spec filename: `_workflow/runs/dev/spec.md`
- Date: 2026-06-08
- Request ID / slug: `fix-project-list-loading`
- Request source: Direct user prompt and `_workflow/runs/dev/request.md`
- Execution mode: `complete-workflow`
- Request classification: Bug fix
- Scope level: Narrow cross-environment frontend/API integration
- Risk level: Low to medium

## 2. Original Request
- Raw user request: "the list of projects are not showing please fix it."
- Normalized request: Fix project list loading end to end by making project API URL resolution reliable in local and deployed environments, preserving the existing gallery, adding regression tests, and verifying the relevant client and server paths.
- Source prompt / request reference: `_workflow/runs/dev/request.md`

## 3. Questions And Answers
- Questions asked: Whether projects are missing on the deployed site, local development, or both.
- Answers received: "ok proceed"
- Questions skipped: Exact affected URL and visible error details were not supplied.
- Remaining open questions: The exact deployment and its environment values are unknown.

## 4. Problem Definition
- Problem being solved: The Projects page does not receive project records.
- Why it matters: Projects are a primary portfolio surface and currently appear unavailable.
- Current pain point: The frontend request can resolve to the Vite frontend origin when `VITE_API_URL` is absent because no Vite API proxy exists.
- Expected value: Reliable loading of the existing 15 project records locally and in supported deployments.

## 5. Current State Analysis
- Existing behavior: `useProjects` calls `${VITE_API_URL || ""}/api/projects`.
- Existing architecture/components: React/Vite frontend, TanStack Query hook, Express route/controller, JSON-backed project data.
- Existing files/modules likely involved: `client/src/hooks/useProjects.js`, `client/vite.config.js`, client tests, and potentially environment examples.
- Existing data flow: Projects page -> `useProjects` -> fetch -> Express `GET /api/projects` -> JSON array.
- Existing API/UI/CLI/workflow behavior: The UI already has loading, error, empty, grid, case-study, search, sort, and filter states.
- Existing tests or verification coverage: Project filtering utilities are tested, but request URL resolution and API integration are not.

## 6. Desired End State
- Expected final behavior: Local Vite requests reach the Express backend; configured deployed API URLs and intentional same-origin `/api` deployments continue to work.
- User-facing outcome: Project cards render from the existing project dataset.
- Developer-facing outcome: API base resolution is deterministic and regression-tested.
- System/workflow outcome: No backend response-contract change.
- Backward compatibility expectations: Existing `VITE_API_URL` deployments remain supported.

## 7. Scope
- In scope: Project API request construction, local Vite proxy configuration, focused regression coverage, relevant verification, and minimal error-state improvement only if needed.
- Out of scope: Redesign, project content edits, database migration, unrelated routes, auth changes, and broad API-client refactoring.
- Non-goals: Replacing TanStack Query or moving project data into MongoDB.
- Explicit boundaries: Do not alter filters, sorting, drawer behavior, or project card design unless required by the loading fix.

## 8. Users And Use Cases
- Primary users: Portfolio visitors.
- Secondary users: Developers running the application locally.
- Main use cases: Open `/projects` and view the project gallery.
- Edge use cases: Cross-origin deployed API, same-origin deployment, absent environment variable, and API failure.

## 9. Functional Requirements
- Required behaviors: Fetch `GET /api/projects` from the correct origin and render a returned array.
- Inputs: Optional `VITE_API_URL`; local Vite proxy target.
- Outputs: Existing project records or the existing explicit error state.
- State changes: TanStack Query transitions through loading, success, or error.
- Error states: Non-2xx responses remain errors and expose a useful message.
- Permissions/auth expectations: Public endpoint; credentials behavior remains unchanged.

## 10. Non-Functional Requirements
- Performance expectations: No additional network round trips.
- Reliability expectations: Avoid malformed URLs and environment-specific local failures.
- Security/privacy expectations: No secrets or private data added; CORS behavior is not broadened without evidence.
- Accessibility expectations: Preserve existing semantic loading/error content.
- Maintainability expectations: Keep URL resolution small, explicit, and testable.
- DX expectations: `npm run dev` should support the standard Vite frontend plus Express backend workflow.

## 11. Affected Surfaces
- Files likely affected: `client/src/hooks/useProjects.js`, `client/vite.config.js`, client test files, and possibly `.env.example`.
- Directories likely affected: `client/src/hooks`, `client/tests`, `client`.
- UI surfaces: Projects page data states only.
- API routes: Existing `GET /api/projects`; no contract change.
- Components: `Projects` only if retry/error behavior needs adjustment.
- Services: Project query function/hook.
- Database/schema: Not applicable.
- Config/env vars: Existing `VITE_API_URL`; local Vite proxy target.
- Tests: Client unit/integration tests and existing server API tests where practical.
- Docs: Run-scoped workflow artifacts.
- Workflow artifacts: All files under `_workflow/runs/dev/`.

## 12. Dependency And Integration Map
- Internal dependencies: Projects page depends on `useProjects`; hook depends on browser fetch; Vite dev server may proxy `/api`; Express mounts project routes.
- External packages/services: TanStack Query, Vite, Express.
- Integration points: Browser/frontend origin to Express backend origin.
- Ordering constraints: Add failing regression test before implementation; fix URL/proxy behavior; verify page behavior.
- Migration/setup requirements: None expected.

## 13. Data And State Impact
- Data models: Unchanged project JSON objects.
- Database changes: None.
- State management changes: None beyond existing query state.
- Cache/session/local storage impact: Existing TanStack Query key remains `["projects"]`.
- Backward compatibility impact: Preserve configured API base URLs and same-origin API support.

## 14. UX / API / Workflow Expectations
- UX expectations: Existing loading skeleton transitions to project content; failures remain clearly distinguishable from empty results.
- API contract expectations: `GET /api/projects` returns the existing JSON array.
- CLI/workflow behavior: Root `npm run dev` should make local frontend API requests functional.
- Error handling expectations: Preserve non-2xx failure handling and readable messages.
- Empty/loading/success/failure states: Preserve all current states; add retry only if tests or reproduction show it is needed.

## 15. Execution Strategy
- Recommended implementation approach: Extract or expose deterministic project endpoint construction for testing, normalize configured base URLs, and add a Vite `/api` proxy to the local Express server.
- Suggested sequencing: Reproduce with a focused failing test, implement the smallest routing fix, verify hook/page behavior, then harden trailing-slash and failure cases.
- Safe rollout/migration approach: No API contract or data migration; retain environment override semantics.
- Files to inspect before editing: Hook, Vite config, project tests, server route/controller, environment examples.
- Decisions to avoid until more evidence exists: Broad shared API-client migration and CORS expansion.

## 16. Verification Strategy
- Required automated checks: Focused client tests, full client tests, client production build, and relevant project API test or direct server-route verification.
- Required manual checks: Load `/projects` with frontend and backend running and confirm project cards appear; inspect browser console/network for request errors.
- Test types needed: Unit test for endpoint resolution and integration/component coverage for successful project rendering where feasible.
- Build/lint/typecheck expectations: Client build must pass; run lint if scoped changes do not expose unrelated failures.
- Acceptance evidence required: Red/Green/Refactor results in each workflow iteration and visible project records in browser verification.
- Proof of completion: Passing tests/build plus local browser verification.

## 17. Acceptance Criteria
- [ ] Local Vite development routes project requests to the Express `GET /api/projects` endpoint.
- [ ] A configured `VITE_API_URL`, including one with a trailing slash, produces a valid project endpoint.
- [ ] The Projects page renders the existing project records after a successful request.
- [ ] Failed requests remain a visible error state rather than an empty successful state.
- [ ] Relevant tests and the client production build pass.
- [ ] No unrelated application behavior or files are changed.

## 18. Edge Cases And Failure Modes
- Edge cases: Empty base URL, base URL with trailing slash, same-origin production, cross-origin API, empty array response.
- Failure modes: 404 from frontend origin, CORS rejection, malformed double slash, non-JSON error response, unavailable backend.
- Regression risks: Breaking configured deployments or changing query caching behavior.
- Recovery expectations: Keep a clear error state; local developers can verify backend availability independently.

## 19. Risks And Mitigations
- Technical risks: Proxy-only fixes can hide production misconfiguration. Mitigation: retain explicit environment override and test both paths.
- Product/UX risks: A failed API may still show no projects. Mitigation: preserve explicit error rendering.
- Security risks: Broadening CORS unnecessarily. Mitigation: do not change CORS unless reproduction proves it is required.
- Scope risks: Turning a loading fix into a redesign or shared-client rewrite. Mitigation: keep changes limited to the project request path.
- Mitigation plan: TDD-first focused tests and final diff audit.

## 20. Assumptions
- Explicit assumptions: Local backend uses port 5000; project endpoint is public; deployed API base is supplied when cross-origin.
- Confidence level: High for the local proxy defect; medium for the unobserved deployed environment.
- What to revisit if assumptions are wrong: Deployment environment variables, frontend host rewrites, and backend CORS allowlist.

## 21. Open Questions
- Blocking questions: None for the local and configuration-level fix.
- Non-blocking questions: Exact deployed URL and observed browser/network error.
- Execution impact: Live deployment verification may remain unperformed without the URL.

## 22. Task Extraction Notes
- Suggested vertical task boundaries: One vertical task to restore and verify project loading from request construction through rendered UI.
- Suggested first task: Add regression coverage and make local/configured project endpoint routing reliable.
- Suggested task ordering: Test reproduction -> endpoint/proxy fix -> UI/API verification -> hardening.
- Areas that should not become separate tasks: Backend data refactor, page redesign, and broad API-client consolidation.
- How the 3-pass Build -> Refine -> Polish loop should apply: Build the minimal tested routing fix; refine environment/trailing-slash/error cases; polish with full verification, browser check, and scope audit.

## Frontend Skill Routing

Applied skill: design-taste-frontend

The skill applies only to preserving and reviewing the Projects page loading/error/success UI states. No visual redesign is planned.
