# Repository Guidelines

This repository pairs a Vite React client with an Express/Mongo API. Follow these standards to keep code consistent and production-ready.

## Project Structure & Module Organization

- **client/** → Vite React app
  - `src/components` — functional components (PascalCase)
  - `src/pages` — route-level views
  - `src/hooks` — custom React hooks
  - `src/constants` — constants (e.g., `baseUrl.js`)
  - `src/assets` — images, icons, fonts
  - `__test__/` — Vitest test specs
- **server/** → Express + Mongo API
  - `models/` — Mongoose schemas (PascalCase)
  - `controllers/` — business logic
  - `routes/` — REST endpoints
  - `middlewares/` — Express middleware
  - `utility/` — helpers
  - `__test__/` — Jest + Supertest suites
  - `__test__/data/` — fixtures and seed data
- **templates/** — shared assets (emails, decks)
- **logs/** — server logs
- **.env** — environment variables (never commit; ignored via `.gitignore`)

## Build, Test, and Development Commands

- `npm run dev` — run Vite client + Nodemon server concurrently.
- `npm run server` — start API in dev mode.
- `npm run client` — start client in dev mode (Vite, port 5000).
- `npm run --prefix client build` — bundle client for production.
- `npm start` — run Express server in production mode.
- `npm test` — Jest + Supertest against `server/`.
- `npm run --prefix client test` — Vitest for React client.
- `npm run --prefix client lint` — ESLint check before PR.

## Coding Style & Naming Conventions

- **JavaScript only** — no TypeScript.
- **Backend:** CommonJS (`require`, `module.exports`).
- **Frontend:** ES modules (`import`, `export default`).
- Always use **arrow functions** for components, hooks, services, and controllers.
- **Indentation:** 2 spaces.
- **Naming:**
  - React components, Mongoose models → **PascalCase**
  - Hooks, utils, Express handlers → **camelCase**
- **Styling:**
  - No Tailwind — SCSS modules only.
  - `<Component>.styles.scss` colocated with component.
  - Dark/light themes via SCSS variables.
- **Exports:**
  - Components, hooks, services → default export.
  - Backend → `module.exports`.

## Testing Guidelines

- **Backend:**
  - Place Jest + Supertest tests inside `server/__test__/`.
  - Seed data lives in `__test__/data/`.
  - Use `describe` blocks for API flows.
- **Frontend:**
  - Place Vitest specs in `client/__test__/`.
  - Name tests after implementation (`Header.jsx` → `header.test.js`).
  - Use jsdom + setup mocks in `client/__test__/setup.js`.

## Commit & Pull Request Guidelines

- **Commits:** short, imperative style (`fix login bug`, `add auth controller`). ≤72 chars.
- **Branches:** focused topic branches (`feature/auth`, `fix/header-ui`).
- **PRs:**
  - Must include scope of change, test evidence (manual + automated), env updates, and screenshots (UI).
  - Link related issues.
  - Tag reviewers across client + server when changes span layers.

## Automation Shortcuts

Use the `:create:[type]:[name]` convention for boilerplate generation:

- `:create:model:user` → Mongoose schema (context-aware fields).
- `:create:crud:product` → REST routes + controller.
- `:create:controller:auth` → Express controller logic.
- `:create:test:auth` → Jest/Vitest test file.
- `:create:component:JobCard` → React component + SCSS module.
- `:create:style:header` → SCSS module.
- `:create:service:jobs` → API request helper.
- `:create:route:dashboard` → React page with route boilerplate.
