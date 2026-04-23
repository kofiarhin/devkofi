# AI Workflow Section — Implementation Plan

**Spec:** `_spec/ai-workflow-spec.md`  
**Date:** 2026-04-23  
**Branch:** `main`

---

## Overview

Add `<AIWorkflowSection />` between `<Landing />` (Hero) and `<Pricing />` in [client/src/Pages/Home/Home.jsx](client/src/Pages/Home/Home.jsx).

Final render order:
```
<Landing />       ← Hero (existing)
<AIWorkflowSection />   ← NEW
<Pricing />       ← existing
```

---

## Files to Create / Modify

| Action | File |
|--------|------|
| Create | `client/src/components/AIWorkflowSection/AIWorkflowSection.jsx` |
| Create | `client/src/components/AIWorkflowSection/ai-workflow-section.styles.scss` |
| Create | `client/test/components/AIWorkflowSection.test.jsx` |
| Modify | `client/src/Pages/Home/Home.jsx` |

---

## Step 1 — Identify Image Imports

The spec references these image tokens: `workStation`, `codeImage`, `personCoding`, `AiImage`, `defaultImage`.

Check `client/src/constants/constants.js` for existing named exports matching these tokens. Use whatever is exported there. If a token is missing, use the closest available Cloudinary URL already in constants, or a `null` fallback with a descriptive `alt`.

Do **not** add new Cloudinary URLs or hard-code image paths.

---

## Step 2 — Build the Component

**File:** `client/src/components/AIWorkflowSection/AIWorkflowSection.jsx`

### Structure

```jsx
<section aria-labelledby="ai-workflow-title" className="ai-workflow-section">

  {/* Intro */}
  <div className="ai-workflow-section__intro">
    <span className="ai-workflow-section__eyebrow">AI ENGINEERING MENTORSHIP</span>
    <h2 id="ai-workflow-title" className="ai-workflow-section__heading">
      How We Build with Agentic AI Workflows
    </h2>
    <p className="ai-workflow-section__subheading">
      A guided mentorship system using Claude Code, Codex, agents, specs,
      reviews, testing, and deployment.
    </p>
  </div>

  {/* Blocks */}
  <div className="ai-workflow-section__blocks">
    {BLOCKS.map((block, index) => (
      <WorkflowBlock key={block.id} block={block} index={index} />
    ))}
  </div>

</section>
```

### BLOCKS constant (defined in the same file)

```js
const BLOCKS = [
  {
    id: "01",
    title: "AI Coding Mentorship with Agentic Workflows",
    description: "Build alongside me using Claude Code, Codex, and real AI-driven systems.",
    tags: ["Claude Code", "Codex", "Agentic Workflows", "Real Builds"],
    image: workStation,    // from constants
    alt: "Developer working at a workstation with AI tools open",
  },
  {
    id: "02",
    title: "AI-Powered System Design & Spec-Driven Development",
    description: "Break ideas into specs, flows, and scalable architecture.",
    tags: ["System Design", "Specs", "Architecture"],
    image: codeImage,
    alt: "Code editor showing system design specs",
  },
  {
    id: "03",
    title: "Agentic Coding with Claude Code, Codex & VS Code",
    description: "Generate and iterate using real AI coding workflows.",
    tags: ["Claude Code", "Codex CLI", "VS Code"],
    image: personCoding,
    alt: "Person coding with AI assistant in VS Code",
  },
  {
    id: "04",
    title: "Fix AI Hallucinations, Avoid AI Slop",
    description: "Guide and verify AI outputs for production reliability.",
    tags: ["Hallucinations", "Verification", "Prompting"],
    image: AiImage,
    alt: "AI output verification and hallucination control",
  },
  {
    id: "05",
    title: "Ship Full-Stack Apps Fast with AI Automation & Testing",
    description: "Deploy, test, and refine real systems.",
    tags: ["Testing", "Automation", "Deployment"],
    image: defaultImage,
    alt: "Full-stack application deployment pipeline",
  },
];
```

### WorkflowBlock sub-component (same file)

- Receives `block` and `index` (used to alternate layout direction on desktop)
- Renders:
  - Block number badge (`block.id`)
  - `<h3>` for the block title
  - `<p>` for description
  - Tag chips list
  - `<img loading="lazy" src={block.image} alt={block.alt} />` — only render `<img>` if `block.image` is truthy

```jsx
const WorkflowBlock = ({ block, index }) => {
  const isReversed = index % 2 !== 0;
  return (
    <motion.div
      className={`ai-workflow-block ${isReversed ? "ai-workflow-block--reversed" : ""}`}
      variants={blockVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <div className="ai-workflow-block__content">
        <span className="ai-workflow-block__number">{block.id}</span>
        <h3 className="ai-workflow-block__title">{block.title}</h3>
        <p className="ai-workflow-block__description">{block.description}</p>
        <ul className="ai-workflow-block__tags" aria-label="Topics covered">
          {block.tags.map((tag) => (
            <li key={tag} className="ai-workflow-block__tag">{tag}</li>
          ))}
        </ul>
      </div>

      {block.image && (
        <div className="ai-workflow-block__image-wrap">
          <img
            src={block.image}
            alt={block.alt}
            className="ai-workflow-block__image"
            loading="lazy"
          />
        </div>
      )}
    </motion.div>
  );
};
```

### Animation

Use `whileInView` + `viewport={{ once: true }}` — no heavy entrance animations. Keep it consistent with the rest of the site (Framer Motion spring, same `blockVariants` shape as `cardVariants` in Pricing).

```js
const blockVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.6 },
  },
};
```

---

## Step 3 — SCSS Styles

**File:** `client/src/components/AIWorkflowSection/ai-workflow-section.styles.scss`

Follow existing conventions: SCSS variables, BEM-like class naming, dark theme with neon green accents.

```scss
$primary: #a3e635;          // neon green — matches pricing.styles.scss
$bg-dark: #09090b;
$bg-card: #111113;
$border: rgba(255, 255, 255, 0.08);
$text-muted: #71717a;

.ai-workflow-section {
  padding: 6rem 1.25rem 7rem;
  max-width: 1200px;
  margin: 0 auto;

  &__eyebrow {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: $primary;
    margin-bottom: 0.75rem;
  }

  &__heading {
    font-size: clamp(1.75rem, 4vw, 2.75rem);
    font-weight: 700;
    color: #fff;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  &__subheading {
    font-size: 1rem;
    color: $text-muted;
    max-width: 600px;
    margin-bottom: 4rem;
  }
}

.ai-workflow-block {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 2.5rem;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: 1rem;
  margin-bottom: 2rem;

  // Desktop alternating layout
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    align-items: center;

    &--reversed {
      direction: rtl;

      > * {
        direction: ltr;
      }
    }
  }

  &__number {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    color: $primary;
    border: 1px solid $primary;
    border-radius: 0.375rem;
    padding: 0.2rem 0.5rem;
    margin-bottom: 1rem;
    letter-spacing: 0.08em;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.75rem;
    line-height: 1.35;
  }

  &__description {
    font-size: 0.95rem;
    color: $text-muted;
    margin-bottom: 1.25rem;
    line-height: 1.6;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__tag {
    font-size: 0.75rem;
    font-weight: 500;
    color: $primary;
    background: rgba(163, 230, 53, 0.08);
    border: 1px solid rgba(163, 230, 53, 0.2);
    border-radius: 9999px;
    padding: 0.25rem 0.75rem;
  }

  &__image-wrap {
    border-radius: 0.75rem;
    overflow: hidden;
    aspect-ratio: 16 / 9;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}
```

---

## Step 4 — Update Home.jsx

**File:** `client/src/Pages/Home/Home.jsx`

```jsx
import "./home.styles.scss";
import Landing from "../../components/Landing/Landing";
import AIWorkflowSection from "../../components/AIWorkflowSection/AIWorkflowSection";
import Pricing from "../../components/Pricing/Pricing";

const Home = () => {
  return (
    <div id="home">
      <div className="container">
        <Landing />
      </div>

      <AIWorkflowSection />

      <Pricing />
    </div>
  );
};

export default Home;
```

---

## Step 5 — Write Tests

**File:** `client/test/components/AIWorkflowSection.test.jsx`

Follow the Newsletter test pattern: plain `render()` (no QueryClientProvider needed — this component fetches no data).

```jsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import AIWorkflowSection from "../../src/components/AIWorkflowSection/AIWorkflowSection";

describe("AIWorkflowSection", () => {
  it("renders the section", () => {
    render(<AIWorkflowSection />);
    expect(screen.getByRole("region", { name: /agentic ai workflows/i })).toBeInTheDocument();
  });

  it("renders the main h2 heading", () => {
    render(<AIWorkflowSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: /how we build with agentic ai workflows/i })
    ).toBeInTheDocument();
  });

  it("renders all 5 block headings", () => {
    render(<AIWorkflowSection />);
    expect(screen.getByRole("heading", { name: /ai coding mentorship with agentic workflows/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /spec-driven development/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /agentic coding with claude code/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /fix ai hallucinations/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /ship full-stack apps fast/i })).toBeInTheDocument();
  });

  it("renders key technology keywords", () => {
    render(<AIWorkflowSection />);
    expect(screen.getByText(/claude code/i)).toBeInTheDocument();
    expect(screen.getByText(/codex/i)).toBeInTheDocument();
    expect(screen.getByText(/agentic workflows/i)).toBeInTheDocument();
  });

  it("renders images with alt text when image src is available", () => {
    render(<AIWorkflowSection />);
    const images = screen.getAllByRole("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute("alt");
      expect(img.getAttribute("alt")).not.toBe("");
      expect(img).toHaveAttribute("loading", "lazy");
    });
  });
});
```

> **Note on image tests:** If all 5 image constants are `null`/`undefined` in the test environment, the images will not render and the `getAllByRole("img")` assertion should be skipped or the test should use `queryAllByRole`. Adjust based on what constants resolve to.

---

## Implementation Order

1. Inspect `client/src/constants/constants.js` — identify which image tokens exist and their exact export names.
2. Create `AIWorkflowSection.jsx` using the image imports found in step 1.
3. Create `ai-workflow-section.styles.scss`.
4. Update `Home.jsx` to insert `<AIWorkflowSection />`.
5. Create `AIWorkflowSection.test.jsx`.
6. Run `npm run test` from the `client/` directory and confirm all tests pass.
7. Visually verify in browser: mobile (single column, text-first) and desktop (alternating layout).

---

## Acceptance Criteria Checklist

- [ ] `<AIWorkflowSection />` renders between Hero and Pricing on `/`
- [ ] Section has `aria-labelledby` pointing to `h2#ai-workflow-title`
- [ ] All 5 blocks render with `h3` headings
- [ ] All images have non-empty `alt` text and `loading="lazy"`
- [ ] Mobile: single column, text above image
- [ ] Desktop (≥768px): alternating text/image layout
- [ ] Dark theme with neon green accents (`#a3e635`)
- [ ] Rounded card style, subtle borders
- [ ] No heavy animations — `whileInView` with `once: true` only
- [ ] All tests in `AIWorkflowSection.test.jsx` pass
- [ ] No TypeScript / lint errors
- [ ] No mixing of styling systems (SCSS only for this component)
