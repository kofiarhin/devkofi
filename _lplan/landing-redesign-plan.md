# DevKofi Landing Page Redesign — Implementation Plan

## Current State Assessment

| Area | Current | Target |
|---|---|---|
| Hero layout | Left content + right image (column on mobile, row on desktop) | Same structure — already correct |
| Feature section | Bento grid (5 tiles, 2 wide) | Zig-zag rows (3 rows, alternating image/text) |
| Highlights section | Does not exist | Two large cards: Career Growth + Teams |
| Accent color | `#a3e635` (lime) | `#4CAF50`-style green — adjust if needed |
| Styling system | SCSS | Stay SCSS — do not introduce Tailwind |
| Animations | Framer Motion (already wired) | Extend — add scroll fade-ins, hover scale |

---

## Phase 1 — Design Tokens & Global Styles

**File:** `client/src/styles/_tokens.scss` (new) or update existing vars per-file

### Changes
- Confirm / update `$primary` — evaluate `#4CAF50` vs current `#a3e635`. Current lime is warmer; `#4CAF50` is more muted green. Spec says "#4CAF50 style" so keep `#a3e635` unless a direct swap is preferred.
- Verify background gradient token: `#09090b → deep-blue` (e.g. `#050a1a`). Currently solid `#09090b`.
- Border token: `rgba(255,255,255,0.1)` — already in use, document as variable.
- Radius tokens: `16px` / `24px` — add `$radius-md: 16px` and `$radius-lg: 24px`.
- Spacing: section padding `80–120px`, row gap `64–96px`, max-width `1200–1400px`.

**Effort:** ~30 min

---

## Phase 2 — Hero Section Adjustments

**Files:**
- `client/src/components/Landing/Landing.jsx`
- `client/src/components/Landing/landing.styles.scss`

### What to keep
- Two-column split (content left, image right) — already implemented correctly.
- Scroll parallax on image — already implemented with `useTransform`.
- TextScramble component — keep.
- Stats row — keep.
- `btn-primary` and `btn-ghost` buttons — keep.

### What to add / change
1. **AI floating badge** — add a second `floating-tag` for "AI" alongside existing "MERN Stack" tag.
   - Position: bottom-left of image frame (complement the top-left MERN tag).
   - Icon: `Lightning` or `Brain` from phosphor.
2. **Background gradient** — update `#landing` background from solid `$bg-dark` to `linear-gradient(180deg, $bg-dark 0%, #050a1a 100%)`.
3. **Headline size** — spec targets 48–72px. Current `clamp(2.4rem, 7.5vw, 4.5rem)` is ~38–72px. Bump floor: `clamp(3rem, 7.5vw, 4.5rem)`.
4. **Floating badge hover** — add `whileHover={{ scale: 1.05 }}` to `experience-badge`.

**Effort:** ~45 min

---

## Phase 3 — Features Section (Zig-Zag Layout)

**Files:**
- `client/src/components/FeatureSection/FeatureSection.jsx` — rewrite render logic
- `client/src/components/FeatureSection/feature-section.styles.scss` — replace bento styles

### Data model change
Replace the flat `FEATURES` array with 3 zig-zag rows:

```js
const ZIG_ZAG_ROWS = [
  {
    number: "01",
    label: "Mentorship",
    title: "1-to-1 Mentorship that actually ships",
    description: "...",
    cta: { label: "Join Now", url: "/register" },
    image: { src: "/assets/mentorship-workspace.jpg", alt: "Developer workspace" },
    layout: "image-left",   // image left, text right
  },
  {
    number: "02",
    label: "Real Projects",
    title: "Real Projects, not toy apps",
    description: "...",
    cta: { label: "View Projects", url: "/projects" },
    image: { src: "/assets/projects-dashboard.jpg", alt: "Dashboard UI" },
    layout: "image-right",  // image right, text left
  },
  {
    number: "03",
    label: "AI Workflow",
    title: "AI-Powered Workflow done the right way",
    description: "...",
    cta: { label: "See How", url: "/register" },
    image: { src: "/assets/ai-neural.jpg", alt: "Abstract AI visual" },
    layout: "image-left",
  },
]
```

### Component structure
```
<section class="features-zigzag">
  <div class="features-header">   <!-- eyebrow + h2 -->
  {rows.map(row =>
    <div class={`feature-row feature-row--${row.layout}`}>
      <div class="feature-row__image">  <!-- image with hover scale -->
      <div class="feature-row__content">
        <span class="feature-number">01</span>
        <h3 class="feature-title">...</h3>
        <p class="feature-desc">...</p>
        <Link class="feature-cta">Learn More</Link>
  )}
```

### Styling rules
- Row layout: CSS Grid `grid-template-columns: 1fr 1fr`, gap `64–96px`
- `feature-row--image-right`: reverse column order via `grid-column` or `direction`
- Image: `border-radius: 20px`, `border: 1px solid rgba(255,255,255,0.1)`, `box-shadow: subtle`
- Image hover: `transform: scale(1.02)`, `transition: 0.4s ease`
- Feature number: `font-size: 4rem`, `font-weight: 900`, `color: rgba($primary, 0.15)` (large faded watermark style)
- Section padding: `100px 0`
- Row gap: `80px`

### Scroll animation
Wrap each `feature-row` in `<motion.div>` with `whileInView={{ opacity: 1, y: 0 }}`, `initial={{ opacity: 0, y: 40 }}`, `viewport={{ once: true, amount: 0.2 }}`.

### Images
- Three placeholder images needed. Options:
  a. Use real screenshots from the app (preferred — `_screenshots/` folder may have some)
  b. Use high-quality stock images from Unsplash (temporary)
  c. Use abstract SVG/canvas-based placeholders
- Check `_screenshots/` for existing shots before sourcing externally.

**Effort:** ~2 hrs

---

## Phase 4 — Highlights Section (New Component)

**Files to create:**
- `client/src/components/Highlights/Highlights.jsx`
- `client/src/components/Highlights/highlights.styles.scss`

**File to update:**
- `client/src/Pages/Home/Home.jsx` — add `<Highlights />` between `<FeatureBento />` and `<Pricing />`

### Layout
Two large side-by-side cards (50/50 split on desktop, stacked on mobile).

```
<section class="highlights">
  <div class="highlights-grid">
    <div class="highlight-card">
      <div class="card-image">   <!-- top image -->
      <div class="card-body">
        <h3>Career Growth</h3>
        <p>...</p>
        <Link>Get Started →</Link>
    <div class="highlight-card">
      ... Teams card
```

### Card content

**Career Growth card**
- Image: career/growth visual (developer at desk, portfolio, interview setting)
- Title: "Career-Focused from day one"
- Description: "Clean GitHub repos, meaningful commit history, deployed projects, and the confidence to explain technical decisions in interviews."
- CTA: "Get Started" → `/register`

**Teams card**
- Image: team/collaboration visual
- Title: "Built for Teams that need to move fast"
- Description: "Hands-on technical upskilling for teams. Direct access to a senior engineer, tailored sessions around your actual codebase."
- CTA: "Request Team Access" → `/enterprise`

### Styling
- Card: `border-radius: 24px`, `border: 1px solid rgba(255,255,255,0.1)`, `background: rgba(255,255,255,0.02)`
- Card image: `aspect-ratio: 16/9`, `object-fit: cover`, `border-radius: 16px 16px 0 0`
- Card body: `padding: 2rem 2.5rem 2.5rem`
- CTA: inline link with `ArrowRight` icon, color `$primary`, hover underline
- Grid gap: `2rem`

**Effort:** ~1.5 hrs

---

## Phase 5 — Scroll Animations & Interactions

All sections should use `whileInView` (Framer Motion) — already set up in the project.

### Additions
- **Hero:** already animated on mount — no change needed.
- **Feature rows:** `opacity: 0, y: 40` → `opacity: 1, y: 0` on scroll enter.
- **Highlight cards:** staggered `opacity: 0, y: 30` → `opacity: 1, y: 0` with `0.15s` delay between cards.
- **Image hover scale:** apply `whileHover={{ scale: 1.02 }}` with `transition={{ duration: 0.4 }}` on all feature and highlight images.
- **Button hover glow:** already on `btn-primary` via SCSS box-shadow — extend to `btn-ghost` with subtle green glow on hover.

**Effort:** ~45 min (spread across phases 3 & 4)

---

## Implementation Order

```
Phase 1 — Tokens/vars          (30 min)
Phase 2 — Hero tweaks          (45 min)
Phase 3 — Features zig-zag     (2 hrs)
Phase 4 — Highlights section   (1.5 hrs)
Phase 5 — Animations           (45 min)  ← woven into phases 3 & 4
```

Total estimate: **~5 hours**

---

## File Change Summary

| File | Action |
|---|---|
| `client/src/components/Landing/Landing.jsx` | Add AI floating tag, bump headline size |
| `client/src/components/Landing/landing.styles.scss` | Update background gradient, floating tag position |
| `client/src/components/FeatureSection/FeatureSection.jsx` | Rewrite: bento → zig-zag rows |
| `client/src/components/FeatureSection/feature-section.styles.scss` | Replace: bento grid styles → zig-zag layout |
| `client/src/components/Highlights/Highlights.jsx` | New component |
| `client/src/components/Highlights/highlights.styles.scss` | New styles |
| `client/src/Pages/Home/Home.jsx` | Add `<Highlights />` import and placement |
| `client/src/assets/` | Add 3 feature images + 2 highlight images |

---

## Open Questions Before Starting

1. **Images** — Do we use real app screenshots, stock images, or placeholders? Check `_screenshots/` first.
2. **Accent color** — Confirm `#a3e635` stays or switch to closer `#4CAF50`. Visual diff is noticeable — lime vs muted green.
3. **Pricing section** — Stays as-is after Highlights, or also in scope?
4. **Mobile breakpoints** — Zig-zag rows collapse to stacked (image top, text bottom) on `< 768px`. Confirm this order.
