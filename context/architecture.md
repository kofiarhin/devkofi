# DevKofi Architecture

Evidence basis: `README.md`, root `package.json`, repository code, and verified pull-request evidence. This file separates documented/implemented structure from runtime verification.

## Intended

DevKofi is a MERN-style web application with a React/Vite frontend communicating with an Express REST API. Most backend features use MongoDB/Mongoose directly. Public blog reads are an explicit exception: DevKofi now treats IdeaHub API as the owning service for blog data instead of reading the `blogposts` collection itself. Client server-state access is intended to flow through services/custom hooks and TanStack Query, with Redux Toolkit reserved for global client/UI/auth state. Backend code follows route/controller/model/utility/middleware boundaries.

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
- MongoDB via Mongoose 8.20 for non-blog backend features.
- JWT and bcrypt for authentication.
- Nodemailer for transactional email.
- CORS, cookie parsing, rate-limit tooling, dotenv, and Supertest/Jest tooling are installed.
- Server structure documented around routes, controllers, models, middleware, utilities, config, and tests.
- DevKofi uses a server-side HTTP service for public blog reads through IdeaHub API.

### Data / External Boundaries

Documented integrations include:

- MongoDB local/Atlas configuration for DevKofi-owned data;
- IdeaHub API for public blog reads;
- transactional email through configured credentials/provider;
- GitHub data for contribution information;
- frontend deployment to Vercel;
- backend deployment to Heroku/Render.

Current production availability/configuration of those external services was not verified during this implementation.

### Shared Blog Publishing Boundary

- IdeaHub owns direct access to the `blogposts` MongoDB collection for the DevKofi blog path.
- IdeaHub owns writes through its publishing workflow and public reads through `GET /api/v1/blog-posts` and `GET /api/v1/blog-posts/:slug`.
- The public IdeaHub routes return published posts only. GPT/search/write/archive/restore routes remain authenticated under `/api/v1/gpt/*`.
- DevKofi keeps its browser-facing `GET /api/blog` and `GET /api/blog/:slug` routes unchanged, but those controllers now call IdeaHub API over server-to-server HTTP instead of querying the `BlogPost` Mongoose model.
- DevKofi requires `IDEAHUB_API_URL` for this boundary and preserves its existing response envelopes and cover-image fallback.
- Other DevKofi MongoDB features remain unchanged.
- The client accesses DevKofi blog endpoints through its existing service and TanStack Query hooks, then renders Markdown without enabling raw HTML.
- There is still no ingestion API, synchronization job, approval UI, draft workflow, queue, or separate blog database in this architecture.

The effective flow is:

```text
Browser
  -> DevKofi API
  -> IdeaHub API
  -> blogposts MongoDB collection
```

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

For the server-to-server blog-read implementation:

- DevKofi pull-request CI ran `npm ci` and `npm test` successfully on the exact implementation head; 89/89 backend tests passed across 9 suites.
- The blog controller and HTTP client tests cover pagination forwarding, slug lookup, response compatibility, the existing cover-image fallback, 404 behavior, and calls to the public IdeaHub endpoints without authentication.
- Pull-request deployment and live-verification jobs were skipped.
- Production connectivity between deployed DevKofi and IdeaHub API has not been verified.

## Constraints

- Existing project conventions override generic framework defaults.
- Do not introduce TypeScript without an approved migration; current application files/documentation are JavaScript-oriented.
- Keep network/API logic out of React components and use existing service/hook patterns.
- Do not duplicate server records into Redux without an explicit architecture decision.
- Preserve backend MVC-style boundaries unless a ticket/spec justifies a change.
- Secrets remain in environment configuration and must not enter source, prompts, logs, or project memory.
- IdeaHub API must be deployed and DevKofi `IDEAHUB_API_URL` configured before this blog path can be released safely.

## Unresolved

- Styling convention conflict: `README.md` states SCSS Modules only while Tailwind 4 tooling is installed. Treat SCSS Modules as the documented convention until a scoped ticket/spec explicitly decides otherwise.
- Runtime-version drift: `README.md` describes Node.js 18+ while current root `package.json` requires Node 20.x. Use the package engine as the current executable constraint; README cleanup may be handled in a focused documentation ticket.
- Current live deployment/production health and the DevKofi-to-IdeaHub API production connection are not verified.
- The exact canonical E2E/browser automation command is not established by current package scripts.
