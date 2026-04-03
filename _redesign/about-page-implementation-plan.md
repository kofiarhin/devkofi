# About Page Redesign — Implementation Plan

Owner: DevKofi  
Status: Ready for execution  
Scope: `client/src/Pages/About/About.jsx`, `client/src/Pages/About/about.styles.scss`, optional reusable section components.

## Goals
- Improve About-page scanability and readability on first pass.
- Add trust and conversion modules without bloating page length.
- Preserve the current brand direction (dark theme + lime accent).
- Ship incrementally with measurable outcomes.

## Non-Goals
- No CMS migration in this phase.
- No redesign of unrelated pages.
- No major routing/content architecture changes outside About page.

## Delivery Phases

## Phase 0 — Baseline & Prep (0.5 day)
### Tasks
1. Capture current metrics baseline:
   - About page CTA click-through rate (if tracked).
   - Scroll depth and average session time for About page.
2. Capture visual baseline screenshot of current About page.
3. Create branch-level checklist for rollout and QA.

### Exit Criteria
- Baseline metrics are documented.
- Current-state screenshot and checklist are saved in `_redesign/`.

---

## Phase 1 — Structural Refactor + Hero Conversion Layer (1–1.5 days)
### Tasks
1. Refactor `About.jsx` into section blocks:
   - Hero
   - Credibility cards
   - Philosophy
   - Process timeline
   - Outcomes
   - Final CTA
2. Add two clear CTA buttons in hero (`Book a Mentorship Call`, `View Program`).
3. Add trust micro-row (mentees/projects/experience).
4. Keep existing copy as fallback props/data until final copy approved.

### Technical Notes
- Prefer small presentational components under `client/src/components/About/`:
  - `AboutHero.jsx`
  - `AboutCredibilityCards.jsx`
  - `AboutProcessTimeline.jsx`
  - `AboutOutcomes.jsx`
  - `AboutFinalCta.jsx`
- Keep page-level orchestration in `About.jsx`.

### Exit Criteria
- New sectionized layout renders correctly in desktop + mobile breakpoints.
- Hero CTAs are visible above the fold.
- No regressions in existing animation behavior.

---

## Phase 2 — Visual System Upgrade (1 day)
### Tasks
1. Tokenize styles in `about.styles.scss`:
   - Surface/background/border/accent tokens.
   - Spacing scale and max-width rules.
2. Introduce card styles for credibility/outcomes modules.
3. Tighten typography hierarchy (H1/H2/body scales).
4. Add restrained motion/stagger with reduced-motion fallback.

### Exit Criteria
- Section spacing and typography are consistent.
- Card system is reusable and visually coherent.
- `prefers-reduced-motion` is respected.

---

## Phase 3 — Content Finalization + Accessibility (0.5–1 day)
### Tasks
1. Finalize condensed copy for each section.
2. Improve image alt text semantics.
3. Validate heading order and landmark usage.
4. Ensure contrast and readable line length on mobile.

### Exit Criteria
- Copy approved and implemented.
- Accessibility checks pass for headings/contrast/alt text.
- Mobile readability confirmed.

---

## Phase 4 — Tracking + QA + Release (0.5 day)
### Tasks
1. Add analytics events:
   - Hero primary CTA click
   - Hero secondary CTA click
   - Final CTA click
2. Run QA checklist (functional + responsive + accessibility smoke tests).
3. Deploy and monitor first 7–14 days.

### Exit Criteria
- Events fire correctly in analytics.
- No major visual regressions after deploy.
- Initial KPI movement reported.

---

## Work Breakdown (Suggested Tickets)
1. `ABOUT-01`: Sectionize About page component structure.
2. `ABOUT-02`: Implement hero CTA + trust row.
3. `ABOUT-03`: Implement credibility cards + outcomes module.
4. `ABOUT-04`: Implement process timeline.
5. `ABOUT-05`: SCSS tokenization + typography/spacing refresh.
6. `ABOUT-06`: Accessibility pass (headings, contrast, alt text).
7. `ABOUT-07`: Analytics event instrumentation.
8. `ABOUT-08`: QA + release + KPI report.

## QA Checklist
- [ ] Desktop layout at 1280px+.
- [ ] Tablet layout around 768–1024px.
- [ ] Mobile layout at 360–430px.
- [ ] Hero CTA buttons are keyboard accessible and visible.
- [ ] Heading hierarchy starts at one H1 and descends correctly.
- [ ] All interactive elements have focus styles.
- [ ] Animations reduce/disable under reduced-motion settings.
- [ ] Image and icon alt/aria labels are meaningful.

## KPI Targets (First Iteration)
- +20% About-page CTA click-through.
- +10% scroll completion to final CTA section.
- +10% mentorship inquiry starts from About page.

## Risks & Mitigations
- **Risk:** Over-animating reduces clarity.
  - **Mitigation:** Keep animation subtle and short; prioritize readability.
- **Risk:** Longer page lowers engagement.
  - **Mitigation:** Use compact modules with strong headings and scan cues.
- **Risk:** Copy approval delays implementation.
  - **Mitigation:** Ship with placeholder-approved copy and iterate quickly.

## Definition of Done
- New About page structure and styles merged.
- Accessibility and responsive checks completed.
- CTA tracking live.
- KPI baseline vs post-release report shared.
