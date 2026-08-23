# Vertical Task Plan

- Spec: `_workflow/runs/feat__creative-studio-redesign/spec.md`
- Planning date: 2026-08-23
- Approval: User approved the saved spec on 2026-08-23
- Execution mode: `complete-workflow`
- Frontend taste: Applied skill: design-taste-frontend

## TASK-001 — Establish the studio PRD workspace

- Status: Done
- Priority: P0
- Parallel safe: No
- Depends on: None
- Blocks: TASK-002
- File locks: `PRD.md`, `README.md`, `AGENTS.md`, `CLAUDE.md`, `roadmap.md`, `review.md`, `context/**`, `customers/**`, `spec/**`, `demos/**`, `routines/**`, `docs/PROJECT_CONTEXT.md`, `_decisions/**`
- Claim status: done
- Claimed by: Architect
- Merge risk: Medium
- Objective: Replace mentorship-era product truth with a PRD-backed creative studio operating workspace while preserving current implementation facts.
- Iterations: Build the smallest complete workspace; refine current-versus-intended truth and existing instructions; polish links, markers, and documentation diff.
- Test plan: Documentation structure, unresolved-marker, secret-pattern, and diff checks.
- Acceptance result:
  - [x] Product truth identifies the creative technology studio.
  - [x] Intended, implemented, historical, and unresolved facts remain separate.
  - [x] Setup PRD Workspace is installed/referenced and required documents are populated.
  - [x] No runtime, dependency, deployment, or secret change occurred.
- Iteration 1 Build: Created the approved PRD, installed the reusable skill, and populated the required workspace. Documentation-only missing-test exception; structural file checks passed.
- Iteration 2 Refine: Reconciled intended studio state with verified legacy implementation and preserved the repository workflow. Marker scan and diff check passed.
- Iteration 3 Polish: Replaced stale mentorship documentation, added compatibility pointers, and audited changed paths. No `client/` or `server/` file changed.
- Stop condition: An instruction conflict cannot be merged without weakening safety.

## TASK-002 — Add the editorial public shell and tested routes

- Status: Done
- Priority: P0
- Parallel safe: No
- Depends on: TASK-001
- Blocks: TASK-003
- File locks: `client/src/App.jsx`, navigation/header/footer/shared styles, route tests
- Claim status: done
- Claimed by: Codex
- Merge risk: High
- Objective: Deliver approved public routes, redirects, navigation, footer, and global editorial tokens.
- Iterations: Build routes/shell; refine keyboard/focus/reduced motion; polish responsive rhythm.
- Test plan: Add route/navigation assertions first, observe Red, implement Green, refactor and rerun.
- Acceptance result: Approved routes render; four legacy paths redirect; admin authorization survives; desktop and mobile navigation share one source.
- Iteration 1 Build: Added failing navigation expectations, then implemented canonical routes, redirects, navigation, and shell.
- Iteration 2 Refine: Preserved admin links/auth guards and replaced Font Awesome menu icons with Phosphor.
- Iteration 3 Polish: Applied editorial typography, then incorporated review feedback with a dark-only off-black/zinc canvas, original lime accent, focus states, and responsive overlay menu.
- Stop condition: Route work requires backend/auth contract changes.

## TASK-003 — Deliver Home, Work, and Start a Project

- Status: Done
- Priority: P0
- Parallel safe: No
- Depends on: TASK-002
- Blocks: TASK-004
- File locks: Home, Work/Projects, Contact/Start Project, content registry, related tests/styles
- Claim status: done
- Claimed by: Codex
- Merge risk: High
- Objective: Complete the primary visitor journey from positioning through proof to a persisted enquiry.
- Iterations: Build journey; refine API states and honest statuses; polish editorial composition and responsive behavior.
- Test plan: Add content, state, status-label, and enquiry-flow tests first.
- Acceptance result: Studio positioning and project CTA are explicit; Hibachi is marked “Building now”; API-backed work and enquiry contracts are preserved.
- Iterations: Built the core journey, refined honest state language and persisted enquiry copy, then polished responsive editorial layouts.
- Stop condition: Safe presentation requires a contact API schema change.

## TASK-004 — Deliver Services, About, Lab, and Journal

- Status: Done
- Priority: P1
- Parallel safe: No
- Depends on: TASK-003
- Blocks: TASK-005
- File locks: Services, About, Lab, Journal pages/components/content/styles/tests
- Claim status: done
- Claimed by: Codex
- Merge risk: Medium
- Objective: Complete the studio capability, story, experiment, and writing discovery surfaces.
- Iterations: Build verified content; refine fallbacks/hierarchy; polish responsive editorial pacing.
- Test plan: Add route-level content and state tests first.
- Acceptance result: Three engagement types, founder-led story, live Lab catalog, and explicitly “Publishing soon” journal entries ship without invented case-study claims.
- Iterations: Built all four routes, refined content against verified practice, and polished shared pacing and typography.
- Stop condition: A CMS or invented evidence becomes necessary.

## TASK-005 — Align supporting and private surfaces

- Status: Done
- Priority: P1
- Parallel safe: No
- Depends on: TASK-004
- Blocks: TASK-006
- File locks: Newsletter verification, NotFound, admin/login/dashboard/message presentation styles/tests
- Claim status: done
- Claimed by: Codex
- Merge risk: Medium
- Objective: Apply the design system without changing private business logic.
- Iterations: Build token alignment; refine focus/error/mobile states; polish visual consistency.
- Test plan: Run existing admin/newsletter tests first and after changes.
- Acceptance result: Admin/login/message and newsletter accents align to the original DevKofi lime; auth, backend, and data contracts are unchanged.
- Iterations: Applied tokens, audited unchanged logic, and verified admin-aware navigation tests.
- Stop condition: Visual alignment requires logic rewrites.

## TASK-006 — Harden, verify, and prepare the draft PR

- Status: Done
- Priority: P0
- Parallel safe: No
- Depends on: TASK-005
- Blocks: None
- File locks: Tests, workflow/polish artifacts, review, verification, release notes, summary
- Claim status: done
- Claimed by: Codex
- Merge risk: Low
- Objective: Prove approved behavior, audit scope/quality, and open a draft PR.
- Iterations: Fix in-scope failures; refine accessibility/performance; polish taste/diff/secret audits and evidence.
- Test plan: Full available frontend/backend checks plus browser review.
- Acceptance result: Production build, changed-file lint, 17 scoped tests, diff/secret/dependency audits pass. Browser automation is unavailable; 13 unrelated legacy full-suite failures are recorded. Draft PR is prepared after push; merge/deploy remain untouched.
- Iterations: Ran scoped and broad checks, separated in-scope evidence from legacy drift, and completed review/release/handoff artifacts.
- Stop condition: Unresolved in-scope failure or missing required evidence.
