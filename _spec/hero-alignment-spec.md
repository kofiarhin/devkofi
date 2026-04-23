# Hero Section Text Alignment Spec

## Goal
Update the Hero section text to align with the AI Workflow section.

- Keep all animations and logic intact
- Only update text content
- Ensure messaging flows into the AI Workflow section

---

## Files to Update

client/src/components/Landing/Landing.jsx  
client/src/components/Landing/AnimatedPhrase.jsx  
client/src/components/Landing/LandingBase.jsx  

---

## 1. Landing.jsx

### Update Hero Headline

Replace existing HeroHeadline with:

```jsx
const HeroHeadline = () => (
  <span className="landing-animated-heading__overlay">
    <span className="landing-animated-heading__line">Build Full-Stack Apps</span>
    <span className="landing-animated-heading__line">
      with <AnimatedPhrase />
    </span>
    <span className="landing-animated-heading__line">Agentic AI Workflows</span>
  </span>
);
```

### Update Accessibility Label

Replace:

```js
headingElement.setAttribute('aria-label', 'Mentoring MERN Devs with AI tools into AI Engineers');
```

With:

```js
headingElement.setAttribute(
  'aria-label',
  'Build Full-Stack Apps with Agentic AI Workflows'
);
```

---

## 2. AnimatedPhrase.jsx

### Update Rotating Phrases

Replace phrases array with:

```js
const PHRASES = [
  'Claude Code',
  'Codex',
  'AI Agents',
  'Code Review',
  'Automation',
];
```

---

## 3. LandingBase.jsx

### Update Badge Text

Replace:

```txt
AI-Powered MERN Mentorship
```

With:

```txt
Agentic AI Coding Mentorship
```

---

### Update Rotating Phrases Constant

```js
const HERO_ROTATING_PHRASES = [
  "Claude Code",
  "Codex",
  "AI Agents",
  "Code Review",
  "Automation",
];
```

---

### Update Main Hero Title

```jsx
<motion.h1 className="hero-title" variants={itemVariants}>
  <span className="hero-title-line">Build Full-Stack Apps</span>
  <span className="hero-title-line hero-title-line--rotating">
    <span className="hero-title-prefix">with</span>
    <HeroRotatingText />
  </span>
  <span className="hero-title-line hero-title-line--accent">
    Agentic AI Workflows
  </span>
</motion.h1>
```

---

### Update Hero Description

```jsx
<motion.p className="hero-description" variants={itemVariants}>
  I mentor developers to ship real MERN apps by layering Claude Code,
  Codex, AI agents, code review, testing, automation, and deployment
  into one practical engineering workflow.
</motion.p>
```

---

### Update Secondary CTA

Replace:

```txt
View Projects
```

With:

```txt
See Workflow
```

---

### Update Stats Section

```js
const STATS = [
  { icon: StackSimple, value: "12+", label: "Production apps shipped" },
  { icon: Star, value: "5+", label: "Years experience" },
  { icon: Users, value: "AI", label: "Workflow expertise" },
];
```

---

## Expected Outcome

- Hero messaging aligns with AI Workflow section
- Clear flow: Hero → Workflow → Pricing
- No changes to animation or layout
- Improved SEO targeting for AI workflows and mentorship

---

## Acceptance Criteria

- All updated text renders correctly
- Animations still function
- No layout breakage
- Build passes
- Tests pass

Run:

```bash
npm run build
npm test
```
