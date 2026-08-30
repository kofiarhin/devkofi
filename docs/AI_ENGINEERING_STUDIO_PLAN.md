# DevKofi AI Engineering Studio — Detailed Implementation Plan

**Status:** Approved planning artifact  
**Product:** DevKofi Website  
**Repository:** `kofiarhin/devkofi`  
**Branch:** `docs/ai-engineering-studio-prd`  
**Governing PRD:** `docs/AI_ENGINEERING_STUDIO_PRD.md`  
**Governing specification:** `docs/AI_ENGINEERING_STUDIO_SPEC.md`  
**Execution state:** Planning only; this document does not authorize implementation, merge, or deployment.

---

## 1. Objective

Implement the approved DevKofi repositioning as a founder-led AI Engineering Studio while preserving working parts of the current application and avoiding unnecessary rewrites.

The implementation must produce a public site that clearly communicates:

> **I engineer AI systems that do real work.**

The finished redesign must make the following distinctions obvious:

- **Services** — what clients can hire DevKofi to do.
- **Work** — curated engineering case studies proving capability.
- **Engineering Systems** — the methods, systems, and infrastructure used to engineer reliably.
- **Products** — applications and products built using those systems and workflows.

This plan converts the approved specification into phased, verifiable execution work.

---

## 2. Current Baseline to Preserve

The implementation starts from the current DevKofi application rather than a greenfield replacement.

Current useful foundations include:

- React + Vite frontend.
- React Router routing.
- Redux Toolkit navigation/admin state.
- TanStack Query project data access.
- Sass and Tailwind available in the client.
- Framer Motion available for restrained animation.
- Vitest and Testing Library.
- Existing `/api/projects` project data flow.
- Existing project thumbnails, descriptions, technologies, live links, repository links, statuses, search/filter helpers, and accessible project drawer patterns.
- Existing profile and supporting image assets.
- Existing dark DevKofi green/lime design variables.
- Existing public and admin route separation.

Admin functionality is not part of the redesign and must remain operational.

---

## 3. Delivery Strategy

Use incremental vertical slices instead of one large visual rewrite.

Each phase should leave the branch in a coherent state and should be verified before moving to the next phase.

Implementation order:

1. Foundation and safety checks.
2. Theme and shared layout primitives.
3. Navigation and route migration.
4. Project/content data classification.
5. Homepage.
6. Services.
7. Work.
8. Engineering Systems.
9. Products.
10. About and Book a Call refinement.
11. SEO, accessibility, performance, and compatibility pass.
12. Full verification and release-readiness review.

No merge or deployment is included in this plan unless separately approved.

---

## 4. Phase 0 — Pre-Implementation Revalidation

### Goal

Confirm that implementation is beginning from the exact expected repository state.

### Tasks

- Re-fetch the latest `docs/AI_ENGINEERING_STUDIO_PRD.md`.
- Re-fetch the latest `docs/AI_ENGINEERING_STUDIO_SPEC.md`.
- Confirm current branch and base branch.
- Inspect latest `client/package.json`.
- Inspect current public routes in `client/src/App.jsx`.
- Inspect `client/src/constants/navigation.js`.
- Inspect current theme values in `client/src/main.styles.scss`.
- Inspect current Header and SideNav implementation.
- Inspect current project query/data flow.
- Inspect available test scripts and CI configuration.
- Confirm no material scope drift from the approved PRD/specification.

### Exit criteria

- Repository baseline is understood.
- No unapproved product-direction change has appeared.
- Required implementation branch is isolated from `main`.
- Existing admin routes and project API are explicitly marked as compatibility constraints.

---

## 5. Phase 1 — Design System Foundation

### Goal

Create one centralized visual system before rebuilding page sections.

### Expected areas

- `client/src/main.styles.scss`
- optional `client/src/styles/tokens.scss`
- optional `client/src/styles/mixins.scss`
- optional shared layout utility files

### Tasks

#### 5.1 Normalize semantic color tokens

Consolidate current DevKofi green/lime and dark-neutral values into semantic variables such as:

- `--color-brand-primary`
- `--color-brand-accent`
- `--color-bg-primary`
- `--color-bg-secondary`
- `--color-bg-elevated`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-border-subtle`
- `--color-success`
- `--color-warning`
- `--color-error`

Preserve the existing brand identity rather than introducing generic AI gradients.

#### 5.2 Normalize spacing, radius, container, and motion tokens

Add semantic values for:

- spacing scale
- page gutters
- max content widths
- radii
- shadows
- transition speeds
- easing

#### 5.3 Typography system

Preserve Outfit unless a separate design decision changes it.

Define reusable typography scales for:

- display
- H1
- H2
- H3
- body large
- body
- body small
- eyebrow/kicker
- labels/buttons

Prefer fluid `clamp()` sizing where appropriate.

#### 5.4 Reconcile duplicate Sass variables

Reduce divergence between CSS custom properties and existing Sass values such as `$lime`, `$bg-dark`, `$card-bg`, and `$border-green`.

### Tests/verification

- Client lint passes.
- Existing pages still render without broken variables.
- No major contrast regression.
- No public component introduces new hard-coded brand colors during subsequent phases.

### Exit criteria

The visual system can support the redesign without page-specific color duplication.

---

## 6. Phase 2 — Shared Layout Components

### Goal

Build reusable primitives so every page follows the same visual language.

### Proposed components

- `PageHero`
- `SplitSection`
- `SectionHeader`
- `ContentContainer`
- `FinalCta`
- reusable CTA/button variants
- reusable media frame

### SplitSection requirements

Desktop supports:

- text-left / media-right
- media-left / text-right

Mobile always renders:

1. media
2. text

Implementation must preserve logical semantic/DOM reading order.

### Visual requirements

- Visual column should generally carry more weight than text.
- Copy blocks remain concise.
- Shared section spacing is token-based.
- Media supports screenshots, profile images, diagrams, and thumbnails.

### Tests

- Render both split variants.
- Confirm mobile DOM/visual order.
- Verify alt text handling.
- Verify CTA links remain keyboard accessible.

### Exit criteria

Homepage and inner pages can be composed mainly from shared layout primitives.

---

## 7. Phase 3 — Navigation and Route Migration

### Goal

Move the public information architecture to the approved structure without breaking important legacy URLs or admin routes.

### Target public routes

- `/`
- `/services`
- `/work`
- `/engineering-systems`
- `/products`
- `/about`
- `/book-a-call`

### Legacy compatibility

- `/projects` redirects to `/work`.
- `/templates` redirects to `/engineering-systems`.
- `/contact` may remain available as a secondary compatibility route, but is removed from primary navigation.

### Navigation source

Update `client/src/constants/navigation.js` to be the single source for:

- Home
- Services
- Work
- Engineering Systems
- Products
- About
- Book a Call

### Desktop header

- DevKofi wordmark left.
- Main navigation visible.
- Book a Call visually distinct.

### Mobile header

- Hamburger button on left.
- DevKofi wordmark visually centered.
- Minimal right-side content.

### Mobile drawer

Must support:

- slide from left
- visible close control
- Escape close
- backdrop close
- route-selection close
- body scroll lock
- `aria-expanded`
- `aria-controls`
- focus transfer into drawer
- focus trap
- focus restoration to trigger
- active route state
- appropriate touch targets

Reuse Redux navigation state if adequate rather than introducing another state mechanism.

### Compatibility constraint

Existing admin navigation must remain functional and must not be unintentionally exposed in public navigation.

### Tests

- Route rendering tests.
- Legacy redirect tests.
- Mobile drawer keyboard test.
- Active navigation state test.
- Admin route smoke test.

### Exit criteria

The new site information architecture is reachable and accessible before page redesign work proceeds.

---

## 8. Phase 4 — Content and Project Data Architecture

### Goal

Reuse the existing project data flow while enabling separate Work, Products, and Engineering Systems views.

### Existing source

Continue using the existing `/api/projects` query unless repository evidence shows a reason to change it.

### Required classification model

Add or normalize fields equivalent to:

- `id`
- `slug`
- `name` / `title`
- `shortDescription`
- `engineeringSummary`
- `thumbnailUrl`
- `technologies`
- `demoUrl`
- `repoUrl`
- `status`
- `featured`
- `displayOrder`
- `aiEngineering`
- `product`
- `engineeringSystem`
- `caseStudy`
- `category`

Exact backend field names should follow the existing data model where possible.

### Selector layer

Create selectors/helpers such as:

- `selectFeaturedWork(projects)`
- `selectWorkProjects(projects)`
- `selectProducts(projects)`
- `selectEngineeringSystems(projects)`
- `sortByDisplayOrder(projects)`

Do not duplicate project arrays inside individual pages.

### Data audit

Before presenting flagship claims, confirm that target projects exist in the source data and have accurate:

- state/status
- description
- thumbnail
- repository URL
- live/demo URL where applicable

Initial flagship candidates remain:

- Hibachi
- Brain
- Context API

Potential Engineering Systems candidates:

- Codex Workflow Kit
- Agent System
- Context API where appropriate

Do not present specification-only or unfinished projects as shipped.

### Tests

- selector unit tests
- missing-field fallbacks
- project classification tests
- status normalization tests

### Exit criteria

One project source can safely power Home, Work, Products, and Engineering Systems.

---

## 9. Phase 5 — Homepage Implementation

### Goal

Build the primary commercial narrative and conversion path.

### Required section order

1. Hero
2. Problem
3. AI Systems Engineering
4. Supporting Services
5. Selected Work
6. Engineering Systems Preview
7. Products Preview
8. Engineering Process
9. Point of View
10. Final CTA

### 9.1 Hero

Desktop:

- text left
- existing DevKofi profile image right

Content:

- optional eyebrow: `AI Engineering Studio`
- H1: `I engineer AI systems that do real work.`
- concise proposition
- `Book a Call`
- `Explore My Work`

Mobile:

1. profile image
2. eyebrow
3. headline
4. supporting copy
5. CTAs

Do not make the existing background video the primary hero experience unless separately justified.

### 9.2 Problem

Explain the prototype-to-production gap with concise copy and a real technical/project visual.

### 9.3 AI Systems Engineering

Give the flagship service more prominence than every other service.

CTA routes to Services.

### 9.4 Supporting Services

Show compact summaries for:

- AI Product Engineering
- Agentic Workflow Engineering
- AI Integration
- AI Context & Knowledge Systems
- AI Engineering Partner

### 9.5 Selected Work

Use approximately three curated flagship projects.

Each item:

- screenshot/thumbnail
- title
- category
- one-line proof/outcome
- status where helpful
- case-study CTA
- live/repo links only when meaningful

### 9.6 Engineering Systems Preview

Preview the repeatable engineering methodology/infrastructure behind the work.

### 9.7 Products Preview

Show visually strong applications built using the engineering workflows.

### 9.8 Engineering Process

Display:

`Discover → Design → Engineer → Verify → Deploy → Improve`

### 9.9 Point of View

Anchor around:

`AI isn’t the whole system.`

Explain the surrounding engineering layer: context, data, tools, permissions, verification, human control, and UX.

### 9.10 Final CTA

Primary action:

`Book a Call`

### Tests

- section presence/order
- mobile layout behavior
- CTA destinations
- loading/error behavior for project-backed sections
- accessibility of images/headings

### Exit criteria

A visitor can understand who DevKofi is, what is offered, proof of capability, and the next action from the homepage alone.

---

## 10. Phase 6 — Services Page

### Goal

Answer: “What can I hire Kofi to do?”

### Structure

- page hero/introduction
- flagship AI Systems Engineering section
- supporting service sections
- final Book a Call CTA

### Service content contract

Each service should contain:

- title
- short problem framing
- concise description of what is built
- typical use cases
- relevant visual
- CTA

### Layout

Use alternating SplitSection presentation on desktop.

Mobile always displays media before copy.

### Content priority

AI Systems Engineering is dominant.

Other services support the primary positioning and must not make the site feel like a generic catalogue.

### Exit criteria

A prospective client can identify the right engagement category without reading excessive technical copy.

---

## 11. Phase 7 — Work Page

### Goal

Turn the existing Projects concept into curated engineering proof.

### Route

`/work`

### Required behavior

- prioritize 4–6 strongest relevant case studies
- avoid displaying every historical project equally
- preserve useful project data and interaction patterns from the current Projects implementation
- retain live/repo links where appropriate

### Case study information model

Where data exists, expose:

- Problem
- Context
- System
- Engineering approach
- Architecture
- Important decisions
- Challenges
- Verification
- Outcome
- Screenshots/demo
- Repository/live link
- Status

The initial implementation may use an expandable drawer/detail view if a dedicated case-study route would be disproportionate, but the content architecture should permit dedicated routes later.

### Filtering

Heavy portfolio-style filtering is optional on Work and should only remain if it supports the curated experience.

Work should not feel like a searchable dump of repositories.

### Exit criteria

The page demonstrates senior AI/full-stack engineering capability through a deliberately curated set of systems.

---

## 12. Phase 8 — Engineering Systems Page

### Goal

Explain how DevKofi builds reliably and establish differentiation beyond project screenshots.

### Route

`/engineering-systems`

### Content candidates

- Codex Workflow Kit
- Agent System
- context infrastructure
- specification workflows
- verification patterns
- testing systems
- orchestration patterns
- reusable developer tooling

### Per-system content contract

Each item answers:

- What is it?
- Why was it built?
- What problem does it solve?
- How is it used?
- Where has it been applied?

### Visual treatment

Prefer:

- architecture diagrams
- screenshots
- workflow diagrams
- repository/project imagery

Avoid abstract decorative AI graphics.

### Exit criteria

Visitors understand that DevKofi has a repeatable engineering methodology and reusable infrastructure, not only one-off demos.

---

## 13. Phase 9 — Products Page

### Goal

Provide a visual gallery of applications/products built using DevKofi engineering systems and workflows.

### Route

`/products`

### Presentation

Image-first cards/rows with:

- large thumbnail
- product title
- one-line description/outcome
- live demo button where available
- repository button where available
- status where relevant

### Data

Use `selectProducts(projects)` rather than duplicated page data.

Products can include AI and non-AI software if they support the story that DevKofi ships real applications using the engineering system.

### Exit criteria

The page showcases breadth of shipped output without diluting Work as the curated AI-engineering proof page.

---

## 14. Phase 10 — About and Book a Call

### About

Refine into a founder-led engineering narrative rather than a long CV.

Structure:

- profile image
- concise introduction
- software engineering background
- transition into AI engineering
- engineering philosophy
- how work is approached
- selected imagery/pull quote
- CTA

### Book a Call

Keep conversion-focused and minimal.

Retain existing booking behavior where functional.

Potential supporting form fields only if already useful or explicitly approved:

- name
- company
- email
- what are you trying to build?
- current stage

Do not add unnecessary lead qualification complexity.

### Exit criteria

Both pages support the new positioning without introducing new business workflows beyond the PRD.

---

## 15. Phase 11 — Footer and Secondary Navigation

### Goal

Ensure global navigation and secondary links reflect the new architecture.

### Tasks

- update Footer public links from shared navigation data where practical
- ensure Work/Engineering Systems/Products are represented consistently
- keep Contact only as a secondary route if still retained
- preserve legal/social links that remain valid
- avoid duplicate or stale `Projects` / `Templates` terminology

### Exit criteria

No public global navigation element contradicts the new information architecture.

---

## 16. Phase 12 — SEO and Metadata

### Goal

Make each route communicate distinct search intent and social metadata.

### Route intent

- Home: AI Engineer / AI Engineering Studio
- Services: AI Engineering Services
- Work: AI Engineering Projects / Case Studies
- Engineering Systems: AI Engineering Systems & Workflows
- Products: DevKofi Products
- About: Kofi / DevKofi
- Book a Call: Hire / Work With DevKofi

### Tasks

- centralized route metadata source
- title and meta description per route
- Open Graph metadata
- canonical paths where supported
- meaningful image metadata when available
- structured heading hierarchy

Do not introduce awkward keyword stuffing.

### Exit criteria

Every primary page has unique metadata matching its purpose.

---

## 17. Phase 13 — Accessibility Hardening

### Required verification areas

- semantic landmarks
- one logical H1 per page
- heading order
- keyboard navigation
- visible focus states
- mobile drawer focus trap and restoration
- dialog/drawer labeling
- button/link semantics
- meaningful image alt text
- decorative image handling
- contrast
- reduced-motion support
- route-change focus/scroll behavior

### Specific drawer checks

- Escape closes
- backdrop closes
- focus never escapes while open
- focus returns to trigger
- scroll locks without layout jump

### Exit criteria

Core public journeys are usable without a mouse and major interactions are screen-reader understandable.

---

## 18. Phase 14 — Performance Hardening

### Tasks

- responsive images
- lazy load below-the-fold project media
- preserve eager loading only for critical hero/profile imagery
- avoid large decorative video/image payloads where unnecessary
- prevent layout shifts by reserving image aspect ratios
- use Framer Motion selectively
- honor `prefers-reduced-motion`
- inspect bundle impact before adding any dependency

### Rule

Do not add a new dependency where the current stack already solves the problem.

### Exit criteria

The image-led direction does not materially degrade loading or interaction performance.

---

## 19. Testing Plan

### Unit tests

Cover:

- project selectors/classification
- navigation data
- legacy route mapping helpers if introduced
- status/metadata normalization

### Component tests

Cover:

- SplitSection variants
- Header nav
- mobile drawer
- project/product cards
- service section
- Final CTA

### Page tests

Cover:

- homepage critical content
- Services route
- Work route
- Engineering Systems route
- Products route
- About route
- Book a Call route
- legacy redirects

### Accessibility-oriented interaction tests

- keyboard drawer flow
- Escape behavior
- focus return
- button/link names

### Existing functionality smoke tests

- project API loading
- project error state
- admin login route still renders
- admin dashboard route remains protected
- newsletter verification route remains reachable if still required

---

## 20. Verification Commands

Use the exact scripts present in the repository at implementation time.

Expected client checks include:

```bash
npm test
npm run lint
npm run build
```

If the repository root defines orchestrated equivalents, prefer the project-standard root commands.

No passing claim may be made for a command that was not actually executed.

### Manual/browser verification

At minimum verify desktop and mobile behavior for:

- `/`
- `/services`
- `/work`
- `/engineering-systems`
- `/products`
- `/about`
- `/book-a-call`
- `/projects` legacy behavior
- `/templates` legacy behavior

Also verify:

- mobile left drawer
- active route styles
- all primary CTAs
- external live/repo links
- project loading/error states
- no console-breaking errors

---

## 21. Suggested Implementation Commits

Keep commits scoped and reviewable.

Suggested sequence:

1. `refactor: centralize public design tokens`
2. `feat: add reusable marketing layout primitives`
3. `feat: migrate public navigation and routes`
4. `refactor: add project classification selectors`
5. `feat: rebuild homepage for ai engineering positioning`
6. `feat: add ai engineering services page`
7. `feat: replace projects with curated work experience`
8. `feat: add engineering systems page`
9. `feat: add products gallery`
10. `refactor: align about booking and footer content`
11. `feat: add page metadata and accessibility hardening`
12. `test: cover ai engineering studio redesign`

Commit grouping may be adjusted to actual diff size, but avoid one monolithic redesign commit.

---

## 22. Scope Guardrails

### In scope

- public site redesign
- new approved routes
- navigation migration
- design tokens
- reusable layout primitives
- homepage positioning
- Services page
- Work page
- Engineering Systems page
- Products page
- About refinement
- Book a Call refinement
- project classification/reuse
- accessibility
- SEO metadata
- performance improvements tied directly to redesign
- tests for redesigned public flows

### Out of scope unless separately approved

- authentication redesign
- admin-dashboard redesign
- new CMS
- new AI chatbot
- new lead-scoring system
- pricing/product packaging changes
- backend rewrite
- replacing project API with static JSON without evidence
- infrastructure/deployment changes
- production deployment
- merge to main
- unrelated dependency upgrades
- broad historical project rewrites

---

## 23. Risks and Mitigations

### Risk: current project schema cannot distinguish Work, Products, and Engineering Systems

Mitigation: extend the existing model minimally and add selector-layer fallbacks rather than creating separate duplicate stores.

### Risk: redesign breaks existing admin/shared Header behavior

Mitigation: explicitly test admin routes after navigation/layout changes and isolate public presentation from admin-specific controls.

### Risk: image-led layout creates performance regressions

Mitigation: responsive image sizing, lazy loading, aspect-ratio reservation, and critical-media prioritization.

### Risk: old project URLs break inbound links

Mitigation: intentional redirects for `/projects` and `/templates`.

### Risk: case-study copy overstates project maturity

Mitigation: derive status from verified project state and preserve explicit labels such as prototype, internal, in development, or specification-only.

### Risk: duplicate style systems emerge from Tailwind, Sass, and CSS variables

Mitigation: keep semantic design tokens authoritative; use Tailwind/Sass only as implementation mechanisms consuming those tokens where practical.

### Risk: homepage becomes too long/text-heavy

Mitigation: maintain image-led sections, strict copy density, and reusable visual rhythm.

---

## 24. Definition of Done

The redesign implementation is complete only when all of the following are true:

- DevKofi consistently presents as a founder-led AI Engineering Studio.
- Hero communicates `I engineer AI systems that do real work.`
- Public navigation matches Home, Services, Work, Engineering Systems, Products, About, Book a Call.
- `/projects` and `/templates` have intentional legacy behavior.
- AI Systems Engineering is visibly the flagship service.
- Homepage follows the approved visual narrative.
- Desktop sections alternate media/text where intended.
- Mobile sections consistently render media before text.
- Mobile navigation drawer opens from the left and passes keyboard/focus requirements.
- Existing DevKofi green/lime identity is preserved through centralized tokens.
- Work is curated engineering proof rather than an undifferentiated project dump.
- Engineering Systems explains repeatable methods/infrastructure.
- Products presents image-led shipped applications.
- Existing project data is reused rather than duplicated unnecessarily.
- Claims accurately reflect project maturity.
- Existing admin functionality remains intact.
- Primary public routes have route-specific SEO metadata.
- Accessibility requirements pass manual and automated checks available in the project.
- Tests pass.
- Lint passes.
- Production client build passes.
- No unverified test/build claims are made.
- No merge or deployment occurs without separate approval.

---

## 25. Recommended First Execution Package

The first bounded implementation package should establish the foundation only:

1. Revalidate branch/repository state.
2. Centralize design tokens.
3. Add shared `SplitSection` / page layout primitives.
4. Update public navigation constants.
5. Implement new route skeletons and legacy redirects.
6. Upgrade Header/SideNav to the approved desktop/mobile navigation behavior.
7. Add focused tests for navigation, route compatibility, and responsive layout primitives.
8. Run client tests, lint, and production build.

Do **not** implement all page content in the first package.

This creates a verified platform for the homepage and subsequent page slices while reducing redesign risk.

---

## 26. Approval Boundary

This plan is a durable execution roadmap only.

Starting implementation is a separate state-changing workflow and should use its own approved execution contract identifying:

- exact branch;
- exact first package;
- affected files;
- verification commands;
- commit expectations;
- whether push or draft PR creation is included.

Merge and deployment remain separate approval gates.
