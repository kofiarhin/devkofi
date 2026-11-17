// Public-site copy for the redesigned pages. Facts come from Kofi's project notes and the existing site.
// Never add clients, testimonials, metrics or results here that are not on record.

export const positioning = {
  eyebrow: "AI engineer · real MERN stack experience",
  title: "AI that works inside the systems you already run.",
  body: "I'm Kofi. I integrate AI into existing software for businesses, and I coach developers 1-on-1 in AI engineering and the MERN stack. Every build is engineered like production software: scoped, tested, verified and kept under human control.",
};

export const services = [
  {
    id: "ai-integration",
    to: "/ai-integration",
    eyebrow: "For businesses",
    title: "AI integration into existing systems",
    body: "Add AI to the product, data and workflows you already have, without rebuilding your stack. Assistants grounded in your data, governed agents and workflow automation with a human approval step.",
    points: ["Works with your existing app and database", "Human approval before consequential actions", "Tested, verified and handed over cleanly"],
    cta: "Explore AI integration",
  },
  {
    id: "ai-mentorship",
    to: "/mentorship#ai-engineering",
    eyebrow: "1-on-1 mentorship",
    title: "AI engineering mentorship",
    body: "Learn to build with LLMs, agents and AI coding tools the way production teams need: scoped specs, reviewed output, tests and verification.",
    points: ["Agents, retrieval and tool use", "Claude Code and Codex workflows", "Specs, review and verification habits"],
    cta: "See AI mentorship",
  },
  {
    id: "mern-mentorship",
    to: "/mentorship#mern",
    eyebrow: "1-on-1 coaching",
    title: "MERN stack mentorship",
    body: "Practical, project-based coaching in MongoDB, Express, React and Node, building real features to a review-ready standard.",
    points: ["Auth flows, APIs and data models", "Testing and UI states", "Deployment checklists and review-ready repos"],
    cta: "See MERN mentorship",
  },
];

export const howItWorks = [
  {
    title: "Free intro call",
    body: "A short call to understand your system, your goal or where you are as a developer. No cost and no obligation.",
  },
  {
    title: "Plan and scope",
    body: "We agree what to build or what to learn, what done looks like, and the format. Everything is written down before work starts.",
  },
  {
    title: "Build or coach",
    body: "I build the integration with you in the loop, or we start 1-on-1 sessions. Progress is shown with working software and evidence, not promises.",
  },
];

const hibachiImage = "https://res.cloudinary.com/dlsiabgiw/image/upload/v1788069502/devkofi/projects/hibachi-thumbnail.webp";
const brainImage = "https://res.cloudinary.com/dlsiabgiw/image/upload/v1787967827/c4eiah6tqqf1njxs7wj8.png";

export const caseStudies = [
  {
    id: "hibachi",
    name: "Hibachi",
    tag: "Local AI engineering agent",
    // TBD(kofi): the personal accessibility reason behind Hibachi is in your notes but kept off the site; add it only if you want it public.
    summary: "A local-first, voice-first agent that runs governed software delivery: from request to spec, approved implementation, verification and draft pull request.",
    problem: "Running the full software delivery loop means constantly reading dense interfaces and terminal output. The goal was an agent that can carry that loop through voice and keyboard, without giving an AI unrestricted control of the machine.",
    built: [
      "React interface served by a Node.js companion bound to localhost",
      "Reasoning providers propose actions; Hibachi executes only through typed, allowlisted tools",
      "Approval gates, workspace boundaries, Git safety and protected-file rules",
      "Typed commands, push-to-talk, approval controls and spoken output",
    ],
    // TBD(kofi): add a concrete outcome once the full delivery loop has been proven end to end.
    result: "In active development. The governed tool layer, approval controls and voice interface are implemented; proving the full delivery loop end to end on a real repository is the current milestone.",
    stack: ["React", "Node.js", "MongoDB", "Codex", "Obsidian"],
    image: hibachiImage,
    imageAlt: "Hibachi local AI agent interface",
    links: [],
  },
  {
    id: "brain",
    name: "Brain",
    tag: "AI personal operating system",
    summary: "A full-stack MERN app where MongoDB holds durable memory, AI workflows plan the day, and an authenticated chat answers from your own data.",
    problem: "Notes, tasks, plans, goals and project context were scattered. They needed one durable home that AI workflows could read and update safely.",
    built: [
      "React, Express and MongoDB app covering notes, tasks, plans, reviews, goals and projects",
      "AI workflows such as \"plan my day\" and a morning briefing",
      "Retrieval with embeddings, vector search and reranking behind a chat interface",
      "Chat kept read-only by design; writes stay in explicit, controlled workflows",
    ],
    // TBD(kofi): add any usage outcome you are happy to publish.
    result: "Live on Vercel with a responsive chat interface. Retrieval, reranking and chat were verified in non-production smoke tests, and the read-only chat boundary keeps AI from changing data on its own.",
    stack: ["React", "Express", "MongoDB", "Vector search", "Codex CLI"],
    image: brainImage,
    imageAlt: "Brain personal operating system interface",
    links: [
      { label: "Live app", href: "https://brain-pi-black.vercel.app" },
      { label: "Repository", href: "https://github.com/kofiarhin/brain" },
    ],
  },
  {
    id: "escowear",
    name: "EscoWear",
    tag: "MERN e-commerce",
    summary: "A sneaker storefront for customers in Ghana, sourcing from UK retailers, built and run end to end on the MERN stack.",
    problem: "Customers in Ghana needed a trustworthy way to order sneakers sourced from UK retailers, with manual order quoting and Mobile Money payment instead of card checkout.",
    built: [
      "MERN storefront with catalogue, product pages and order flow",
      "Admin tools: hero carousel management and product management with image uploads",
      "Password recovery with single-use, expiring reset links",
      "Docker deployment with tests, lint and build gating every release, plus rollback",
    ],
    // TBD(kofi): add a storefront screenshot and any customer/order outcome you want to publish.
    result: "Live at escowear.com. Releases only go out after the test, lint and build gates pass, with the previous version kept ready for rollback.",
    stack: ["MongoDB", "Express", "React", "Node.js", "Docker"],
    image: null,
    imageAlt: "",
    links: [{ label: "Visit escowear.com", href: "https://escowear.com" }],
  },
];

export const integrationKinds = [
  {
    title: "Assistants grounded in your data",
    body: "Chat or search over your own records and documents using retrieval, so answers come from your data. Read-only by default, like the chat in Brain.",
  },
  {
    title: "Governed agents and tool use",
    body: "Agents that act only through typed, allowlisted tools with approval steps, the pattern Hibachi is built on.",
  },
  {
    title: "Workflow automation with human review",
    body: "Classify, enrich, draft or rank the repetitive parts of a process, with a person approving before anything is sent or saved.",
  },
  {
    title: "AI features inside your web app",
    body: "LLM-powered features added to an existing React, Node and MongoDB product, with clear boundaries so the rest of the stack stays stable.",
  },
  {
    title: "Context and knowledge systems",
    body: "Structured context, memory and retrieval so AI tools get compact, relevant knowledge instead of everything at once.",
  },
  {
    title: "AI-assisted engineering workflows",
    body: "Specification, approval, testing and verification loops for teams using AI coding agents, so completion claims require evidence.",
  },
];

export const integrationFit = [
  "You already run a web app, internal tool or database and want AI to work with it",
  "A repetitive, data-heavy process is costing your team time",
  "You have an AI prototype that needs to become dependable software",
  "You want humans to stay in control of what the AI is allowed to do",
];

export const integrationProcess = [
  { title: "Free intro call", body: "We talk through the system you run and the process you want AI to help with." },
  { title: "Map and scope", body: "I look at how the work happens today, where AI genuinely helps, and the risks. You get a written scope." },
  { title: "Build a working slice", body: "One integrated piece working against real inputs, with structured outputs and a human approval step." },
  { title: "Verify and hand over", body: "Tests, verification and documentation, then expand only once the first slice proves itself." },
];

export const integrationFaq = [
  {
    question: "Do I need to rebuild my system to add AI?",
    answer: "No. The point is to integrate with what you already run: your app, database and workflows. The AI piece gets clear boundaries so the rest of your stack stays stable.",
  },
  {
    question: "Will the AI take actions on its own?",
    answer: "Only within limits you approve. I build agents that act through allowlisted tools, and consequential actions wait for a person to approve them.",
  },
  {
    question: "What stack do you work with?",
    answer: "Mostly JavaScript and TypeScript: React, Node.js, Express and MongoDB, plus LLM APIs, retrieval and vector search, Docker and CI. If your stack is different, we can talk about it on the intro call.",
  },
  {
    question: "How is pricing handled?",
    answer: "Scope, format and pricing are agreed after the free intro call, once we both understand the work.",
  },
];

export const mentorshipTracks = [
  {
    id: "ai-engineering",
    eyebrow: "Track 1",
    title: "AI engineering mentorship",
    body: "For developers who want to build real software with LLMs and agents, and use AI coding tools without losing engineering judgement.",
    covers: [
      "Integrating LLM APIs into real applications",
      "Retrieval, context and memory for AI features",
      "Agents, tool use and approval boundaries",
      "Claude Code and Codex for planning, implementation, debugging and review",
      "Writing useful specs and checking AI output instead of trusting it blindly",
      "Testing and verifying AI-assisted work",
    ],
  },
  {
    id: "mern",
    eyebrow: "Track 2",
    title: "MERN stack mentorship",
    body: "For developers comfortable with JavaScript fundamentals who want to ship production-style MongoDB, Express, React and Node applications.",
    covers: [
      "Auth flows and protected routes",
      "API design and data models",
      "React UI states: loading, empty, error and success",
      "Dashboards and real product features",
      "Testing with Vitest, Jest and Testing Library",
      "Deployment checklists and review-ready repositories",
    ],
  },
];

export const mentorshipFit = [
  "Developers building a serious portfolio project or startup feature",
  "Engineers who want direct guidance and code review, not passive video lessons",
  "Builders who want to use AI tools while keeping engineering judgement in control",
];

export const mentorshipSteps = [
  { title: "Free intro call", body: "We talk about your goals, current level and what you want to build." },
  { title: "Agree the plan", body: "We pick the track, the project and the session format. Format and pricing are agreed on the free intro call." },
  { title: "1-on-1 sessions", body: "Live sessions on your real code: building, reviewing, debugging and shipping together." },
];

export const mentorshipFaq = [
  {
    question: "Is this a course or direct mentorship?",
    answer: "Direct 1-on-1 mentorship built around real builds, code review, debugging discipline and shipping habits, not a fixed video curriculum.",
  },
  {
    question: "Do I need to know the MERN stack already?",
    answer: "You should be comfortable with JavaScript fundamentals and willing to work through React, Node, Express and MongoDB in real projects. The intro call is where we check the fit.",
  },
  {
    question: "How do AI tools fit in?",
    answer: "AI tools are used for planning, implementation support, debugging and reviews. The focus is not blind code generation: you learn to scope work, inspect output and catch weak assumptions.",
  },
  {
    question: "What will I actually build?",
    answer: "Production-style features and applications: auth flows, dashboards, API design, data models, UI states, tests and deployment. The exact project depends on your goals.",
  },
  {
    question: "How much does it cost?",
    answer: "Format and pricing are agreed on the free intro call, once we know what you want to achieve.",
  },
];

export const homeFaq = [
  {
    question: "Who do you work with?",
    answer: "Businesses that want AI integrated into the software they already run, and developers who want 1-on-1 mentorship in AI engineering or the MERN stack.",
  },
  {
    question: "What does the free intro call cover?",
    answer: "Your system or your goals, whether I'm a good fit, and what a sensible first step looks like. There is no cost and no obligation.",
  },
  {
    question: "How do you keep AI safe to use in a real business?",
    answer: "AI gets clear boundaries: allowlisted tools, read-only access where possible and a human approval step before consequential actions. Work is tested and verified before it's called done.",
  },
  {
    question: "How is pricing handled?",
    answer: "Scope, format and pricing are agreed after the free intro call. There are no packages to buy up front.",
  },
];

export const aboutCopy = {
  intro: "I'm Kofi, a full-stack engineer focused on designing and building AI systems, agentic workflows and AI-native products that have to work in the real world.",
  shift: "My background is building complete software systems across frontend, APIs, databases, deployment, testing and product UX. AI engineering extends that responsibility rather than replacing it: models still need architecture, context, tools, permissions, verification and interfaces around them.",
  philosophy: "A dependable AI product needs the surrounding engineering to be explicit: context, data, APIs, tool boundaries, application state, human approvals, evaluation, fallbacks, observability, security and user experience. That is the layer I focus on building well.",
  mentoring: "I also mentor developers 1-on-1, because the habits that make AI systems dependable (clear specs, review, tests and verification) are the same habits that make developers good.",
};

export const engineeringProcess = ["Discover", "Design", "Engineer", "Verify", "Deploy", "Improve"];
