# DevKofi AI Engineering Studio — Detailed Implementation Specification

**Status:** Approved implementation specification  
**Product:** DevKofi Website  
**Repository:** `kofiarhin/devkofi`  
**Branch:** `docs/ai-engineering-studio-prd`  
**Governing PRD:** `docs/AI_ENGINEERING_STUDIO_PRD.md`  
**Implementation state:** Specification only; no redesign implementation is authorized by this document alone.

---

## 1. Purpose

This specification translates the approved DevKofi AI Engineering Studio PRD into a repository-aware implementation contract.

The redesign must reposition DevKofi from a general developer/personal portfolio into a founder-led AI Engineering Studio while preserving useful parts of the existing application architecture, data flow, brand identity, assets, administrative functionality and deployment assumptions.

The target experience should communicate one clear commercial identity:

> **I engineer AI systems that do real work.**

The implementation must make DevKofi feel like the commercial front door, portfolio and engineering practice of an AI systems engineer rather than a broad collection of unrelated development projects.

This specification distinguishes:

- **current repository evidence** — what exists now;
- **required implementation** — what the redesign must change;
- **proposed structure** — the preferred implementation shape where the PRD does not mandate a specific file path or component name.

No feature should be treated as implemented until repository changes are made and verified.

---

## 2. Current Repository Baseline

The current frontend is a React/Vite application using React Router, Redux Toolkit, TanStack Query, Sass, Tailwind CSS, Framer Motion, Vitest and existing icon libraries.

Current relevant public routes include:

- `/`
- `/about`
- `/projects`
- `/templates`
- `/contact`
- `/book-a-call`
- `/newsletter/verify`

The application also contains separate admin routes that must remain functional and outside the public-site redesign scope except where shared navigation/layout changes require compatibility work.

The current public layout renders:

1. `Header`
2. conditional `SideNav`
3. route content through `Outlet`
4. `Footer`

The current homepage is lightweight and consists of:

- `Landing`
- `AIWorkflowSection`
- `Pricing`

The current project experience is data-driven through `useProjects`, which fetches `/api/projects` through TanStack Query. The Projects page already supports richer project interaction, including project thumbnails, descriptions, status, technologies, live-demo links, repository links, filtering, search, grid/list states and an accessible detail drawer.

The current global stylesheet already defines DevKofi brand variables, including the green/lime identity, dark surfaces, text colours, borders, radii and layout widths. The redesign should consolidate and expand this existing token approach rather than introducing a second competing theme mechanism.

Existing profile and supporting imagery are already referenced from `client/src/constants/constants.js`, including `profileImage`, `profileSmall`, `aboutMeImage`, `workStation`, `personCoding` and other existing DevKofi assets.

---

## 3. Architectural Principles

### 3.1 Preserve the existing application unless replacement is justified

This is a redesign and repositioning, not a greenfield rewrite.

Prefer:

- extending existing routes;
- reusing the existing project API/query layer;
- reusing existing images;
- evolving existing navigation state;
- evolving existing SCSS/CSS variables;
- reusing tested interaction patterns;
- keeping admin routes isolated and working.

Do not replace React Router, Redux Toolkit, TanStack Query, Sass, Tailwind, Framer Motion or the project API simply to modernize the codebase unless implementation evidence shows a concrete reason.

### 3.2 Content must be data-driven where content is repeated

Shared project metadata, service definitions, navigation labels, page metadata and repeated system/product cards should not be duplicated across pages.

### 3.3 Visual proof takes priority over decorative imagery

Real project screenshots, project thumbnails, profile images, system diagrams and workflow illustrations should be used before stock or abstract AI art.

### 3.4 Mobile is an intentionally designed experience

The desktop layout may alternate text/image placement, but mobile must preserve a predictable reading order with visual proof first.

### 3.5 Accessibility is a functional requirement

Navigation, drawers, dialogs, images, keyboard flows and motion must be implemented accessibly and tested.

### 3.6 Product claims must remain evidence-based

A project may be labelled shipped, live, prototype, internal, experimental or specification-only based on actual project state. The site must not upgrade an unfinished or documentation-only project into a production claim.

---

## 4. Target Public Information Architecture

The primary navigation must become:

1. **Home** — `/`
2. **Services** — `/services`
3. **Work** — `/work`
4. **Engineering Systems** — `/engineering-systems`
5. **Products** — `/products`
6. **About** — `/about`
7. **Book a Call** — `/book-a-call`

### 4.1 Route migration

Required public route changes:

| Current | Target | Required behaviour |
|---|---|---|
| `/projects` | `/work` | New Work page becomes the curated proof/case-study destination. |
| `/templates` | `/engineering-systems` | Existing Templates concept is retired from primary positioning. |
| none | `/services` | Add Services page. |
| none | `/products` | Add Products page. |
| `/contact` | optional compatibility route | Contact may remain reachable but must not compete with Book a Call in primary navigation. |

### 4.2 Legacy route behaviour

Preferred approach:

- `/projects` redirects to `/work`.
- `/templates` redirects to `/engineering-systems`.
- `/contact` may remain as a secondary route if the existing contact workflow has value, but primary navigation should remove it in favour of Book a Call.

Do not break existing externally shared URLs without providing intentional compatibility behaviour.

### 4.3 Admin routes

Existing admin routes are not part of the public redesign and must remain reachable under their current URLs.

Public navigation redesign must not expose admin controls unless an authenticated admin state already requires them.

---

## 5. Proposed Frontend Structure

The following structure is the preferred target. Exact naming may vary if existing conventions make another structure cleaner, but responsibility boundaries should remain equivalent.

```text
client/src/
├── Pages/
│   ├── Home/
│   ├── Services/
│   ├── Work/
│   ├── EngineeringSystems/
│   ├── Products/
│   ├── About/
│   ├── BookCall/
│   └── ...existing admin/support pages
├── components/
│   ├── Header/
│   ├── SideNav/
│   ├── Footer/
│   ├── layout/
│   │   ├── PageHero/
│   │   ├── SplitSection/
│   │   ├── SectionHeader/
│   │   ├── ContentContainer/
│   │   └── FinalCta/
│   ├── projects/
│   │   ├── ProjectCard/
│   │   ├── FeaturedProject/
│   │   ├── ProjectActions/
│   │   └── ProjectStatus/
│   ├── services/
│   │   └── ServiceSection/
│   └── systems/
│       └── SystemCard/
├── constants/
│   ├── navigation.js
│   ├── constants.js
│   ├── services.js
│   ├── siteContent.js
│   └── seo.js
├── hooks/
│   └── useProjects.js
├── lib/
│   ├── projectSelectors.js
│   └── seo.js
├── styles/
│   ├── tokens.scss
│   ├── mixins.scss
│   └── utilities.scss
└── main.styles.scss
```

This is a structural target, not a mandate to move files unnecessarily. Existing conventions should be preserved where they already work.

---

## 6. Centralized Design Token System

### 6.1 Goal

All public-facing components must consume a centralized semantic design system. Brand colours should not be repeatedly hardcoded inside component styles.

The current CSS variables in `main.styles.scss` provide the starting point and must be normalized into a clearer semantic token system.

### 6.2 Preserve the current DevKofi brand palette

Existing brand direction includes:

- green primary
- bright lime accent
- very dark neutral backgrounds
- off-white primary text
- muted zinc/gray text
- dark borders/surfaces

The redesign should keep that identity.

Do not introduce generic purple/blue AI gradients as the new visual identity.

### 6.3 Proposed semantic tokens

At minimum define:

```css
:root {
  --color-brand-primary: ...;
  --color-brand-accent: ...;

  --color-bg-primary: ...;
  --color-bg-secondary: ...;
  --color-bg-elevated: ...;

  --color-text-primary: ...;
  --color-text-secondary: ...;
  --color-text-inverse: ...;

  --color-border-subtle: ...;
  --color-border-strong: ...;

  --color-success: ...;
  --color-warning: ...;
  --color-error: ...;

  --space-1: ...;
  --space-2: ...;
  --space-3: ...;
  --space-4: ...;
  --space-5: ...;
  --space-6: ...;

  --radius-sm: ...;
  --radius-md: ...;
  --radius-lg: ...;
  --radius-xl: ...;

  --shadow-soft: ...;
  --shadow-brand: ...;

  --content-max: ...;
  --content-wide: ...;
  --gutter: ...;

  --motion-fast: ...;
  --motion-medium: ...;
  --ease-standard: ...;
}
```

### 6.4 Token rules

Components should use semantic names such as:

- `var(--color-bg-primary)`
- `var(--color-text-secondary)`
- `var(--color-brand-accent)`

Avoid new component-local values such as `#94ff2b` unless defining or documenting the token itself.

Existing duplicate Sass variables such as `$lime`, `$bg-dark`, `$card-bg` and `$border-green` should be progressively reconciled with the semantic token layer rather than allowed to diverge.

### 6.5 Typography

The existing Outfit font may remain unless a deliberate typography redesign is approved later.

Define consistent scales for:

- display/hero
- H1
- H2
- H3
- body large
- body
- body small
- eyebrow/kicker
- button/label

Use fluid sizing with `clamp()` where practical.

---

## 7. Responsive Layout System

### 7.1 Desktop content width

Reuse the current container pattern and max-width variables unless audit evidence during implementation requires adjustment.

The site should feel spacious rather than densely packed.

### 7.2 Breakpoint intent

Exact values may follow current styles, but behaviour must include at least:

- mobile
- tablet
- desktop
- wide desktop

Suggested behavioural thresholds:

- mobile: below ~768px
- tablet: ~768–1023px
- desktop: ~1024px+

Do not couple component logic to arbitrary JavaScript viewport checks when CSS can handle layout changes.

### 7.3 Split section primitive

Create or standardize a reusable `SplitSection` pattern for the core visual rhythm.

Desktop variants:

- `text-left`: text left / media right
- `media-left`: media left / text right

Mobile behaviour for both variants:

1. media
2. text

The implementation must not rely only on CSS visual `order` if doing so creates an illogical DOM/screen-reader order. Prefer a markup API that produces correct semantic order across responsive states.

### 7.4 Split section proportions

The two columns do not need to be 50/50.

Preferred desktop feel:

- visual: approximately 52–60%
- copy: approximately 40–48%

The visual is the anchor; text explains it.

### 7.5 Section density

Avoid stacking large bodies of copy.

Typical content block limits:

- eyebrow: one short phrase
- heading: 1–2 lines
- supporting copy: usually 1–2 short paragraphs
- bullets: only where scanning adds value
- CTA: 1 primary action, optional secondary action

---

## 8. Header and Navigation Specification

### 8.1 Desktop header

Desktop header should include:

- DevKofi wordmark/logo at left
- primary navigation
- distinct Book a Call CTA

The existing wordmark structure `Dev` + highlighted `Kofi` can be retained and restyled through tokens.

### 8.2 Mobile header

Mobile header must use:

- hamburger/menu control on the **left**
- DevKofi wordmark visually centered
- minimal or no right-side action unless required for visual balance/accessibility

The current header already has a Redux-controlled menu action. Reuse the existing navigation state if it remains sufficient.

### 8.3 Mobile navigation drawer

The drawer must slide from the **left**.

Required items:

- Home
- Services
- Work
- Engineering Systems
- Products
- About
- Book a Call

Required interaction behaviour:

- menu button exposes `aria-expanded`
- menu button references the drawer with `aria-controls`
- drawer has an accessible label
- visible close button
- Escape closes drawer
- clicking backdrop closes drawer
- route selection closes drawer
- body scrolling is locked while open
- keyboard focus moves into drawer when opened
- focus is trapped while drawer is open
- focus returns to the menu trigger when closed
- active route is visually and programmatically distinguishable
- touch targets should be at least approximately 44×44 CSS pixels

### 8.4 Shared navigation source

`client/src/constants/navigation.js` remains the source of truth for labels and URLs.

Update it to represent the new information architecture rather than hardcoding page links separately inside Header, SideNav and Footer.

---

## 9. Homepage Detailed Specification

The homepage is the primary commercial narrative.

Required section order:

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

This order may be refined during implementation only if the PRD intent is preserved and the change is explicitly reviewed.

### 9.1 Hero

#### Desktop

Two columns:

**Left**

- optional eyebrow: `AI Engineering Studio`
- H1: `I engineer AI systems that do real work.`
- concise supporting proposition
- primary CTA: `Book a Call`
- secondary CTA: `Explore My Work`

**Right**

- existing DevKofi profile image
- no stock AI imagery
- image treatment may include a subtle brand frame, border, crop or glow

#### Mobile

Required order:

1. profile image
2. eyebrow
3. H1
4. supporting copy
5. CTAs

The image should establish the founder-led identity immediately.

#### Hero constraints

- avoid background video as the dominant hero experience unless it clearly supports performance and the approved visual direction;
- headline should remain visible without waiting for animation;
- CTA must remain reachable without complex interaction;
- profile image must include useful alt text unless treated as decorative.

### 9.2 Problem section

Purpose: explain the prototype-to-production gap.

Core narrative:

- AI prototypes are easy to produce;
- dependable AI software requires engineering around the model;
- DevKofi handles that surrounding system.

Recommended visual:

- architecture/system screenshot
- agent workflow diagram
- real product interface

Do not use a generic “robot brain” illustration.

### 9.3 AI Systems Engineering section

This is the flagship service section and should have stronger visual prominence than all supporting services.

Content should cover:

- what the service is;
- the type of problems it solves;
- representative capabilities without becoming a technology dump;
- CTA to Services.

The copy should emphasize systems, integration, production reliability and outcomes.

### 9.4 Supporting Services section

Represent the remaining services concisely:

- AI Product Engineering
- Agentic Workflow Engineering
- AI Integration
- AI Context & Knowledge Systems
- AI Engineering Partner

Preferred presentation:

- compact cards or grouped rows;
- each service gets title + one short explanation;
- no long nested content.

### 9.5 Selected Work

Show approximately three strongest proof projects.

Initial candidates from the approved PRD:

- Hibachi
- Brain
- Context API

The implementation must not blindly assume these projects already exist in the DevKofi project API dataset. During implementation, confirm and add/project-map them through the actual data source where needed.

Each selected item should show:

- visual
- project name
- category
- one-line outcome/description
- status if useful
- `View case study` or equivalent

Optional direct links:

- live demo
- repository

Do not overload the homepage with the full existing Projects filtering interface.

### 9.6 Engineering Systems Preview

Purpose: demonstrate that DevKofi has repeatable engineering methods and infrastructure.

Initial candidate systems:

- Codex Workflow Kit
- Agent System
- Context infrastructure

Each item should answer in one line:

> What engineering problem does this system solve?

CTA:

`Explore Engineering Systems`

### 9.7 Products Preview

Purpose: retain broader project proof without confusing all projects with AI case studies.

Narrative:

> Products I’ve shipped using my AI engineering workflows.

Display should be visual and compact.

Prefer 3–6 products maximum on homepage, sourced from project data.

CTA:

`Explore Products`

### 9.8 Engineering Process

Required sequence:

1. Discover
2. Design
3. Engineer
4. Verify
5. Deploy
6. Improve

This can be represented as a horizontal process on desktop and a vertical sequence on mobile.

Each step should use no more than a short sentence.

### 9.9 Point of View

Core idea:

> **AI isn’t the whole system.**

Support with concise language around:

- context
- data
- tools
- interfaces
- permissions
- evaluation
- verification
- human control

This section should build conviction, not become an essay.

### 9.10 Final CTA

High-contrast conversion block.

Recommended structure:

- heading: `Have an AI system you want to build?`
- one short support line
- primary CTA: `Book a Call`

No newsletter or competing conversion should visually overpower this CTA on the homepage.

---

## 10. Services Page Specification

Route: `/services`

### 10.1 Objective

Answer:

> What can I hire Kofi to do?

### 10.2 Page structure

1. compact page hero
2. AI Systems Engineering flagship section
3. AI Product Engineering
4. Agentic Workflow Engineering
5. AI Integration
6. AI Context & Knowledge Systems
7. AI Engineering Partner
8. final CTA

### 10.3 Service section content contract

Each service should contain:

- service name
- one-sentence proposition
- problem addressed
- what is built
- representative use cases
- relevant visual
- CTA

Keep service capability lists short and outcome-oriented.

### 10.4 Layout

Use alternating `SplitSection` layouts on desktop.

Mobile always uses media first, copy second.

### 10.5 Service data

Prefer a `services.js` configuration/source file so homepage previews and the Services page use the same service names and descriptions.

Do not duplicate service copy in multiple JSX files.

---

## 11. Work Page Specification

Route: `/work`

### 11.1 Objective

Show curated engineering proof.

This is not simply the old Projects page under a new label.

### 11.2 Relationship to existing Projects implementation

The existing Projects page already contains reusable pieces:

- project query/data loading
- loading and error states
- status normalization
- technology tags
- project action links
- detail drawer
- project filtering utilities

The new Work experience should reuse appropriate logic but simplify presentation around curated case studies.

### 11.3 Work selection rule

A project belongs in Work when it demonstrates an important engineering capability or client-relevant outcome.

Work should prioritize:

- AI systems
- agentic workflows
- context/retrieval systems
- production-oriented AI applications
- developer/engineering infrastructure relevant to the positioning

Work should not automatically include every historical project.

### 11.4 Work card contract

Required:

- name
- visual
- category
- concise description
- project status
- case-study link or detail interaction

Optional:

- repo link
- demo link
- technologies

### 11.5 Case study structure

For dedicated case-study views or a detail drawer/page, structure content as:

1. Problem
2. Context
3. System
4. Engineering Approach
5. Architecture
6. Important Decisions
7. Challenges / Failure Modes
8. Verification
9. Outcome
10. Screenshots / Evidence
11. Demo / Repository links where appropriate

### 11.6 Evidence labels

Support explicit statuses such as:

- Live
- Production
- Internal
- Prototype
- Experimental
- In Development
- Specification
- Archived

Do not imply production status from a repository existing alone.

---

## 12. Engineering Systems Page Specification

Route: `/engineering-systems`

### 12.1 Objective

Explain how DevKofi engineers reliable systems.

This page replaces the old public “Templates” framing.

### 12.2 Candidate content

Initial systems may include:

- Codex Workflow Kit
- Agent System
- Context infrastructure
- specification workflows
- testing/evaluation systems
- approval and verification patterns
- project memory/context systems
- reusable engineering tooling

### 12.3 System entry content contract

Each entry should answer:

- What is it?
- Why was it built?
- What engineering problem does it solve?
- How does it work at a high level?
- Where has it been applied?
- What evidence is available?

### 12.4 Presentation

Prefer diagram + concise explanation over dense documentation.

The page should communicate engineering maturity to technical buyers without becoming internal tooling documentation.

---

## 13. Products Page Specification

Route: `/products`

### 13.1 Objective

Show the broader set of products/applications Kofi has built.

Products can be AI or non-AI.

### 13.2 Relationship to Work

**Work** is curated proof of expertise.

**Products** is the broader visual catalogue of shipped/built applications.

A project may appear in both where appropriate, but presentation purpose differs.

### 13.3 Presentation

Image-led gallery/grid.

Each product should typically show:

- thumbnail
- name
- one-line description
- status
- live demo when available
- repository when available

Avoid large technical explanations in the catalogue itself.

### 13.4 Filtering

Optional filters may be retained if genuinely useful, but the page should not become an overly complex project database.

Likely useful filters:

- AI
- Web/Product
- Internal Tool
- Live
- In Development

Do not expose internal-only metadata accidentally.

---

## 14. About Page Specification

Route: `/about`

### 14.1 Objective

Explain who Kofi is, the transition into AI engineering and the engineering philosophy behind DevKofi.

### 14.2 Page structure

1. profile-led introduction
2. software engineering background
3. transition into AI engineering
4. what I build now
5. engineering philosophy
6. selected visual proof / working imagery
7. final CTA

### 14.3 Content limits

Do not turn the About page into a complete CV.

Use concise narrative supported by images.

Existing `profileImage`, `profileSmall`, `aboutMeImage`, `workStation` or `personCoding` assets may be reused if visually suitable.

---

## 15. Book a Call Specification

Route: `/book-a-call`

### 15.1 Objective

Provide the primary commercial conversion path.

### 15.2 Requirements

Keep the page focused.

Potential content:

- clear heading
- short qualification copy
- booking interface
- optional compact enquiry form

If a form remains/gets used, fields should be limited to information necessary before an initial conversation, for example:

- name
- email
- company
- what are you trying to build?
- current stage

Avoid long discovery questionnaires.

### 15.3 Contact route

If `/contact` remains, it should not compete with `/book-a-call` as the primary site conversion.

---

## 16. Project Data Model Specification

### 16.1 Current data source

The frontend currently fetches projects through `/api/projects` using `useProjects` and TanStack Query.

Therefore, the redesign should treat the backend project source/API as the canonical runtime source unless a separate migration is explicitly approved.

The PRD’s reference to an existing project JSON/data source should be reconciled with the current API implementation during development. Do not silently introduce a second static project catalogue if the API already serves the intended source.

### 16.2 Required data capabilities

The project record should be able to support, either directly or through derived selectors:

```text
id / _id
name
title
slug
shortDescription
description
thumbnailUrl
technologies
features
status
demoUrl
repoUrl
featured
category
type
engineeringSummary
caseStudy
aiEngineering
product
engineeringSystem
displayOrder
visibility
```

### 16.3 Case study structure

Preferred normalized shape:

```js
caseStudy: {
  problem: string,
  context: string,
  system: string,
  approach: string,
  architecture: string,
  decisions: string[],
  challenges: string[],
  verification: string[],
  outcome: string,
}
```

Existing fields and helper logic may be preserved if equivalent information is already represented differently.

### 16.4 Classification flags

The frontend needs deterministic selectors for:

- homepage featured work
- Work
- Products
- Engineering Systems

Prefer explicit classification fields over fragile keyword matching.

Example:

```js
featured: true
aiEngineering: true
product: true
engineeringSystem: false
displayOrder: 10
```

### 16.5 Visibility

Support intentional public visibility so internal or incomplete projects are not exposed merely because they exist in the database.

Recommended field:

```js
visibility: "public" | "private" | "unlisted"
```

If the current backend schema cannot support this without broader migration, define the smallest compatible equivalent and document it.

### 16.6 Selectors

Create pure selectors/utilities rather than scattering filtering rules through page JSX.

Examples:

- `getFeaturedWork(projects)`
- `getWorkProjects(projects)`
- `getProducts(projects)`
- `getEngineeringSystems(projects)`
- `sortByDisplayOrder(projects)`

These utilities should be unit tested.

---

## 17. Content Configuration

Static repeated marketing content should be centralized.

Suggested sources:

### `services.js`

Stores service names, short descriptions, use cases and routes.

### `siteContent.js`

Stores stable homepage/process/POV content where this improves maintainability.

### `navigation.js`

Stores all public navigation.

### `seo.js`

Stores page titles/descriptions and social metadata defaults.

Do not create a mini CMS unless content volume justifies it.

---

## 18. Image and Media Specification

### 18.1 Priority order

1. actual product screenshots
2. current project thumbnails
3. Kofi profile photography
4. architecture diagrams
5. workflow diagrams
6. purpose-built supporting graphics

### 18.2 Existing assets

The current constants file already references Cloudinary-hosted imagery and video. Reuse appropriate existing assets before sourcing replacements.

### 18.3 Image behaviour

Requirements:

- responsive width/height
- preserve aspect ratio
- avoid layout shift by supplying dimensions/aspect-ratio where possible
- lazy-load below-the-fold imagery
- eagerly load/priority-load the hero profile image if it materially affects LCP
- useful alt text for meaningful images
- empty alt for decorative imagery
- use Cloudinary transformations where practical for responsive delivery

### 18.4 Hero profile treatment

The hero profile image should feel deliberate and premium rather than a basic circular avatar.

Acceptable treatments include:

- cropped portrait in a large rounded frame
- edge-to-edge rectangular portrait
- subtle brand accent border/glow
- background shape using existing brand green

Avoid excessive effects.

---

## 19. Motion Specification

Framer Motion already exists and may be used, but animation is secondary to clarity and performance.

### 19.1 Allowed patterns

- subtle fade/translate on section entrance
- drawer slide animation
- small hover/press feedback
- image reveal
- process progression accents

### 19.2 Avoid

- long loading animations
- staggered text that delays comprehension
- constant floating/bobbing effects
- parallax that harms reading
- large animation bundles for decorative effects

### 19.3 Reduced motion

All meaningful motion must respect `prefers-reduced-motion`.

The interface must remain fully usable with animation disabled.

---

## 20. SEO Specification

### 20.1 Page intent

| Route | Primary intent |
|---|---|
| `/` | AI Engineer / AI Engineering Studio |
| `/services` | AI Engineering Services |
| `/work` | AI Engineering Work / Case Studies |
| `/engineering-systems` | AI Engineering Systems / Workflows |
| `/products` | Products built by DevKofi |
| `/about` | Kofi / DevKofi AI Engineer |
| `/book-a-call` | Hire / Work with DevKofi |

### 20.2 Metadata

Each public page should define:

- unique `<title>`
- meta description
- canonical URL
- Open Graph title
- Open Graph description
- Open Graph image when appropriate
- Twitter/social card metadata if currently supported

### 20.3 Structured data

Consider lightweight JSON-LD only when accurate, such as:

- `Person`
- `ProfessionalService`
- `WebSite`

Do not fabricate reviews, organization size or client metrics.

### 20.4 Semantic content

Use one clear H1 per page.

Maintain logical H2/H3 hierarchy.

Avoid using heading tags purely for visual styling.

---

## 21. Accessibility Specification

Target WCAG 2.2 AA where practical.

Required:

- semantic landmarks (`header`, `nav`, `main`, `footer`)
- skip-to-content link
- visible focus state
- keyboard-operable navigation
- drawer focus management
- dialog/drawer Escape handling
- sufficient text/background contrast
- non-colour active-state indicators
- meaningful alt text
- form labels and errors associated programmatically
- icon-only buttons with accessible names
- minimum practical touch targets
- reduced-motion support
- logical reading order

Existing accessible patterns in the Projects drawer should be reused or improved rather than regressed.

---

## 22. Performance Specification

### 22.1 Primary goals

The redesign should remain visually rich without becoming media-heavy or animation-heavy.

### 22.2 Requirements

- lazy-load non-critical page sections/components where useful
- lazy-load below-the-fold images
- optimize Cloudinary image sizing
- avoid oversized background videos
- avoid loading all project images at full resolution
- preserve Vite chunking/tree-shaking
- remove unused legacy page code only after route migration is stable
- avoid layout shift from missing media dimensions

### 22.3 Core Web Vitals guidance

Implementation should target good field/lab performance for:

- LCP
- CLS
- INP

No specific numerical guarantee should be claimed until measured.

---

## 23. State Management Boundaries

### 23.1 Redux Toolkit

Continue using Redux only for genuine global client state such as:

- navigation drawer state
- authenticated admin/session state where already implemented

Do not move server project data into Redux.

### 23.2 TanStack Query

Continue using TanStack Query for project/server state.

Work, Products and homepage project previews should share the same cached query where possible.

### 23.3 Local state

Use component-local state for:

- presentation-only tabs/filters
- modal/drawer selection where not globally shared
- transient UI interactions

---

## 24. Error, Loading and Empty States

Every project-backed page must handle:

- loading
- fetch error
- empty data
- partial/missing optional fields

### 24.1 Homepage

If project data fails, the homepage must still render positioning, services, process and CTA. Selected Work/Products may show a concise fallback rather than breaking the page.

### 24.2 Work / Products

Provide:

- accessible loading skeleton or state
- clear retry action on fetch failure
- meaningful empty message

Reuse current Projects loading/error patterns where appropriate.

---

## 25. Footer Specification

Footer should reinforce rather than duplicate the entire navigation experience.

Recommended contents:

- DevKofi wordmark
- short one-line positioning
- selected navigation
- Book a Call
- GitHub/LinkedIn or existing relevant social links
- copyright

Avoid a dense multi-column enterprise footer unless content volume justifies it.

---

## 26. Existing Feature Compatibility

The redesign must not accidentally break:

- admin login
- admin dashboard
- admin message routes
- newsletter verification
- project API calls
- existing contact/booking backend behaviour
- existing authentication/session hooks

Where shared Header/Footer changes affect admin layouts, either:

- retain compatible branching in shared components; or
- introduce separate `PublicHeader`/`AdminHeader` only if this reduces complexity.

Do not force public marketing navigation into admin screens if it degrades admin usability.

---

## 27. Testing Specification

The project already includes Vitest and Testing Library dependencies.

### 27.1 Unit tests

Add/update tests for pure project selectors:

- Work classification
- Product classification
- Engineering System classification
- featured ordering
- visibility filtering
- status handling

### 27.2 Component tests

At minimum cover:

#### Header / mobile nav

- renders target nav items
- menu opens/closes
- Escape closes
- selecting a route closes
- accessibility attributes update correctly

#### SplitSection

- media/text content renders correctly
- variant class/behaviour is applied

#### Project cards

- thumbnail and text render
- missing optional links do not render broken controls
- live/repo links have correct external-link attributes

#### Work / Products

- loading state
- error state + retry
- empty state
- expected filtered items

### 27.3 Route tests

Verify:

- `/services`
- `/work`
- `/engineering-systems`
- `/products`
- `/about`
- `/book-a-call`

Legacy routes should redirect as specified.

Admin routes must remain unaffected.

### 27.4 Accessibility checks

Automated accessibility testing may be added if already compatible with the test setup. Regardless, keyboard behaviour and semantic attributes must be asserted manually or through Testing Library where practical.

---

## 28. Verification Commands

Use repository-defined scripts as source of truth during implementation.

At minimum, based on the current client scripts:

```bash
npm test
npm run lint
npm run build
```

If commands must be run from `client/`, use the repository’s actual root/client script arrangement rather than inventing a new workflow.

Verification claims must identify which commands actually ran and their exact result.

A successful build alone is not equivalent to functional verification.

---

## 29. Implementation Phases

### Phase 1 — Foundation

- preserve approved PRD/spec
- audit exact existing route/component dependencies
- normalize design tokens
- update navigation data
- implement route skeletons and legacy redirects
- establish reusable layout primitives

**Exit criteria:** new route structure renders with no regression to admin/support routes.

### Phase 2 — Header, Drawer and Shared Layout

- desktop navigation
- mobile left drawer
- focus management
- footer update
- responsive container/layout rules

**Exit criteria:** shared navigation passes responsive and keyboard checks.

### Phase 3 — Homepage

- hero with profile image
- problem
- flagship service
- supporting services
- selected Work
- Engineering Systems preview
- Products preview
- process
- POV
- final CTA

**Exit criteria:** homepage communicates positioning and routes correctly to deeper pages.

### Phase 4 — Services and About

- Services page
- About page
- shared split section refinements

**Exit criteria:** service hierarchy and founder narrative match PRD.

### Phase 5 — Project Classification and Work

- reconcile project backend fields
- add/derive explicit classification
- selectors
- Work page
- evidence/status handling
- case-study interaction

**Exit criteria:** Work is curated and does not expose unrelated projects by default.

### Phase 6 — Engineering Systems and Products

- Engineering Systems page
- Products page
- data-driven previews and cards
- legacy Templates/Projects compatibility

**Exit criteria:** clear distinction exists between Work, Engineering Systems and Products.

### Phase 7 — Polish and Verification

- responsive QA
- accessibility QA
- image optimization
- metadata/SEO
- motion/reduced motion
- tests
- lint
- production build

**Exit criteria:** all acceptance criteria verified against the exact implementation revision.

---

## 30. Migration Rules

### 30.1 Do not delete useful legacy code prematurely

Route migration should be incremental.

Old Projects/Templates implementations can be refactored or removed after equivalent functionality exists and tests confirm no required behaviour is lost.

### 30.2 Data migration must remain backwards compatible where possible

If project records need new flags, avoid breaking existing API consumers/admin tooling.

Prefer optional fields with safe defaults until all records are migrated.

### 30.3 Avoid scope creep

The redesign does not authorize:

- rewriting the backend architecture
- replacing MongoDB/data storage
- adding a CMS
- adding authentication changes
- changing deployment providers
- introducing new analytics vendors
- rebuilding the admin dashboard
- adding AI chat to the marketing site

Any such change requires separate scope approval.

---

## 31. Content and Claims Rules

### 31.1 First-person voice

Public copy should use:

- `I`
- `my`
- `DevKofi`

Avoid pretending DevKofi is a multi-person agency unless that becomes factually true later.

### 31.2 Avoid unsupported claims

Do not publish:

- invented ROI percentages
- invented client counts
- invented performance gains
- fabricated testimonials
- “production” claims without evidence
- “enterprise-grade” as empty marketing language

### 31.3 Preferred vocabulary

Use naturally where accurate:

- AI systems engineering
- AI agents
- agentic workflows
- AI-native products
- context engineering
- integration
- verification
- evaluation
- human approval
- reliability
- production-oriented

Avoid repetitive buzzword stuffing.

---

## 32. Page-Level Acceptance Criteria

### Home

- hero uses existing/profile photography rather than generic AI hero art
- desktop two-column hero
- mobile image-first hero
- correct section sequence
- AI Systems Engineering is visually primary
- selected Work is curated
- Engineering Systems and Products are distinct concepts
- Book a Call remains primary conversion

### Services

- all approved service categories represented
- flagship service receives strongest prominence
- sections alternate on desktop
- mobile uses image-first stack
- repeated service data is centralized

### Work

- route is `/work`
- only curated proof is shown by default
- project status/evidence is explicit
- project links are data-driven
- loading/error/empty states work

### Engineering Systems

- route is `/engineering-systems`
- replaces Templates in primary navigation
- systems explain engineering method rather than generic downloadable templates

### Products

- route is `/products`
- image-led catalogue
- consumes existing project source
- supports live/repository links where available

### About

- concise founder story
- transition to AI engineering explained
- not a long CV dump
- real imagery used

### Book a Call

- remains primary conversion destination
- booking/contact flow remains functional

---

## 33. Global Acceptance Criteria

The implementation is acceptable when all of the following are true:

1. DevKofi is consistently positioned as a founder-led AI Engineering Studio.
2. Public copy consistently uses first-person language.
3. Target routes exist and primary navigation matches the approved sitemap.
4. Legacy `/projects` and `/templates` URLs have intentional compatibility behaviour.
5. Desktop content uses the alternating split-layout system where specified.
6. Mobile content uses media-first ordering for split sections.
7. Mobile navigation opens from the left and meets the interaction/accessibility requirements.
8. Existing DevKofi brand colours remain recognizable and are centralized through semantic tokens.
9. Project/server state remains in TanStack Query rather than being duplicated into Redux.
10. Repeated project classification logic is centralized and tested.
11. Work, Engineering Systems and Products are visibly and conceptually distinct.
12. Real project/profile visuals provide the majority of visual proof.
13. No unsupported production/outcome claims are introduced.
14. Existing admin and support routes continue to function.
15. Responsive layouts work across mobile, tablet and desktop.
16. Keyboard navigation and drawer interaction work correctly.
17. Reduced-motion preferences are respected.
18. Project-backed sections have loading, error and empty states.
19. SEO metadata is unique for the main public pages.
20. Test, lint and production-build commands pass on the exact candidate revision before it is considered verified.

---

## 34. Explicit Out of Scope

This specification does not include authorization to implement:

- a new backend architecture
- new authentication
- a CMS
- a customer portal
- AI chat on the website
- automated lead scoring
- complex CRM integration
- paid advertising infrastructure
- pricing changes
- production deployment
- new deployment provider
- major admin-dashboard redesign
- complete blog platform
- fabricated client case studies
- fabricated testimonials
- merge to `main`

---

## 35. Implementation Decision Log

The following decisions are locked by the approved PRD and this specification unless explicitly reopened:

- DevKofi category: **AI Engineering Studio**.
- Founder-led voice: **first person**.
- Core proposition: **I engineer AI systems that do real work.**
- Flagship service: **AI Systems Engineering**.
- Public sitemap: Home, Services, Work, Engineering Systems, Products, About, Book a Call.
- Work = curated engineering proof.
- Engineering Systems = how the work is engineered.
- Products = broader catalogue of applications built.
- Hero uses Kofi’s existing profile imagery.
- Desktop sections use alternating two-column storytelling.
- Mobile split sections use media first, text second.
- Mobile navigation uses a left-side drawer.
- Existing DevKofi brand colours are preserved.
- Theme/design values are centralized.
- Existing project data/API is reused and extended rather than duplicated without cause.
- Real visuals are preferred over stock AI imagery.
- Book a Call is the primary conversion.

---

## 36. Recommended First Implementation Package

The first code-changing implementation package should remain deliberately bounded.

Recommended package:

### Goal

Establish the redesign foundation without yet rebuilding every page.

### Scope

- semantic design tokens
- target public navigation config
- route skeletons/redirects
- shared `SplitSection`
- shared page container/hero primitives
- desktop/mobile Header
- accessible left navigation drawer
- Footer navigation update

### Excluded from first package

- full homepage content
- project schema migration
- Work filtering
- Products page content
- Engineering Systems content
- service copy completion
- backend changes

### Verification

- component tests
- route tests
- keyboard drawer test
- lint
- unit tests
- production build

This keeps the first implementation reversible and gives later page work a stable visual and routing foundation.
