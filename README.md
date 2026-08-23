# DevKofi

DevKofi is Kofi Arhin's creative technology studio: product engineering, creative development, photography, and content brought together to turn useful ideas into working digital experiences.

The repository is an established MERN application currently transitioning from its historical mentorship positioning to the studio direction defined in [PRD.md](PRD.md).

## Product status

- Intended direction: Creative technology studio
- Current implementation: Public portfolio/marketing client plus legacy mentorship operations and private admin tools
- Current redesign: `feat/creative-studio-redesign`
- Production: [devkofi.com](https://devkofi.com)
- Staging: [devkofi.vercel.app](https://devkofi.vercel.app)

Implementation, verification, merge, and deployment are tracked as separate states. See [context/current-state.md](context/current-state.md).

## Product workspace

- [PRD.md](PRD.md) — approved product direction
- [roadmap.md](roadmap.md) — ordered outcomes
- [review.md](review.md) — product and quality review standard
- [context/product.md](context/product.md) — customer, problem, promise, and journey
- [context/architecture.md](context/architecture.md) — intended and implemented architecture
- [context/decisions.md](context/decisions.md) — confirmed, unresolved, and historical decisions
- [context/current-state.md](context/current-state.md) — intended, implemented, verified, and unresolved status
- [spec/README.md](spec/README.md) — ticket discipline
- [demos/core-flow.md](demos/core-flow.md) — primary walkthrough

The reusable Setup PRD Workspace skill is installed under `.claude/skills/setup-prd-workspace/` from [kofiarhin/setup-prd-workspace](https://github.com/kofiarhin/setup-prd-workspace).

## Stack

- Client: React 19, Vite 7, React Router, TanStack Query, Redux Toolkit, Framer Motion, SCSS, Tailwind 4 tooling
- API: Node.js, Express 5, MongoDB, Mongoose
- Tests: Vitest/Testing Library, Jest/Supertest, Playwright
- Deployment: Vercel client and Heroku API

## Current operational boundaries

- MongoDB remains authoritative for persisted enquiries and bookings.
- Telegram notification is best-effort and must not roll back a successful persisted submission.
- Redux is limited to shared client-owned UI/auth state.
- TanStack Query owns API-backed server state.
- Environment-specific values and secrets stay in environment variables.
- Legacy mentorship behavior is retained until a separate audit authorizes removal.

## Local setup

Requirements:

- Node.js 18+
- npm
- MongoDB when exercising API-backed flows

```bash
npm install
npm install --prefix client
npm run dev
```

Common checks:

```bash
npm test
npm run lint --prefix client
npm run build --prefix client
```

Use `.env.example` and `.env.test.example` as variable-name references. Never commit secrets.

## Repository structure

```text
client/       React/Vite application
server/       Express/MongoDB API
context/      PRD-derived product and architecture truth
spec/         scoped implementation ticket guidance
demos/        core-flow and browser review guidance
routines/     inactive-by-default routine guidance
_workflow/    run-scoped delivery evidence
_decisions/   meaningful product and architecture decisions
```

## Contribution workflow

Read [AGENTS.md](AGENTS.md), [RUN_WORKFLOW.md](RUN_WORKFLOW.md), the PRD, roadmap, review standard, and context relevant to the task. Work on a non-main branch, preserve unrelated changes, verify proportionately, and never merge or deploy without explicit approval.

## License

MIT
