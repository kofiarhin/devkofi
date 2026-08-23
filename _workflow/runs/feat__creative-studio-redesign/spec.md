# DevKofi Creative Technology Studio Redesign

## 1. Metadata

- Spec filename: `_workflow/runs/feat__creative-studio-redesign/spec.md`
- Date: 2026-08-23
- Request ID / slug: `creative-studio-redesign`
- Request source: Direct user request, repository evidence, Ideas Hub project record, and completed Grill
- Execution mode: `complete-workflow`
- Request classification: Feature / product-direction migration / polish-ui
- Scope level: Large
- Risk level: Medium

## 2. Original Request

- Raw request: Redesign the whole DevKofi website based on Kofi's current work, move away from mentorship, and use `kofiarhin/setup-prd-workspace`.
- Normalized request: Reposition DevKofi as Kofi's creative technology studio, create a PRD-driven repository workspace, redesign every public experience around qualified project enquiries and authentic work, preserve existing operational data flows, visually align private admin surfaces, verify the change, and open a draft PR without merging or deploying.
- Source: `_workflow/runs/feat__creative-studio-redesign/request.md`

## 3. Questions And Answers

- Positioning: Kofi-led creative technology studio.
- Conversion: Qualified client enquiries first; work discovery second.
- Visual identity: Cinematic editorial.
- Information architecture: Home, Work, Services, About, Lab, Journal, Start a Project.
- In-progress work: Public-safe, honestly labelled case studies.
- Private scope: Public redesign plus visual alignment of admin, not an admin UX rebuild.
- Assets: Authentic photography and verified screenshots only.
- Mentorship: Move away from mentorship as the product direction.
- PRD workflow: Use Setup PRD Workspace internally; keep `devkofi.com` as the public destination.
- Execution route: `@GitHub`.
- Remaining blocking questions: None.

## 4. Problem Definition

DevKofi's current public experience and durable documentation describe a mentorship and learning platform. That conflicts with Kofi's current work across product engineering, AI-assisted systems, photography, content, and creative technology. The site needs one coherent identity, stronger proof, and a direct path from interest to qualified enquiry.

## 5. Current State Analysis

- Public React/Vite routes currently include Home, About, Projects, Templates, Contact, Book a Call, newsletter verification, and 404.
- Home currently composes a landing surface, an AI workflow section, and mentorship-era pricing.
- Projects are API-backed, searchable, filterable, and include loading, error, empty, grid, case-study, and drawer states.
- Contact submissions persist to MongoDB before best-effort Telegram notification; this production flow is verified and must remain intact.
- Private admin authentication, dashboard, and message-detail routes exist.
- The client uses React 19, Vite 7, React Router, Redux Toolkit, TanStack Query, Framer Motion, Phosphor icons, SCSS, and Tailwind 4 tooling.
- Vitest, Jest/Supertest, Playwright, lint, and production build scripts exist.
- The latest verified `main` revision is `8e8068f`.
- Existing repository workflow documentation is extensive and must be preserved conservatively while product facts are corrected.
- Existing public assets are limited and mostly represent older projects.
- Ideas Hub currently identifies DevKofi as a mentorship platform; this is approved to change.

## 6. Desired End State

- DevKofi publicly presents a Kofi-led creative technology studio.
- Visitors understand what Kofi builds, see credible work, learn how he works, and can start a qualified enquiry.
- Hibachi leads as an honest building-now case study; ThriftChef, KareBraids, DevKofi, and selected creative work provide supporting proof.
- Mentorship language, pricing, and public navigation are removed from the primary experience.
- The repository contains an explicit studio PRD and a populated PRD operating workspace.
- Current implementation, intended direction, verified behavior, deprecated behavior, and unresolved content remain clearly separated.
- Existing backend contracts, persisted submissions, Telegram behavior, authentication, and admin functionality remain backward compatible.
- A draft PR contains all implementation and evidence; nothing is merged or deployed.

## 7. Scope

### In scope

- New studio PRD.
- Setup PRD Workspace installation/reference and populated documentation structure.
- Conservative updates to existing `AGENTS.md`, `CLAUDE.md`, README, and project context.
- New design tokens, typography, layout primitives, navigation, footer, motion, and responsive behavior.
- Public routes: Home, Work, Services, About, Lab, Journal, Start a Project, newsletter verification, 404.
- Legacy public redirects.
- API-backed project and template reuse where it strengthens the new experience.
- Admin visual-token alignment.
- Frontend tests and route/interaction regression coverage.
- Workflow and polish-ui artifacts.
- Draft pull request.
- Verified Ideas Hub update after implementation evidence exists.

### Out of scope

- Removing legacy mentorship data or database collections.
- Rewriting contact, booking, Telegram, authentication, or admin business logic.
- New paid services or dependencies.
- CMS implementation.
- Fabricated testimonials, client outcomes, photography, or metrics.
- Merge, production deployment, DNS changes, or destructive cleanup.

## 8. Users And Use Cases

- Primary: founders, small businesses, and teams seeking product engineering or creative technology work.
- Secondary: collaborators, recruiters, developers, content followers, and users exploring Kofi's products.
- Internal: Kofi reviewing enquiries and maintaining portfolio/project content.
- Main journey: Land → understand positioning → inspect work/capabilities → start a qualified project enquiry.
- Secondary journeys: Explore an in-progress product, read a build note, discover a reusable tool, or contact Kofi.
- Edge journey: API content unavailable; public pages still explain the studio and offer a functioning enquiry route.

## 9. Functional Requirements

- Replace mentorship-first navigation and homepage messaging.
- Add canonical routes `/work`, `/services`, `/lab`, `/journal`, and `/start-a-project`.
- Preserve `/about`, newsletter verification, 404, and private admin routes.
- Redirect `/projects` to `/work`, `/templates` to `/lab`, `/contact` and `/book-a-call` to `/start-a-project`.
- Present public-safe project status and distinguish live, building, and historical work.
- Keep the existing persisted contact submission pipeline; adapt public form copy and qualification fields only when the existing API contract supports them safely.
- Provide accessible mobile navigation, keyboard states, visible focus, reduced-motion behavior, and meaningful error/loading/empty states.
- Use authentic assets or explicit asset slots; do not invent portfolio evidence.
- Keep admin routes functionally unchanged and visually compatible with the new tokens.

## 10. Non-Functional Requirements

- Responsive from small mobile through wide desktop without horizontal overflow.
- WCAG-conscious contrast, landmarks, labels, keyboard navigation, focus management, and motion reduction.
- Animate transform and opacity only; isolate perpetual motion and avoid scroll listeners.
- Maintainable content/data separation and focused components.
- No secrets, environment changes, database migration, or new dependency unless separately approved.
- Preserve current API reliability and public error handling.
- Avoid generic AI visual patterns, purple/blue neon, excessive cards, stock photography, and fake data.

## 11. Affected Surfaces

- Routing and layout: `client/src/App.jsx`, header, side navigation, footer, scroll behavior.
- Design system: `client/src/index.css`, `client/src/main.styles.scss`, shared component styles.
- Public pages/components under `client/src/Pages` and `client/src/components`.
- Project/template hooks and services where reusable content is mapped into new surfaces.
- Frontend tests under `client/test`, `client/tests`, and applicable page/component folders.
- Admin presentation styles only.
- Documentation: `README.md`, `docs/PROJECT_CONTEXT.md`, PRD workspace files, decisions, run artifacts, polish-ui artifacts.
- Ideas Hub: `projects/devkofi.md`, `PROJECTS.md`, generated catalog/awareness/event files when justified.
- API/database/env/deployment: no intentional contract or configuration changes.

## 12. Dependency And Integration Map

- React Router → public/private route shells and legacy redirects.
- TanStack Query → project/template data.
- Redux Toolkit → navigation and authenticated UI state only.
- Existing contact service → Express API → MongoDB → best-effort Telegram notification.
- Existing admin session/query → protected routes.
- Framer Motion and Phosphor icons are already installed and may be used; no new animation/icon package is required.
- Setup PRD Workspace source → installed/reference skill → PRD-derived documentation.
- Ordering: establish product truth first, then design system/layout, then public pages, then legacy/admin alignment, then verification and knowledge synchronization.

## 13. Data And State Impact

- Database/schema: none.
- Existing persisted contacts/bookings: preserved.
- Authentication/session behavior: preserved.
- Redux: retain shared UI/auth state; do not copy project/template server records into Redux.
- TanStack Query: retain API-backed server-state ownership.
- Local storage: theme preference may be added only if implemented with system fallback and tested; otherwise default to the signature dark presentation without persistence.
- Backward compatibility: old public URLs redirect; APIs and private routes remain stable.

## 14. UX / API / Workflow Expectations

- UX: editorial, asymmetric, tactile, fast, and clear; dark-only layered surfaces with no light-theme counterpart in this release.
- Typography: characterful sans display plus restrained mono; no Inter.
- Palette: off-black and zinc surfaces, soft white text, and the original DevKofi lime as the single accent.
- Motion: fluid CSS/Framer transitions, staggered reveals, and reduced-motion fallbacks.
- API contracts: unchanged unless evidence proves a copy-only adaptation requires no contract change.
- Loading: shape-matched skeletons.
- Empty: useful next action.
- Error: inline explanation and retry where appropriate.
- Forms: visible labels above fields, helper/error text, clear success state.
- Workflow: PRD and operating docs distinguish intended, implemented, verified, historical, and unresolved facts.

## 15. Execution Strategy

1. Create the PRD and PRD operating workspace without changing runtime code.
2. Write route/content tests for the new public information architecture and observe expected failure.
3. Establish shared design tokens, typography, public shell, navigation, footer, and redirects.
4. Build Home and Work as the first complete public journey.
5. Build Services, About, Lab, Journal, and Start a Project using authentic content constraints.
6. Align newsletter, 404, and admin presentation without business-logic changes.
7. Refine responsive behavior, accessibility, reduced motion, performance, and failure states.
8. Run full verification, browser/code-surface review, final taste audit, and diff audit.
9. Open a draft PR.
10. Update Ideas Hub only with evidence-backed direction and implementation state.

## 16. Verification Strategy

- Frontend targeted tests during each vertical task.
- Frontend suite: `npm test --prefix client`.
- Client lint: `npm run lint --prefix client`.
- Client production build: `npm run build --prefix client`.
- Backend regression suite: `npm test --prefix server` or repository root equivalent identified during execution.
- Route/redirect assertions.
- Responsive browser checks where a runnable preview is available.
- Keyboard, focus, landmarks, reduced-motion, console, and network review.
- Final PR diff and changed-file audit.
- No claim of passing checks that GitHub execution cannot actually run; unrun checks remain explicit.

## 17. Acceptance Criteria

- [ ] Product and repository documentation identify DevKofi as a creative technology studio, not a mentorship platform.
- [ ] The PRD operating workspace is populated without fake evidence or unresolved template markers.
- [ ] Public navigation exposes Home, Work, Services, About, Lab, Journal, and Start a Project.
- [ ] Legacy public URLs redirect to their approved replacements.
- [ ] Home clearly communicates positioning, selected work, capabilities, and a project-enquiry CTA.
- [ ] Hibachi is visibly labelled as in development; no private details are exposed.
- [ ] Work/Lab distinguish live, building, and historical projects.
- [ ] The public enquiry journey preserves the existing persistence and notification contracts.
- [ ] Admin authentication and message workflows remain functionally unchanged.
- [ ] The design uses the approved editorial system and authentic-assets-only rule.
- [ ] Mobile, keyboard, focus, error, loading, empty, and reduced-motion behavior are handled.
- [ ] Relevant automated checks and production build pass or are reported as unverified blockers.
- [ ] A draft PR is opened; nothing is merged or deployed.
- [ ] Ideas Hub reflects verified direction without overstating implementation, merge, or deployment.

## 18. Edge Cases And Failure Modes

- Project/template API unavailable: retain meaningful static structure and retry messaging.
- Missing authentic media: render deliberate typographic/graphic asset slots without fake photography.
- Long titles/descriptions: clamp only where full content remains available in detail views.
- Motion disabled: all information and actions remain usable.
- Old bookmarks: redirects preserve intent.
- Contact submission succeeds but Telegram fails: preserve current successful persisted-submission behavior.
- Authenticated admin navigation: public shell changes must not leak into authorization decisions.
- In-progress work: status language must not imply shipped or verified outcomes.

## 19. Risks And Mitigations

- Product drift: PRD and decisions become the explicit authority.
- Scope expansion: no backend rewrite, CMS, dependency, merge, or deployment.
- Regression in operational flows: preserve service/hooks/contracts and run backend regression checks.
- Visual ambition harming performance/accessibility: transform/opacity motion, reduced-motion support, responsive fallbacks, and no heavy new visual dependency.
- Insufficient media: authentic asset slots and CSS/SVG materiality rather than invented images.
- Existing documentation conflict: merge conservatively; preserve safety/verification rules and record current vs intended state.
- GitHub-only verification limitations: never label unexecuted checks as passed.

## 20. Assumptions

- The existing API and admin workflows should remain available during the brand transition.
- Public mentorship content can be removed without deleting stored records.
- Existing Framer Motion and Phosphor dependencies are sufficient.
- Kofi will supply final photography after asset slots and requirements are visible.
- Confidence: High for product direction; medium for full runtime regression until checks execute.

## 21. Open Questions

- Blocking: None.
- Non-blocking: final photography selection, final client proof/testimonials, whether Journal content is API-backed or curated locally in v1, and whether a persistent theme toggle ships in the first PR.
- Execution impact: use honest placeholders/content registry and defer unsupported evidence; do not block core redesign.

## 22. Task Extraction Notes

- TASK-001: Establish the studio PRD workspace and durable product truth.
- TASK-002: Introduce tested public routing, redirects, and shared editorial shell.
- TASK-003: Deliver the Home → Work → Start a Project conversion journey.
- TASK-004: Deliver Services, About, Lab, and Journal discovery surfaces.
- TASK-005: Align supporting public states and private admin presentation.
- TASK-006: Complete responsive/accessibility/performance hardening and verification.
- Each task is sequential because shared routing, tokens, and content registries create file overlap.
- Apply Build → Refine → Polish with Red → Green → Refactor; documentation-only iterations record a justified test exception and perform structural/diff verification.

## 23. Frontend Taste Application

- Applicable.
- Detection: The request is a whole-site frontend redesign and activates the `polish-ui` path.
- Applied skill: design-taste-frontend.
- Required propagation: tasks, implementation evidence, polish-ui audit, final taste review, verification, review, release notes, summary, and workflow health.
- Baseline: design variance 8, motion intensity 6, visual density 4.

## 24. Approved Visual Amendment

- Date: 2026-08-23
- Source: Manual review feedback from Kofi.
- Replace the warm ivory/copper treatment with a dark-only off-black/zinc canvas and the original DevKofi lime accent.
- Preserve the approved editorial structure, typography, content, routes, and behavior.
- This amendment supersedes only the palette/theme statements in sections 3, 6, 10, 14, 17, and 23.
