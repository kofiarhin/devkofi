# AI Workflow Section Implementation Spec

## Goal
Add a new AI Workflow Feature Section between the Hero and Pricing sections.

Final layout:
<Hero />
<AIWorkflowSection />
<Pricing />

---

## Purpose
Productize mentorship around:
- Claude Code, Codex, VS Code
- Agentic workflows & multi-agent systems
- Spec-driven development
- Code review & debugging
- AI hallucination control
- Testing, automation, deployment, refactoring

Tone: Mentorship (not course)

---

## Files to Add
client/src/components/AIWorkflowSection/AIWorkflowSection.jsx  
client/src/components/AIWorkflowSection/ai-workflow-section.styles.scss  
client/test/components/AIWorkflowSection.test.jsx  

---

## Homepage Update
Insert:
<AIWorkflowSection />

between Hero and Pricing.

---

## Section Content

### Intro
AI ENGINEERING MENTORSHIP  
How We Build with Agentic AI Workflows  
A guided mentorship system using Claude Code, Codex, agents, specs, reviews, testing, and deployment.

---

## Blocks

### 01
AI Coding Mentorship with Agentic Workflows  
Build alongside me using Claude Code, Codex, and real AI-driven systems.  
Tags: Claude Code, Codex, Agentic Workflows, Real Builds  
Image: workStation  

### 02
AI-Powered System Design & Spec-Driven Development  
Break ideas into specs, flows, and scalable architecture.  
Tags: System Design, Specs, Architecture  
Image: codeImage  

### 03
Agentic Coding with Claude Code, Codex & VS Code  
Generate and iterate using real AI coding workflows.  
Tags: Claude Code, Codex CLI, VS Code  
Image: personCoding  

### 04
Fix AI Hallucinations, Avoid AI Slop  
Guide and verify AI outputs for production reliability.  
Tags: Hallucinations, Verification, Prompting  
Image: AiImage  

### 05
Ship Full-Stack Apps Fast with AI Automation & Testing  
Deploy, test, and refine real systems.  
Tags: Testing, Automation, Deployment  
Image: defaultImage  

---

## Layout

Mobile-first:
- Single column
- Text first, image second

Desktop:
- Alternating layout

---

## Styling
Dark theme, neon green accents, rounded cards, subtle borders.

---

## Accessibility
- section + aria-labelledby
- h2 for main title, h3 for blocks
- alt text on all images

---

## Performance
- lazy loading images
- no heavy animations

---

## Tests
Verify:
- section renders
- all headings render
- images render
- key keywords exist

---

## Acceptance Criteria
- Section between Hero and Pricing
- Mobile optimized
- Alternating desktop layout
- Uses provided images
- Tests pass
