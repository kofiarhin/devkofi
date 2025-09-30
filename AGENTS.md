# DevKofi Automation Charter

DevKofi pairs a Vite/React mentorship portal with an Express/Mongo API. Every contribution must respect the house rules: JavaScript only, SCSS modules on the client, CommonJS on the server, arrow functions everywhere, React Query for server state, strict MVC, and zero hard-coded secrets.

---

## Roles & Prompts

### Router Agent
- **Goal:** Keep navigation, route guards, and URL structure in sync across `client/src/App.jsx`, `client/src/components/Header`, and `client/src/components/SideNav`.
- **Inputs:** Current router config, Redux `auth` slice, private route requirements.
- **Outputs:** Updated route maps, guards, and any accompanying link changes.
- **Constraints / System Prompt:** Operate only within React Router + Redux Toolkit patterns already in `client/src`. Use arrow-function components, SCSS modules, and keep dev-only routes behind `import.meta.env.DEV` checks.

### Curriculum Agent
- **Goal:** Maintain curriculum data (`client/src/Pages/CourseOutline/courseData.json`) and related presentation components.
- **Inputs:** JSON course data, `CourseOutline` page, supporting components.
- **Outputs:** Up-to-date module timelines, requirements, and CTA copy that match mentorship offerings.
- **Constraints / System Prompt:** Store curriculum content in JSON or plain JS objects—no hard-coded strings inside components beyond descriptive labels. Preserve Framer Motion patterns already in use.

### Frontend Agent
- **Goal:** Build and refine UI inside `client/`.
- **Inputs:** Components, hooks, SCSS modules, React Query services.
- **Outputs:** Accessible, responsive React components with colocated `ComponentName.styles.scss` files.
- **Constraints / System Prompt:** JavaScript + JSX only, arrow-function components, SCSS modules, default exports. Use React Query + custom hooks for server state, Redux Toolkit for UI state, and never introduce Tailwind or inline global CSS.

### Backend Agent
- **Goal:** Extend the Express API under `server/` following strict MVC.
- **Inputs:** `server/app.js`, `routes`, `controllers`, `Model`, `utility`, `middlewares`.
- **Outputs:** Routes, controllers, models, and utilities that align with existing patterns, plus accompanying Jest + Supertest coverage.
- **Constraints / System Prompt:** CommonJS modules, arrow functions for controllers/utilities, keep logic pure and layered (route → controller → service/helper → model). Enable CORS via `cors()` only, respect environment variables, and ensure new routes are mounted in `app.js`.

### Content & Marketing Agent
- **Goal:** Update copywriting, assets, and marketing collateral across the site and `templates/`.
- **Inputs:** JSON data files, SCSS modules, components that render marketing copy.
- **Outputs:** On-brand DevKofi messaging, updated pricing cards, testimonials, and downloadable template metadata.
- **Constraints / System Prompt:** Source strings from data objects where possible. No lorem ipsum. Ensure copy reflects actual mentorship benefits shown in the current repo.

### Docs Agent
- **Goal:** Maintain high-fidelity documentation (`README.md`, `/templates` guides, inline comments where essential).
- **Inputs:** Existing docs, repo structure, scripts.
- **Outputs:** Accurate, concise documentation that reinforces house rules and references real commands/files.
- **Constraints / System Prompt:** Keep docs evergreen—avoid placeholders. Reference real paths, scripts, and URLs present in the repo. Mirror CI/CD strategy (Vercel + Render/Heroku).

### QA Agent
- **Goal:** Safeguard quality with automated tests and manual acceptance criteria.
- **Inputs:** Jest/Vitest suites, GitHub Actions configs (when present), testing docs.
- **Outputs:** Expanded coverage, reproducible test plans, and bug reproduction steps.
- **Constraints / System Prompt:** Use Jest + Supertest in `server/__test__/`, Vitest in `client/__test__/`. Add fixtures under `server/__test__/data/` when needed. Never mix testing frameworks.

### DevOps Agent
- **Goal:** Streamline local/dev/prod workflows, scripts, and deployment automation.
- **Inputs:** Root `package.json`, deployment guides, CI configs, environment variable docs.
- **Outputs:** Updated scripts, deployment instructions, and infrastructure-as-code tweaks aligned with Vercel (client) and Render/Heroku (server).
- **Constraints / System Prompt:** Do not introduce alternative hosting stacks. Keep `.env` usage consistent, rely on `concurrently` for dev, and respect the existing port contract (Express on 5000, Vite on 5173).

### Analytics Agent
- **Goal:** Implement privacy-friendly analytics and reporting hooks without breaking performance.
- **Inputs:** Client services/hooks, server info endpoints, environment-driven feature flags.
- **Outputs:** Analytics adapters, dashboards, or data exports tied to real endpoints like `/api/info/github`.
- **Constraints / System Prompt:** Guard analytics behind env flags. Prefer custom hooks and React Query observers. Never ship tracking IDs or secrets in source—use `.env` only.

---

## Command Shortcuts

Use these intent tags when requesting boilerplate:

- `:create:model:[Name]`
- `:create:crud:[Name]`
- `:create:controller:[Name]`
- `:create:test:[Name]`
- `:create:component:[Name]`
- `:create:style:[Name]`
- `:create:service:[Name]`
- `:create:route:[Name]`

---

## Definition of Done

A task is complete when:

1. JavaScript-only code that respects arrow functions, SCSS modules, React Query patterns, and CommonJS on the server is committed.
2. New backend logic lives in the proper MVC layer with matching Jest + Supertest coverage; new frontend logic includes or updates Vitest specs when practical.
3. Environment variables are read from `.env` (or `import.meta.env`) and never hard-coded.
4. CORS remains configured through the `cors` package (wildcard in development) with no alternative middleware added.
5. README/AGENTS/docs stay accurate and reference real scripts, routes, URLs, and configuration present in the repository.
6. All tests and required build steps pass locally (`npm test`, `npm run test:client`, `npm run build` when affected).
7. Changes align with deployment expectations (Vercel for client, Render/Heroku for server) and update any affected instructions.
8. PRs include evidence of testing, follow feature-branch etiquette, and highlight any environment updates needed for reviewers.

---

## Chat UI Module

- Components live at `client/src/components/` (`ChatBox.jsx`, `MessageList.jsx`, `SuggestionChips.jsx`, `Composer.jsx`, `JumpToBottomFAB.jsx`) with SCSS modules.
- Server interactions flow through `client/src/services/chatAdapter.js` and React Query (retry=2, exponential backoff, optimistic updates with rollback).
- Utilities such as `client/src/utils/autoGrowTextarea.js` support the composer auto-grow behavior (max 5 lines).
- Tests: `npm --prefix client exec vitest run src/__tests__/ChatBox.test.jsx src/__tests__/MessageFlow.test.jsx src/__tests__/Composer.test.jsx src/__tests__/SelfHealing.test.jsx`.
