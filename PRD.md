# DevKofi Creative Technology Studio

**Status:** Approved product direction  
**Date:** 2026-08-23  
**Owner:** Kofi Arhin

## Vision

DevKofi is Kofi's creative technology studio: a public home for product engineering, creative development, photography, content, and the systems that connect them.

## Promise

DevKofi turns useful ideas into clear, working digital experiences and shows the thinking, craft, and evidence behind the work.

## Users

### Primary

- Founders and small teams seeking a product engineer or creative technology partner.
- Businesses that need a focused website, internal tool, product prototype, or visual digital experience.

### Secondary

- Collaborators, recruiters, developers, and creators evaluating Kofi's work.
- People discovering Kofi's products, experiments, templates, and writing.

## Problem

The current website presents DevKofi as a mentorship platform. That no longer represents Kofi's active practice across full-stack product work, AI-assisted systems, photography, content, and creative technology. Visitors lack one clear explanation of the studio, credible proof of current work, and a direct route to begin a project.

## Primary journey

1. A visitor lands on DevKofi and understands the studio positioning.
2. They inspect selected work and see honest project statuses.
3. They understand the available capabilities and Kofi's working approach.
4. They submit a qualified project enquiry.
5. The existing API persists the enquiry and attempts the existing private notification flow.

## Public information architecture

- Home
- Work
- Services
- About
- Lab
- Journal
- Start a Project

Legacy route intent is preserved through redirects:

- `/projects` to `/work`
- `/templates` to `/lab`
- `/contact` to `/start-a-project`
- `/book-a-call` to `/start-a-project`

## MVP scope

- Reposition the public website as a creative technology studio.
- Establish a cinematic editorial design system.
- Feature Hibachi as an in-development flagship case study.
- Feature verified supporting work including ThriftChef, KareBraids, and DevKofi.
- Present product engineering, creative development, and photography/content capabilities.
- Preserve the existing contact persistence and best-effort Telegram notification behavior.
- Preserve private admin authentication and message workflows.
- Provide honest loading, empty, error, success, keyboard, mobile, and reduced-motion experiences.
- Use only authentic photography and verified product screenshots; use deliberate asset slots when final media is unavailable.

## Explicit exclusions

- Mentorship as DevKofi's public product identity.
- Deleting legacy mentorship data, schemas, or operational code.
- A new CMS.
- Fabricated testimonials, metrics, clients, articles, or photography.
- New paid services or dependencies.
- Admin information-architecture redesign.
- Merge, deployment, or DNS changes in the redesign pull request.

## Design direction

- Signature dark presentation using off-black and warm ivory.
- One muted copper/amber accent.
- Asymmetric editorial layouts with strong negative space.
- Characterful sans-serif typography with a restrained monospace companion.
- Authentic photography, product interface evidence, code fragments, and tactile materiality.
- Fluid transform/opacity motion with reduced-motion fallbacks.
- No neon AI-purple styling, stock imagery, fake evidence, generic three-card rows, or decorative animation that harms usability.

## Functional requirements

- The approved navigation and routes are available.
- Old public paths redirect without breaking bookmarks.
- Work distinguishes live, building, and historical projects.
- In-progress products never appear shipped.
- The project enquiry continues to use the existing server contract unless a later approved ticket changes it.
- Admin authorization and operational flows remain unchanged.
- API-backed content includes useful loading, error, retry, and empty states.

## Non-functional requirements

- Responsive from small mobile to wide desktop without horizontal overflow.
- Keyboard-accessible navigation and interactions.
- Visible focus and sufficient contrast.
- Reduced-motion support.
- No secrets or private product details in client code or public content.
- No new dependency without separate approval.
- Tests, lint, and production build must pass or remain explicitly unverified.

## Success criteria

- A first-time visitor can explain what DevKofi does after the opening viewport.
- Selected work and statuses are understandable without opening GitHub.
- A qualified visitor can reach and submit the project enquiry.
- Existing contact and admin regression checks remain green.
- The public experience is coherent on mobile and desktop.
- The pull request contains implementation and verification evidence without claiming merge or deployment.

## Risks

- Missing final photography could weaken the editorial experience.
- Legacy mentorship code and copy may remain outside active public routes.
- Ambitious motion could harm performance or accessibility.
- Existing project data may lack complete case-study narratives.

## Unresolved

- Final photography selection and licensing metadata.
- Approved client testimonials or outcome metrics.
- Whether Journal becomes API-backed after the initial curated state.
- Whether a persistent light/dark theme toggle is needed after the signature experience is validated.
