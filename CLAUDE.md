# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevKofi is a MERN mentorship platform. Frontend is deployed to Vercel; backend API to Heroku; database is MongoDB Atlas.

---

## Commands

### Development
```bash
npm run dev          # Run both server (port 5000) and client (port 5173) concurrently
npm run server       # Server only (nodemon)
npm run client       # Client only (Vite)
```

### Testing
```bash
npm test                          # Jest + Supertest (server), watch mode
npm run test:client               # Vitest (client), run once
cd client && npx vitest run       # Client tests, run once (no watch)
cd client && npx vitest run path/to/Component.test.jsx   # Single test file
npx jest server/tests/admin.test.js   # Single server test file
```

### Build & Lint
```bash
cd client && npm run build        # Vite production build → client/dist/
cd client && npm run lint         # ESLint check
```

### Seeding
```bash
node server/scripts/seedAdmin.js  # Create initial admin user (requires .env)
```

---

## Architecture

### Monorepo Layout
- `client/` — Vite React app (ES modules, SCSS Modules, no TypeScript)
- `server/` — Express 5 API (CommonJS, strict MVC)
- Shared env: root `.env` is read by the server; `client/.env` (or `.env.local`) for Vite.

### Frontend (`client/src/`)
- **`App.jsx`** — React Router v7 config; all routes live here. Public layout wraps most routes; `AdminRoute` guards the dashboard.
- **`Pages/`** — One folder per route (Home, About, Contact, BookCall, AdminDashboard, etc.)
- **`components/`** — Reusable UI; each component colocates its `.styles.scss`
- **`hooks/`** — All React Query hooks. `mutations/` for writes, `queries/` for reads. Hooks call services; services call the Axios client.
- **`services/`** — Low-level Axios calls (no React; usable outside components)
- **`lib/api.js`** — Single Axios instance: `baseURL = VITE_API_URL`, `withCredentials: true`, 401 interceptor clears Redux auth state
- **`redux/`** — Two slices: `authSlice` (admin session) and `navigationSlice` (sidebar open/close). Server state lives in React Query, not Redux.

### Backend (`server/`)
- **`server.js`** — Entry point: loads `.env`, connects to MongoDB, starts listener
- **`app.js`** — Express setup: CORS, cookie-parser, route mounting, global error handler
- **`controllers/`** — Business logic only; no DB calls in routes
- **`routes/`** — Thin route files; apply middleware and delegate to controllers
- **`middleware/requireAdminAuth.js`** — Verifies `adminToken` httpOnly cookie; protects all `/api/admin/*` routes
- **`utils/emailService.js`** — Nodemailer over Gmail SMTP; email is fire-and-forget (DB write is authoritative)
- **`utils/bookingSlots.js`** — Availability computation logic (timezone-aware)

### Auth Flow
Admin authentication uses httpOnly cookies (no localStorage). Login sets `adminToken` cookie + dispatches to Redux. `requireAdminAuth` middleware validates the JWT on each protected request. `AdminRoute` component double-checks the session client-side via `useAdminSession`.

### API Response Shape
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "message" }
```

### Styling
SCSS Modules only (`.styles.scss` colocated with components). Tailwind is installed but not in active use — do not add Tailwind utilities to existing components.

### Testing Patterns
- **Server:** Jest + Supertest. Test DB lifecycle managed in `server/__test__/setup.js` (in-memory MongoDB). Tests create their own fixtures.
- **Client:** Vitest + React Testing Library. Setup in `client/test/setupTests.js`. Mock `client/src/lib/api.js` for unit tests.
- **E2E:** Playwright against the production URL (`production.spec.js`).

---

## Environment Variables

See `.env.example` (root) and `client/.env.example`. Key vars:

| Variable | Used by |
|---|---|
| `MONGO_URI` | DB connection |
| `JWT_SECRET` | Admin token signing |
| `CLIENT_URL` | CORS origin whitelist |
| `EMAIL_USER` / `EMAIL_PASS` | Nodemailer SMTP |
| `VITE_API_URL` | Client Axios baseURL |
| `LOGIN_RATE_LIMIT_MAX` / `LOGIN_RATE_LIMIT_WINDOW_MS` | Auth rate limit |
| `CONTACT_RATE_LIMIT` | Contact form rate limit |
