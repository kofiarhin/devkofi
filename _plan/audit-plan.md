# DevKofi MERN Codebase Audit Plan

**Date:** 2026-04-24  
**Branch:** main  
**Scope:** Security, correctness, API contracts, env/config, routing, deployment blockers

---

## Audit Report

### CRITICAL

| # | Location | Issue |
|---|----------|-------|
| C1 | `server/app.js:86-92` | `cors({ origin: "*" })` is mounted **after** the custom credentialed-CORS middleware. The custom middleware patches `res.setHeader` to rewrite `*` back to the request origin — but only when `isAllowedOrigin` is true. For any origin **not** in the allowlist, `cors()` emits `Access-Control-Allow-Origin: *` unpatched, which the browser will reject on a credentialed request. Additionally, this patch pattern is fragile: if Express or Node ever writes the header without going through `res.setHeader`, the rewrite is silently skipped. The entire custom middleware + cors-wildcard pairing should be replaced with the standard `cors()` `origin` function pattern. |
| C2 | `client/src/constants/constants.js:12-14` | `baseUrl` hard-codes the production Heroku URL (`https://devkofi-api-82532bf8b693.herokuapp.com`) for non-dev environments. This bypasses `VITE_API_URL` in production, making it impossible to point the build at a different backend without a code change. Violates the "no hardcoded URLs" rule. |
| C3 | `client/src/hooks/useContactMutation.js` | Uses raw `fetch` with `baseUrl` from `constants.js` instead of the shared axios client at `client/src/lib/api.js`. This means the contact endpoint silently ignores the production URL controlled by `VITE_API_URL`, bypasses any future axios interceptors, and diverges from every other service in the codebase. |

---

### HIGH

| # | Location | Issue |
|---|----------|-------|
| H1 | `package.json:11` | `"test": "jest --watchAll server"` — `--watchAll` blocks in CI (requires TTY, never exits). Should be `jest --forceExit` or plain `jest` for CI. |
| H2 | `package.json:7` | `"dev"` script: `"npm run client "` has a trailing space. Not a runtime bug but can cause issues in some shells or CI environments. |
| H3 | `package.json:12` | `"test:client": "concurrently \"npm run server\" \"npm run test --prefix client\""` — starts the backend server alongside frontend unit tests. Unit tests should not depend on a live server; this can cause port conflicts and flaky tests. |
| H4 | `client/src/lib/api.js` | No response interceptor for `401`/`403`. Unauthenticated responses from protected routes are silently passed through to each hook/component. A global interceptor should at minimum dispatch `clearAdmin` and redirect to login on 401. |
| H5 | `server/config/env.js` | `env.js` is **not** required in `server.js` or `app.js` — it's loaded lazily via controller/util imports. If admin routes are never called, missing `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, or `ADMIN_PASSWORD` won't be caught at startup. |
| H6 | `client/src/constants/constants.js:1-9` | `DEV_API_URL`, `PROD_API_URL`, and `normalizeUrl` are declared but unused. Dead code that could mislead future developers. |

---

### MEDIUM

| # | Location | Issue |
|---|----------|-------|
| M1 | `server/app.js:97,111,115` | Health check and root routes use `async` without any `await`. Unnecessary and slightly misleading. |
| M2 | `server/app.js:111-117` | `/api/health` and `/health` return `{ message: "ok" }` without checking MongoDB connection state. A deployment health check should verify DB reachability. |
| M3 | `client/src/lib/api.js` | No `baseURL` fallback if `VITE_API_URL` is undefined (e.g., missing `client/.env`). Axios defaults to relative URLs silently, causing confusing 404s. |
| M4 | `server/controllers/adminAuthController.js:41-43` | `logoutAdmin` passes full `COOKIE_OPTIONS` (including `maxAge`) to `res.clearCookie`. `maxAge` is ignored when clearing; only `path`, `domain`, `httpOnly`, `sameSite`, and `secure` matter. Not a bug but could mask subtle domain/path mismatches. |
| M5 | `package.json` | `geoip-lite` and `express-useragent` are in `dependencies` but do not appear to be used anywhere in `server/`. Dead dependencies inflate install size and attack surface. |
| M6 | `package.json` / `client/package.json` | `vitest` appears in both root `devDependencies` and `client/devDependencies` at different versions (`^3.2.4` vs `^4.0.15`). Root vitest is unused for actual tests; only `client/` runs vitest. |
| M7 | `server/__test__/setup.js` path | Jest config `setupFilesAfterEnv: ["<rootDir>/server/__test__/setup.js"]` — the path uses double underscore (`__test__`) which is non-standard (Jest convention is `__tests__`). Works, but inconsistent. |

---

### LOW

| # | Location | Issue |
|---|----------|-------|
| L1 | `server/controllers/newsletterController.js` | Regex email validation on the backend may not align with what the frontend validates. Confirm the regex patterns match to avoid accept/reject divergence. |
| L2 | `client/src/hooks/queries/useAdminSession.js` | Session is only queried on admin routes. If the `isChecked` flag isn't set before a non-admin page loads, there could be a flash of unauthenticated state. Confirm `isChecked` defaults to `false` and UI handles this gracefully. |
| L3 | Non-ASCII characters | Run `grep -rP '[^\x00-\x7F]'` across `server/` and `client/src/` to detect hidden Unicode (zero-width spaces, smart quotes, etc.) that can cause silent runtime errors. |
| L4 | `client/src/Pages/AdminDashboard/AdminDashboard.test.jsx` | Test file appears to exist in both `client/src/Pages/AdminDashboard/` and `client/test/admin/`. Duplicate or diverged test — confirm which is canonical. |

---

## Fix Plan (ordered by severity)

### Step 1 — Fix CORS (C1)

**File:** `server/app.js`

Remove the custom `res.setHeader` patch middleware entirely. Replace both the custom middleware and the `cors({ origin: "*" })` call with a single standard `cors()` call using the `origin` function:

```js
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin || true);
      } else {
        callback(new Error(`CORS: origin not allowed — ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

This correctly:
- Echoes back the specific request origin (not `*`) so credentialed cookies are accepted
- Rejects unlisted origins at the CORS layer, not via a header rewrite hack
- Does not break preflight (OPTIONS) handling

**Test:** Add a backend test that POSTs to `/api/contact` from an unlisted origin and asserts `Access-Control-Allow-Origin` is absent (or request is rejected), and from a listed origin asserts the echo-back header is present.

---

### Step 2 — Fix hardcoded production URL (C2, C3, H6)

**File:** `client/src/constants/constants.js`

Remove `DEV_API_URL`, `PROD_API_URL`, `normalizeUrl`, and the hard-coded Heroku URL from `baseUrl`. Replace with:

```js
export const baseUrl = import.meta.env.VITE_API_URL;
```

**File:** `client/src/hooks/useContactMutation.js`

Replace the raw `fetch` call with the shared API client:

```js
import api from "../lib/api";

const sendContactMessage = async (formData) => {
  const { data } = await api.post("/api/contact", formData);
  return data;
};
```

This removes the hardcoded URL and routes through the axios client that already has `withCredentials: true` and the correct baseURL.

**Test:** Confirm the contact mutation test mocks `api.post` (not `fetch` or `global.fetch`).

---

### Step 3 — Fix api.js baseURL fallback (M3)

**File:** `client/src/lib/api.js`

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});
```

Add a 401 interceptor to auto-clear auth state:

```js
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Dispatch clearAdmin via store — import store directly or emit a custom event
      // store.dispatch(clearAdmin());
    }
    return Promise.reject(err);
  }
);
```

Note: If importing the Redux store creates a circular dependency, use a custom DOM event instead (`window.dispatchEvent(new Event("auth:expired"))`), and listen for it in a top-level component.

---

### Step 4 — Fix env.js lazy-load (H5)

**File:** `server/server.js`

Add `require('./config/env')` at the very top, before anything else:

```js
require("dotenv").config();
require("./config/env"); // fail fast on missing vars
const app = require("./app");
```

This ensures the app refuses to start with missing required environment variables, rather than failing at the first request to an admin route.

---

### Step 5 — Fix test scripts (H1, H2, H3)

**File:** `package.json`

```json
"scripts": {
  "dev": "concurrently \"npm run server\" \"npm run client\"",
  "server": "nodemon server/server.js",
  "start:server": "node server/server.js",
  "client": "npm run dev --prefix client",
  "test": "jest --forceExit",
  "test:watch": "jest --watchAll",
  "test:client": "npm run test --prefix client"
}
```

Changes:
- Remove trailing space from `"npm run client "` → `"npm run client"`
- `jest --watchAll server` → `jest --forceExit` (no TTY hang in CI)
- Add `test:watch` for local development
- `test:client` no longer starts the server (unit tests must be self-contained)

---

### Step 6 — Fix health check routes (M1, M2)

**File:** `server/app.js`

Replace async-less async functions and add DB check:

```js
const mongoose = require("mongoose");

app.get("/", (req, res) => {
  res.json({ status: "ok", timeStamp: new Date(), message: "welcome to dev kofi" });
});

app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = connected
  res.json({ message: dbState === 1 ? "ok" : "db_disconnected", db: dbState });
});

app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.json({ message: dbState === 1 ? "ok" : "db_disconnected", db: dbState });
});
```

---

### Step 7 — Fix logout clearCookie options (M4)

**File:** `server/controllers/adminAuthController.js`

```js
const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  secure: process.env.NODE_ENV === "production",
};

const logoutAdmin = (req, res) => {
  res.clearCookie("adminToken", CLEAR_COOKIE_OPTIONS);
  return res.status(200).json({ success: true, message: "Logged out" });
};
```

---

### Step 8 — Remove unused dependencies (M5, M6)

```bash
npm uninstall geoip-lite express-useragent
```

Remove `vitest` and `@vitest/coverage-v8` from root `devDependencies` (they belong only in `client/`).

**File:** `package.json` — remove `vitest` and `@vitest/coverage-v8` from devDependencies.

---

### Step 9 — Eager-load env.js in app.js (belt-and-suspenders)

**File:** `server/app.js`

Add at the top (after dotenv is loaded in server.js):

```js
require("./config/env"); // ensure required vars are present before routes load
```

---

### Step 10 — Non-ASCII character scan (L3)

Run:

```bash
grep -rP '[^\x00-\x7F]' server/ client/src/ --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx"
```

Fix any found occurrences (replace smart quotes, zero-width spaces, etc. with ASCII equivalents).

---

### Step 11 — Resolve duplicate test file (L4)

Determine which of the following is the canonical test:
- `client/src/Pages/AdminDashboard/AdminDashboard.test.jsx`
- `client/test/admin/AdminDashboard.test.jsx` (if it exists)

Delete the stale copy. Keep only the one under `client/test/`.

---

## Tests to Add / Update

| Test | File | What to assert |
|------|------|----------------|
| CORS: listed origin gets echo-back | `server/tests/cors.test.js` | Response header `Access-Control-Allow-Origin` equals the request origin |
| CORS: unlisted origin is rejected | `server/tests/cors.test.js` | No CORS allow header on response |
| CORS: credentialed preflight succeeds | `server/tests/cors.test.js` | OPTIONS returns 204 with `Access-Control-Allow-Credentials: true` |
| Contact mutation uses api client | `client/test/hooks/useContactMutation.test.jsx` | Mocks `../lib/api` not `fetch`, verifies `api.post('/api/contact', ...)` |
| Env fail-fast | Manual or integration | Start server with missing `JWT_SECRET` — process must exit non-zero |
| Health check DB state | `server/tests/health.test.js` | `/api/health` returns `db: 1` when connected |
| Logout cookie cleared | `server/tests/admin.test.js` | After logout, `Set-Cookie` header sets `adminToken` with empty value or `Max-Age=0` |

---

## Changed Files Summary (after fixes)

```
server/app.js                              — Replace CORS middleware; add DB health check; remove async from sync routes
server/server.js                           — Add eager require('./config/env')
server/controllers/adminAuthController.js  — Fix clearCookie options
package.json                               — Fix test scripts; remove unused deps
client/src/lib/api.js                      — Add baseURL fallback; add 401 interceptor
client/src/constants/constants.js          — Remove hardcoded prod URL and dead code
client/src/hooks/useContactMutation.js     — Switch from fetch to api client
server/tests/cors.test.js                  — New CORS tests
server/tests/health.test.js                — New health check tests
client/test/hooks/useContactMutation.test.jsx — New/updated mutation test
```

---

## Commands to Run After Fixes

```bash
# 1. Install (after removing unused deps)
npm install

# 2. Run backend tests
npm test

# 3. Run frontend tests
npm run test --prefix client

# 4. Build frontend
npm run build --prefix client

# 5. Non-ASCII scan
grep -rP '[^\x00-\x7F]' server/ client/src/ --include="*.js" --include="*.jsx"

# 6. Start server (confirm env fail-fast)
npm run server
```

---

## Remaining Risks / Manual Checks

1. **Cookie domain in production** — `sameSite: "none"` requires `secure: true`. Confirm the production deployment uses HTTPS and that the Heroku domain is in `CLIENT_URL` or `CORS_ORIGINS`.

2. **`VITE_API_URL` in production build** — Vite bakes env vars at build time. Confirm `VITE_API_URL` is set in the Heroku/CI build environment, not just locally.

3. **Admin seed script** — `server/scripts/seedAdmin.js` creates an admin using `ADMIN_EMAIL` / `ADMIN_PASSWORD` from env. Confirm this has been run at least once against the production DB, otherwise login will fail silently (user not found).

4. **Rate limit env vars** — `CONTACT_RATE_LIMIT` is in `.env.example` but the `contactRoutes.js` may use a different env var name. Verify the rate limit is actually reading the correct variable.

5. **Newsletter email regex** — Confirm server-side regex in `newsletterController.js` aligns with frontend validation to avoid reject-at-API surprises.

6. **`useAdminSession` isChecked flash** — Auth state starts as `{ admin: null, isChecked: false }`. Confirm `AdminRoute` renders a spinner (not a redirect) while `isChecked === false`.

---

## Final Verification Steps

```bash
# Verify no hardcoded localhost or Heroku URLs remain in client source
grep -r "localhost:5000\|heroku" client/src/ --include="*.js" --include="*.jsx"

# Verify VITE_API_URL is used consistently
grep -r "VITE_API_URL" client/src/

# Confirm test suite exits cleanly (no --watchAll hang)
npm test -- --forceExit

# Confirm build produces no errors
npm run build --prefix client

# Confirm server startup fails fast with missing env
JWT_SECRET="" node server/server.js  # should throw immediately

# Check CORS with curl from an unlisted origin
curl -v -H "Origin: https://evil.com" http://localhost:5000/api/health
# Access-Control-Allow-Origin should NOT appear in response

# Check CORS from listed origin
curl -v -H "Origin: http://localhost:5173" http://localhost:5000/api/health
# Access-Control-Allow-Origin: http://localhost:5173 should appear
```
