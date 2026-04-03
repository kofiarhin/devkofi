# Synthesized redesign plan (Agent 4)

## Synthesis approach
I combined the three proposals into one hybrid that balances:
- **Conversion clarity** (Agent 1)
- **Narrative depth** (Agent 2)
- **Operational scanability** (Agent 3)

## Recommended redesign: “Case Study + Command Center”

### 1) Above-the-fold
- Keep existing dark visual identity, but add a stronger value headline and proof chips.
- Two CTAs: `Hire me / Contact` and `Browse case studies`.

### 2) Smart toolbar (sticky)
- Keep current status filter and add search + sort.
- Optional advanced filters in collapsible drawer (stack, platform, year).

### 3) Adaptive content mode toggle
- **Grid mode (default):** visually rich project cards for quick scan.
- **Case-study mode:** narrative summaries with challenge/approach/outcome.

### 4) Main list redesign
- First 1–2 projects are “featured outcomes” cards.
- Remaining items in consistent compact cards with:
  - status
  - concise outcome
  - top 3 tech tags
  - quick actions

### 5) Replace blocking modal with side drawer
- Preserve page context while reviewing details.
- Drawer tabs:
  - Overview
  - Architecture decisions
  - Results/metrics
  - Links

### 6) Bottom conversion band
- Add call-to-action with contact path.
- Optional testimonials or trust badges.

## Proposed implementation phases

### Phase 1 — IA + interaction foundations
- Introduce sticky toolbar, search, sort, and drawer detail view.
- Keep current card visuals with minor cleanup.

### Phase 2 — Content quality
- Add structured fields to project data model:
  - `challenge`
  - `approach`
  - `outcomes`
  - `role`
  - `year`

### Phase 3 — Story + trust
- Add case-study mode, testimonial strip, and bottom CTA.

## Concrete UI recommendations for current codebase
Based on current `Projects.jsx` + `projects.styles.scss` implementation:
1. Keep Framer Motion but reduce heavy hover transforms for dense layouts.
2. Convert `ProjectDetail` overlay modal to right-side panel component.
3. Extend `FILTERS` to include dynamic tags from `features`.
4. Add `input[type=search]` next to filter pills.
5. Improve accessibility labels for image alt text and action buttons.

## Success metrics to validate redesign
- Time-to-first-click on a project.
- Contact CTA click-through rate.
- Percentage of sessions with 2+ project views.
- Scroll depth to lower-page conversion band.
