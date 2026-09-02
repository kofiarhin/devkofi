import { aiImage, codeSnippetImage, workStation } from "./constants";

export const engagementOffers = [
  {
    id: "ai-workflow-audit",
    name: "AI Workflow Audit",
    duration: "3–5 days",
    summary:
      "Map one expensive manual process, identify where AI is appropriate, define integrations, risks, success metrics, and a pilot plan.",
    outcomes: [
      "Workflow map and AI suitability assessment",
      "Integration and risk notes",
      "Success metrics and pilot scope",
    ],
    image: aiImage,
    imageAlt: "AI workflow mapping and systems planning visual",
  },
  {
    id: "ai-pilot-sprint",
    name: "AI Pilot Sprint",
    duration: "1–3 weeks",
    summary:
      "Build one working vertical slice against real inputs, with structured outputs, evaluation criteria, and human approval.",
    outcomes: [
      "Working vertical slice on real data",
      "Structured outputs and evaluation criteria",
      "Human approval path before action",
    ],
    image: codeSnippetImage,
    imageAlt: "Engineering code and pilot implementation visual",
  },
  {
    id: "production-ai-system",
    name: "Production AI System",
    duration: "Scoped engagement",
    summary:
      "Turn the validated pilot into an integrated application with authentication, observability, evaluations, failure handling, and deployment.",
    outcomes: [
      "Integrated production application",
      "Auth, observability, and failure handling",
      "Evaluation and deployment path",
    ],
    image: workStation,
    imageAlt: "Production workstation and delivery environment visual",
  },
];

export const workflowExamples = [
  {
    title: "Prospecting workflow",
    body: "Turn LinkedIn engagement into qualified prospects, verified contacts, and human-approved outreach preparation.",
  },
  {
    title: "Support triage workflow",
    body: "Classify inbound requests, draft responses, escalate exceptions, and write outcomes back to your tools.",
  },
  {
    title: "Governed coding workflow",
    body: "Scope AI coding agents with intake, approval gates, tests, and verification so completion claims require evidence.",
  },
];
