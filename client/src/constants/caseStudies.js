export const caseStudies = [
  {
    id: "leadradar",
    name: "LeadRadar",
    category: "Sales workflow system",
    status: "In production development",
    problem:
      "Founder-led teams engage on LinkedIn but struggle to turn public engagement into a reliable, ranked prospect list without hours of manual work.",
    workflow:
      "Engagement capture → enrichment → qualification → ranking → human review → outreach preparation.",
    safeguards: [
      "Structured prospect schemas",
      "Validation before write-back",
      "Human review queue before outreach",
      "Clear separation of AI suggestions and approved actions",
    ],
    stack: "TypeScript, React, Vite, Express, MongoDB, shared schemas, provider adapters",
    result:
      "A repeatable prospecting system designed for measurable pipeline hygiene instead of one-off scraping scripts.",
    links: {
      repo: "https://github.com/kofiarhin/leadradar",
    },
  },
  {
    id: "governed-coding-workflow",
    name: "Governed AI coding workflow",
    category: "Engineering system",
    status: "Reusable infrastructure",
    problem:
      "AI coding agents often claim completion without scoped plans, tests, or verification — creating noisy, unreviewable changes.",
    workflow:
      "Plain-language request → clarification → specification → approval → implementation → tests → verification → handoff.",
    safeguards: [
      "Scoped task boundaries",
      "Approval gates before implementation",
      "Evidence-backed verification",
      "Shared rules across agent runtimes",
    ],
    stack: "AI Dev Workspace, Codex Workflow Kit, Universal Agent System patterns",
    result:
      "A controlled delivery system where agents cannot treat unverified output as done.",
    links: {
      repo: "https://github.com/kofiarhin/ai-dev-workspace",
    },
  },
];
