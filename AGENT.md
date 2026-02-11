# AGENT.md

## DevKofi Engineering Standards (MERN Stack)

This document defines the operational standards for all DevKofi
projects. All generated code must follow these rules strictly.

---

# 1. Default Project Structure

    root/
      client/
      server/
      .gitignore
      README.md
      package.json

Root `package.json` runs both client and server via `concurrently`.

---

# 2. Frontend Standards (React + Vite)

## Stack

- React (Vite)
- Redux Toolkit (global state)
- React Query (server state)
- React Router
- SCSS (NOT Tailwind, NOT CSS Modules)

---

## Component Structure

Each component lives in its own folder:

    client/src/components/Header/
      Header.jsx
      header.styles.scss

Import styles like:

```js
import "./header.styles.scss";
```

---

## Naming Conventions

- Components: PascalCase (`Header.jsx`)
- Styles: `component.styles.scss`
- Hooks / utilities: camelCase
- Files must match component names exactly

---

## SCSS Rules

- Use global BEM-style classes
- Example:

```{=html}
<!-- -->
```

    .header
    .header__nav
    .header--open

- Mobile-first responsive design
- Avoid deep nesting
- Keep styles scoped to the component block

---

## Environment Variables (Frontend)

- Use `.env`
- Access via:

```js
import.meta.env.VITE_API_URL;
```

- Never hardcode API URLs
- Normalize trailing slash when needed

---

## Data Fetching

- Use React Query
- Handle loading + error states cleanly
- Use service helpers for API calls
- Normalize API base URLs

---

## Auth

- Clerk when applicable
- Verify tokens server-side
- Gate routes by role
- Keep auth predictable (Redux or Clerk hooks)

---

# 3. Backend Standards (Node + Express + MongoDB)

## Structure

    server/
      server.js
      config/
      routes/
      controllers/
      models/
      middleware/
      utils/
      tests/

---

## Rules

- Use `.env` (never hardcode secrets)
- Central error handling middleware
- Consistent API response format:

Success:

```json
{ "success": true, "data": {} }
```

Error:

```json
{ "success": false, "message": "Error message" }
```

- Use async/await
- Validate input (zod / joi / express-validator)
- Keep controllers clean and focused

---

## Security Defaults

- Do NOT include Helmet by default
- Do NOT include Morgan by default
- Add only if explicitly required

---

## Cron / Scheduled Jobs

- Jobs must be idempotent
- Keep job logic isolated
- Compatible with Heroku / Render scheduler

---

# 4. Scraping Rule (Critical)

All scraping must use:

- Crawlee
- PlaywrightCrawler

Never use: - Axios + Cheerio for scraping

Scrapers must: - Be modular - Be orchestrated from a central runner -
Store normalized data

---

# 5. Git & Repo Hygiene

## Required `.gitignore`

Must ignore:

    node_modules
    .env
    notes.txt

---

## Commit Message Style

- Present tense
- Clear and specific

Examples:

    Fix pricing API base URL normalization
    Add projects filter with status normalization
    Refactor dashboard role gating

---

# 6. Code Regeneration / Fix Requests

When fixing code:

1.  Provide full updated files immediately
2.  Include any companion files needed
3.  Format:

```{=html}
<!-- -->
```

    Changed files:
    - path/file1
    - path/file2

    ## path/file1
    <full file code>

    ## path/file2
    <full file code>

No partial diffs unless explicitly requested.

---

# 7. Deployment Assumptions

Frontend: - Vercel

Backend: - Render or Heroku

Rules: - Environment variables configured on platform - API base
controlled via `VITE_API_URL` - No environment leakage in repo

---

# 8. UI / UX Expectations

- Clean, modern UI
- Consistent spacing
- Fully responsive
- Dark-mode friendly where applicable
- Production-ready --- no placeholders unless requested

---

# 9. Output Discipline

- No fluff
- No broken imports
- No missing dependencies
- No partial implementations
- Deliver production-grade code by default

---

# 10. Operating Principle

Build like a founder.

Every decision should: - Improve scalability - Improve clarity - Reduce
technical debt - Be deployable immediately - Be clean enough to ship

---

End of AGENT.md
