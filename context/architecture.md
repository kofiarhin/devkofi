# DevKofi Architecture

Evidence basis: `README.md`, root `package.json`, current repository implementation, and GitHub workflow evidence. This file separates documented/implemented structure from runtime verification.

## Intended

DevKofi is a MERN-style web application with a React/Vite frontend communicating with an Express REST API backed by MongoDB/Mongoose for its application-owned data. Client server-state access is intended to flow through services/custom hooks and TanStack Query, with Redux Toolkit reserved for global client/UI/auth state. Backend code follows route/controller/model/service/utility/middleware boundaries.

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
- MongoDB via Mongoose 8.20 for DevKofi-owned application data.
- JWT and bcrypt for authentication.
- Nodemailer for transactional email.
- Axios for server-to-server HTTP integrations, including public blog reads from IdeaHub API.
- CORS, cookie parsing, rate-limit tooling, dotenv, and Supertest/Jest tooling are installed.
- Server structure documented around routes, controllers, models, services, middleware, utilities, config, and tests.

### Data / External Boundaries

Documented integrations include:

- MongoDB local/Atlas configuration for DevKofi-owned application data;
- IdeaHub API for public blog reads;
- transactional email through configured credentials/provider;
- GitHub data for contribution information;
- frontend deployment to Vercel;
- backend deployment to Heroku/Render.

Current production availability/configuration of those external services must be verified separately from repository implementation.

### IdeaHub Blog API Boundary

- IdeaHub API owns direct access to the `blogposts` collection for DevKofi blog publishing and reads.
- IdeaHub API exposes public read-only `GET /api/v1/blog-posts` and `GET /api/v1/blog-posts/:slug` endpoints for published posts only.
- The existing `/api/v1/gpt/*` content-intelligence and blog write/archive/restore routes remain Bearer-authenticated and are not made public by the read boundary.
- DevKofi keeps its browser-facing `GET /api/blog` and `GET /api/blog/:slug` routes for compatibility.
- DevKofi's blog controller no longer queries the `BlogPost` Mongoose model. It calls IdeaHub API server-to-server through `server/services/ideaHubBlogService.js` using `IDEAHUB_API_URL`.
- The client continues to access DevKofi's existing endpoints through its service and TanStack Query hooks, then renders Markdown without enabling raw HTML.
- The existing Cloudinary cover-image fallback remains in DevKofi presentation handling.
- Contacts, bookings, newsletters, admin data, and other DevKofi-owned MongoDB behavior are outside this blog-boundary change and remain unchanged.
- The repository implementation has automated verification evidence, but cross-service production behavior remains unverified until the IdeaHub API endpoint is deployed and `IDEAHUB_API_URL` is configured in the DevKofi backend runtime.

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

For ticket 039 on `feature/blog-via-ideahub-api`:

- repository diff review shows the public blog controller now depends on the IdeaHub HTTP service rather than `server/models/BlogPost.js`;
- focused controller and IdeaHub-client tests were added;
- GitHub Actions `Validate backend` completed the backend test step successfully for implementation head `8692994a1448cb9fffa3cb505f33ce64618f52bf`;
- feature-branch deploy and live-verification jobs were skipped, so no deployment or live cross-service behavior is claimed.

## Constraints

- Existing project conventions override generic framework defaults.
- Do not introduce TypeScript without an approved migration; current application files/documentation are JavaScript-oriented.
- Keep network/API logic out of React components and use existing service/hook patterns.
- Do not duplicate server records into Redux without an explicit architecture decision.
- Preserve backend route/controller/model/service/utility boundaries unless a ticket/spec justifies a change.
- Secrets remain in environment configuration and must not enter source, prompts, logs, or project memory.

## Unresolved

- `IDEAHUB_API_URL` still needs runtime configuration before the DevKofi backend can use the new boundary outside tests.
- Cross-service live verification remains pending until the IdeaHub API public endpoints are deployed and DevKofi is configured to call them.
- Styling convention conflict: `README.md` states SCSS Modules only while Tailwind 4 tooling is installed. Treat SCSS Modules as the documented convention until a scoped ticket/spec explicitly decides otherwise.
- Runtime-version drift: `README.md` describes Node.js 18+ while current root `package.json` requires Node 20.x. Use the package engine as the current executable constraint; README cleanup may be handled in a focused documentation ticket.
- The exact canonical E2E/browser automation command is not established by current package scripts.
