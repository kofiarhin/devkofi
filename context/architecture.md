# DevKofi Architecture

Evidence basis: `README.md`, root `package.json`, and `client/package.json` inspected on the migration branch. This file separates documented/implemented structure from runtime verification.

## Intended

DevKofi is a MERN-style web application with a React/Vite frontend communicating with an Express REST API backed by MongoDB/Mongoose. Client server-state access is intended to flow through services/custom hooks and TanStack Query, with Redux Toolkit reserved for global client/UI/auth state. Backend code follows route/controller/model/utility/middleware boundaries.

## Implemented Repository Structure

### Frontend

- React 19.2 with Vite 7.
- React Router 7.
- TanStack Query 5 for server-state workflows.
- Redux Toolkit/React Redux for global client state.
- Framer Motion and icon libraries for presentation.
- Sass is installed and the repository README documents SCSS Modules as the styling convention.
- Tailwind CSS 4 and `@tailwindcss/vite` are present in `client/package.json`; whether Tailwind is intentionally active for production surfaces was not established by this setup.

The README documents service/hook boundaries for API work, including mentorship, users, downloads, GitHub information, and messaging-related flows.

### Backend

- Node.js with root `package.json` engines set to Node 20.x/npm 10.x.
- Express 5.2.
- MongoDB via Mongoose 8.20.
- JWT and bcrypt for authentication.
- Nodemailer for transactional email.
- CORS, cookie parsing, rate-limit tooling, dotenv, and Supertest/Jest tooling are installed.
- Server structure documented around routes, controllers, models, middleware, utilities, config, and tests.

### Data / External Boundaries

Documented integrations include:

- MongoDB local/Atlas configuration;
- transactional email through configured credentials/provider;
- GitHub data for contribution information;
- frontend deployment to Vercel;
- backend deployment to Heroku/Render.

Current production availability/configuration of those external services was not verified during this setup.

### Blog Publishing Boundary

- Context API owns read access to the shared `blogposts` collection and exposes authenticated server-to-server reads at `GET /api/v1/blog` and `GET /api/v1/blog/:slug`.
- IdeaHub remains the blog publisher/write owner for generated posts.
- DevKofi no longer queries `blogposts` directly. Its Express API calls Context API using `CONTEXT_API_URL` and a server-only `CONTEXT_API_KEY`.
- DevKofi preserves its frontend-facing contract: `GET /api/blog` lists published documents and `GET /api/blog/:slug` resolves one published document.
- The React client continues to access only DevKofi's own API through the existing service and TanStack Query hooks; Context API credentials are never exposed to the browser.
- DevKofi's MongoDB connection remains in place for its other application data.

## Verification Tooling

Current package manifests expose:

```bash
npm test
npm run test:client
npm --prefix client run lint
npm --prefix client run build
```

Vitest/Testing Library dependencies exist in the client. Jest/Supertest are configured at the root. Playwright/Puppeteer are installed at the root, but this setup did not establish a canonical E2E command.

## Verified

For this workspace migration only:

- repository documentation and package manifests were inspected;
- application runtime, tests, lint, build, browser flows, network behavior, database connectivity, and deployments were not run or verified.

## Constraints

- Existing project conventions override generic framework defaults.
- Do not introduce TypeScript without an approved migration; current application files/documentation are JavaScript-oriented.
- Keep network/API logic out of React components and use existing service/hook patterns.
- Do not duplicate server records into Redux without an explicit architecture decision.
- Preserve backend MVC-style boundaries unless a ticket/spec justifies a change.
- Secrets remain in environment configuration and must not enter source, prompts, logs, or project memory.

## Unresolved

- Styling convention conflict: `README.md` states SCSS Modules only while Tailwind 4 tooling is installed. Treat SCSS Modules as the documented convention until a scoped ticket/spec explicitly decides otherwise.
- Runtime-version drift: `README.md` describes Node.js 18+ while current root `package.json` requires Node 20.x. Use the package engine as the current executable constraint; README cleanup may be handled in a focused documentation ticket.
- Current live deployment/production health is not verified.
- The exact canonical E2E/browser automation command is not established by current package scripts.
