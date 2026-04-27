# Home FAQ Section Implementation Plan

**Spec:** `_spec/home-faq-section-spec.md`  
**Date:** 2026-04-27  
**Scope:** Frontend-only home page FAQ section under the existing newsletter section.

---

## Overview

Implement a dedicated `HomeFAQ` accordion section for the home page. The current newsletter is rendered from `client/src/components/Pricing/Pricing.jsx`, so the smallest scoped implementation is to render `<HomeFAQ />` immediately after `<Newsletter />` inside `Pricing`.

Target render order inside the home page flow:

```jsx
<Landing />
<AIWorkflowSection />
<Pricing>
  {/* pricing cards */}
  <Newsletter />
  <HomeFAQ />
</Pricing>
```

The FAQ is static content. It should not introduce API calls, Redux state, React Context, new routes, new external assets, or broad page restructuring.

---

## Success Criteria

- FAQ appears directly below the newsletter section on the home page.
- FAQ copy matches the spec and reinforces DevKofi's AI engineering mentorship positioning.
- Accordion uses semantic buttons, `aria-expanded`, and controlled answer panels.
- First FAQ is open by default.
- Multiple FAQ items can be open at once.
- Styling matches the existing dark pricing/newsletter system.
- Layout is single-column on mobile and a balanced two-column grid on desktop.
- Tests cover rendering, default state, toggle behavior, and ARIA state.
- `npm run test:client` and `cd client && npm run build` pass.

---

## Files To Create Or Modify

| Action | File |
| --- | --- |
| Create | `client/src/components/HomeFAQ/HomeFAQ.jsx` |
| Create | `client/src/components/HomeFAQ/home-faq.constants.js` |
| Create | `client/src/components/HomeFAQ/home-faq.styles.scss` |
| Create | `client/test/components/HomeFAQ.test.jsx` |
| Modify | `client/src/components/Pricing/Pricing.jsx` |

---

## Phase 1: Current-State Check

Confirm the exact integration point before editing.

1. Open `client/src/components/Pricing/Pricing.jsx`.
2. Verify `Newsletter` is imported from `../Newsletter/Newsletter`.
3. Verify the component currently renders `<Newsletter />` as the last child in `pricing-section`.
4. Confirm `@phosphor-icons/react` is already installed in `client/package.json`.
5. Confirm the repo is using SCSS for `Pricing` and `Newsletter`, so the new FAQ should also use SCSS rather than introducing a different styling system for this feature.

Expected result: no dependency installation is required.

---

## Phase 2: Add Static FAQ Content

Create `client/src/components/HomeFAQ/home-faq.constants.js`.

1. Export `HOME_FAQ_ITEMS`.
2. Use the eight FAQ items from the spec exactly unless content polish is needed for grammar.
3. Keep content as plain strings, not JSX, so tests and future edits remain simple.
4. Do not include emoji, external URLs, generated names, or unverifiable claims.

Implementation shape:

```js
export const HOME_FAQ_ITEMS = [
  {
    question: "Who is DevKofi mentorship for?",
    answer: "DevKofi is for developers...",
  },
];
```

---

## Phase 3: Build The FAQ Component

Create `client/src/components/HomeFAQ/HomeFAQ.jsx`.

### Component Responsibilities

- Render the section shell, intro copy, and accordion.
- Own only local accordion state.
- Import static content from `home-faq.constants.js`.
- Import styles from `home-faq.styles.scss`.
- Use `Plus` and `Minus` from `@phosphor-icons/react`.

### State Model

Use local `useState` with an array of open indexes instead of a `Set`. Arrays are easier to test and avoid accidental mutation concerns.

```jsx
const [openItems, setOpenItems] = useState([0]);
```

Toggle logic:

```jsx
const toggleItem = (index) => {
  setOpenItems((current) =>
    current.includes(index)
      ? current.filter((item) => item !== index)
      : [...current, index],
  );
};
```

### Markup Requirements

Use this semantic structure:

```jsx
<section className="home-faq" aria-labelledby="home-faq-title">
  <div className="home-faq__layout">
    <div className="home-faq__intro">
      <p className="home-faq__eyebrow">FAQ</p>
      <h2 id="home-faq-title" className="home-faq__title">
        Questions before you build with AI.
      </h2>
      <p className="home-faq__description">
        Clear answers on the mentorship, workflow, support levels, and newsletter before you apply or book a call.
      </p>
      <p className="home-faq__proof">
        Built for developers who want practical shipping discipline, not AI shortcuts.
      </p>
    </div>

    <div className="home-faq__list">
      {/* FAQ rows */}
    </div>
  </div>
</section>
```

For each item:

- `button type="button"`
- `aria-expanded={isOpen}`
- `aria-controls={panelId}`
- `id={buttonId}`
- icon with `aria-hidden="true"`
- answer panel with `id={panelId}` and `aria-labelledby={buttonId}`
- closed answer should use `hidden`

Avoid `role="region"` unless the implementation later reduces the number of items or there is a clear accessibility reason. Eight regions can create noisy screen reader landmarks.

---

## Phase 4: Style The Section

Create `client/src/components/HomeFAQ/home-faq.styles.scss`.

### Design Direction

Match `Pricing` and `Newsletter`:

- Accent: `#a3e635`
- Main text: `#fafafa`
- Muted text: `#a1a1aa`
- Borders: `rgba(255, 255, 255, 0.08)`
- Surfaces: transparent or low-opacity white overlays
- No new illustration, decorative orbs, emoji, or external images

### Layout

Mobile:

- `margin-top: clamp(2.5rem, 5vw, 5rem)`
- single column
- intro first, accordion second
- no horizontal overflow
- buttons at least `44px` high

Desktop:

- `display: grid`
- use `grid-template-columns: minmax(0, 0.78fr) minmax(0, 1.22fr)` or similar
- align start
- preserve the existing `pricing-section` width by not adding a new outer max-width

### Interaction Styling

FAQ row:

- subtle border
- `border-radius: 16px` or less
- background changes slightly when open
- hover brightens border/background
- active uses `transform: translateY(1px) scale(0.99)`
- focus-visible has a clear lime or white outline

Answer:

- readable line height around `1.7`
- max-width suitable for text scanning
- closed panels use `hidden`, not height animation that conflicts with accessibility

Reduced motion:

```scss
@media (prefers-reduced-motion: reduce) {
  .home-faq__button,
  .home-faq__item,
  .home-faq__icon {
    transition: none;
  }
}
```

---

## Phase 5: Integrate With Pricing

Modify `client/src/components/Pricing/Pricing.jsx`.

1. Add the import:

```jsx
import HomeFAQ from "../HomeFAQ/HomeFAQ";
```

2. Render directly after newsletter:

```jsx
<Newsletter />
<HomeFAQ />
```

3. Do not move `Newsletter`.
4. Do not change pricing data loading, pricing card rendering, or existing newsletter behavior.
5. Keep import order consistent with nearby component imports.

---

## Phase 6: Add Frontend Tests

Create `client/test/components/HomeFAQ.test.jsx`.

### Test Setup

Use Vitest and React Testing Library. Match existing test conventions in `client/test/` or nearby client tests.

### Required Tests

1. Renders the FAQ section heading.
2. Renders every question from `HOME_FAQ_ITEMS`.
3. First FAQ answer is visible by default.
4. A closed FAQ opens when clicked.
5. An open FAQ closes when clicked.
6. Buttons update `aria-expanded` correctly.

### Testing Notes

- Query question buttons with `screen.getByRole("button", { name: /.../i })`.
- Use `userEvent.click`.
- Use `toHaveAttribute("aria-expanded", "true")` and `"false"`.
- For hidden panels, prefer assertions compatible with the `hidden` attribute.
- Import `HOME_FAQ_ITEMS` into the test so the content count stays aligned with constants.

---

## Phase 7: Validation

Run targeted validation after implementation.

```bash
npm run test:client
cd client && npm run build
```

If tests fail:

1. Fix component/test issues first.
2. Re-run `npm run test:client`.
3. Re-run the client build after tests pass.

Manual UI check:

- Load the home page.
- Scroll to pricing, then newsletter, then FAQ.
- Confirm spacing between newsletter and FAQ feels intentional.
- Confirm FAQ rows do not look like nested cards inside the newsletter surface.
- Confirm mobile layout stacks cleanly.
- Confirm keyboard tab order reaches every question button.
- Confirm toggling does not shift the whole page in a jarring way.

---

## Risks And Mitigations

| Risk | Mitigation |
| --- | --- |
| FAQ placement is coupled to `Pricing` because newsletter currently lives there. | Keep the integration minimal now; future refactor can move both sections into `Home.jsx`. |
| Accordion state using `Set` can be awkward to test or accidentally mutated. | Use an array of open indexes. |
| Styling may compete with the large newsletter card. | Use row-based borders and transparent surfaces instead of another heavy card shell. |
| Too many ARIA regions can create screen reader noise. | Do not add `role="region"` to every answer panel by default. |
| Existing unrelated worktree changes may exist. | Only touch the five files listed in this plan. |

---

## Implementation Checklist

- [ ] Create `home-faq.constants.js` with `HOME_FAQ_ITEMS`.
- [ ] Create `HomeFAQ.jsx` with local accordion state.
- [ ] Add accessible ids, `aria-expanded`, and `aria-controls`.
- [ ] Add Phosphor expand/collapse icons.
- [ ] Create `home-faq.styles.scss` using the pricing/newsletter visual language.
- [ ] Import and render `HomeFAQ` after `<Newsletter />` in `Pricing.jsx`.
- [ ] Add `HomeFAQ.test.jsx`.
- [ ] Run `npm run test:client`.
- [ ] Run `cd client && npm run build`.
- [ ] Perform manual responsive and keyboard checks.

---

## Design Skill Pre-Flight Matrix

- [x] Global state is avoided; accordion state is local.
- [x] Mobile layout is guaranteed to collapse to one column.
- [x] No full-height section is introduced.
- [x] No `useEffect` animation is introduced.
- [x] Empty, loading, and error states are not applicable because content is static.
- [x] FAQ uses row grouping and spacing instead of a generic card grid.
- [x] No CPU-heavy animation or perpetual motion is introduced.
- [x] Icons use installed `@phosphor-icons/react`.
- [x] Styling remains within the existing SCSS pattern for this page area.
