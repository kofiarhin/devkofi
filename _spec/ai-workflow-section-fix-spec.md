# AIWorkflowSection Elegance Fix Spec

## Context

The AI workflow section is implemented in:

- `client/src/components/AIWorkflowSection/AIWorkflowSection.jsx`
- `client/src/components/AIWorkflowSection/ai-workflow-section.styles.scss`

Reference screenshots captured during analysis:

- `_suggestion/ai-workflow-block-1.png` — Block 01, desktop, 1440px
- `_suggestion/ai-workflow-block-2.png` — Block 02, desktop, 1440px
- `_suggestion/ai-workflow-section-full.png` — Full section, desktop, 1440px

The section presents five sequential AI engineering workflow steps using alternating image/content card blocks with scroll-driven parallax images, Framer Motion entrance animations, lime green tags, step number badges, and full-width lime CTA buttons.

Observed issues from desktop screenshots:

- Image quality and tone is inconsistent across the five blocks; Block 02 shows a raw screen capture, Block 03's photo nearly disappears into the dark card background.
- No visual connector signals that blocks 01–05 are an ordered workflow rather than a feature list.
- Each block renders its step number twice: as a lime badge and as a near-invisible ghost watermark in the background.
- The lime green `#a3e635` accent appears on every element simultaneously — eyebrow, badges, tags, tag borders, CTA buttons, card hover borders, top accent lines, and ambient glow — diluting its focal impact.
- Tags are styled identically to CTA buttons in color weight, creating visual competition; Block 03 overflows tags to a second row.
- The subheading copy opens with "The page starts with the promise" which is context-dependent and confuses mid-scroll readers.
- All five CTA buttons use the same filled lime pill style, treating every block as equally important and obscuring the entry-point hierarchy.
- Cards blend into the page background; `$bg-card: #111113` is nearly identical to the underlying page tone and the border is too subtle to compensate.
- Image aspect ratio `16 / 10` creates awkwardly tall card image areas at 900px–1100px viewport widths.

---

## Goal

Refine the AIWorkflowSection so it reads as a cohesive, sequential workflow rather than a list of features. Improve visual hierarchy, brand restraint, image coherence, and card depth without altering content structure, animations that are working well, or the existing alternating layout.

The fix should be scoped entirely to:
- `AIWorkflowSection.jsx` for copy and minor JSX class additions
- `ai-workflow-section.styles.scss` for all visual changes

---

## Non-Goals

- Do not redesign any section outside of `AIWorkflowSection`.
- Do not change backend APIs or server code.
- Do not migrate from SCSS Modules to Tailwind; project rules prohibit Tailwind in existing components.
- Do not replace Framer Motion or introduce new animation libraries.
- Do not change the alternating image/content block layout.
- Do not replace or swap the images themselves — treat them with CSS only.
- Do not add new npm dependencies.
- Do not change routing, Redux state, or TanStack Query.

---

## Design Direction

- Maintain the existing dark technical aesthetic and lime brand identity.
- Use lime `#a3e635` at full saturation for one element only per block: the primary CTA button.
- All other lime uses should be opacity-reduced to subordinate them to the CTA.
- Use off-black/zinc surfaces (`#131517`) rather than the near-black `#111113` to give cards perceptible depth.
- Keep all existing entrance animations; they are well-executed.
- Do not add new motion beyond a CSS-only workflow connector.
- Animate only `transform` and `opacity` for any new transitions.
- Preserve reduced-motion compatibility (existing Framer Motion animations already use `whileInView` which respects the scheduler, but CSS transitions should be audited).

---

## Proposed Changes

### Change 1 — Consistent Image Overlay Treatment

**Problem:** Images across five blocks have inconsistent brightness, color temperature, and contrast against the dark card background. Block 02's code screenshot is not art-directed, and Block 03's photo merges into the background.

**Solution:** Add a `::before` pseudo-element inside `.ai-workflow-block__image-wrap` that applies a uniform dark-to-green-tint gradient overlay across all images.

**SCSS target:** `.ai-workflow-block__image-wrap`

```scss
.ai-workflow-block__image-wrap {
  // existing rules stay
  position: relative; // ensure pseudo-element stacks correctly

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

**Requirements:**
- The overlay must not obscure image content; keep opacity below 0.25 on the dark channel.
- The `z-index: 1` on the overlay must sit above the image but below the existing `::after` neon frame.
- Do not change actual image files or the `src` attributes.

---

### Change 2 — Remove Ghost Watermark Number

**Problem:** The step number appears twice per block: as a readable lime badge (intentional) and as a `font-size: 11rem` ghost watermark with `rgba(255,255,255,0.022)` opacity (functionally invisible, visually redundant).

**Solution:** Delete the `&::before` pseudo-element rule from `.ai-workflow-block` that renders `content: attr(data-number)`. The `data-number` attribute can remain on the element for now but does not need to be removed.

**SCSS target:** `.ai-workflow-block::before`

Delete this entire rule block:

```scss
// DELETE — ghost watermark number
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

Also delete the mobile override for this rule at `@media (max-width: 767px)`:

```scss
// DELETE — ghost watermark mobile override
&::before {
  right: 0.65rem;
  bottom: -1.25rem;
  font-size: 7rem;
}
```

**Requirements:**
- The `::after` top-edge neon accent line on `.ai-workflow-block` must remain untouched.
- The lime badge (`.ai-workflow-block__number`) must remain unchanged.

---

### Change 3 — Fix Subheading Copy

**Problem:** The subheading opens with "The page starts with the promise." — a sentence that only makes sense in relation to the hero section above it. Mid-scroll readers and anyone linking directly to the section will find it confusing.

**Solution:** Replace the subheading string in `AIWorkflowSection.jsx`.

**JSX target:** The `<p className="ai-workflow-section__subheading">` element.

Current:
```jsx
The page starts with the promise. This is the operating system:
scope the work, guide the agents, verify the output, and deploy with
confidence.
```

Replace with:
```jsx
Scope the work, guide the agents, verify the output, and deploy with
confidence. Five steps, one repeatable system.
```

**Requirements:**
- Do not add inline styles or new class names to the paragraph.
- Keep the element as a `<p>` — no semantic change.

---

### Change 4 — Mute Tags to Monochrome

**Problem:** Tags use full-saturation lime `#a3e635` text, a lime-tinted background, and a lime border — the same color weight as the CTA button. This creates visual competition between tags and the action element, and makes the block feel loud.

**Solution:** Restyle tags to a neutral white-on-dark monochrome treatment so they recede behind the CTA.

**SCSS target:** `.ai-workflow-block__tag`

Replace the current tag color variables with neutral values:

```scss
.ai-workflow-block__tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);        // was: $primary
  background: rgba(255, 255, 255, 0.05);   // was: $primary-dim
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

**Requirements:**
- The tag hover state must not use lime — keep it in the neutral white range.
- Tag list (`__tags`) layout rules are unchanged.
- This change applies to all five blocks uniformly.

---

### Change 5 — Increase Card Surface Depth

**Problem:** `$bg-card: #111113` is visually indistinguishable from the page background at quick glance. The border `rgba(255,255,255,0.07)` is too faint to provide the card "lift" users need to perceive these as discrete content surfaces.

**Solution:** Brighten the card background slightly and add a persistent glass-highlight inset shadow at rest, not only on hover.

**SCSS target:** `.ai-workflow-block` base rule

```scss
.ai-workflow-block {
  background: #131517;                        // was: #111113
  border: 1px solid rgba(255, 255, 255, 0.09); // was: rgba(255,255,255,0.07)
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),  // top-edge glass highlight
    0 2px 16px rgba(0, 0, 0, 0.32);           // ambient depth shadow
  // all other existing rules remain
}
```

Update `$bg-card-hover` on hover accordingly:

```scss
&:hover {
  background: #161a1c;                        // was: #131516
  border-color: $primary-border-hover;        // unchanged
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 0 0 1px rgba(163, 230, 53, 0.06),
    0 8px 40px rgba(0, 0, 0, 0.4),
    0 0 60px $primary-glow;
}
```

**Requirements:**
- The contrast increase must not make the card feel lighter than the section background — keep the delta small.
- Do not change card border-radius, padding, or grid.

---

### Change 6 — CTA Button Hierarchy: Primary vs Ghost

**Problem:** All five blocks use the same filled lime pill CTA button. In a sequential workflow funnel, Block 01 is the entry point; Blocks 02–05 are supporting details. Equal visual weight implies equal importance, which flattens the funnel.

**Solution:** Mark Block 01 as the primary entry (keep existing filled lime style) and Blocks 02–05 as secondary (ghost/outline style). Implement via an optional `isPrimary` boolean on each block's data object.

**JSX target:** `BLOCKS` array and `WorkflowBlock` component in `AIWorkflowSection.jsx`

Add `isPrimary: true` only to Block 01:

```jsx
const BLOCKS = [
  {
    id: "01",
    isPrimary: true,
    title: "Build inside a real production workflow",
    // ...
  },
  {
    id: "02",
    // isPrimary omitted — defaults to false
    // ...
  },
  // blocks 03–05 same pattern
];
```

Pass `isPrimary` to `WorkflowBlock` and add the modifier class to the CTA:

```jsx
const WorkflowBlock = ({ block, index }) => {
  const isReversed = index % 2 !== 0;

  return (
    <motion.div
      className={`ai-workflow-block${isReversed ? " ai-workflow-block--reversed" : ""}`}
      // ...existing motion props
    >
      <div className="ai-workflow-block__content">
        {/* ...existing content */}
        <Link
          to="/contact"
          className={`ai-workflow-block__cta${block.isPrimary ? "" : " ai-workflow-block__cta--ghost"}`}
        >
          {block.cta}
        </Link>
      </div>
      {/* ...image */}
    </motion.div>
  );
};
```

**SCSS target:** Add ghost CTA variant after the existing `__cta` block:

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

**Requirements:**
- The ghost button must have the same `padding`, `border-radius`, `font-size`, and `font-weight` as the primary — only color treatment changes.
- Both variants must maintain visible `:focus-visible` outlines.
- On mobile, both variants must expand to full width (existing `width: 100%` rule applies to both).

---

### Change 7 — Vertical Workflow Connector Line

**Problem:** Five sequentially numbered blocks do not read as a connected workflow because there is no visual thread joining them. The section title promises a workflow; the layout delivers a list.

**Solution:** Add a vertical lime line running along the left edge of the blocks container, fading in and out at the top and bottom, sitting behind the cards.

**SCSS target:** `.ai-workflow-section__blocks`

The blocks container needs `position: relative` (add if not already set) and the connector as a `::before`:

```scss
.ai-workflow-section__blocks {
  position: relative;

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

Hide the connector on mobile where cards are single-column and the left position becomes meaningless:

```scss
@media (max-width: 767px) {
  .ai-workflow-section__blocks::before {
    display: none;
  }
}
```

**Requirements:**
- The connector must sit at `z-index: 0`, behind all card content (`z-index: 1`).
- The `left: 3.5rem` value aligns with the step badge position in the card padding — verify at 1440px that it visually threads through the badge area.
- The line must not interfere with the `overflow: hidden` on any individual card.
- Do not animate the line on scroll — static is sufficient and lower-cost.

---

### Change 8 — Mute Supporting Lime Accent Elements

**Problem:** The lime accent appears at full `#a3e635` saturation on the eyebrow label, eyebrow decorative line, and step number badges — the same weight as the primary CTA. This means every block has five lime focal points competing for the eye.

**Solution:** Reduce opacity on decorative lime elements so the CTA is the only true lime focal point per block.

**SCSS targets:**

```scss
// Eyebrow line — reduce from solid to 50% opacity
.ai-workflow-section__eyebrow-line {
  background: rgba(163, 230, 53, 0.5); // was: $primary (#a3e635)
}

// Eyebrow label — reduce from full to 70%
.ai-workflow-section__eyebrow {
  color: rgba(163, 230, 53, 0.7); // was: $primary
}

// Step number badge — reduce text and border to 75%
.ai-workflow-block__number {
  color: rgba(163, 230, 53, 0.75);          // was: $primary
  border-color: rgba(163, 230, 53, 0.15);   // was: $primary-border (0.2)
  background: rgba(163, 230, 53, 0.06);     // was: $primary-dim (0.08)
}
```

**Requirements:**
- The reduced-opacity values must still pass WCAG AA contrast against the card background (`#131517`) for the eyebrow and badge text. Verify with a contrast checker — `rgba(163,230,53,0.7)` on `#131517` is approximately 6.1:1, which passes AA for small text.
- Do not reduce lime opacity on `.ai-workflow-block__cta` — the CTA must remain full saturation.
- Do not reduce lime opacity on the card hover border or top-edge accent line — these are interaction feedback elements, not decorative.

---

### Change 9 — Image Aspect Ratio at Mid-Width Breakpoint

**Problem:** The image wrap uses `aspect-ratio: 16 / 10` uniformly. At 900px–1100px viewport widths (common laptop sizes), the image column grows tall relative to the text content, creating awkward proportions especially for Block 02's code screenshot.

**Solution:** Add a media query to shorten the image aspect ratio at mid-width desktop viewports.

**SCSS target:** `.ai-workflow-block__image-wrap`

```scss
.ai-workflow-block__image-wrap {
  aspect-ratio: 16 / 10; // existing

  @media (min-width: 768px) and (max-width: 1100px) {
    aspect-ratio: 16 / 11;
  }
}
```

**Requirements:**
- The image itself uses `height: 115%` to allow parallax travel — this must not change. The aspect-ratio shortening applies to the wrap, not the inner image.
- Verify the `margin-top: -7.5%` centering on the inner image still works correctly at the new ratio.

---

## Technical Plan

### Files to Modify

```
client/src/components/AIWorkflowSection/AIWorkflowSection.jsx
client/src/components/AIWorkflowSection/ai-workflow-section.styles.scss
```

No other files need to change. Do not touch `App.jsx`, routing, constants, or any other component.

### JSX Changes Summary (`AIWorkflowSection.jsx`)

1. **Copy update** (Change 3): Replace the `<p className="ai-workflow-section__subheading">` content string.
2. **BLOCKS data** (Change 6): Add `isPrimary: true` to Block 01's object only.
3. **WorkflowBlock component** (Change 6): Accept `block.isPrimary` and conditionally append `ai-workflow-block__cta--ghost` class to the `<Link>`.

No new imports are needed. No hooks, state, or effect changes are required.

### SCSS Changes Summary (`ai-workflow-section.styles.scss`)

| Change | Target selector | Action |
|---|---|---|
| 1 — Image overlay | `.ai-workflow-block__image-wrap::before` | Add new pseudo-element rule |
| 2 — Remove ghost watermark | `.ai-workflow-block::before` | Delete entire rule block |
| 2 — Remove mobile watermark override | `@media (max-width: 767px) .ai-workflow-block::before` | Delete override block |
| 4 — Mute tags | `.ai-workflow-block__tag` | Replace color/bg/border values |
| 4 — Mute tag hover | `.ai-workflow-block__tag:hover` | Replace color/bg/border values |
| 5 — Card depth | `.ai-workflow-block` base | Update `background`, `border-color`, `box-shadow` |
| 5 — Card hover depth | `.ai-workflow-block:hover` | Update `background`, `box-shadow` |
| 6 — Ghost CTA | `.ai-workflow-block__cta--ghost` | Add new modifier rule |
| 7 — Connector line | `.ai-workflow-section__blocks::before` | Add new pseudo-element rule |
| 7 — Connector hide mobile | `@media (max-width: 767px)` | Add display:none override |
| 8 — Eyebrow line | `.ai-workflow-section__eyebrow-line` | Update `background` |
| 8 — Eyebrow label | `.ai-workflow-section__eyebrow` | Update `color` |
| 8 — Step badge | `.ai-workflow-block__number` | Update `color`, `border-color`, `background` |
| 9 — Image ratio | `.ai-workflow-block__image-wrap` | Add mid-width media query |

### Variable Audit

The following SCSS variables defined at the top of the file are affected:

- `$primary-dim: rgba(163, 230, 53, 0.08)` — still used by CTA button; do not remove.
- `$primary-border: rgba(163, 230, 53, 0.2)` — still used by CTA button and ghost CTA; do not remove.
- `$bg-card: #111113` — update value to `#131517` or replace usage inline and update the variable.
- `$bg-card-hover: #131516` — update value to `#161a1c` or replace usage inline.

Update the variable declarations at the top of the SCSS file:

```scss
$bg-card: #131517;       // was: #111113
$bg-card-hover: #161a1c; // was: #131516
```

---

## Accessibility Requirements

- All changes are visual/styling only — no semantic HTML changes are required.
- The ghost CTA (`ai-workflow-block__cta--ghost`) must retain the existing `:focus-visible` outline rule from the base `__cta` rule. Verify that the outline is visible against the card background in both normal and ghost states.
- Reduced-opacity lime values (Changes 4 and 8) must maintain WCAG AA 4.5:1 contrast for text elements. Expected values:
  - `rgba(163,230,53,0.7)` on `#131517` ≈ 6.1:1 — passes AA.
  - `rgba(255,255,255,0.55)` on `rgba(255,255,255,0.05)` over `#131517` ≈ 4.8:1 — passes AA.
- The image overlay pseudo-element (Change 1) must have `pointer-events: none` so it does not block image interaction or keyboard focus on elements above it.
- The connector line (Change 7) is purely decorative and has no semantic meaning — it requires no ARIA.
- No existing `aria-label`, `aria-labelledby`, or role attributes should be altered.

---

## Testing and Verification

### Automated Checks

Run after all changes:

```bash
cd client && npm run build
cd client && npm run lint
cd client && npx vitest run
```

If lint or tests fail on unrelated pre-existing issues, document the exact failures and confirm none originate from the modified files.

### Browser Verification

Start the frontend dev server:

```bash
npm run client
```

Capture screenshots with Playwright at the following viewports using the project's existing Playwright setup:

| Viewport | Width × Height | Purpose |
|---|---|---|
| Desktop large | 1440 × 900 | Primary design target |
| Desktop mid | 1100 × 768 | Tests aspect-ratio fix (Change 9) and connector line alignment |
| Tablet | 768 × 1024 | Tests column collapse and connector line hide |
| Mobile | 390 × 844 | Tests full-width ghost CTA and mobile layout |

Save screenshots to:

```
_suggestion/ai-workflow-after-desktop.png
_suggestion/ai-workflow-after-desktop-mid.png
_suggestion/ai-workflow-after-tablet.png
_suggestion/ai-workflow-after-mobile.png
```

### Manual Visual Checks

At desktop 1440px:

- [ ] All five images have a uniform dark/green-tint overlay — no image looks radically brighter or colder than the others.
- [ ] No ghost watermark numbers appear inside any card.
- [ ] Subheading reads "Scope the work, guide the agents..." not "The page starts with the promise."
- [ ] Tags are white/neutral — no lime green tag text or lime tag borders.
- [ ] Cards visually lift off the page background — the border is perceptible without hovering.
- [ ] Block 01 CTA is a filled lime pill. Blocks 02–05 CTAs are ghost/outline lime pills.
- [ ] A faint vertical line is visible along the left side of the blocks column, fading in/out at the top and bottom.
- [ ] Eyebrow text, eyebrow line, and step badges are visibly less lime-saturated than the CTA buttons.
- [ ] Image proportions at 1100px feel balanced with the text content — images are not disproportionately tall.

At mobile 390px:

- [ ] No vertical connector line is visible.
- [ ] Ghost CTA buttons are full-width and tappable.
- [ ] Tags wrap cleanly; no overflow beyond card edges.
- [ ] All five blocks are readable and no content clips or overlaps.

### Hover and Interaction Checks

- [ ] Hovering any card: top edge neon accent line appears, border brightens, card background shifts — all hover effects remain intact from original.
- [ ] Hovering Block 01 CTA (primary): brightens to `#b7f24a`, lifts `translateY(-2px)`, green glow appears.
- [ ] Hovering Blocks 02–05 CTA (ghost): background fills with `$primary-dim`, border brightens, lifts `translateY(-2px)`.
- [ ] Hovering tags: neutral hover — no lime fill, slight brightening only.
- [ ] Keyboard tabbing through CTAs: `focus-visible` outline is visible on both primary and ghost variants.

---

## Acceptance Criteria

- [ ] All five card images share a visually cohesive tone thanks to the consistent dark/green overlay.
- [ ] No ghost step-number watermarks appear in any card background.
- [ ] Subheading copy starts with "Scope the work..." and contains no reference to "the page starts with the promise."
- [ ] Tags are monochrome (white/neutral) — lime is not used for tag text, background, or border.
- [ ] Cards are perceptibly distinct from the page background without hovering.
- [ ] Block 01 uses a filled lime CTA. Blocks 02–05 use ghost/outline CTAs.
- [ ] A vertical lime connector line is visible on desktop (≥768px) and hidden on mobile (<768px).
- [ ] Lime usage at full saturation is limited to: Block 01 CTA fill, ghost CTA text/border, card top-edge accent on hover, card border on hover. All other lime uses are opacity-reduced.
- [ ] Image aspect ratio at 900px–1100px does not create disproportionately tall image areas.
- [ ] `cd client && npm run build` succeeds with no new errors.
- [ ] No new lint errors are introduced in the modified files.
- [ ] All existing Framer Motion entrance, parallax, and hover animations continue to work correctly.
- [ ] Keyboard navigation and focus states function correctly on both CTA variants.

---

## Implementation Order

1. **Change 2** — Delete ghost watermark SCSS rules (`.ai-workflow-block::before` and its mobile override). Quick win, zero risk.
2. **Change 3** — Update subheading copy in JSX. One string, no style impact.
3. **Change 5** — Update card background and base box-shadow in SCSS. Verify cards lift visually.
4. **Change 8** — Reduce opacity on eyebrow, eyebrow line, and step badge. Verify contrast ratios.
5. **Change 4** — Replace tag color values with monochrome neutrals. Verify CTA now reads as the clear focal point.
6. **Change 1** — Add image overlay pseudo-element. Check all five blocks at desktop and mobile.
7. **Change 6** — Add `isPrimary` to BLOCKS data, update `WorkflowBlock` JSX to conditionally apply ghost class, add `__cta--ghost` SCSS rule. Verify at desktop and mobile.
8. **Change 7** — Add vertical connector line to `.ai-workflow-section__blocks::before`. Align `left` value against badge position. Verify desktop/tablet/mobile.
9. **Change 9** — Add mid-width aspect-ratio media query. Verify at 1100px.
10. **Verification pass** — Capture all required screenshots, run build/lint/tests, check all acceptance criteria.
