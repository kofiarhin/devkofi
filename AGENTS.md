# Repository Guidelines

## Project Structure & Module Organization

This is a full-stack JavaScript app with a Vite/React client and an Express/MongoDB backend. Frontend code lives in `client/src/`, with UI in `components/`, pages in `Pages/`, shared API setup in `lib/`, service calls in `services/`, Redux state in `redux/`, and assets in `assets/`. Frontend tests live in `client/test/`. Backend code is flat under `server/`: routes in `routes/`, controllers in `controllers/`, models in `models/`, middleware in `middleware/`, config in `config/`, and tests in `server/tests/`. End-to-end Playwright specs live in `e2e/`.

## Build, Test, and Development Commands

- `npm run dev`: run backend and frontend together with `concurrently`.
- `npm run server`: start `server/server.js` with `nodemon`.
- `npm run client`: start the Vite dev server from `client/`.
- `npm run start:server`: run the backend with plain Node.
- `npm test`: run backend Jest/Supertest tests in `server/tests/`.
- `npm run test:client`: run client Vitest tests.
- `cd client && npm run build`: create the production frontend build.
- `cd client && npm run lint`: run ESLint on the frontend.

## Coding Style & Naming Conventions

Use modern JavaScript and React function components. Keep components focused on UI, place backend/API calls in `client/src/services/`, and use the shared client in `client/src/lib/api.js`; do not hard-code API URLs. Prefer Tailwind for new styling, but this repo also has SCSS component styles, so follow nearby files when editing existing styled components. Use PascalCase for React components, camelCase for functions and variables, and descriptive test names ending in `.test.js` or `.test.jsx`.

## Testing Guidelines

Backend tests use Jest and Supertest under `server/tests/**/*.test.js`. Frontend tests use Vitest and React Testing Library under `client/test/`. Add focused tests for new routes, service behavior, form interactions, and user-facing regressions. Run the relevant suite before opening a PR: `npm test` for backend changes, `npm run test:client` for frontend changes, and Playwright specs when changing critical flows.

## Commit & Pull Request Guidelines

Recent history uses short, imperative commit subjects such as `update ui` and `fix ui update`; keep commits concise and action-oriented. Pull requests should include a clear summary, the commands run, linked issues when applicable, and screenshots or recordings for UI changes.

## Security & Configuration

Keep backend environment variables in root `.env` and frontend variables in `client/.env` with the `VITE_` prefix. Never commit secrets or expose sensitive fields such as password hashes. Backend validation and authorization remain the source of truth.
