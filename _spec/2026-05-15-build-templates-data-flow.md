# Build Templates Data Flow Spec

## 1. Metadata
- Spec filename: `_spec/2026-05-15-build-templates-data-flow.md`
- Date: 2026-05-15
- Request ID / slug: `build-templates-data-flow`
- Request source: Latest direct user prompt synced into `WORK_REQUEST.md`
- Execution mode: `parallel-workflow`
- Request classification: `feature`
- Scope level: `medium`
- Risk level: `medium`

## 2. Original Request
- Raw user request: Build the Templates data flow by creating a templates JSON data source, exposing it through a backend endpoint, and updating `client/src/Pages/Templates/Templates.jsx` to fetch and render templates from that endpoint, with loading/error states and responsive cards. Execution mode requested: `parallel-workflow`, default worker count 3.
- Normalized request: Add a small backend-backed templates list at `GET /api/templates`, source it from `server/data/templates.json`, and update the Templates frontend to fetch via the existing API/client-state conventions.
- Source prompt / WORK_REQUEST reference: `WORK_REQUEST.md`

## 3. Questions And Answers
- Questions asked: None.
- Answers received: Not applicable.
- Questions skipped: Follow-up questions were skipped because the prompt provides concrete data fields, endpoint, target page, UI states, and workflow requirements, and explicitly says to execute.
- Remaining open questions: Exact template copy and visual treatment are not specified; use small representative content and preserve the existing Templates page visual direction.

## 4. Problem Definition
- Problem being solved: The Templates page currently uses local placeholder data inside the component instead of backend-provided template data.
- Why it matters: Backend-provided data makes the template catalog maintainable without editing UI rendering logic.
- Current pain point: Template cards cannot be shared with other clients or tested as an API contract.
- Expected value: A simple data-backed templates feature with a reusable public API and frontend loading/error handling.

## 5. Current State Analysis
- Existing behavior: `client/src/Pages/Templates/Templates.jsx` renders three hard-coded placeholder cards from a local `templateCards` array.
- Existing architecture/components: Backend routes are mounted in `server/app.js`; static JSON-backed project data lives in `server/data/` and is exposed through a route/controller pair. Frontend has a shared Axios client at `client/src/lib/api.js`, domain services in `client/src/services/`, and TanStack Query hooks in `client/src/hooks/queries/`.
- Existing files/modules likely involved: `server/app.js`, `server/data/`, `server/controllers/`, `server/routes/`, `server/tests/`, `client/src/Pages/Templates/Templates.jsx`, `client/src/services/`, `client/src/hooks/queries/`.
- Existing data flow: JSON data can be required by a backend controller and returned through an Express router; frontend server state should flow through service and query hook layers.
- Existing API/UI/CLI/workflow behavior: Public APIs use `/api/*`. Client build command is `npm run build --prefix client`; backend tests use Jest/Supertest from root `npm test`.
- Existing tests or verification coverage: Backend test harness exists under `server/tests/`. No Templates-specific frontend test exists.

## 6. Desired End State
- Expected final behavior: `GET /api/templates` returns a JSON array with at least three templates, each including `id`, `title`, `description`, `category`, and `tags`.
- User-facing outcome: The Templates page fetches templates and renders responsive cards, with visible loading and error states.
- Developer-facing outcome: Templates data can be edited in a JSON file, and frontend fetch logic is isolated in service/query hook layers.
- System/workflow outcome: Parallel queue, claims, locks, worker status, progress, handoff, review, release notes, summary, and health check are documented.
- Backward compatibility expectations: Existing routes and pages keep working; no schema migration or deployment change.

## 7. Scope
- In scope: `server/data/templates.json`, backend templates controller/route/app mount, a targeted backend endpoint test, frontend service/query hook, Templates page data rendering, loading/error/empty states, workflow artifacts.
- Out of scope: Database persistence, admin CRUD, filters/search, downloads, deployment config changes, new dependencies, broad redesign.
- Non-goals: Building a full template marketplace or changing existing project/pricing APIs.
- Explicit boundaries: Keep changes small and local to Templates data flow and required workflow artifacts.

## 8. Users And Use Cases
- Primary users: Site visitors browsing available templates.
- Secondary users: Developers maintaining the template list.
- Main use cases: Load the Templates page; fetch templates; view card title, description, category, and tags.
- Edge use cases: API request fails; API returns an empty list; cards collapse cleanly on small screens.

## 9. Functional Requirements
- Required behaviors: Create `templates.json`; expose `GET /api/templates`; fetch templates from the frontend; render responsive template cards; provide loading and error states.
- Inputs: HTTP GET request to `/api/templates`; frontend page load.
- Outputs: JSON array from backend; rendered cards in UI.
- State changes: React Query server-state cache stores the templates response.
- Error states: Backend route should pass unexpected errors to the centralized handler; frontend should show an inline error message if the query fails.
- Permissions/auth expectations: Public unauthenticated read endpoint.

## 10. Non-Functional Requirements
- Performance expectations: Small static JSON response; no database call.
- Reliability expectations: API returns deterministic data and does not mutate JSON content.
- Security/privacy expectations: No secrets, private user data, or sensitive fields are exposed.
- Accessibility expectations: Semantic page landmarks, accessible loading/error sections, card headings, readable tag text.
- Maintainability expectations: Use existing backend route/controller conventions and existing frontend service/query conventions.
- DX expectations: Verification commands documented each iteration; no new packages.

## 11. Affected Surfaces
- Files likely affected: `server/data/templates.json`, `server/controllers/templatesController.js`, `server/routes/templateRoutes.js`, `server/app.js`, `server/tests/templates.test.js`, `client/src/services/templateService.js`, `client/src/hooks/queries/useTemplates.js`, `client/src/Pages/Templates/Templates.jsx`.
- Directories likely affected: `server/data/`, `server/controllers/`, `server/routes/`, `server/tests/`, `client/src/services/`, `client/src/hooks/queries/`, `client/src/Pages/Templates/`, workflow artifact directories.
- UI surfaces: Templates page only.
- API routes: New `GET /api/templates`.
- Components: Existing Templates page component.
- Services: New frontend template service.
- Database/schema: None.
- Config/env vars: None.
- Tests: Add targeted backend test for `GET /api/templates`; targeted frontend lint/build verification.
- Docs: Workflow artifacts and durable project context.
- Workflow artifacts: `WORK_REQUEST.md`, `_spec/`, `_task/`, `_parallel/`, `_progress/progress.md`, `_handoff/current.md`, `_review/`, `_release/`, `_summary/`.

## 12. Dependency And Integration Map
- Internal dependencies: Backend route depends on JSON data and app mount. Frontend page depends on new service/hook and existing QueryClientProvider.
- External packages/services: Existing Express, Axios, TanStack Query, React, Phosphor icons.
- Integration points: `server/app.js` mounts route; `client/src/lib/api.js` supplies base URL and credentials.
- Ordering constraints: API contract must be defined before frontend consumption; implementation can be parallelized because backend and frontend file locks do not overlap once the contract is specified.
- Migration/setup requirements: None.

## 13. Data And State Impact
- Data models: Static JSON template objects with `id`, `title`, `description`, `category`, and `tags`.
- Database changes: None.
- State management changes: New React Query server-state hook; no Redux changes.
- Cache/session/local storage impact: React Query cache only.
- Backward compatibility impact: Additive API and UI data-source change.

## 14. UX / API / Workflow Expectations
- UX expectations: Keep the current dark, high-contrast Templates style but render data-driven cards; show skeleton-like loading cards; show a clear inline error panel; show an empty state if no templates are returned.
- API contract expectations: `GET /api/templates` returns a plain JSON array, not wrapped, matching the existing `/api/projects` route style.
- CLI/workflow behavior: Execute parallel workflow only where file locks are non-overlapping; final orchestrator performs merge review and final verification.
- Error handling expectations: Frontend uses service error normalization; backend uses central error handler for unexpected errors.
- Empty/loading/success/failure states: All required on the frontend.

## 15. Execution Strategy
- Recommended implementation approach: Create backend JSON/controller/route/test and frontend service/hook/UI update as separate parallel-safe tasks after saving queue/claims/locks.
- Suggested sequencing: Plan -> create parallel queue -> worker backend task -> worker frontend task -> orchestrator merge review -> final verification/artifacts.
- Safe rollout/migration approach: Additive backend route and small frontend replacement of local data with fetched data.
- Files to inspect before editing: `server/app.js`, existing route/controller/data pattern, `client/src/lib/api.js`, existing query/service pattern, `Templates.jsx`.
- Decisions to avoid until more evidence exists: Do not add filters, CRUD, database models, or new visual system.

## 16. Verification Strategy
- Required automated checks: Targeted backend endpoint test if practical; `npm run build --prefix client`; targeted `npx eslint src/Pages/Templates/Templates.jsx src/services/templateService.js src/hooks/queries/useTemplates.js` from `client`.
- Required manual checks: Review diff and verify loading/error/empty code paths exist.
- Test types needed: Backend integration test for `GET /api/templates`.
- Build/lint/typecheck expectations: Client build should pass; repo-wide lint may still fail on unrelated existing issues and should be documented if observed.
- Acceptance evidence required: Endpoint response includes at least 3 correctly shaped items; Templates page maps fetched data and handles loading/error/empty states.
- Proof of completion: Passing targeted checks or documented verification gaps, final diff audit, workflow artifacts complete.

## 17. Acceptance Criteria
- [ ] `server/data/templates.json` exists with at least three templates containing `id`, `title`, `description`, `category`, and `tags`.
- [ ] `GET /api/templates` returns the template list as JSON.
- [ ] A targeted backend test verifies the templates endpoint shape, or a verification gap is documented if the backend test cannot run.
- [ ] Frontend template API logic uses the shared client through service/query layers.
- [ ] `client/src/Pages/Templates/Templates.jsx` fetches templates and renders responsive cards from the endpoint data.
- [ ] Templates page includes loading, error, and empty states.
- [ ] No new dependencies, deployment changes, database schema changes, or hard-coded frontend API origins are introduced.
- [ ] Parallel claims, locks, worker status, merge review, final review, release notes, summary, handoff, and health check are recorded.

## 18. Edge Cases And Failure Modes
- Edge cases: Empty templates array; missing tags array; slow API request; API failure.
- Failure modes: Backend import path error; app route not mounted; frontend assumes wrapped response incorrectly; client build/lint fails.
- Regression risks: Existing Templates visual layout could break on mobile; app import could fail if route/controller has syntax errors; backend tests could require MongoDB despite static endpoint.
- Recovery expectations: Fix in-scope syntax/route/render issues; document unrelated repo-wide failures without broad refactors.

## 19. Risks And Mitigations
- Technical risks: Backend app imports connect to MongoDB during tests; mitigate with targeted test and document if external DB is unavailable.
- Product/UX risks: Data copy is sample-level; mitigate by keeping content generic and editable in JSON.
- Security risks: Low; static public data only.
- Scope risks: User asked for small/clean; mitigate by avoiding filters/downloads/admin CRUD.
- Mitigation plan: Keep files focused, run targeted verification, and use final diff audit.

## 20. Assumptions
- Explicit assumptions: Plain array response is acceptable; endpoint is public; `server/data/templates.json` is the intended data-source location; existing dark Templates design can remain; service/query hook layers are preferred even though the prompt names only `Templates.jsx`.
- Confidence level: High.
- What to revisit if assumptions are wrong: Response envelope, auth requirements, final copy/categories, or whether the data file should live outside `server/data/`.

## 21. Open Questions
- Blocking questions: None.
- Non-blocking questions: Whether future filters/downloads are planned.
- Execution impact: No impact for this small data-flow request.

## 22. Task Extraction Notes
- Suggested vertical task boundaries: One backend task for data/endpoint/test; one frontend task for service/query/page render.
- Suggested first task: Add templates JSON endpoint and targeted backend test.
- Suggested task ordering: Backend and frontend can run in parallel after contract definition; orchestrator completes final merge review and artifacts.
- Areas that should not become separate tasks: Styling-only tweaks, broad lint cleanup, deployment.
- How the 3-pass Build -> Refine -> Polish loop should apply: Each task records a first implementation pass, a targeted correctness/refinement pass, and a final cleanup/verification pass.
