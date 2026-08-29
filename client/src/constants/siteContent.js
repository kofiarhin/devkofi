import { aiImage, codeSnippetImage, personCoding, profileImage, workStation } from "./constants";

export const studioContent = {
  hero: {
    eyebrow: "AI Engineering Studio",
    title: "I engineer AI systems that do real work.",
    body: "AI agents, intelligent workflows, and AI-native products engineered around your software, data, and business processes.",
    image: profileImage,
  },
  problem: {
    eyebrow: "Beyond the prototype",
    title: "A useful AI demo is not the same thing as dependable software.",
    body: "Production AI needs context, data, tool boundaries, permissions, evaluation, fallbacks, observability, and a product experience people can actually use. I engineer that surrounding system.",
    image: aiImage,
  },
  systems: {
    eyebrow: "The systems behind the work",
    title: "Repeatable engineering, not one-off prompting.",
    body: "I use structured specification, implementation, verification, context, and agent workflows to keep AI-assisted delivery controlled and reviewable.",
    image: codeSnippetImage,
  },
  products: {
    eyebrow: "Built with the system",
    title: "Real products are the output.",
    body: "The same engineering workflows power AI systems and conventional full-stack products. Products shows the broader set of applications I have built and shipped.",
    image: workStation,
  },
  viewpoint: {
    eyebrow: "Point of view",
    title: "AI isn't the whole system.",
    body: "The model is one component. Reliable AI products depend on the engineering around it: context, data, APIs, tools, permissions, state, verification, human control, and UX.",
    image: personCoding,
  },
};

export const engineeringProcess = ["Discover", "Design", "Engineer", "Verify", "Deploy", "Improve"];

export const engineeringSystems = [
  {
    title: "Codex Workflow Kit",
    body: "A structured software delivery workflow spanning clarification, specification, planning, implementation, testing, review, verification, and handoff.",
    evidence: "Specification and verification workflow",
  },
  {
    title: "Universal Agent System",
    body: "A model-agnostic instruction system for generating consistent agent behaviour across coding runtimes while preserving shared engineering rules.",
    evidence: "Multi-runtime agent infrastructure",
  },
  {
    title: "Context Infrastructure",
    body: "Structured context and retrieval patterns that give agents compact, relevant project knowledge without loading entire repositories or histories.",
    evidence: "Context, memory, and retrieval",
  },
];
