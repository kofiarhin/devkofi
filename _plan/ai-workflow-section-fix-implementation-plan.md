# AIWorkflowSection Elegance Fix — Implementation Plan

## Source Spec

- `_spec/ai-workflow-section-fix-spec.md`

## Reference Screenshots

- `_suggestion/ai-workflow-block-1.png`
- `_suggestion/ai-workflow-block-2.png`
- `_suggestion/ai-workflow-section-full.png`

---

## Objective

Implement all nine visual and copy changes described in the spec to make the AIWorkflowSection read as a cohesive, elegant workflow. Changes are confined to two files. No new dependencies. No layout restructure.

---

## Working Constraints

- Edit only `AIWorkflowSection.jsx` and `ai-workflow-section.styles.scss` unless a test file is added.
- Do not touch any other component, page, route, or backend file.
- Do not add npm packages.
- Do not introduce Tailwind utilities.
- Do not alter any existing Framer Motion animation logic, entrance variants, or parallax behaviour — only SCSS and copy change.
- All CSS changes must not break the card hover states, top-edge neon accent line, or parallax image effect.

---

## Files in Scope

Primary:

- `client/src/components/AIWorkflowSection/AIWorkflowSection.jsx`
- `client/src/components/AIWorkflowSection/ai-workflow-section.styles.scss`

Verification artifacts to create:

- `_suggestion/ai-workflow-after-desktop.png`
- `_suggestion/ai-workflow-after-desktop-mid.png`
- `_suggestion/ai-workflow-after-tablet.png`
- `_suggestion/ai-workflow-after-mobile.png`

---

## Implementation Phases

---

### Phase 1 — Baseline Read and Pre-flight

**Goal:** Fully understand the current SCSS token structure and JSX shape before making any edit.

**Steps:**

1. Read `AIWorkflowSection.jsx` in full.
   - Note the `BLOCKS` array shape (id, title, description, tags, cta, image, alt).
   - Note that `WorkflowBlock` accepts `block` and `index` props.
   - Note that the CTA is rendered as `<Link to="/contact" className="ai-workflow-block__cta">`.
   - Note the subheading is a `<p className="ai-workflow-section__subheading">` with inline text.

2. Read `ai-workflow-section.styles.scss` in full.
   - Record the exact current values for the SCSS variables at the top of the file:
     - `$bg-card`, `$bg-card-hover`, `$primary`, `$primary-dim`, `$primary-border`, `$primary-border-hover`, `$primary-glow`, `$border`, `$text-muted`
   - Confirm the `::before` ghost watermark rule exists on `.ai-workflow-block`.
   - Confirm the mobile override for the ghost watermark exists at `@media (max-width: 767px)`.
   - Confirm `.ai-workflow-block__image-wrap` does not already have a `::before` pseudo-element.
   - Confirm `.ai-workflow-section__blocks` does not already have `position: relative` or a `::before`.

3. Run the dev server and confirm the section renders without errors:
   ```bash
   npm run client
   ```

**Exit criteria:**

- Both files fully read and key selectors confirmed.
- Dev server starts and section is visible at `http://localhost:5173`.
- No pre-existing console errors related to the AIWorkflowSection.

---

### Phase 2 — SCSS: Remove Ghost Watermark Numbers

**Spec reference:** Change 2

**Goal:** Delete the near-invisible ghost step number from the card background to eliminate the redundant double-number treatment.

**File:** `ai-workflow-section.styles.scss`

**Step 2.1 — Delete the base ghost watermark rule.**

Locate and delete the entire `&::before` block inside `.ai-workflow-block` that renders `content: attr(data-number)`. The block to delete looks like:

```scss
// DELETE this entire block
&::before {
  content: attr(data-number);
  position: absolute;
  bottom: -2rem;
  right: 1.25rem;
  font-size: 11rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.022);
  line-height: 1;
  letter-spacing: -0.05em;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}
```

Do not delete the `&::after` block — that is the top-edge neon accent line and must remain.

**Step 2.2 — Delete the mobile override for the ghost watermark.**

Locate the `@media (max-width: 767px)` block. Inside it, find and delete the `.ai-workflow-block::before` override:

```scss
// DELETE this block inside @media (max-width: 767px)
&::before {
  right: 0.65rem;
  bottom: -1.25rem;
  font-size: 7rem;
}
```

**Step 2.3 — Verify.**

After editing, confirm:
- No `content: attr(data-number)` exists anywhere in the file.
- The `&::after` neon top line on `.ai-workflow-block` is still present.
- The `data-number` attribute in the JSX is still there (it is harmless — no need to remove it).

**Exit criteria:**

- Ghost watermarks are gone from all five cards.
- Card hover top-edge accent line still functions.
- No SCSS syntax errors.

---

### Phase 3 — SCSS: Increase Card Surface Depth

**Spec reference:** Change 5

**Goal:** Make cards perceptibly lift off the page background by lightening the card surface and adding a persistent glass highlight inset shadow.

**File:** `ai-workflow-section.styles.scss`

**Step 3.1 — Update SCSS variable declarations at the top of the file.**

Change:

```scss
$bg-card: #111113;
$bg-card-hover: #131516;
```

To:

```scss
$bg-card: #131517;
$bg-card-hover: #161a1c;
```

**Step 3.2 — Update the base `.ai-workflow-block` shadow.**

In the `.ai-workflow-block` base rule, update the `border` and add a base `box-shadow`. The block currently has no `box-shadow` at rest — only on hover. Add one:

```scss
.ai-workflow-block {
  // existing rules...
  background: $bg-card;                           // now resolves to #131517
  border: 1px solid rgba(255, 255, 255, 0.09);   // was: rgba(255,255,255,0.07)
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),     // top-edge glass highlight
    0 2px 16px rgba(0, 0, 0, 0.32);              // ambient depth
  // ...rest of existing rules unchanged
}
```

**Step 3.3 — Update the hover box-shadow to layer on top of the new base shadow.**

Inside the `&:hover` block, the existing `box-shadow` already overrides the base. Update it to include the glass highlight at a slightly stronger value:

```scss
&:hover {
  border-color: $primary-border-hover;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 0 0 1px rgba(163, 230, 53, 0.06),
    0 8px 40px rgba(0, 0, 0, 0.4),
    0 0 60px $primary-glow;
  background: $bg-card-hover;

  &::after {
    opacity: 1;
  }

  .ai-workflow-block__image {
    transform: scale(1.04) translateY(var(--parallax-y, 0px));
  }
}
```

**Exit criteria:**

- Cards are perceptibly distinct from the page background at rest without any user interaction.
- Hover state still triggers correctly.
- No visual regression on the card border-radius, padding, or grid layout.

---

### Phase 4 — SCSS: Reduce Lime Saturation on Decorative Elements

**Spec reference:** Change 8

**Goal:** Subordinate the eyebrow label, eyebrow line, and step number badges by reducing their lime opacity. This reserves full-saturation lime exclusively for the CTA button.

**File:** `ai-workflow-section.styles.scss`

**Step 4.1 — Reduce eyebrow line opacity.**

Locate `.ai-workflow-section__eyebrow-line`. Change the `background`:

```scss
.ai-workflow-section__eyebrow-line {
  // existing rules...
  background: rgba(163, 230, 53, 0.5);  // was: $primary (#a3e635)
}
```

**Step 4.2 — Reduce eyebrow label color.**

Locate `.ai-workflow-section__eyebrow`. Change `color`:

```scss
.ai-workflow-section__eyebrow {
  // existing rules...
  color: rgba(163, 230, 53, 0.7);  // was: $primary
}
```

**Step 4.3 — Reduce step number badge lime values.**

Locate `.ai-workflow-block__number`. Update `color`, `background`, and `border-color`:

```scss
.ai-workflow-block__number {
  // existing rules...
  color: rgba(163, 230, 53, 0.75);         // was: $primary
  background: rgba(163, 230, 53, 0.06);    // was: $primary-dim (0.08)
  border: 1px solid rgba(163, 230, 53, 0.15); // was: $primary-border (0.2)
}
```

**Step 4.4 — Verify contrast ratios (manual check).**

Expected approximate contrast:
- `rgba(163,230,53,0.7)` on `#131517` ≈ 6.1:1 — passes WCAG AA for small text (4.5:1 threshold).
- `rgba(163,230,53,0.75)` on `rgba(163,230,53,0.06)` over `#131517` ≈ 5.4:1 — passes AA.

**Exit criteria:**

- Eyebrow, eyebrow line, and step badges are visually quieter than the CTA buttons.
- None of these elements appear as bright as the CTA at a quick glance.
- CTA button lime is untouched.
- Hover borders and top-edge accent line are untouched.

---

### Phase 5 — SCSS: Mute Tags to Monochrome

**Spec reference:** Change 4

**Goal:** Strip lime color from tags entirely so they recede behind the CTA and do not compete with it for attention.

**File:** `ai-workflow-section.styles.scss`

**Step 5.1 — Replace tag color values.**

Locate `.ai-workflow-block__tag`. Replace the entire rule body with neutral monochrome values:

```scss
.ai-workflow-block__tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);           // was: $primary
  background: rgba(255, 255, 255, 0.05);      // was: $primary-dim
  border: 1px solid rgba(255, 255, 255, 0.1); // was: $primary-border
  border-radius: 9999px;
  padding: 0.28rem 0.85rem;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.09);
    color: rgba(255, 255, 255, 0.8);
    border-color: rgba(255, 255, 255, 0.18);
  }
}
```

**Step 5.2 — Verify tag hover does not use lime.**

Confirm the `&:hover` inside `__tag` contains only white/neutral values. No `$primary` reference.

**Exit criteria:**

- Tags are white/neutral across all five blocks — no lime text, borders, or backgrounds.
- Tags still animate on hover.
- The CTA button is now clearly the dominant lime element in each block.

---

### Phase 6 — SCSS: Consistent Image Overlay

**Spec reference:** Change 1

**Goal:** Add a uniform dark-to-green-tint gradient overlay to all card images so they share the same visual tone regardless of the source photo's brightness or color temperature.

**File:** `ai-workflow-section.styles.scss`

**Step 6.1 — Add `position: relative` to `.ai-workflow-block__image-wrap`.**

The `::before` pseudo-element needs `position: relative` on the parent. Check whether it already exists. If not, add it:

```scss
.ai-workflow-block__image-wrap {
  position: relative; // add if not already present
  // existing rules...
}
```

**Step 6.2 — Add the overlay `::before` pseudo-element.**

Inside `.ai-workflow-block__image-wrap`, add a new `::before` block:

```scss
.ai-workflow-block__image-wrap {
  // existing rules...

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.22) 0%,
      rgba(163, 230, 53, 0.045) 100%
    );
    border-radius: inherit;
    pointer-events: none;
  }
}
```

**Step 6.3 — Verify z-index layering.**

The image-wrap currently has an `::after` that applies the neon inset frame on hover:

```scss
&::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgba(163, 230, 53, 0);
  transition: box-shadow 0.35s ease;
  pointer-events: none;
  z-index: 2;
}
```

The overlay `::before` uses `z-index: 1` and the hover frame `::after` uses `z-index: 2`. The image itself has no z-index set (`will-change: transform` only). This stacking order is correct — overlay sits above the image, neon frame sits above the overlay.

**Step 6.4 — Verify at all five blocks.**

At desktop, review each block's image visually:
- Block 01 (workstation photo): overlay should not darken excessively — photo is already dark.
- Block 02 (code screenshot): overlay should bring it closer in tone to the other blocks.
- Block 03 (person in dark room): overlay should add the green tint and slightly lift the overall lightness.
- Blocks 04 and 05: apply equally.

If any block looks over-darkened, reduce the `rgba(0,0,0,0.22)` value to `0.16`. Do not exceed `0.28` on the dark channel.

**Exit criteria:**

- All five images have a consistent tonal quality at a glance.
- The neon hover frame still appears on hover.
- The parallax movement still works — the overlay is absolute positioned and does not interfere with the `motion.img` transform.
- `pointer-events: none` is set on the overlay.

---

### Phase 7 — JSX: Subheading Copy

**Spec reference:** Change 3

**Goal:** Replace the context-dependent subheading copy with self-contained language that works for mid-scroll readers.

**File:** `AIWorkflowSection.jsx`

**Step 7.1 — Locate the subheading paragraph.**

Find the `<p className="ai-workflow-section__subheading">` element in the `AIWorkflowSection` component body. It currently reads:

```jsx
The page starts with the promise. This is the operating system:
scope the work, guide the agents, verify the output, and deploy with
confidence.
```

**Step 7.2 — Replace the text content.**

Replace the inner text with:

```jsx
Scope the work, guide the agents, verify the output, and deploy with
confidence. Five steps, one repeatable system.
```

Do not change the element tag, class name, or any surrounding motion wrappers.

**Exit criteria:**

- Subheading starts with "Scope the work..." and contains no reference to "the page starts with the promise".
- No other JSX in the component is altered in this step.

---

### Phase 8 — JSX + SCSS: CTA Button Hierarchy

**Spec reference:** Change 6

**Goal:** Make Block 01 the clear primary entry point by keeping its filled lime CTA, and style Blocks 02–05 with ghost/outline CTAs to signal supporting content.

**File 1:** `AIWorkflowSection.jsx`

**Step 8.1 — Add `isPrimary` to the BLOCKS array.**

In the `BLOCKS` constant, add `isPrimary: true` only to the first block object. Do not add it to Blocks 02–05:

```jsx
const BLOCKS = [
  {
    id: "01",
    isPrimary: true,
    title: "Build inside a real production workflow",
    description:
      "Use Claude Code, Codex, and agent workflows to plan, implement, review, and ship real application features.",
    tags: ["Claude Code", "Codex", "Agent Workflows", "Real Builds"],
    cta: "Start the workflow",
    image: workStation,
    alt: "Developer working at a workstation with AI tools open",
  },
  {
    id: "02",
    // no isPrimary — defaults to undefined (falsy)
    title: "Turn ideas into specs and architecture",
    // ...rest unchanged
  },
  // blocks 03–05: no isPrimary
];
```

**Step 8.2 — Update the `WorkflowBlock` component to apply the ghost class conditionally.**

In the `WorkflowBlock` component, find the `<Link>` element for the CTA. Add the conditional modifier class:

```jsx
<Link
  to="/contact"
  className={`ai-workflow-block__cta${block.isPrimary ? "" : " ai-workflow-block__cta--ghost"}`}
>
  {block.cta}
</Link>
```

No other changes to `WorkflowBlock` are needed. Do not change the `isReversed` logic, motion props, or image component.

**File 2:** `ai-workflow-section.styles.scss`

**Step 8.3 — Add the ghost CTA modifier rule.**

After the closing brace of the existing `.ai-workflow-block__cta` rule block, add a new modifier:

```scss
.ai-workflow-block__cta--ghost {
  background: transparent;
  color: $primary;
  border-color: $primary-border;
  box-shadow: none;

  &:hover,
  &:focus-visible {
    background: $primary-dim;
    border-color: $primary;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      0 0 16px rgba(163, 230, 53, 0.1);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(-1px);
  }
}
```

**Step 8.4 — Verify mobile full-width behaviour.**

Confirm the existing mobile rule `width: 100%; min-height: 3.2rem;` on `__cta` applies to the ghost variant too. Since the ghost rule is a modifier class layered on top of `__cta`, the base mobile width rule automatically applies — no additional mobile override needed.

**Step 8.5 — Verify focus visibility on both variants.**

The existing `__cta:focus-visible` rule:
```scss
&:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.86);
  outline-offset: 3px;
}
```
applies to any element with the `ai-workflow-block__cta` class. Since the ghost variant keeps this class, it inherits the focus outline. Confirm this is still the case after editing.

**Exit criteria:**

- Block 01 CTA renders as a filled lime pill button.
- Blocks 02–05 CTAs render as ghost/outline lime pills with transparent background.
- Hovering a ghost CTA fills background with `$primary-dim` and border brightens.
- On mobile, both variants are full-width.
- Keyboard focus outline is visible on both variants.

---

### Phase 9 — SCSS: Vertical Workflow Connector Line

**Spec reference:** Change 7

**Goal:** Add a faint vertical lime line along the left side of the blocks container to visually connect the five sequential steps.

**File:** `ai-workflow-section.styles.scss`

**Step 9.1 — Add `position: relative` to `.ai-workflow-section__blocks`.**

The blocks container needs `position: relative` so the `::before` pseudo-element is positioned relative to it. Locate the `.ai-workflow-section__blocks` rule. If `position: relative` is not already set, add it. The existing rule in the file only applies `position: relative` to the `__intro` and `__blocks` selectors together:

```scss
&__intro,
&__blocks {
  position: relative;
  z-index: 1;
}
```

This means `position: relative` is already present via the grouped selector. Confirm this and proceed.

**Step 9.2 — Add the connector `::before` pseudo-element.**

Add a new rule for `.ai-workflow-section__blocks::before`. Place it after the grouped `&__intro, &__blocks` rule:

```scss
.ai-workflow-section__blocks {
  &::before {
    content: "";
    position: absolute;
    left: 3.5rem;
    top: 3rem;
    bottom: 3rem;
    width: 1px;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(163, 230, 53, 0.2) 12%,
      rgba(163, 230, 53, 0.2) 88%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 0;
  }
}
```

Alternatively, if the file uses BEM `&__blocks` nesting inside `.ai-workflow-section { }`, write it as:

```scss
&__blocks {
  &::before {
    content: "";
    position: absolute;
    left: 3.5rem;
    top: 3rem;
    bottom: 3rem;
    width: 1px;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(163, 230, 53, 0.2) 12%,
      rgba(163, 230, 53, 0.2) 88%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 0;
  }
}
```

**Step 9.3 — Hide the connector line on mobile.**

Add a rule inside the existing `@media (max-width: 767px)` block:

```scss
@media (max-width: 767px) {
  // existing mobile rules...

  .ai-workflow-section__blocks::before {
    display: none;
  }
}
```

**Step 9.4 — Verify visual alignment.**

At 1440px desktop, confirm:
- The `left: 3.5rem` position threads visually through or near the step number badge area in the card padding. The cards have `padding: 3.5rem` at `@media (min-width: 768px)`, and the badge sits `margin-bottom: 1.25rem` after the top padding. The `left: 3.5rem` from the left edge of the blocks container should roughly align with the badge.
- If the line does not visually connect through the badge area, adjust `left` in increments of `0.25rem`.
- The line must appear behind the cards (`z-index: 0` vs. cards at `z-index: 1`). The cards themselves have `overflow: hidden` which will clip the line inside each card — the line should only be visible in the vertical gap between cards. This is the intended effect.

**Exit criteria:**

- A faint vertical lime gradient line is visible between cards on desktop (≥768px).
- The line is not visible on mobile (<768px).
- The line sits behind all card content and does not interfere with interactions.

---

### Phase 10 — SCSS: Image Aspect Ratio at Mid-Width

**Spec reference:** Change 9

**Goal:** Prevent images from becoming disproportionately tall at 900px–1100px viewport widths.

**File:** `ai-workflow-section.styles.scss`

**Step 10.1 — Add a mid-width breakpoint to the image wrap.**

Locate `.ai-workflow-block__image-wrap`. Add a nested media query after the existing `aspect-ratio: 16 / 10` rule:

```scss
.ai-workflow-block__image-wrap {
  // existing rules...
  aspect-ratio: 16 / 10;

  @media (min-width: 768px) and (max-width: 1100px) {
    aspect-ratio: 16 / 11;
  }
}
```

**Step 10.2 — Verify inner image centering still works.**

The inner `.ai-workflow-block__image` uses `height: 115%; margin-top: -7.5%` to enable parallax travel while keeping the image centered. These values apply to the image relative to the wrap — changing the wrap's aspect ratio does not affect the image's internal centering logic. Verify visually at 1100px that no white space appears above or below the image.

**Exit criteria:**

- At 900px–1100px viewport widths, images are proportionally reasonable relative to the text content alongside them.
- At 1440px and at mobile widths, no visual change from this rule.
- Inner image centering is intact.

---

### Phase 11 — Automated Validation

**Goal:** Confirm the implementation introduces no build errors, lint violations, or test regressions.

**Steps:**

1. Run the Vite build:
   ```bash
   cd client && npm run build
   ```
   Expected: exits with code 0. If it fails, diagnose and fix before continuing.

2. Run ESLint:
   ```bash
   cd client && npm run lint
   ```
   Expected: no new errors in `AIWorkflowSection.jsx` or `ai-workflow-section.styles.scss`. Pre-existing lint errors in other files are acceptable if they existed before this work.

3. Run the client test suite:
   ```bash
   cd client && npx vitest run
   ```
   Expected: all tests pass or failures are pre-existing and unrelated to the modified files. Document any failures by test name and file.

**Handling failures:**

- If build fails on SCSS: check for unclosed braces, missing semicolons, or invalid property values introduced in Phases 2–10.
- If build fails on JSX: check the conditional class expression in the `<Link>` element — ensure template literal syntax is correct.
- If lint fails: check for unused variables, missing `key` props, or prop-types warnings introduced by the `isPrimary` field.
- If tests fail due to this work: the most likely cause is a snapshot test. Check if any snapshot includes the CTA class name and update it.

**Exit criteria:**

- `npm run build` succeeds.
- `npm run lint` produces no new errors in the modified files.
- `npx vitest run` passes or all failures are documented and pre-existing.

---

### Phase 12 — Browser Verification and Screenshots

**Goal:** Visually confirm all nine changes are correct and capture after-state screenshots.

**Setup:**

Start the frontend dev server:
```bash
npm run client
```

Use the project's Playwright setup to capture screenshots. Create a one-off screenshot script in the project root (delete after use):

```js
// screenshot-ai-after.cjs (delete after verification)
const playwright = require('playwright');

(async () => {
  const { chromium } = playwright;
  const browser = await chromium.launch();
  const viewports = [
    { width: 1440, height: 900, name: 'desktop' },
    { width: 1100, height: 768, name: 'desktop-mid' },
    { width: 768,  height: 1024, name: 'tablet' },
    { width: 390,  height: 844,  name: 'mobile' },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    const section = await page.$('.ai-workflow-section');
    if (section) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await section.screenshot({
        path: `_suggestion/ai-workflow-after-${vp.name}.png`,
      });
    }
    await page.close();
  }

  await browser.close();
  console.log('Screenshots saved to _suggestion/');
})();
```

Run:
```bash
node screenshot-ai-after.cjs
```

Then delete the script file.

**Visual checklist — desktop 1440px:**

- [ ] All five card images share a uniform dark/green-tint overlay.
- [ ] No ghost step-number watermarks visible inside any card.
- [ ] Cards visually lift off the page background without hovering.
- [ ] Subheading reads "Scope the work, guide the agents..." — no reference to "the page starts with the promise".
- [ ] Tags are white/neutral across all five blocks — no lime tag text, borders, or backgrounds.
- [ ] A faint vertical lime gradient line is visible between cards on the left side.
- [ ] Block 01 CTA: filled lime pill.
- [ ] Blocks 02–05 CTAs: ghost/outline lime pills with transparent backgrounds.
- [ ] Eyebrow label and step badges are visibly less lime-saturated than the CTA buttons.
- [ ] No stray lime elements compete with the CTA focal point.

**Visual checklist — desktop mid 1100px:**

- [ ] Image proportions are reasonable — images are not disproportionately tall.
- [ ] Connector line is still visible.
- [ ] Ghost CTA buttons are correctly styled.

**Visual checklist — tablet 768px:**

- [ ] Connector line is hidden.
- [ ] Blocks may be single-column (check if the grid collapses at this breakpoint — the existing spec sets `grid-template-columns: 1fr` for mobile and `minmax(0, 1.05fr) minmax(0, 0.95fr)` for `min-width: 768px`). At exactly 768px, the two-column layout activates. Verify it looks clean.
- [ ] No content clips or overflows.

**Visual checklist — mobile 390px:**

- [ ] Connector line is not visible.
- [ ] Block 01 CTA is full-width and lime-filled.
- [ ] Blocks 02–05 CTAs are full-width and ghost-styled.
- [ ] Tags wrap within the card without overflowing.
- [ ] No horizontal page scroll.

**Hover interaction checklist (manual, desktop):**

- [ ] Hovering any card triggers: border brightens to lime, top-edge neon line appears, card background shifts, hover shadow activates.
- [ ] Hovering Block 01 CTA: brightens to `#b7f24a`, lifts `translateY(-2px)`, green glow appears.
- [ ] Hovering Blocks 02–05 CTAs: background fills with `$primary-dim`, border brightens, lifts `translateY(-2px)`.
- [ ] Hovering tags: slight white brightening — no lime fill.
- [ ] Keyboard tab through CTAs: `focus-visible` outline visible on both primary and ghost variants.
- [ ] Image parallax still active on scroll.

**Exit criteria:**

- All four screenshots saved to `_suggestion/`.
- All visual checklist items pass.
- No horizontal scroll at any viewport.
- All interactions checked and functioning.

---

## Suggested Patch Sequence

Execute phases in this order to minimise risk of visual regressions between steps:

1. **Phase 2** — Delete ghost watermarks (SCSS delete, no visual dependency on later changes)
2. **Phase 3** — Card depth (SCSS, standalone change)
3. **Phase 4** — Reduce decorative lime opacity (SCSS, standalone change)
4. **Phase 5** — Mute tags to monochrome (SCSS, standalone change)
5. **Phase 6** — Image overlay (SCSS, verify stacking after)
6. **Phase 7** — Subheading copy (JSX, standalone change)
7. **Phase 8** — CTA hierarchy (JSX + SCSS, interrelated — do both sub-steps before verifying)
8. **Phase 9** — Connector line (SCSS, add last among layout changes)
9. **Phase 10** — Image aspect ratio (SCSS, add last among image changes)
10. **Phase 11** — Build / lint / test
11. **Phase 12** — Screenshots and visual checklist

---

## Risk Register

### Risk: Ghost Watermark `::before` Deletion Removes Wrong Rule

The `.ai-workflow-block` element has both a `::before` (ghost number) and `::after` (top-edge neon line). Deleting the wrong one will break the hover neon effect.

**Mitigation:** Before deleting, read the rule to confirm it contains `content: attr(data-number)`. The `::after` contains `background: linear-gradient(90deg, transparent, $primary, transparent)` — do not delete this.

---

### Risk: Image Overlay `::before` Conflicts with Hover Frame `::after`

The image wrap already uses `::after` for the hover neon inset frame. Adding `::before` for the overlay is safe as long as z-index ordering is correct: overlay at `z-index: 1`, neon frame at `z-index: 2`.

**Mitigation:** Explicitly set `z-index: 1` on `::before` and verify `::after` retains `z-index: 2`. Confirm hover neon frame still appears.

---

### Risk: Ghost CTA Template Literal Syntax Error

The conditional class string `\`ai-workflow-block__cta${block.isPrimary ? "" : " ai-workflow-block__cta--ghost"}\`` must use a template literal (backticks) in JSX. A typo here will cause a build error.

**Mitigation:** Run `npm run build` immediately after Phase 8.2 to catch syntax errors early before proceeding to remaining SCSS phases.

---

### Risk: Connector Line `left` Value Misaligned With Badges

The connector line at `left: 3.5rem` is calculated against the card padding. If cards are scrolled to a position where the line is visible but does not pass through the badge zone, the effect reads as arbitrary.

**Mitigation:** After Phase 9, visually check at 1440px that the line falls near the badges. Adjust `left` in `0.25rem` increments until aligned. Accept a gap between the line and badge — the key is that the line implies connection without needing to overlap the badge.

---

### Risk: `overflow: hidden` on Cards Clips the Connector Line

Each `.ai-workflow-block` has `overflow: hidden`. The connector line exists on the blocks container (parent), not inside each card. The line is only visible in the vertical gap between cards, not inside the cards themselves. This is the intended treatment — but if card margins change, the gaps may be too small to show the line.

**Mitigation:** Verify gap visibility at 1440px. If the line is not visible between cards, check `margin-bottom: 1.75rem` on `.ai-workflow-block` — this is the gap the line appears in. Do not reduce this margin.

---

### Risk: Tag Color Change Reduces Contrast Below AA

The monochrome tag text `rgba(255,255,255,0.55)` over the card surface `#131517` must meet 4.5:1 for small text.

**Mitigation:** `rgba(255,255,255,0.55)` on `#131517` is approximately 5.2:1 — above the AA threshold. If the card background changes significantly lighter than `#131517`, re-verify.

---

### Risk: Mid-Width Aspect Ratio Query Affects Tablet Single-Column Layout

The `@media (min-width: 768px) and (max-width: 1100px)` query overlaps with the point where cards switch from single-column to two-column grid. At 768px, images are in a two-column context and the `16/11` ratio applies. Verify at 768px that this does not create unexpected tall images.

**Mitigation:** If 768px looks odd with `16/11`, narrow the query to `min-width: 900px and max-width: 1100px`.

---

## Rollback Plan

If any phase produces a visual regression or build failure that cannot be quickly resolved:

1. Revert changes to `AIWorkflowSection.jsx` and `ai-workflow-section.styles.scss` only.
2. Do not revert unrelated working tree changes.
3. Use `git diff` to inspect exactly what changed before reverting.
4. Keep all screenshots captured up to that point — they are useful for diagnosis.
5. The two files can each be reverted independently if only one is problematic.

---

## Definition of Done

- [ ] All five card images share a visually cohesive tone (Phase 6 overlay).
- [ ] No ghost step-number watermarks appear in any card background (Phase 2).
- [ ] Cards are perceptibly distinct from the page background at rest (Phase 3).
- [ ] Eyebrow, eyebrow line, and step badges are visibly subordinate to the CTA in lime intensity (Phase 4).
- [ ] Tags are white/neutral across all five blocks — no lime (Phase 5).
- [ ] Subheading starts with "Scope the work..." (Phase 7).
- [ ] Block 01 uses a filled lime CTA; Blocks 02–05 use ghost/outline CTAs (Phase 8).
- [ ] Vertical lime connector line is visible on desktop, hidden on mobile (Phase 9).
- [ ] Image proportions at 900–1100px are balanced with the text content (Phase 10).
- [ ] `cd client && npm run build` succeeds.
- [ ] No new lint errors in the modified files.
- [ ] All existing Framer Motion animations continue to function correctly.
- [ ] All four verification screenshots are saved to `_suggestion/`.
- [ ] All visual and interaction checklist items pass.

---

## Final Pre-Flight Checklist

- Global state: No changes to Redux or TanStack Query.
- New dependencies: None.
- Backend: Not touched.
- SCSS migration: Not performed — stays in SCSS Modules.
- Animations: All existing entrance, parallax, and hover animations preserved.
- Reduced motion: No new animation added; existing Framer Motion animations unchanged.
- Mobile layout: Single-column layout and full-width CTAs preserved; connector line hidden.
- Accessibility: Focus states preserved on both CTA variants; contrast ratios verified.
- Scope creep: Zero changes outside the two target files (plus a temporary screenshot script).
