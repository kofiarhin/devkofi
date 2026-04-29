# AIWorkflowSection — Design Improvement Suggestions

Screenshots captured: `ai-workflow-block-1.png`, `ai-workflow-block-2.png`, `ai-workflow-section-full.png`

---

## What's Currently Working

- The alternating image/content layout creates good visual rhythm on desktop
- Scroll-driven parallax on images adds depth
- The staggered word-by-word heading animation is polished
- The lime green (`#a3e635`) brand color is distinctive and consistent

---

## Issues Observed

### 1. Inconsistent Image Quality and Treatment
**Block 1** has a professional dark workstation photo. **Block 2** shows a raw VS Code screenshot with terminal visible — looks like a screen capture, not an art-directed image. **Block 3** has a person in a very dark room that nearly disappears into the card background. This inconsistency makes the section feel unfinished.

**Fix:** Apply a consistent image treatment to all five images:
```scss
.ai-workflow-block__image-wrap {
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.18) 0%,
      rgba(163, 230, 53, 0.04) 100%
    );
    border-radius: inherit;
    pointer-events: none;
  }
}
```
This subtle green-tinted dark overlay unifies all images visually regardless of their original color temperature.

---

### 2. No Visual Thread Connecting the 5-Step Workflow
The section is titled "The AI Engineering Workflow I Teach" but the 5 blocks look like a feature list, not a connected workflow. There is no visual indicator that steps 01–05 are sequential.

**Fix:** Add a vertical connecting line on the left edge of the blocks column, running between the step number badges:
```scss
.ai-workflow-section__blocks {
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 3.5rem;            // aligns with the number badges
    top: 2.5rem;
    bottom: 2.5rem;
    width: 1px;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(163, 230, 53, 0.25) 15%,
      rgba(163, 230, 53, 0.25) 85%,
      transparent
    );
    pointer-events: none;
    z-index: 0;
  }
}
```

---

### 3. Redundant Number Treatment (Badge + Ghost Watermark)
Each block renders the step number twice: once as a small lime badge (`01`) and again as a giant ghost watermark in the card background. This redundancy dilutes both effects — neither reads as intentional.

**Fix:** Remove the ghost watermark (`&::before` on `.ai-workflow-block`) and let the badge carry the number identity. The watermark competes with the content text and its `rgba(255,255,255,0.022)` opacity makes it functionally invisible anyway.

```scss
// Remove this rule from .ai-workflow-block
&::before {
  content: attr(data-number); // DELETE
  ...
}
```

---

### 4. The Lime Green Is Overused and Feels Harsh
`#a3e635` appears on: eyebrow text, eyebrow line, step badges, tag backgrounds, tag borders, tag text, CTA buttons, card hover borders, card top accent lines, the ambient glow — every element. The color loses its impact when it's everywhere.

**Fix:** Reserve the full-saturation lime exclusively for the CTA button. Use the dimmed/muted versions for everything else:

| Element | Current | Suggested |
|---|---|---|
| Eyebrow text | `#a3e635` | `rgba(163,230,53,0.7)` |
| Eyebrow line | `#a3e635` solid | `rgba(163,230,53,0.5)` |
| Step badge text | `#a3e635` | `rgba(163,230,53,0.75)` |
| Tag text | `#a3e635` | `rgba(255,255,255,0.6)` |
| Tag border | `rgba(163,230,53,0.2)` | `rgba(255,255,255,0.1)` |
| Tag background | `rgba(163,230,53,0.08)` | `rgba(255,255,255,0.04)` |
| CTA button | `#a3e635` | `#a3e635` (keep — only full accent here) |

This creates a clear visual hierarchy: tags and labels recede; the CTA commands attention.

---

### 5. Tags Create Visual Noise Without Guiding the User
Each block has 4–5 tags that are all styled identically. They sit in a row and read like a keyword cloud rather than scannable signals. Block 03 even overflows to a second tag row.

**Fix options (pick one):**
- **Cap at 3 tags per block** and remove the least distinctive ones
- **Make tags monochrome** (white text, no green) so they don't compete with the CTA
- **Replace tags with a single "You'll learn:" sentence** under the description for cleaner copy hierarchy

---

### 6. Subheading Copy Feels Context-Dependent
> "The page starts with the promise. This is the operating system: scope the work, guide the agents, verify the output, and deploy with confidence."

This reads as though it references content above it ("the page starts with the promise"), which is confusing for someone landing mid-scroll or skimming. The second sentence is actually strong — the first sentence should be cut.

**Suggested copy:**
> "Scope the work, guide the agents, verify the output, deploy with confidence. Five steps, one repeatable system."

---

### 7. CTA Buttons Are Identical Across All 5 Blocks
Every block uses the same filled lime pill button with different label text. This makes every block feel equally important — there's no hierarchy. In a real funnel, block 01 is the entry point; the others are supporting context.

**Fix:** Style block 01's CTA as the primary action (current style, `background: $primary`) and blocks 02–05 as ghost/outline CTAs:
```scss
.ai-workflow-block--secondary .ai-workflow-block__cta {
  background: transparent;
  color: $primary;
  border-color: $primary-border;

  &:hover {
    background: $primary-dim;
    border-color: $primary;
  }
}
```
Add `ai-workflow-block--secondary` class to blocks 2–5 in the JSX data.

---

### 8. Card Background Blends Into Page Background
`$bg-card: #111113` is nearly identical to a typical dark page background. The cards don't visually "lift" off the page. The border (`rgba(255,255,255,0.07)`) is too subtle to compensate.

**Fix:** Increase card contrast slightly and add a soft inset highlight on the top edge at rest (not just on hover):
```scss
.ai-workflow-block {
  background: #131517;           // slightly lighter
  border-color: rgba(255,255,255,0.09);  // more visible border
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.04),   // top edge glass highlight
    0 2px 12px rgba(0,0,0,0.3);             // base shadow for depth
}
```

---

### 9. Image Aspect Ratio Creates Tall Cards on Small Desktop Widths
`aspect-ratio: 16 / 10` on the image wrap is fine at 1440px, but at ~900px–1100px the images become tall and awkward relative to the text content. Block 02's code screenshot is particularly stretched.

**Fix:**
```scss
.ai-workflow-block__image-wrap {
  aspect-ratio: 16 / 10;

  @media (min-width: 768px) and (max-width: 1100px) {
    aspect-ratio: 16 / 11;
  }
}
```

---

## Priority Order

| Priority | Issue | Effort |
|---|---|---|
| 1 | Consistent image overlay treatment | Low — pure CSS |
| 2 | Remove ghost watermark number | Low — delete CSS |
| 3 | Fix subheading copy | Low — string change |
| 4 | Mute tags (monochrome or remove green) | Low — SCSS vars |
| 5 | Card background depth | Low — SCSS tweak |
| 6 | CTA button hierarchy (primary vs ghost) | Medium — add class + SCSS |
| 7 | Vertical workflow connector line | Medium — SCSS |
| 8 | Lime color usage audit | Medium — token sweep |
| 9 | Image aspect ratio at mid-widths | Low — media query |
