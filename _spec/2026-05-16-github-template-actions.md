# GitHub Template Actions Spec

## 1. Metadata
- Spec filename: `_spec/2026-05-16-github-template-actions.md`
- Date: 2026-05-16
- Request ID / slug: `github-template-actions`
- Request source: Latest direct user prompt synced to `WORK_REQUEST.md`
- Execution mode: `complete-workflow`
- Request classification: `feature`
- Scope level: `small`
- Risk level: `low`

## 2. Original Request
- Raw user request: Implement GitHub-backed template actions on the DevKofi templates page, including adding a Codex Workflow Kit template and conditional CTAs for GitHub template generation, GitHub repo, and releases.
- Normalized request: Add optional GitHub-related template fields to static template data and render conditional primary/secondary actions in the existing templates UI while preserving current states and fallback behavior.
- Source prompt / WORK_REQUEST reference: `WORK_REQUEST.md`

## 3. Questions And Answers
- Questions asked: None.
- Answers received: Not applicable.
- Questions skipped: Skipped because the prompt provided exact data, target files, constraints, and success criteria.
- Remaining open questions: None blocking.

## 4. Problem Definition
- Problem being solved: Templates currently only expose a contact/request action, even when a template has an actionable GitHub repository, GitHub template generation URL, or release download.
- Why it matters: Users should be able to directly use or download available templates without unnecessary contact friction.
- Current pain point: The templates UI cannot represent templates that are immediately usable from GitHub.
- Expected value: The Codex Workflow Kit card can drive users directly to "Use Template", "GitHub", and "Download" actions while legacy cards keep the request flow.

## 5. Current State Analysis
- Existing behavior: `server/data/templates.json` contains three template objects with `id`, `title`, `description`, `category`, and `tags`. `Templates.jsx` maps fetched templates into cards and always renders one `/contact` CTA.
- Existing architecture/components: Backend serves JSON-backed templates; frontend uses `useTemplates` and `templateService` through the shared API client.
- Existing files/modules likely involved: `server/data/templates.json`, `client/src/Pages/Templates/Templates.jsx`.
- Existing data flow: Backend static JSON -> `/api/templates` -> shared client in `templateService` -> TanStack Query hook -> Templates page.
- Existing API/UI/CLI/workflow behavior: Loading, error, and empty states already exist in `Templates.jsx`; template cards currently render static actions.
- Existing tests or verification coverage: `server/tests/templates.test.js` verifies `/api/templates` returns the data file. Client build and lint are available.

## 6. Desired End State
- Expected final behavior: The Codex Workflow Kit template appears from JSON data and renders "Use Template", "GitHub", and "Download" links. Existing templates render "Request this template".
- User-facing outcome: Users can directly generate, inspect, or download GitHub-backed templates.
- Developer-facing outcome: Optional fields are data-driven and require no new dependency or controller change.
- System/workflow outcome: Workflow artifacts document implementation, validation, review, release notes, and summary.
- Backward compatibility expectations: Templates without GitHub fields keep the existing `/contact` CTA.

## 7. Scope
- In scope: Static JSON addition; template-card CTA rendering; local inline CSS additions; validation.
- Out of scope: Backend controller changes unless required; database persistence; new packages; deployment changes; broad UI redesign.
- Non-goals: Filtering, pricing, downloads beyond linking to the release URL, or changing the service/query architecture.
- Explicit boundaries: Do not modify unrelated routes, controllers, services, or styling systems.

## 8. Users And Use Cases
- Primary users: Visitors browsing DevKofi templates.
- Secondary users: Site owner maintaining the templates catalog.
- Main use cases: Use a GitHub template, open the template repository, download the latest release, request a non-GitHub template.
- Edge use cases: A template has only one optional link; a template has no optional links; missing tags or title fallback behavior remains defensive.

## 9. Functional Requirements
- Required behaviors: Add the exact Codex Workflow Kit object; render primary "Use Template" when `templateUrl` exists; render fallback "Request this template" when it does not; render secondary "GitHub" and "Download" when their URLs exist.
- Inputs: Static template JSON and optional URL fields from API response.
- Outputs: Template cards with correct links and labels.
- State changes: None beyond fetched data shape.
- Error states: Existing error state unchanged.
- Permissions/auth expectations: Not applicable.

## 10. Non-Functional Requirements
- Performance expectations: No new runtime dependency or extra request.
- Reliability expectations: Existing templates continue rendering when optional fields are absent.
- Security/privacy expectations: External links use `target="_blank"` with `rel="noreferrer"`.
- Accessibility expectations: Links remain keyboard focusable and grouped in a clear action region.
- Maintainability expectations: Keep conditional rendering straightforward and colocated with current card markup.
- DX expectations: JSON remains valid; JSX builds successfully.

## 11. Affected Surfaces
- Files likely affected: `server/data/templates.json`, `client/src/Pages/Templates/Templates.jsx`, workflow artifacts.
- Directories likely affected: `server/data/`, `client/src/Pages/Templates/`, `_spec/`, `_task/`, `_progress/`, `_handoff/`, `_review/`, `_release/`, `_summary/`.
- UI surfaces: `/templates`.
- API routes: Existing `/api/templates` response shape gains optional fields in static data.
- Components: `Templates`.
- Services: Read-only inspection of `templateService`; no service change expected.
- Database/schema: None.
- Config/env vars: None.
- Tests: Existing backend template test and build/lint checks.
- Docs: Workflow artifacts only.
- Workflow artifacts: `WORK_REQUEST.md`, `_spec`, `_task`, `_progress`, `_handoff`, `_review`, `_release`, `_summary`.

## 12. Dependency And Integration Map
- Internal dependencies: `Templates.jsx` depends on `useTemplates`; `useTemplates` depends on `templateService`; `templateService` depends on shared `api`.
- External packages/services: No new packages. Existing `@phosphor-icons/react`, React, TanStack Query, Vite.
- Integration points: `/api/templates` returns JSON; page consumes optional fields.
- Ordering constraints: Update data and UI, then validate JSON/build/test.
- Migration/setup requirements: None.

## 13. Data And State Impact
- Data models: Static JSON template object gains optional URL fields.
- Database changes: None.
- State management changes: None.
- Cache/session/local storage impact: React Query cache sees the expanded data shape.
- Backward compatibility impact: Optional fields preserve compatibility for existing objects.

## 14. UX / API / Workflow Expectations
- UX expectations: Card actions wrap cleanly, primary action is visually prominent, secondary actions are visually quieter.
- API contract expectations: Existing clients can ignore optional fields.
- CLI/workflow behavior: Complete the repo workflow artifacts and validation.
- Error handling expectations: Existing loading/error/empty states remain unchanged.
- Empty/loading/success/failure states: Loading, error, and empty branches remain unchanged except any non-behavioral CSS additions needed for cards.

## 15. Execution Strategy
- Recommended implementation approach: Add JSON object, destructure URL fields, create a card actions wrapper, conditionally render primary/fallback and secondary links, add requested CSS.
- Suggested sequencing: Data first, JSX second, CSS third, validation last.
- Safe rollout/migration approach: Optional data fields only; no breaking backend contract.
- Files to inspect before editing: The four user-specified files plus package scripts and existing template test.
- Decisions to avoid until more evidence exists: Do not redesign the cards or add tests that require new tooling unless existing validation reveals a gap.

## 16. Verification Strategy
- Required automated checks: JSON parse, Vite build, JSX syntax through build, backend template test if feasible.
- Required manual checks: Inspect JSX conditions to confirm labels and hrefs match the prompt.
- Test types needed: Existing backend Supertest route coverage; frontend build/lint.
- Build/lint/typecheck expectations: `npm run build --prefix client`; targeted or full lint if available.
- Acceptance evidence required: Commands and outcomes recorded in progress, review, release notes, and summary.
- Proof of completion: Diff contains the new template object and conditional links/styles.

## 17. Acceptance Criteria
- [ ] `server/data/templates.json` contains the exact `codex-workflow-kit` template with GitHub, template generation, and release URLs.
- [ ] `Templates.jsx` destructures `githubUrl`, `templateUrl`, and `releaseUrl` during template mapping.
- [ ] Templates with `templateUrl` show an external "Use Template" primary CTA.
- [ ] Templates without `templateUrl` still show "Request this template" linking to `/contact`.
- [ ] Templates with `githubUrl` show an external "GitHub" secondary CTA.
- [ ] Templates with `releaseUrl` show an external "Download" secondary CTA.
- [ ] Requested `.template-card__actions` and secondary action styles are added in the existing style block.
- [ ] Loading, error, and empty states remain behaviorally unchanged.
- [ ] JSON validity and client build/JSX validation pass; backend template route check is attempted.

## 18. Edge Cases And Failure Modes
- Edge cases: Template has only `githubUrl`; template has only `releaseUrl`; template has no optional URLs.
- Failure modes: Invalid JSON; external links missing security attrs; wrapping actions break mobile layout.
- Regression risks: Existing cards losing fallback CTA; loading/error/empty branches accidentally altered.
- Recovery expectations: Fix only in-scope JSON/JSX/CSS issues and rerun failing checks.

## 19. Risks And Mitigations
- Technical risks: JSX conditional rendering mistakes. Mitigation: build and lint.
- Product/UX risks: Too many CTAs could crowd mobile cards. Mitigation: flex-wrap action container and concise labels.
- Security risks: External tabnabbing. Mitigation: `rel="noreferrer"`.
- Scope risks: Prior template workflow artifacts exist. Mitigation: create a new request-specific workflow run and edit only requested implementation files.
- Mitigation plan: Keep change narrow, run existing checks, audit final diff.

## 20. Assumptions
- Explicit assumptions: The template service and hook do not need changes because they pass through arbitrary JSON fields. The backend controller does not need changes because it returns the JSON file.
- Confidence level: High.
- What to revisit if assumptions are wrong: If verification shows fields are stripped by a controller or transformer, update only that backend layer.

## 21. Open Questions
- Blocking questions: None.
- Non-blocking questions: Whether future templates should use tests for frontend CTA presence.
- Execution impact: No implementation blocker.

## 22. Task Extraction Notes
- Suggested vertical task boundaries: One vertical task is sufficient because data and card rendering are a single user-visible slice.
- Suggested first task: `TASK-001: Add GitHub-backed actions to templates`.
- Suggested task ordering: Complete the single task through Build, Refine, and Polish, then final review/release/summary.
- Areas that should not become separate tasks: Service or hook changes unless verification proves they are required.
- How the 3-pass Build -> Refine -> Polish loop should apply: Build performs the data/UI change, Refine verifies and adjusts syntax/style details, Polish runs final checks and audit.
