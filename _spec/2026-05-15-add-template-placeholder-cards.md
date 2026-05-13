# Add Template Placeholder Cards Spec

## 1. Metadata

- Spec filename: `_spec/2026-05-15-add-template-placeholder-cards.md`
- Date: 2026-05-15
- Request ID / slug: `add-template-placeholder-cards`
- Request source: Latest direct user prompt and follow-up clarification.
- Execution mode: `complete-workflow`
- Request classification: `feature`
- Scope level: `small`
- Risk level: `low`

## 2. Original Request

- Raw user request: `add placeholder content to the templates page`
- Normalized request: Add placeholder content to the existing Templates page.
- Source prompt / WORK_REQUEST reference: `WORK_REQUEST.md`

## 3. Questions And Answers

- Questions asked:
  - What placeholder content should the Templates page show: a simple empty-state message, or sample template cards/list items?
  - Should I proceed despite the existing dirty workflow files?
- Answers received:
  - Use three sample template cards.
  - Proceed carefully, preserve all existing dirty files and workflow artifacts, and only update the required workflow artifacts plus `client/src/Pages/Templates/Templates.jsx`.
- Questions skipped: None.
- Remaining open questions: None blocking.

## 4. Problem Definition

- Problem being solved: The `/templates` page currently renders only the text `Templates`, leaving the route visually unfinished.
- Why it matters: Visitors need a credible placeholder surface that communicates what templates will be available.
- Current pain point: The existing page has no sample content, hierarchy, or helpful preview.
- Expected value: The route will look intentional while final template data/features are pending.

## 5. Current State Analysis

- Existing behavior: `client/src/Pages/Templates/Templates.jsx` returns `<div>Templates</div>`.
- Existing architecture/components: React + Vite app with public routes in `client/src/App.jsx`; pages live under `client/src/Pages/`.
- Existing files/modules likely involved: `client/src/Pages/Templates/Templates.jsx`.
- Existing data flow: No data fetching or state on the Templates page.
- Existing API/UI/CLI/workflow behavior: `/templates` is already routed as a public page.
- Existing tests or verification coverage: No Templates-specific tests found during intake.

## 6. Desired End State

- Expected final behavior: `/templates` displays a responsive section with three sample template cards.
- User-facing outcome: Visitors see clear placeholder cards for planned template types.
- Developer-facing outcome: The placeholder is self-contained in `Templates.jsx`, with no new dependencies or route changes.
- System/workflow outcome: Required workflow artifacts document the scoped change.
- Backward compatibility expectations: Existing route and layout remain unchanged.

## 7. Scope

- In scope:
  - Replace the Templates page stub with three sample template cards.
  - Keep content static and UI-only.
  - Preserve accessibility and responsive layout.
  - Update required workflow artifacts.
- Out of scope:
  - Backend/API/template persistence.
  - New routes.
  - New dependencies.
  - Deployment changes.
  - Editing style/config files.
- Non-goals: Full template marketplace functionality, filtering, checkout, downloads, or data integration.
- Explicit boundaries: Only update required workflow artifacts and `client/src/Pages/Templates/Templates.jsx`.

## 8. Users And Use Cases

- Primary users: Site visitors browsing DevKofi templates.
- Secondary users: Developers reviewing the route during workflow testing.
- Main use cases: Visit `/templates` and understand sample template categories that may be offered.
- Edge use cases: Small mobile viewport, keyboard navigation, reduced motion preferences.

## 9. Functional Requirements

- Required behaviors:
  - Render exactly three sample template cards.
  - Include meaningful placeholder names, descriptions, metadata, and visible actions/status cues.
  - Keep all content static.
- Inputs: None.
- Outputs: Static rendered UI.
- State changes: None.
- Error states: Not applicable because there is no asynchronous behavior.
- Permissions/auth expectations: Public page; no auth changes.

## 10. Non-Functional Requirements

- Performance expectations: Static rendering only; no expensive animations or network calls.
- Reliability expectations: Page should build without runtime errors.
- Security/privacy expectations: No secrets, user data, or API behavior.
- Accessibility expectations: Use semantic landmarks/headings, readable contrast, keyboard-focusable links/buttons if present.
- Maintainability expectations: Keep sample data in a local array and render via map.
- DX expectations: Component remains simple and self-contained.

## 11. Affected Surfaces

- Files likely affected:
  - `client/src/Pages/Templates/Templates.jsx`
  - `WORK_REQUEST.md`
  - `_spec/2026-05-15-add-template-placeholder-cards.md`
  - `_task/2026-05-15-add-template-placeholder-cards.md`
  - `_progress/progress.md`
  - `_handoff/current.md`
  - `_review/2026-05-15-add-template-placeholder-cards.md`
  - `_release/add-template-placeholder-cards.md`
  - `_summary/2026-05-15-add-template-placeholder-cards.md`
- Directories likely affected: `client/src/Pages/Templates/`, workflow artifact directories.
- UI surfaces: `/templates`.
- API routes: Not applicable.
- Components: `Templates`.
- Services: Not applicable.
- Database/schema: Not applicable.
- Config/env vars: Not applicable.
- Tests: No new test planned due tiny static placeholder and user-constrained file set.
- Docs: Workflow artifacts only.
- Workflow artifacts: Required spec, task, progress, handoff, review, release notes, summary.

## 12. Dependency And Integration Map

- Internal dependencies: Public route imports `Templates` from `client/src/App.jsx`.
- External packages/services: React and installed `@phosphor-icons/react` icons.
- Integration points: Existing public layout wraps page with Header/Footer.
- Ordering constraints: Save spec and task plan before editing implementation.
- Migration/setup requirements: None.

## 13. Data And State Impact

- Data models: None.
- Database changes: None.
- State management changes: None.
- Cache/session/local storage impact: None.
- Backward compatibility impact: None expected.

## 14. UX / API / Workflow Expectations

- UX expectations: Polished placeholder content with three distinct sample template cards, consistent dark DevKofi visual language, responsive mobile stack.
- API contract expectations: No API changes.
- CLI/workflow behavior: Run available frontend verification.
- Error handling expectations: Not applicable.
- Empty/loading/success/failure states: Static placeholder acts as interim page content; no async states needed.

## 15. Execution Strategy

- Recommended implementation approach:
  - Define a local `templateCards` array.
  - Render a semantic `<main>` with intro copy and three `<article>` cards.
  - Use inline style objects because the user constrained implementation edits to `Templates.jsx` and the current app is not wired for Tailwind output.
  - Use installed Phosphor icons after verifying package availability.
- Suggested sequencing:
  1. Save workflow spec.
  2. Save task plan.
  3. Replace the page stub with the static card UI.
  4. Run verification.
  5. Record progress, review, release notes, summary, and handoff.
- Safe rollout/migration approach: UI-only replacement of a stub page.
- Files to inspect before editing: `client/src/Pages/Templates/Templates.jsx`, `client/package.json`, nearby page patterns.
- Decisions to avoid until more evidence exists: Data model, backend endpoints, template downloads, pricing, or filtering.

## 16. Verification Strategy

- Required automated checks:
  - `cd client && npm run build`
- Required manual checks:
  - Review the `Templates.jsx` diff for exactly three cards and no out-of-scope files.
- Test types needed: No dedicated test required for this tiny static placeholder under the user-constrained file set.
- Build/lint/typecheck expectations: Build should pass. Lint may be run if build passes and command is available.
- Acceptance evidence required: Build/lint result or documented failure, diff review, acceptance checklist.
- Proof of completion: Three sample cards exist in `Templates.jsx` and build succeeds.

## 17. Acceptance Criteria

- [ ] `client/src/Pages/Templates/Templates.jsx` renders three sample template cards.
- [ ] Placeholder content is static and does not add backend/API/data dependencies.
- [ ] The page uses semantic, responsive, accessible markup.
- [ ] No files outside required workflow artifacts and `client/src/Pages/Templates/Templates.jsx` are edited.
- [ ] Verification is attempted and documented.

## 18. Edge Cases And Failure Modes

- Edge cases: Mobile width, long card text, keyboard focus on calls to action.
- Failure modes: Build failure due unsupported syntax/import; style not applying because external CSS was not added.
- Regression risks: Accidentally adding a dependency, route change, or editing dirty unrelated files.
- Recovery expectations: Fix only `Templates.jsx` if verification fails in scope; otherwise document unrelated failures.

## 19. Risks And Mitigations

- Technical risks: Inline styles could become bulky. Mitigation: Keep styles compact and local due one-file constraint.
- Product/UX risks: Placeholder content may imply final offerings. Mitigation: Label content as sample/coming soon.
- Security risks: None expected.
- Scope risks: Workflow artifacts are already dirty. Mitigation: Update only required sections/files and preserve unrelated dirty changes.
- Mitigation plan: Use focused diff review and final `git status --short`.

## 20. Assumptions

- Explicit assumptions:
  - The Templates page should remain UI-only.
  - Static placeholder cards are acceptable without links to real template assets.
  - `@phosphor-icons/react` can be used because it is installed.
  - Inline styles are acceptable for this constrained workflow test.
- Confidence level: High.
- What to revisit if assumptions are wrong: Move styles to a SCSS module/file and add tests in a follow-up, if the file constraint is lifted.

## 21. Open Questions

- Blocking questions: None.
- Non-blocking questions: Final template names, pricing, and real download/workflow behavior remain future work.
- Execution impact: Non-blocking; proceed with sample content.

## 22. Task Extraction Notes

- Suggested vertical task boundaries: One task is sufficient because this is a single static page placeholder.
- Suggested first task: Add three sample template cards to the Templates page.
- Suggested task ordering: Only one implementation task, followed by required review/release/summary artifacts.
- Areas that should not become separate tasks: Backend, tests, stylesheets, route changes.
- How the 3-pass Build -> Refine -> Polish loop should apply: Build the static UI, refine semantics/responsiveness, polish final diff and verification evidence.
