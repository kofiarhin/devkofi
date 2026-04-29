# About Page Elegant Redesign Implementation Plan

## Objective

Implement the About page redesign specified in `_spec/about-page-elegant-redesign-spec.md`. The final page should feel more elegant, editorial, and senior while preserving the DevKofi brand, current route behavior, and existing CTA destinations.

## Scope

Primary files:

- `client/src/Pages/About/About.jsx`
- `client/src/Pages/About/about.styles.scss`

Optional file:

- `client/src/index.css` only if the font stack is updated globally with a low-risk fallback.

Out of scope:

- Backend changes
- Routing changes
- Deployment changes
- Full site redesign
- New dependencies
- API or service changes

## Implementation Sequence

### Phase 1: Confirm Baseline

1. Open the current About source and styles.
2. Confirm the route still renders at `/about`.
3. Keep the current screenshot references for comparison:
   - `output/playwright/about-page-current.png`
   - `output/playwright/about-page-current-mobile.png`
4. Check for uncommitted user work before editing:
   - `git status --short`

Acceptance:

- Current implementation is understood.
- No unrelated files are modified.

### Phase 2: Restructure About Content Data

Edit `client/src/Pages/About/About.jsx`.

1. Replace `credibilityCards` with a capabilities-oriented data array.
   - Suggested shape:
     - `label`
     - `title`
     - `body`
     - `evidence`
2. Replace `processSteps` string array with structured method steps.
   - Suggested shape:
     - `number`
     - `title`
     - `body`
3. Replace `outcomes` string array with before/after outcome rows.
   - Suggested shape:
     - `from`
     - `to`
4. Keep `trustStats`, but consider making values more editorial in presentation rather than boxed cards.
5. Keep existing CTA labels and routes:
   - `/contact`: `Start Mentorship`
   - `/projects`: `See Workflow`

Acceptance:

- Content arrays support the new visual structure.
- Copy remains concrete and focused on AI engineering mentorship.
- No fake numbers or generic filler claims are added.

### Phase 3: Rebuild JSX Layout

Edit `client/src/Pages/About/About.jsx`.

1. Change the page heading from `h2` to `h1`.
2. Remove the quick-link nav from the top of the page.
   - Preferred: remove it entirely.
   - Acceptable fallback: move it after the hero as a compact in-page contents row, hidden or simplified on mobile.
3. Create the new section order:
   - Hero
   - Belief statement
   - Method rail
   - Capabilities matrix
   - Outcomes transformation
   - Personal story
   - Final CTA
4. Keep semantic HTML:
   - Page wrapper: `section` or `main`-like section with `aria-label`
   - Hero: `header`
   - Major content blocks: `section`
   - Repeated capabilities: `article`
   - Method steps: ordered list
   - Outcomes: list or description-style rows
5. Preserve the existing IntersectionObserver only if reveal animation remains useful.
6. If the observer is retained:
   - Keep `observer.disconnect()` cleanup.
   - Preserve `prefers-reduced-motion` CSS support.
7. Add class names that reflect the new design:
   - `about-page__hero`
   - `about-page__hero-copy`
   - `about-page__portrait-panel`
   - `about-page__proof-strip`
   - `about-page__belief`
   - `about-page__method`
   - `about-page__capabilities`
   - `about-page__outcomes`
   - `about-page__story`
   - `about-page__final-cta`

Acceptance:

- The JSX reads as a clear content hierarchy.
- The page has one H1.
- Links continue to use React Router `Link`.
- No component-level API logic is introduced.

### Phase 4: Rebuild SCSS Tokens

Edit `client/src/Pages/About/about.styles.scss`.

1. Replace current tokens with softer dark editorial tokens:
   - `--about-bg`
   - `--about-surface`
   - `--about-surface-strong`
   - `--about-text`
   - `--about-muted`
   - `--about-subtle`
   - `--about-border`
   - `--about-accent`
2. Avoid pure black and bright glow treatments.
3. Remove repeated large card styling from generic `&__section`.
4. Add base page layout:
   - `background`
   - `color`
   - `padding`
   - `overflow-x: clip`
5. Use a central container:
   - `width: min(100% - 2rem, 1180px)`
   - `margin: 0 auto`
6. Keep SCSS nesting consistent with the current file.

Acceptance:

- The stylesheet has clear tokens.
- Generic section card styling is removed.
- Accent use is controlled.

### Phase 5: Implement Editorial Hero Styling

Edit `client/src/Pages/About/about.styles.scss`.

1. Build an asymmetric desktop grid:
   - Example: `grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr)`
   - `align-items: center`
2. Style the H1:
   - Controlled large size with `clamp`
   - Tight line-height
   - Refined max width
3. Style lead text:
   - Muted, readable, controlled line length
4. Style CTAs:
   - Clear primary and secondary states
   - Visible focus states
   - Active tactile press state
5. Style trust stats as inline proof, not boxed metrics.
   - Use dividers, small labels, or compact rows.
6. Style portrait:
   - Refined border
   - Subtle shadow
   - No neon outer glow
   - Optional caption/proof strip

Acceptance:

- Desktop first viewport feels composed and premium.
- Portrait no longer depends on a lime glow.
- CTAs remain easy to find.

### Phase 6: Implement Belief Statement

Edit JSX and SCSS as needed.

1. Add a large editorial belief statement section.
2. Use open spacing or a top border, not a card.
3. Highlight only one key phrase with the accent.
4. Keep max line length under control.

Acceptance:

- The section creates a memorable pause after the hero.
- It does not repeat the hero paragraph.

### Phase 7: Implement Method Rail

Edit JSX and SCSS as needed.

1. Render structured method steps in an ordered list.
2. Use a vertical rail or thin dividers.
3. Each step includes:
   - Number
   - Title
   - Body
4. Desktop can use a two-column layout with an intro on one side and steps on the other.
5. Mobile collapses to a simple vertical stack.

Acceptance:

- The workflow is scannable.
- Numbering is accessible and visible.
- Mobile indentation does not cause awkward wrapping.

### Phase 8: Implement Capabilities Matrix

Edit JSX and SCSS as needed.

1. Render four capability items.
2. Use an asymmetric grid on desktop.
   - Example: first item spans more columns, remaining items align around it.
3. Avoid the generic two-by-two boxed-card look.
4. Use thin separators, low-contrast surfaces, or subtle panels only where hierarchy benefits.
5. Add hover/focus polish only for interactive elements. Static articles do not need hover effects.

Acceptance:

- Expertise reads as structured and senior.
- The section feels less like a generic feature grid.
- Mobile becomes a clean list with dividers.

### Phase 9: Implement Outcomes Transformation

Edit JSX and SCSS as needed.

1. Render before/after rows from the outcome data.
2. Use accessible labels:
   - `From`
   - `To`
3. On desktop, rows can use two columns.
4. On mobile, stack each row with clear separation.
5. Avoid relying only on an arrow symbol or color to communicate transformation.

Acceptance:

- Outcomes are more concrete than the current bullet list.
- The transformation is clear with or without color.

### Phase 10: Refine Personal Story and CTA

Edit JSX and SCSS as needed.

1. Rework "Why I Mentor" into an open editorial block.
2. Use a stronger opening paragraph and shorter supporting paragraphs.
3. Replace final CTA card with:
   - Top border
   - Spacious layout
   - Clear CTA copy
   - Same CTA links
4. Ensure button wrapping is clean on narrow screens.

Acceptance:

- The end of the page feels intentional, not like another card.
- The final CTA is visible and calm.

### Phase 11: Responsive Pass

Test responsive behavior at:

- `320px`
- `390px`
- `768px`
- `1024px`
- `1440px`

Checklist:

- No horizontal scrolling.
- Hero collapses cleanly.
- H1 does not overflow.
- CTA buttons do not collide.
- Portrait does not dominate too much vertical space on mobile.
- Method rail text wraps cleanly.
- Outcomes rows remain readable.
- Footer still appears correctly after the page content.

Acceptance:

- Mobile experience is shorter and more refined than current capture.
- Desktop feels more editorial and less boxed.

### Phase 12: Accessibility Pass

1. Confirm there is one H1.
2. Confirm heading order is logical.
3. Tab through:
   - Header links
   - CTA links
   - Any in-page anchors if retained
4. Check focus visibility on dark backgrounds.
5. Confirm portrait alt text remains meaningful.
6. Confirm accent text contrast is sufficient.
7. Confirm reduced-motion media query disables reveal movement.

Acceptance:

- Keyboard navigation is usable.
- Screen-reader structure is reasonable.
- Motion is respectful of user preference.

### Phase 13: Build and Lint

Run:

```powershell
cd client
npm run build
npm run lint
```

If lint reveals pre-existing unrelated warnings, document them separately and do not broaden scope unless they block the About page work.

Acceptance:

- Build passes.
- Lint either passes or unrelated existing issues are documented.

### Phase 14: Screenshot Verification

Start or reuse the Vite dev server:

```powershell
npm run client
```

Capture:

- Desktop: `output/playwright/about-page-redesign-desktop.png`
- Mobile: `output/playwright/about-page-redesign-mobile.png`

Compare against:

- `output/playwright/about-page-current.png`
- `output/playwright/about-page-current-mobile.png`

Acceptance:

- New screenshots show fewer heavy cards.
- The hero has stronger hierarchy.
- Mobile starts with the primary story instead of a large quick-link block.
- The final page meets the spec.

## Risk Notes

- The global font stack currently starts with Inter in `client/src/index.css`. Updating it globally could affect the whole site, so prefer page-scoped typography unless a broader typography change is desired.
- The existing header and footer are visually tied to the neon lime brand. The About page should refine lime use without making header/footer look broken.
- The current About page uses SCSS, so continue with SCSS for this feature rather than mixing in Tailwind.
- The portrait is a remote Cloudinary asset. Keep the same asset for now to avoid content approval delays.

## Suggested Implementation Order for a Single Coding Session

1. Update JSX data arrays and section structure.
2. Replace SCSS tokens and hero layout.
3. Style belief, method, capabilities, outcomes, story, and CTA.
4. Run mobile responsive pass.
5. Run build and lint.
6. Capture desktop and mobile screenshots.
7. Make final polish adjustments from screenshots.

## Done Definition

The implementation is complete when:

- `/about` reflects the new elegant editorial design.
- The page uses one H1 and accessible heading order.
- The design has fewer boxed panels and more intentional spacing.
- Lime is used as a controlled signature accent.
- Desktop and mobile screenshots are captured after implementation.
- `npm run build` succeeds from `client`.
- `npm run lint` has been run and results are recorded.

## Design Skill Pre-Flight Matrix

- [x] Global state is not part of the implementation.
- [x] Mobile collapse is explicitly planned under `768px`.
- [x] No `h-screen` hero is planned.
- [x] Reveal effects must preserve cleanup and reduced-motion handling.
- [x] Loading, empty, and error states are not applicable for this static page.
- [x] The plan removes unnecessary cards in favor of dividers, spacing, and editorial structure.
- [x] CPU-heavy perpetual animations are excluded.
