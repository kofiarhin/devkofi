# Hero Section Fix Implementation Plan

## Source Spec

- `_spec/hero-section-fix-spec.md`

## Objective

Implement the home hero refinement described in the spec while keeping the work scoped to the existing `Landing` hero. The implementation should fix headline spacing, simplify the palette, improve the visual column, add reduced-motion handling, strengthen responsive behavior, and produce verification screenshots.

## Working Constraints

- Apply `design-taste-frontend` rules for all UI decisions.
- Keep this feature in the existing SCSS styling system because the hero already uses `landing.styles.scss`.
- Do not introduce new dependencies.
- Use existing `framer-motion` and `@phosphor-icons/react` only.
- Do not modify backend behavior.
- Do not change deployment configuration.
- Avoid broad homepage refactors.
- Preserve user changes in the working tree.

## Files In Scope

Primary files:

- `client/src/components/Landing/LandingBase.jsx`
- `client/src/components/Landing/landing.styles.scss`

Optional files only if justified:

- `client/src/components/Landing/Landing.jsx`
- `client/test/landing-hero.test.jsx`

Artifacts to create during verification:

- `output/playwright/hero-desktop-after.png`
- `output/playwright/hero-tablet-after.png`
- `output/playwright/hero-mobile-after.png`

## Implementation Phases

### Phase 1: Baseline Review

1. Read the current hero component and styles:
   - `LandingBase.jsx`
   - `landing.styles.scss`
2. Confirm package availability in `client/package.json`:
   - `framer-motion`
   - `@phosphor-icons/react`
3. Review the existing screenshot:
   - `output/playwright/current-hero-desktop.png`
4. Note current class names and motion components before editing so the patch stays targeted.

Exit criteria:

- Current hero structure is understood.
- No dependency additions are needed.
- The change list remains limited to the expected hero files.

### Phase 2: Content And Structure Update

Modify `client/src/components/Landing/LandingBase.jsx`.

1. Replace the current separate `VERBS`, `NOUNS`, and `SUFFIXES` headline model.
2. Implement a stable H1 structure:

   ```txt
   Build production software
   with AI-assisted engineering.
   ```

3. If animation is retained, rotate only the second-line phrase as one complete unit. Do not rotate individual words in a way that changes spacing between fixed words.
4. Replace the rotating description with one stable primary paragraph unless there is a clear reason to keep rotation:

   ```txt
   Mentorship for developers building MERN apps with AI tools, tests, review loops, and deployment discipline.
   ```

5. Replace the existing proof chips with an ordered process flow:

   ```txt
   Spec -> Architecture -> AI Build -> Review -> Deploy
   ```

   Use Phosphor icons for arrows or separators. Do not use emoji.

6. Update stat labels:
   - `12+` / `Apps shipped`
   - `5+` / `Years mentoring`
   - `AI` / `Spec-to-deploy workflow`

7. Keep CTA routes unchanged:
   - `/contact`
   - `/projects`

Exit criteria:

- H1 text is stable and readable.
- Proof flow reads as ordered.
- CTA links still point to the existing public routes.
- No backend or service logic is touched.

### Phase 3: Motion And Reduced Motion

Modify `client/src/components/Landing/LandingBase.jsx`.

1. Import `useReducedMotion` from `framer-motion`.
2. Create a local boolean:

   ```jsx
   const shouldReduceMotion = useReducedMotion();
   ```

3. Gate all motion that is not essential:
   - Stagger reveal.
   - Headline or description rotation if retained.
   - Image parallax.
   - Tilt rotation.
   - Infinite image scale/float.
   - Badge pulse.
   - Workflow overlay movement.

4. For reduced motion:
   - Use static headline and paragraph content.
   - Set parallax image `y` to `0`.
   - Set tilt transforms to `0`.
   - Remove infinite animation arrays.
   - Keep any mount animation subtle or disable it.

5. Ensure any `setInterval` usage has cleanup in `useEffect`.
6. Keep pointer-following behavior on motion values, not React state.

Exit criteria:

- `prefers-reduced-motion` users receive stable content.
- There are no uncleaned intervals.
- Continuous motion only animates `transform` and `opacity`.

### Phase 4: Visual Column Redesign

Modify `client/src/components/Landing/LandingBase.jsx` and `landing.styles.scss`.

1. Keep the portrait as the main right-side visual.
2. Replace the current decorative `MERN Stack` and `AI Workflow` floating tags with a meaningful workflow overlay.
3. Recommended overlay content:
   - `Review queue`
   - `Tests passing`
   - `Deploy ready`
4. Keep or reposition the `5+ Years` badge only if it does not compete with the face or cause overlap.
5. Ensure all decorative wrappers are `aria-hidden="true"` where appropriate.
6. Use Phosphor icons consistently.

Exit criteria:

- Visual side communicates mentorship/workflow value.
- The face remains unobscured.
- Overlay elements are constrained within the visual column at desktop and tablet widths.

### Phase 5: SCSS Layout And Palette Refinement

Modify `client/src/components/Landing/landing.styles.scss`.

1. Change hero viewport sizing:

   ```scss
   min-height: 100dvh;
   ```

2. Remove or neutralize the purple orb:
   - Delete `.hero-gradient-orb--2`, or
   - Recolor it to a very low-opacity neutral/lime treatment.

3. Tighten hero vertical rhythm:
   - Reduce excessive empty lower space.
   - Keep enough top padding to clear the fixed/sticky header.
   - Keep a hint of the next section where practical.

4. Refine headline styles:
   - Prevent large gaps.
   - Use stable line-height.
   - Avoid mobile overflow at 320px.

5. Refine process flow:
   - Use a rail, divided inline group, or neatly wrapped pills.
   - Keep step spacing stable.
   - Prevent horizontal page overflow.

6. Refine CTA states:
   - Hover.
   - Active/tactile press.
   - `:focus-visible`.

7. Refine visual column:
   - Stable image aspect ratio.
   - Subtle borders/inner highlights.
   - Less outer glow.
   - Responsive overlay positioning.

8. Add CSS reduced-motion fallback:

   ```scss
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       scroll-behavior: auto !important;
     }
   }
   ```

   Scope this carefully if a global selector inside the component stylesheet creates unwanted side effects.

Exit criteria:

- No purple hero accent remains.
- Hero uses one lime accent system.
- Layout is stable on desktop, tablet, and mobile.
- Focus states are visible.

### Phase 6: Responsive Pass

Use CSS media queries in `landing.styles.scss`.

1. Desktop, `>= 1024px`:
   - Preserve split layout.
   - Content and visual columns align intentionally.
   - Visual width stays around `420px` to `500px`.

2. Tablet, `768px` to `1023px`:
   - Use a single-column layout unless the visual remains clean.
   - Keep portrait size constrained.
   - Keep overlays inside the viewport.

3. Mobile, `< 768px`:
   - Single-column layout.
   - Content first, portrait second.
   - Buttons stack or fill available width.
   - Process flow wraps or scrolls internally without page overflow.
   - Stats wrap without overlap.

4. Small mobile, `320px`:
   - Verify no text clips in buttons, pills, badges, or overlays.

Exit criteria:

- No horizontal scrolling at tested viewports.
- Text and UI elements do not overlap.
- Hero remains visually coherent at 320px width.

### Phase 7: Optional Focused Test

Add a frontend test only if the current test setup can support it without significant scaffolding.

Candidate test file:

- `client/test/landing-hero.test.jsx`

Potential assertions:

- Renders the hero H1.
- Renders both CTA links with correct `href` values.
- Renders process flow labels in order.
- Renders updated stat labels.

Skip this phase if test setup friction would exceed the value for this mostly visual change. If skipped, document that verification is screenshot/build/lint based.

Exit criteria:

- Either a focused test exists and passes, or the reason for not adding one is documented.

### Phase 8: Automated Validation

Run from `client/`:

```bash
npm run build
npm run lint
npm run test
```

Expected handling:

- If all pass, record success.
- If a command fails due to pre-existing unrelated issues, record:
  - Command.
  - Failure summary.
  - Why it is unrelated to the hero change.
- If a command fails because of the hero implementation, fix before proceeding.

Exit criteria:

- Build succeeds.
- Lint and tests are either passing or failures are clearly classified and not caused by the hero change.

### Phase 9: Browser Verification And Screenshots

Start the frontend:

```bash
cd client
npm run dev -- --host 127.0.0.1
```

Capture screenshots at:

- `1440x900` -> `output/playwright/hero-desktop-after.png`
- `1024x768` -> optional laptop/tablet checkpoint
- `768x1024` -> optional tablet portrait checkpoint
- `390x844` -> `output/playwright/hero-mobile-after.png`
- `320x740` -> small mobile checkpoint

At minimum, save:

- `output/playwright/hero-desktop-after.png`
- `output/playwright/hero-tablet-after.png`
- `output/playwright/hero-mobile-after.png`

Visual checklist:

- Headline spacing is stable.
- H1 is readable and not clipped.
- No purple accent remains.
- CTA layout is polished.
- Focus states are present if checked manually.
- Process flow reads in order.
- Stats are legible.
- Portrait is not obscured.
- Overlay panel stays inside the hero.
- No horizontal page scroll.
- Reduced-motion mode renders stable content.

Console handling:

- API connection errors are acceptable only when running frontend without backend.
- API errors are not acceptable if they blank or break the hero.

Exit criteria:

- Required screenshots are saved.
- Visual checklist passes.
- Any remaining tradeoff is documented.

## Suggested Patch Sequence

1. Patch `LandingBase.jsx` content constants, H1 structure, proof flow, stats, and visual overlay markup.
2. Patch `LandingBase.jsx` motion gating with `useReducedMotion`.
3. Patch `landing.styles.scss` layout, palette, headline, CTA, stats, visual overlay, and reduced-motion rules.
4. Run a quick build to catch syntax errors.
5. Run browser screenshots and fix responsive issues.
6. Run final build/lint/test commands.

## Risk Register

### Risk: Framer Motion Reduced-Motion Handling Regresses Animations

Mitigation:

- Keep reduced-motion branching simple.
- Prefer static objects over conditional arrays for reduced motion.
- Test normal and reduced-motion browser contexts.

### Risk: Visual Overlay Obscures Portrait On Smaller Widths

Mitigation:

- Position overlays relative to the image frame.
- Move overlays below the image on mobile if necessary.
- Use `max-width`, `inset`, and media queries instead of uncontrolled absolute positions.

### Risk: Hero Becomes Too Dense On Mobile

Mitigation:

- Hide nonessential decorative elements on mobile.
- Stack CTAs.
- Collapse process flow into wrapped steps or internal horizontal scroll.
- Reduce stats to compact rows.

### Risk: SCSS Reduced-Motion Rule Affects Other Components

Mitigation:

- Scope reduced-motion selectors under `#landing`.
- Avoid global `*` rules outside the hero stylesheet scope.

### Risk: Existing API Calls Cause Console Noise During Verification

Mitigation:

- Treat frontend-only connection refused errors as environmental unless the hero UI breaks.
- Optionally run full `npm run dev` for clean integration verification.

## Rollback Plan

If the visual implementation fails or creates layout regressions:

1. Revert only the changes in:
   - `client/src/components/Landing/LandingBase.jsx`
   - `client/src/components/Landing/landing.styles.scss`
   - any optional test file added for this work
2. Keep generated screenshots and notes if they are useful for diagnosis.
3. Do not revert unrelated working tree changes.

## Definition Of Done

- Hero implementation matches `_spec/hero-section-fix-spec.md`.
- Desktop screenshot no longer shows the large headline gap.
- Hero palette uses lime as the only accent.
- Right-side visual contains meaningful workflow context or a cleaner reduced version.
- Reduced-motion behavior is implemented.
- Mobile and tablet layouts have no overlap or horizontal scroll.
- `#landing` uses `min-height: 100dvh`.
- Required screenshots are saved under `output/playwright/`.
- Validation commands are run and results are documented.

## Final Design Pre-Flight

- Global state: No new global state.
- Mobile collapse: Single-column below desktop breakpoint.
- Full-height section: `min-height: 100dvh`.
- Effect cleanup: All intervals cleaned; Framer-managed motion only.
- Empty/loading/error states: Not applicable to this static hero.
- Card restraint: Overlay/panel is meaningful, not decorative clutter.
- Continuous motion: Gated by reduced motion and limited to transform/opacity.
