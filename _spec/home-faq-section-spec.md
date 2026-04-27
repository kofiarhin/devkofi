# Home FAQ Section Implementation Spec

## Goal
Add an FAQ section directly under the existing newsletter section on the home page.

Current home flow:

```jsx
<Landing />
<AIWorkflowSection />
<Pricing /> // renders <Newsletter /> at the bottom
```

Target home flow:

```jsx
<Landing />
<AIWorkflowSection />
<Pricing /> // renders <Newsletter /> then <HomeFAQ />
```

The FAQ should answer the highest-friction questions raised by the current page: who DevKofi is for, what the mentorship covers, how AI tools are used, how pricing and application work, and what subscribers receive.

---

## Product Purpose
The page currently positions DevKofi as AI engineering mentorship for developers building production MERN applications with Claude Code, Codex, agent workflows, specs, code review, testing, and deployment discipline.

The FAQ should:

- Reduce uncertainty before users contact, apply, or book a call.
- Reinforce the mentorship positioning instead of sounding like a generic course.
- Clarify that AI is used inside a controlled engineering workflow, not as a replacement for judgment.
- Support newsletter conversion by answering practical questions immediately after signup.
- Keep users in the home page flow before they reach the footer.

---

## Files to Add
Add a dedicated FAQ component near the existing home sections:

```txt
client/src/components/HomeFAQ/HomeFAQ.jsx
client/src/components/HomeFAQ/home-faq.styles.scss
client/src/components/HomeFAQ/home-faq.constants.js
client/test/components/HomeFAQ.test.jsx
```

---

## Files to Update

```txt
client/src/components/Pricing/Pricing.jsx
```

Import and render the FAQ immediately after the newsletter:

```jsx
import HomeFAQ from "../HomeFAQ/HomeFAQ";
```

```jsx
<Newsletter />
<HomeFAQ />
```

Do not move the newsletter unless a later refactor separates `Newsletter` from `Pricing`. Rendering the FAQ from `Pricing` is the smallest implementation because the newsletter currently lives there.

---

## FAQ Content

Use this initial copy in `home-faq.constants.js`:

```js
export const HOME_FAQ_ITEMS = [
  {
    question: "Who is DevKofi mentorship for?",
    answer:
      "DevKofi is for developers, founders, and small teams who want to build real MERN applications with stronger planning, review, testing, and deployment habits. It fits best when you already want to ship a serious portfolio project, startup feature, or production workflow.",
  },
  {
    question: "Do I need to know the MERN stack before joining?",
    answer:
      "You should be comfortable with JavaScript fundamentals and willing to work through React, Node, Express, and MongoDB in real projects. The mentorship is practical and project-based, so it works better for builders who want guided execution instead of passive lessons.",
  },
  {
    question: "How do Claude Code, Codex, and AI agents fit into the program?",
    answer:
      "AI tools are used for planning, implementation support, debugging, reviews, and workflow automation. The focus is not blind code generation. You learn how to scope work, write useful specs, inspect output, catch weak assumptions, and keep engineering judgment in control.",
  },
  {
    question: "What will I actually build?",
    answer:
      "The work centers on production-style MERN features and applications: auth flows, dashboards, API design, data models, UI states, testing, deployment checklists, and review-ready repositories. The exact project depends on your goals and chosen support level.",
  },
  {
    question: "What is the difference between Standard, Pro, and Team support?",
    answer:
      "Standard gives structured weekly guidance and accountability. Pro adds deeper code review, architecture support, priority feedback, and closer implementation help. Team support is for engineering groups that need shared AI-assisted workflows, standards, workshops, and advisory support.",
  },
  {
    question: "Is this a course or direct mentorship?",
    answer:
      "It is mentorship. The home page, pricing, and workflow sections are built around real builds, direct guidance, code review, debugging discipline, and shipping habits rather than a fixed video-only curriculum.",
  },
  {
    question: "How does the application or booking process work?",
    answer:
      "You can start through the pricing call to action, contact page, or Book a Call route. The program uses manual review and activation so the support level matches your current skill, project scope, and availability.",
  },
  {
    question: "What do I get from the newsletter?",
    answer:
      "The newsletter sends concise build notes for developers working with MERN, AI workflows, growth, and practical systems. Expect tactical planning, cleaner code habits, review notes, and shipping guidance without spam.",
  },
];
```

---

## Component Behavior

Use an accessible accordion pattern.

Required behavior:

- Render all questions as buttons.
- Each button toggles one answer panel.
- Allow multiple questions to be open at once unless design review chooses single-open behavior.
- Default the first FAQ open on initial render to make the section feel useful immediately.
- Use local `useState`; do not use Redux or React Context.
- Use stable ids from `useId` or deterministic item ids for `aria-controls` and `aria-labelledby`.
- Button state must set `aria-expanded`.
- Answer panels should be hidden with the `hidden` attribute or conditional rendering when closed.
- Use `@phosphor-icons/react` for the expand/collapse icon because it is already installed.

Recommended component outline:

```jsx
import { useId, useState } from "react";
import { Plus, Minus } from "@phosphor-icons/react";
import { HOME_FAQ_ITEMS } from "./home-faq.constants";
import "./home-faq.styles.scss";

const HomeFAQ = () => {
  const baseId = useId();
  const [openItems, setOpenItems] = useState(() => new Set([0]));

  const toggleItem = (index) => {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section className="home-faq" aria-labelledby="home-faq-title">
      {/* section content */}
    </section>
  );
};

export default HomeFAQ;
```

---

## Layout

Mobile:

- Single column.
- Header text above accordion.
- Full-width FAQ rows.
- Minimum touch target height of 44px for toggles.

Desktop:

- Two-column section inside the existing `pricing-section` width.
- Left column: eyebrow, heading, supporting copy, optional small proof line.
- Right column: accordion list.
- Use CSS Grid, not complex flex percentage math.

Suggested section copy:

```txt
Eyebrow: FAQ
Heading: Questions before you build with AI.
Body: Clear answers on the mentorship, workflow, support levels, and newsletter before you apply or book a call.
Proof line: Built for developers who want practical shipping discipline, not AI shortcuts.
```

---

## Visual Design

Match the current dark pricing/newsletter visual system:

- Background should remain transparent inside `pricing-section`; do not add a new full-page color band.
- Use lime accent from existing nearby styles: `#a3e635`.
- Use off-black and zinc tones already present: `#09090b`, `#fafafa`, `#a1a1aa`, `rgba(255,255,255,0.08)`.
- Avoid large nested cards. FAQ rows should use subtle borders, spacing, and disclosure states.
- Keep border radius at or below 16px for FAQ rows so it does not compete with the newsletter card.
- Use hover and active states:
  - hover: slightly brighter border/background
  - active: `transform: translateY(1px) scale(0.99)`
- Add focus-visible outlines on buttons.
- Respect `prefers-reduced-motion`.

Do not add decorative gradient orbs, emoji, or new illustration assets.

---

## Accessibility

Requirements:

- `section` with `aria-labelledby="home-faq-title"`.
- Main heading should be an `h2` because it is a major home page section.
- Questions should be actual `<button type="button">` elements.
- Each question button:
  - has `aria-expanded`
  - has `aria-controls`
  - references the answer panel id
- Each answer panel:
  - has `id`
  - has `role="region"` only if needed; avoid region noise for every item if the list grows beyond eight questions.
- Keyboard interaction should work with native buttons.
- Icons must be `aria-hidden="true"`.

---

## Performance

- Static FAQ data only; no backend request.
- No global state.
- No heavy scroll listeners.
- If using Framer Motion for panel reveal, keep animation limited to opacity and transform.
- Prefer CSS transitions for this feature because the interaction is small.

---

## Testing

Add `client/test/components/HomeFAQ.test.jsx`.

Test cases:

- Renders section heading and all FAQ questions.
- First answer is visible by default.
- Clicking a closed question opens its answer.
- Clicking an open question closes its answer.
- Buttons expose correct `aria-expanded` values.
- No duplicate question text is needed outside the button label.

Suggested commands:

```bash
npm run test:client
cd client && npm run build
```

---

## Acceptance Criteria

- FAQ appears directly below the newsletter section on the home page.
- FAQ content reflects the actual home page messaging: AI engineering mentorship, MERN builds, Claude Code, Codex, specs, review, testing, deployment, pricing support levels, and newsletter value.
- Accordion is accessible by keyboard and screen reader.
- Mobile layout is single-column with no horizontal scroll.
- Desktop layout is balanced and does not look like another generic card grid.
- Styling follows the existing SCSS system used by Pricing and Newsletter.
- No API calls, secrets, or hard-coded external URLs are introduced.
- Relevant Vitest tests pass.

---

## Design Skill Pre-Flight Matrix

- [x] Global state is not used; local state is enough for accordion UI.
- [x] Mobile collapse is specified as single-column with full-width rows.
- [x] No full-height section is needed.
- [x] No `useEffect` animation is needed.
- [x] Empty, loading, and error states are not applicable because FAQ data is static.
- [x] FAQ rows use borders and spacing instead of another heavy card grid.
- [x] No CPU-heavy perpetual animation is introduced.
