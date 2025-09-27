# DevKofi — MERN Mentorship Platform (2025)

DevKofi pairs a Vite-powered learning portal with an Express/Mongo API to onboard mentees, showcase the curriculum, and manage internal tooling for the mentorship team.

## Live URLs

- **Frontend (Prod):** https://devkofi.com
- **Backend (Prod):** https://devkofi-883f1d7b0ba0.herokuapp.com
- **Staging:** https://devkofi.vercel.app (mirrors the production client; connect to local API when running previews)

## Stack Overview

- **Client:** React 19 (Vite), React Router 7, React Query, Redux Toolkit (UI state), Framer Motion, SCSS Modules
- **Server:** Node.js 18+, Express 5 (CommonJS), Mongoose 8, Nodemailer, JSON Web Tokens, bcryptjs, cors
- **Database:** MongoDB (local or Atlas)
- **Tooling:** Vitest (client), Jest + Supertest (server), ESLint, Concurrently, Nodemon
- **Deploy:** Vercel (frontend) + Heroku/Render (backend) with `.env` configuration per environment

## Features

### Client-facing
- **Homepage** with modular sections (`Landing`, `Overview`, `Scale`, `IntegrateAI`, `Pricing`, `FAQ`, `Newsletter`) driven by SCSS module styling and Framer Motion reveals.
- **Course Outline** page powered by `courseData.json`, surfacing modules, requirements, and project briefs for the 6-month program.
- **Join Mentorship** form connected to `/api/mentorship` via `useMentorshipMutation` and React Query for async state.
- **Templates Gallery** gated by `PrivateRoutes`, listing downloadable starter projects resolved from `/api/templates`.
- **About Me** profile that hydrates a GitHub contribution heatmap from the `/api/info/github` endpoint.
- **Contact, Success, Error** flows that reuse `sendMessage` service utilities and display result states.
- **Portal & Messages** dashboards that switch between student and admin UI using Redux-authenticated user roles.
- **Playground** route exposed only in `import.meta.env.DEV` to test components without polluting production.

### Server-side
- **Mentorship enrollment** (`POST /api/mentorship`) creates records, sends welcome + verification emails, and notifies staff.
- **Contact and newsletter intake** (`POST /api/contact`, `POST /api/newsletter`) persist leads and trigger transactional email sequences.
- **Auth stack** (`/api/auth/register`, `/api/auth/login`, `/api/auth/verify`) issues JWT tokens and hashes passwords with bcrypt.
- **Admin insights** (`/api/admin/users`, `/api/users`) enforce role checks before exposing user lists.
- **Pricing API** (`GET /api/pricing`, `/api/pricing/:id`) exposes the curated bootcamp plans that the client consumes offline.
- **Info service** (`GET /api/info/github`) proxies GitHub GraphQL totals and 365-day contribution history for the client heatmap.
- **Template catalogue** (`GET /api/templates`) mirrors `server/config/project-profile.json` for the download center.
- **Download handler** (`GET /api/download?name=`) streams starter zip files stored in `server/files`.

## Monorepo Structure

```
devkofi/
├─ client/                    # Vite React app (SCSS modules only)
│  ├─ src/
│  │  ├─ Pages/               # Route-level components (Home, Templates, Portal, etc.)
│  │  ├─ components/          # Reusable UI (Header, Pricing, TemplateList, dashboards)
│  │  ├─ hooks/               # React Query hooks (useMentorshipMutation, useUsersQuery, ...)
│  │  ├─ services/            # Fetch helpers (sendMessage, downloadFile, getGitHubInfo)
│  │  ├─ constants/           # baseUrl, Cloudinary image URLs
│  │  ├─ data/                # Local JSON for pricing & users
│  │  ├─ main.jsx             # React Query + Redux providers
│  │  └─ App.jsx              # Router configuration & layout shell
│  ├─ __test__/               # Vitest specs
│  └─ vite.config.js
├─ server/                    # Express API (strict MVC)
│  ├─ controllers/            # Auth, Contact, Mentorship, Pricing, Info
│  ├─ routes/                 # Express routers mounted in `app.js`
│  ├─ Model/                  # Mongoose schemas (Contact, Mentorship, Newsletter, User)
│  ├─ config/                 # Mongo connection + project profile JSON
│  ├─ data/                   # Static pricing catalogue consumed by API and client
│  ├─ middlewares/            # Logger, auth, cleaner, errorHandler
│  ├─ utility/                # Email + helper utilities (GitHub fetchers, JWT)
│  ├─ __test__/               # Jest + Supertest suites with fixtures
│  ├─ app.js                  # Express instance
│  └─ server.js               # Entrypoint + DB bootstrap
├─ templates/                 # Marketing collateral and downloadable assets
├─ request.rest               # Thunder Client/REST client examples
├─ package.json               # Workspace scripts (dev, server, test, start)
└─ README.md / AGENTS.md      # Repo docs & automation guardrails
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local Docker or Atlas cluster)
- Gmail app password (for transactional email) or update `utility/sendEmail.js` to use your provider

### Installation & Local Dev

```bash
# Install root deps (includes server)
npm install

# Install client deps
cd client && npm install && cd ..

# Start both apps (concurrently runs Nodemon + Vite)
npm run dev

# Start only the API (useful for backend work)
npm run server

# Start only the client (front-end only flow)
npm run client
```

The Vite dev server runs on http://localhost:5173 and proxies API calls to http://localhost:5000 using the `import.meta.env.DEV` branches inside hooks and services.

### Environment Variables

Create a `.env` file at the repo root (consumed by the server scripts):

```
NODE_ENV=development
PORT=5000
MONGO_URI_DEV=mongodb://127.0.0.1:27017/devkofi
MONGO_URI_PROD= # Atlas connection string for deployments
JWT_SECRET=change-me
ADMIN_EMAIL=team@devkofi.com
EMAIL_USERNAME=example@gmail.com
EMAIL_APP_PASSWORD=generated-gmail-app-password
GITHUB_USERNAME=kofiarhin
GITHUB_TOKEN=ghp_yourgithubtoken
```

Create `client/.env.local` when you need client-only vars:

```
VITE_UPLOAD_PRESET=devkofi_uploads
```

> Never hard-code secrets—each deployment platform (Vercel, Render, Heroku) must be configured with the same environment keys.

## Scripts

### Root `package.json`
- `npm run dev` — concurrently run `server` and `client` scripts.
- `npm run server` — start Express with Nodemon and `.env`.
- `npm run client` — launch Vite dev server from `/client`.
- `npm test` — run Jest + Supertest suites against `server/__test__` (watch mode).
- `npm start` — production Express server (ensure `NODE_ENV=production`).

### `client/package.json`
- `npm run dev` — start Vite on port 5173.
- `npm run build` — build static assets into `dist/`.
- `npm run preview` — preview the production build.
- `npm run lint` — ESLint check (JS/JSX only).
- `npm run test` — run Vitest alongside the API (spins up the server script) for integration coverage.
- `npm run test:client` — run Vitest tests in isolation.

## Conventions & House Rules

- JavaScript everywhere—no TypeScript files in either package.
- SCSS Modules only for styling (`ComponentName.styles.scss` colocated per component).
- Arrow functions for every component, hook, controller, and utility.
- Follow strict MVC in `server/` (`Model/`, `controllers/`, `routes/`, `utility/`, `middlewares/`).
- Use React Query for server state; wrap fetch logic in custom hooks (`client/src/hooks`).
- Keep environment-specific values in `.env`; use `import.meta.env` / `process.env` guards, never literals.
- Enable CORS through `cors()` with wildcard origin for development; harden origins before production deploys.
- Persist UI state with Redux Toolkit slices (`navigation`, `auth`) and keep effects pure.
- Prefer pure functions with early returns and small modules; split large flows into helpers.
- Tests live beside their domain: Jest + Supertest only in `server/__test__/`, Vitest in `client/__test__/`.

## Testing

- **Server:** `npm test` (Jest + Supertest) covers GitHub info fetchers, pricing endpoints, auth flows, and error handling.
- **Client:** `npm run test:client` (Vitest) executes service-level integration checks; expand with component specs under `client/__test__/`.

## CI/CD

- **Frontend:** Deploy `client/` via Vercel (build command `npm run build`, output `dist`). Configure env vars for API base URL and Cloudinary.
- **Backend:** Deploy `server/` to Render or Heroku. Use `npm start` as the start command and supply the server `.env` variables. MongoDB Atlas is the recommended managed database.
- **Pipelines:** GitHub Actions can lint and run both test suites before merges, then trigger Vercel + Render/Heroku deploy hooks.

## Roadmap

1. **Client analytics & QA:** add Vitest coverage for critical pages (Home, JoinMentorship) and wire a lightweight analytics tracker via environment toggles.
2. **Server hardening:** complete validation + rate limiting for contact/newsletter endpoints and move transactional email recipients into env vars (currently hard-coded admin email).
3. **Mentor portal:** flesh out `/portal` dashboards with actual data (assignments, messages, templates) backed by new Express controllers and Mongo collections.
4. **Download center:** automate template ZIP generation and surface status badges (`status === "planned"`) with clearer messaging in the UI.

## License

MIT
