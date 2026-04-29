# Hero Section Fix Spec

## Context

The current home hero is implemented in:

- `client/src/components/Landing/LandingBase.jsx`
- `client/src/components/Landing/landing.styles.scss`
- `client/src/components/Landing/Landing.jsx`

Reference screenshot:

- `output/playwright/current-hero-desktop.png`

The hero currently presents DevKofi as an AI engineering mentorship offer with a dark split layout, animated headline text, portrait media, floating badges, proof tags, CTAs, supporting copy, and stats.

Observed issues from the desktop screenshot:

- The animated headline creates an excessive visual gap between "Build" and "production software".
- The hero uses both lime and purple glow/orb accents, weakening palette discipline.
- The right-side portrait is strong, but the floating badges feel decorative rather than informative.
- The lower portion of the first viewport has too much unused space and does not hint at the next section.
- The stats/proof labels are small and uneven in clarity.
- Infinite motion exists without an explicit reduced-motion strategy.
- The section uses `min-height: 100svh`; project frontend guidance requires `min-height: 100dvh`.
- Browser capture reported backend/API connection refused errors when only the frontend server was running. This should not block the hero visual fix, but verification should distinguish API availability from UI rendering.

## Goal

Refine the home hero so it reads faster, feels more intentional, and complies with project frontend design rules while preserving the existing brand direction: dark technical aesthetic, lime accent, DevKofi portrait, AI engineering mentorship positioning, and current public navigation.

The fix should improve visual hierarchy, responsive behavior, accessibility, and motion performance without introducing a broad redesign of unrelated sections.

## Non-Goals

- Do not redesign the full homepage beyond hero-level adjustments.
- Do not change backend APIs.
- Do not change deployment setup.
- Do not migrate the app from SCSS to Tailwind for this feature.
- Do not replace React Router, Redux, TanStack Query, or service structure.
- Do not introduce new third-party dependencies unless the existing implementation cannot satisfy the requirements.
- Do not add backend-dependent hero content.

## Design Direction

Use the required `design-taste-frontend` constraints for frontend work:

- Maintain an asymmetric split hero on desktop.
- Use one accent color: the current lime (`#a3e635`) may remain, but remove purple accent treatment from the hero.
- Avoid generic centered hero composition.
- Avoid card-overuse; use spacing, borders, and intentional panels only where they communicate hierarchy.
- Use off-black/zinc tones rather than pure black.
- Keep motion tactile but controlled.
- Animate only `transform` and `opacity`.
- Provide `prefers-reduced-motion` fallbacks.
- Ensure mobile collapses into a strict single-column layout.
- Use `min-height: 100dvh` for the hero shell.

## Proposed UX Changes

### 1. Headline

Replace the current multi-word rotating headline layout with a headline that preserves stable spacing.

Recommended copy:

```txt
Build production software
with AI-assisted engineering.
```

Use a single animated phrase or accent span only if it does not change line width enough to create large gaps.

Acceptable alternatives:

- Keep one rotating suffix after a fixed first line: "with spec-to-deploy systems", "with agent workflows", "with production review".
- Rotate the entire second line as one unit instead of rotating individual words.

Requirements:

- No large blank gap between words at any animation state.
- H1 must remain readable with JavaScript animation disabled.
- H1 should not exceed two or three visual lines on desktop.
- H1 must not overflow on 320px mobile width.

### 2. Supporting Copy

Make the primary paragraph direct and specific.

Recommended copy:

```txt
Mentorship for developers building MERN apps with AI tools, tests, review loops, and deployment discipline.
```

Keep the longer supporting paragraph only if it adds information not already covered.

Requirements:

- Use one primary paragraph near the H1.
- Keep line length around 50 to 65 characters on desktop.
- Avoid vague words such as "seamless", "elevate", "next-gen", and "unleash".

### 3. Proof Flow

Replace the current small proof chips:

```txt
Spec
Architecture
AI Build
Review
Deploy
```

With a clearer process strip:

```txt
Spec -> Architecture -> AI Build -> Review -> Deploy
```

Implementation options:

- Keep as inline pills with arrow icons from `@phosphor-icons/react`.
- Use a single bordered rail with divided process steps.
- On mobile, allow horizontal scroll or wrap cleanly into two rows.

Requirements:

- The process must read as an ordered workflow.
- Do not use emoji arrows.
- Keep tap targets and text spacing stable on mobile.

### 4. CTA Group

Keep two CTAs:

- Primary: `Start mentorship`
- Secondary: `See the work`

Requirements:

- Primary button uses the lime accent with readable dark text.
- Secondary button remains quieter with border/transparent treatment.
- Both buttons need visible focus states.
- Active state should use a small tactile transform such as `translateY(1px)` or `scale(0.98)`.
- Buttons must stack or fill available width on narrow mobile screens if needed.

### 5. Stats

Replace the current stat row with stronger, scan-friendly proof points.

Recommended items:

- `12+` / `Apps shipped`
- `5+` / `Years mentoring`
- `AI` / `Spec-to-deploy workflow`

Requirements:

- Use consistent icon sizing from `@phosphor-icons/react`.
- Keep numbers visually stronger than labels.
- Use organic text labels, not awkward compound labels.
- Ensure the row wraps without overlap at tablet and mobile widths.

### 6. Visual Column

Keep the portrait as the main visual anchor, but make surrounding UI more meaningful.

Recommended visual treatment:

- Portrait remains on the right on desktop.
- Replace decorative floating tags with a small "workflow panel" or meaningful overlay showing:
  - `Review queue`
  - `Tests passing`
  - `Deploy ready`
- Use subtle borders and inner highlights instead of strong outer glow.
- Keep the `5+ Years` badge only if it no longer competes with the portrait.

Requirements:

- Do not obscure the face in the portrait.
- Floating elements must not overlap incoherently at 1024px, 768px, 390px, or 320px widths.
- Avoid purple gradients and purple border accents.
- Use constrained dimensions and aspect ratio for the image frame.
- Image frame should remain stable during hover/animation.

### 7. Background And Palette

Refine the background to a disciplined dark system.

Recommended palette:

- Background: `#09090b` or close zinc off-black.
- Surface: translucent zinc, not pure black.
- Text: white and zinc-muted values.
- Accent: lime only.

Requirements:

- Remove `.hero-gradient-orb--2` purple treatment or recolor it to a neutral/lime low-opacity treatment.
- Avoid heavy neon outer glows.
- Grain/noise must be pointer-events none and should not create scrolling repaint cost.
- Any background decoration must stay behind content and not reduce text contrast.

### 8. Motion And Reduced Motion

Current motion includes:

- Staggered content reveal.
- Rotating headline text.
- Rotating description text.
- Parallax image `y`.
- Tilt interaction.
- Infinite image float/scale.
- Badge pulse.
- Floating tag loops.

Requirements:

- Add a reduced-motion strategy using Framer Motion's `useReducedMotion` and CSS `@media (prefers-reduced-motion: reduce)`.
- When reduced motion is enabled:
  - Disable infinite loops.
  - Disable parallax movement.
  - Disable tilt rotation.
  - Render stable headline/description text.
  - Keep basic opacity reveal optional and brief.
- All intervals must be cleaned up in `useEffect`.
- Continuous animation should only animate `transform` and `opacity`.
- Avoid state updates for pointer-following or continuous animation.

### 9. Responsive Behavior

Desktop:

- Preserve split layout.
- Recommended grid: content column and visual column, with visual around 420px to 500px wide.
- Keep content vertically centered but with enough lower reveal to imply more page content.

Tablet:

- Reduce visual size and prevent floating overlays from leaving the viewport.
- Layout may remain split above 1024px only.

Mobile:

- Single-column layout.
- Content first, visual second.
- Buttons wrap or stack cleanly.
- Proof process wraps or scrolls horizontally without page overflow.
- No text should overlap or clip inside buttons, badges, process steps, stats, or overlays.

Requirements:

- Test at 1440x900, 1024x768, 768x1024, 390x844, and 320x740.
- No horizontal scrolling at any tested viewport.
- Hero should use `min-height: 100dvh`; avoid `h-screen`.

## Technical Plan

### Files To Modify

Expected:

- `client/src/components/Landing/LandingBase.jsx`
- `client/src/components/Landing/landing.styles.scss`

Optional if needed:

- `client/src/components/Landing/Landing.jsx`
- `client/test/landing-hero.test.jsx` or similar focused test file under `client/test/`

### Component Changes

In `LandingBase.jsx`:

- Simplify or replace `HeroAnimatedHeadline`.
- Consider replacing separate `VERBS`, `NOUNS`, and `SUFFIXES` arrays with a single stable `HERO_HEADLINE_VARIANTS` array for one-line/second-line phrase rotation.
- Update `HERO_DESCRIPTION_PHRASES` or replace rotating description with stable copy.
- Add `useReducedMotion` from `framer-motion`.
- Gate animation props based on `shouldReduceMotion`.
- Replace decorative floating tags with a workflow overlay component or more meaningful panel.
- Ensure existing interval cleanup remains intact.

Example implementation shape:

```jsx
const shouldReduceMotion = useReducedMotion();

const imageMotion = shouldReduceMotion
  ? { opacity: 1, scale: 1, y: 0 }
  : { opacity: 1, scale: [1, 1.02, 1], y: [0, -10, 0] };
```

In `landing.styles.scss`:

- Change `min-height: 100svh` to `min-height: 100dvh`.
- Remove purple orb styling.
- Tighten grid spacing and image sizing.
- Adjust heading font sizing and line-height to prevent gaps.
- Add explicit mobile rules for the hero layout, CTA group, proof/process strip, stats, and visual overlays.
- Add `@media (prefers-reduced-motion: reduce)` rules that remove CSS animation and transitions where appropriate.
- Add visible focus-visible styles for CTA links.

### Styling System

This feature should continue using the existing SCSS file because the hero already uses SCSS. Do not mix Tailwind into this specific feature unless a broader styling migration is requested.

### Dependencies

No new dependencies are expected.

Existing relevant packages:

- `framer-motion`
- `@phosphor-icons/react`
- `react-router-dom`

If any new third-party library is proposed, verify `client/package.json` first and document the install command before use.

## Accessibility Requirements

- H1 must be a real `h1`.
- CTA links must have visible keyboard focus states.
- Decorative visual elements must remain `aria-hidden="true"`.
- The portrait image needs useful alt text, or empty alt if the surrounding content already identifies the person and the image is decorative. Preferred:

```txt
DevKofi portrait
```

- Do not rely on animation to communicate essential information.
- Maintain sufficient color contrast for lime text, muted body copy, chips, and buttons.
- Respect `prefers-reduced-motion`.

## Testing And Verification

### Automated Checks

Run:

```bash
cd client
npm run build
npm run lint
npm run test
```

If lint or tests fail for unrelated existing issues, document the exact failure and confirm the hero files do not introduce new failures.

### Browser Verification

Start the frontend:

```bash
cd client
npm run dev -- --host 127.0.0.1
```

Capture screenshots with Playwright or the project screenshot workflow:

- Desktop: `1440x900`
- Laptop/tablet: `1024x768`
- Tablet portrait: `768x1024`
- Mobile: `390x844`
- Small mobile: `320x740`

Required screenshots:

- `output/playwright/hero-desktop-after.png`
- `output/playwright/hero-tablet-after.png`
- `output/playwright/hero-mobile-after.png`

Manual visual checks:

- Headline spacing is stable.
- No text overlaps or clips.
- CTAs are aligned and readable.
- Portrait and overlays do not obscure each other.
- There is no purple visual accent remaining in the hero.
- No horizontal scroll on mobile.
- Reduced-motion mode shows stable content.
- The next homepage section is hinted or the hero bottom does not feel accidentally empty.

### Console Checks

During frontend-only verification, API connection errors may appear if the backend is not running. These are not hero regressions unless they cause blank content, broken layout, or user-facing error UI in the hero.

If the backend is needed for a full clean console run:

```bash
npm run dev
```

Then repeat the hero screenshot check.

## Acceptance Criteria

- The hero screenshot at desktop no longer shows the large gap between "Build" and "production software".
- The hero uses a single lime accent system and removes purple hero accents.
- The right visual area communicates workflow/mentorship value, not just decorative tags.
- H1, description, proof flow, CTA group, and stats are readable at all tested viewports.
- `#landing` uses `min-height: 100dvh`.
- Reduced-motion users do not receive infinite loops, parallax, or tilt.
- CTA links have visible focus states and tactile active states.
- The implementation does not introduce new dependencies.
- The implementation stays scoped to `Landing` hero files unless tests are added.
- `cd client && npm run build` succeeds.
- Relevant lint/test results are documented after implementation.

## Design Pre-Flight Matrix

- Global state: Not needed for this hero fix; keep state local to animation text only.
- Mobile collapse: Required; desktop split must become single-column below desktop breakpoint.
- Full-height section: Must use `min-height: 100dvh`, not `h-screen` or `100svh`.
- Effect cleanup: All intervals and motion effects must clean up or be Framer-managed.
- Loading/empty/error states: Not applicable to static hero content; do not add fake states.
- Card restraint: Use meaningful overlays/panels only; avoid decorative card clutter.
- CPU-heavy animation isolation: Infinite/continuous motion must be gated by reduced motion and limited to transform/opacity.

## Implementation Order

1. Update hero copy and headline structure in `LandingBase.jsx`.
2. Add `useReducedMotion` and gate motion props.
3. Replace decorative floating tags with a meaningful workflow overlay or remove them.
4. Refine SCSS for spacing, palette, responsive layout, focus states, and reduced motion.
5. Run build/lint/tests.
6. Capture desktop/tablet/mobile screenshots.
7. Compare against `output/playwright/current-hero-desktop.png` and document remaining tradeoffs.
