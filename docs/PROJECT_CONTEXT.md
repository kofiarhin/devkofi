# Project Context

This file captures durable repository facts discovered during workflow runs. Keep it concise and update it when repo conventions become clear.

## Project Summary

- Project name: `devkofi` / `fullstack-template-projects`.
- Purpose: Portfolio and service site with project, booking, contact, newsletter, admin, pricing, and templates surfaces.
- Current maturity: active application.

## Stack

- Frontend: React 19 with Vite.
- Backend: Node.js with Express.
- Database: MongoDB through Mongoose for persisted domains.
- Runtime: Node 20.x, npm 10.x.
- Languages: JavaScript and JSX.
- Styling: Existing repo primarily uses SCSS modules/global SCSS plus some inline component CSS; Tailwind v4 dependencies are installed but this repo is not fully Tailwind-only.
- Deployment: Repo rules state frontend deploys to Namecheap via GitHub Actions and backend deploys to Heroku.

## Package Manager

- Detected package manager: npm.
- Lockfiles: root `package-lock.json` and `client/package-lock.json`.
- Install command: `npm install` at root and `npm install --prefix client` for client-only installs.

## Common Commands

```bash
# Backend tests
npm test

# Client tests
npm run test --prefix client

# Client lint
npm run lint --prefix client

# Client build
npm run build --prefix client
```

## Testing Tools

- Backend integration tests: Jest and Supertest under `server/tests/`.
- Frontend tests: Vitest and React Testing Library available under the client package.
- End-to-end tests: Playwright dependency/config exists.
- Manual verification notes: Frontend uses Vite; backend app exports Express `app` for Supertest.

## Repo Conventions

- Folder conventions: backend is flat under `server/`; route files live in `server/routes/`, controllers in `server/controllers/`, static JSON data in `server/data/`.
- API conventions: public JSON routes mount under `/api/*` in `server/app.js`.
- Frontend API conventions: `client/src/lib/api.js` is the shared Axios client; domain services live in `client/src/services/`; React Query hooks live in `client/src/hooks/queries/`.
- State management conventions: Redux Toolkit is used for client-owned global UI/auth state; TanStack Query is used for server state.
- Error handling conventions: backend uses a centralized Express error handler; client pages render inline loading/error states.

## Architecture Rules

- Do not use `server/src/`; keep backend modules under `server/`.
- Do not hard-code frontend API origins; use `import.meta.env.VITE_API_URL` through the shared API client.
- Keep database-independent JSON-backed read routes simple and colocated with `server/data/`.

## Known Constraints

- Existing repo-wide client lint is known to include unrelated failures from prior work.
- Backend tests may require a reachable MongoDB connection because `server/app.js` connects on import.

## Open Questions

- None currently blocking.
