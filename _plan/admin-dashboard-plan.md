# Admin Dashboard Implementation Plan

**Spec:** `_spec/admin-dashboard-spec.md`  
**Date:** 2026-04-22  
**Stack:** Node/Express/MongoDB + React/Vite/TailwindCSS

---

## Current State

- `server/middleware/` — empty
- `server/models/` — `ContactMessage.js`, `NewsletterSubscriber.js` exist ✓
- `server/scripts/` — has `seedUsers.js`, need new `seedAdmin.js`
- `server/controllers/` — has `adminUsersController.j` (broken filename, ignore)
- `client/src/components/AdminRoute/` — folder exists, empty
- `client/src/Pages/Login/` — folder exists, empty
- `client/src/redux/auth/` — folder exists, empty
- `client/src/lib/api.js` — does NOT exist yet (required by CLAUDE.md)
- Root `.env` and `.env.example` exist — need admin vars added
- `client/.env` exists — no changes needed

---

## Implementation Phases

---

### Phase 1 — Backend: Environment + Config

**Goal:** Add required env vars and a centralized server config module.

#### 1.1 Update root `.env.example`
Add to existing file:
```
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=changeme_strong_password
LOGIN_RATE_LIMIT_MAX=10
LOGIN_RATE_LIMIT_WINDOW_MS=900000
```

#### 1.2 Update root `.env`
Mirror the same keys with real local dev values (never commit real secrets).

#### 1.3 Create `server/config/env.js`
Centralized config that reads `process.env` once and fails fast on missing required vars.

```js
// server/config/env.js
const required = ['MONGO_URI', 'JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];

for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
}

module.exports = {
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  loginRateLimit: {
    max: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '10', 10),
    windowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || '900000', 10),
  },
};
```

---

### Phase 2 — Backend: Admin Model

**Goal:** Create the Admin Mongoose model.

#### 2.1 Create `server/models/Admin.js`

```js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
```

---

### Phase 3 — Backend: Seed Script

**Goal:** Create a one-time script to seed the admin user. Never expose this as an endpoint.

#### 3.1 Create `server/scripts/seedAdmin.js`

- Connects to MongoDB using `server/config/db.js`
- Reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from env
- Hashes password with bcrypt (saltRounds: 12)
- Uses `Admin.findOneAndUpdate({ email }, ..., { upsert: true })` for idempotency
- Logs success and exits

**Run once:**
```bash
node server/scripts/seedAdmin.js
```

---

### Phase 4 — Backend: Auth Middleware

**Goal:** Create `requireAdminAuth` middleware that protects all admin dashboard routes.

#### 4.1 Create `server/middleware/requireAdminAuth.js`

Logic:
1. Read JWT from `req.cookies.adminToken`
2. If missing → `401 { success: false, error: 'Not authenticated' }`
3. Verify with `jwt.verify(token, JWT_SECRET)`
4. If expired/invalid → `401 { success: false, error: 'Token invalid or expired' }`
5. Look up admin by `payload.id` in `Admin` model
6. If not found → `401`
7. If `admin.role !== 'admin'` → `403 { success: false, error: 'Forbidden' }`
8. Attach `req.admin = admin` and call `next()`

---

### Phase 5 — Backend: Controllers

#### 5.1 Create `server/controllers/adminAuthController.js`

**`loginAdmin`** — `POST /api/admin/auth/login`
- Validate: email (string, valid format) and password (string, non-empty) — return `400` if missing
- Find admin by email; if not found → `401 { success: false, error: 'Invalid credentials' }` (no email enumeration)
- Compare password with bcrypt; if mismatch → same `401` response
- Sign JWT: `{ id: admin._id, role: admin.role }`, expires per config
- Set HTTP-only cookie: `adminToken`, `httpOnly: true`, `secure: NODE_ENV === 'production'`, `sameSite: 'strict'` (dev) or `'none'` (cross-domain prod), `maxAge` matching JWT expiry
- Return `200 { success: true, data: { email: admin.email, role: admin.role } }`

**`logoutAdmin`** — `POST /api/admin/auth/logout`
- Clear `adminToken` cookie with same options
- Return `200 { success: true, message: 'Logged out' }`

**`getAdminSession`** — `GET /api/admin/auth/me`
- Protected by `requireAdminAuth` middleware
- Return `200 { success: true, data: { email: req.admin.email, role: req.admin.role } }`

#### 5.2 Create `server/controllers/adminDashboardController.js`

**`getContactMessages`** — `GET /api/admin/contact-messages`
- Query params: `page` (default 1), `limit` (default 20)
- Parse and validate as positive integers; clamp limit to max 100
- `ContactMessage.find().sort({ createdAt: -1 }).skip(skip).limit(limit)`
- `ContactMessage.countDocuments()` for total
- Return `200 { success: true, data: { messages, page, limit, total } }`

**`getNewsletterSubscribers`** — `GET /api/admin/newsletter-subscribers`
- Same pagination pattern
- `NewsletterSubscriber.find().sort({ createdAt: -1 }).skip(skip).limit(limit)`
- Return `200 { success: true, data: { subscribers, page, limit, total } }`

---

### Phase 6 — Backend: Routes

#### 6.1 Create `server/routes/adminRoutes.js`

```
POST   /login          → adminAuthController.loginAdmin        (rate limited)
POST   /logout         → adminAuthController.logoutAdmin
GET    /me             → requireAdminAuth, adminAuthController.getAdminSession
GET    /contact-messages       → requireAdminAuth, adminDashboardController.getContactMessages
GET    /newsletter-subscribers → requireAdminAuth, adminDashboardController.getNewsletterSubscribers
```

Rate limit config for `/login`:
- Use `express-rate-limit` (already installed)
- Max: `LOGIN_RATE_LIMIT_MAX` requests per `LOGIN_RATE_LIMIT_WINDOW_MS`
- Standard headers, legacy headers disabled

#### 6.2 Mount in `server/app.js`

```js
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);
```

Ensure `cookie-parser` middleware is present before routes:
```js
const cookieParser = require('cookie-parser');
app.use(cookieParser());
```

Check if `cookie-parser` is already installed; install if not.

---

### Phase 7 — Backend: Tests

**File:** `server/tests/admin.test.js`

Use Jest + Supertest. Tests must cover:

**Auth:**
- `POST /api/admin/auth/login` — valid credentials → 200 + cookie set
- `POST /api/admin/auth/login` — wrong password → 401
- `POST /api/admin/auth/login` — missing fields → 400
- `POST /api/admin/auth/login` — unknown email → 401 (no enumeration)
- `GET /api/admin/auth/me` — with valid cookie → 200
- `GET /api/admin/auth/me` — no cookie → 401
- `POST /api/admin/auth/logout` → 200 + cookie cleared

**Dashboard:**
- `GET /api/admin/contact-messages` — authenticated → 200 + pagination shape
- `GET /api/admin/contact-messages` — unauthenticated → 401
- `GET /api/admin/newsletter-subscribers` — authenticated → 200 + pagination shape
- `GET /api/admin/newsletter-subscribers` — unauthenticated → 401

**Rate limit:**
- `POST /api/admin/auth/login` — exceed limit → 429

---

### Phase 8 — Frontend: Shared API Client

**Goal:** Create `client/src/lib/api.js` as required by CLAUDE.md. All API calls go through this.

#### 8.1 Create `client/src/lib/api.js`

```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // sends HTTP-only cookies automatically
});

export default api;
```

---

### Phase 9 — Frontend: Admin Service

#### 9.1 Create `client/src/services/adminService.js`

Functions (all use `api` from `lib/api.js`):

```js
export const loginAdmin = (email, password) =>
  api.post('/api/admin/auth/login', { email, password });

export const logoutAdmin = () =>
  api.post('/api/admin/auth/logout');

export const getAdminSession = () =>
  api.get('/api/admin/auth/me');

export const getContactMessages = (page = 1, limit = 20) =>
  api.get('/api/admin/contact-messages', { params: { page, limit } });

export const getNewsletterSubscribers = (page = 1, limit = 20) =>
  api.get('/api/admin/newsletter-subscribers', { params: { page, limit } });
```

---

### Phase 10 — Frontend: Redux Auth Slice

#### 10.1 Create `client/src/redux/auth/authSlice.js`

State shape:
```js
{
  admin: null,       // { email, role } or null
  isChecked: false,  // true after /me check completes (prevents flash)
}
```

Actions:
- `setAdmin(adminData)` — set on login or session restore
- `clearAdmin()` — set on logout or 401
- `setChecked()` — mark session check done

#### 10.2 Register slice in `client/src/redux/store.js`

Add `auth: authReducer` to the root reducer.

---

### Phase 11 — Frontend: TanStack Query Hooks

Follow CLAUDE.md: wrap TanStack Query in custom hooks under `hooks/queries/` and `hooks/mutations/`.

#### 11.1 `client/src/hooks/queries/useAdminSession.js`
- `useQuery({ queryKey: ['adminSession'], queryFn: getAdminSession })`
- On success: dispatch `setAdmin` + `setChecked`
- On error: dispatch `clearAdmin` + `setChecked`

#### 11.2 `client/src/hooks/queries/useContactMessages.js`
- `useQuery({ queryKey: ['contactMessages', page], queryFn: () => getContactMessages(page) })`
- Enabled only when admin is authenticated

#### 11.3 `client/src/hooks/queries/useNewsletterSubscribers.js`
- `useQuery({ queryKey: ['newsletterSubscribers', page], queryFn: () => getNewsletterSubscribers(page) })`
- Enabled only when admin is authenticated

#### 11.4 `client/src/hooks/mutations/useLoginAdmin.js`
- `useMutation({ mutationFn: ({ email, password }) => loginAdmin(email, password) })`
- On success: dispatch `setAdmin`, navigate to `/admin/dashboard`
- On error: surface error message to form

#### 11.5 `client/src/hooks/mutations/useLogoutAdmin.js`
- `useMutation({ mutationFn: logoutAdmin })`
- On success: dispatch `clearAdmin`, invalidate `adminSession` query, navigate to `/admin/login`

---

### Phase 12 — Frontend: Components

#### 12.1 Create `client/src/components/AdminRoute/AdminRoute.jsx`

Protected route wrapper:
- Reads `admin` and `isChecked` from Redux
- While `!isChecked` → render loading spinner (`<Spinner />`)
- If `isChecked && !admin` → `<Navigate to="/admin/login" replace />`
- If `isChecked && admin` → render `<Outlet />`

#### 12.2 Create `client/src/Pages/Login/AdminLogin.jsx`

- Controlled form: email + password inputs
- Uses `useLoginAdmin` mutation
- Disable submit while loading
- Show inline error message on failure
- On mount: if already authenticated, redirect to `/admin/dashboard`
- Tailwind styling, accessible labels

#### 12.3 Create `client/src/pages/AdminDashboard/AdminDashboard.jsx`

Two-tab layout: "Contact Messages" and "Newsletter Subscribers"

**Contact Messages tab:**
- Uses `useContactMessages(page)` hook
- Table columns: Name, Email, Subject, Message (truncated), Date
- Loading state: skeleton or spinner
- Empty state: "No messages yet"
- Pagination controls: Prev / Next, current page display

**Newsletter Subscribers tab:**
- Uses `useNewsletterSubscribers(page)` hook
- Table columns: Email, Subscribed Date
- Same loading/empty/pagination pattern

**Header:**
- Shows logged-in admin email
- Logout button (uses `useLogoutAdmin` mutation)

---

### Phase 13 — Frontend: Router Integration

#### 13.1 Update `client/src/App.jsx`

Add admin routes inside the existing `<Routes>`:

```jsx
import AdminRoute from './components/AdminRoute/AdminRoute';
import AdminLogin from './Pages/Login/AdminLogin';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';

// Inside <Routes>:
<Route path="/admin/login" element={<AdminLogin />} />
<Route element={<AdminRoute />}>
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
</Route>
```

#### 13.2 Session bootstrap in `App.jsx` or root layout

Call `useAdminSession()` once at app root so Redux auth state is populated before any route renders. This prevents the protected route from flashing the login screen on refresh.

---

### Phase 14 — Frontend: Tests

**File:** `client/test/admin/AdminLogin.test.jsx`

- Renders login form correctly
- Shows error on invalid credentials (mock mutation failure)
- Redirects on success (mock mutation success + Redux dispatch)
- Disables submit while loading

**File:** `client/test/admin/AdminDashboard.test.jsx`

- Renders contact messages table from mock data
- Renders subscribers table from mock data
- Shows empty state when arrays are empty
- Logout button calls mutation

---

## File Checklist

### New Backend Files
```
server/config/env.js
server/models/Admin.js
server/scripts/seedAdmin.js
server/middleware/requireAdminAuth.js
server/controllers/adminAuthController.js
server/controllers/adminDashboardController.js
server/routes/adminRoutes.js
server/tests/admin.test.js
```

### Modified Backend Files
```
server/app.js                  — mount adminRoutes, add cookie-parser
.env                           — add JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, etc.
.env.example                   — mirror new vars with placeholders
```

### New Frontend Files
```
client/src/lib/api.js
client/src/services/adminService.js
client/src/redux/auth/authSlice.js
client/src/hooks/queries/useAdminSession.js
client/src/hooks/queries/useContactMessages.js
client/src/hooks/queries/useNewsletterSubscribers.js
client/src/hooks/mutations/useLoginAdmin.js
client/src/hooks/mutations/useLogoutAdmin.js
client/src/components/AdminRoute/AdminRoute.jsx
client/src/Pages/Login/AdminLogin.jsx
client/src/pages/AdminDashboard/AdminDashboard.jsx
client/test/admin/AdminLogin.test.jsx
client/test/admin/AdminDashboard.test.jsx
```

### Modified Frontend Files
```
client/src/redux/store.js      — register auth reducer
client/src/App.jsx             — add /admin/login and /admin/dashboard routes
```

---

## Implementation Order

1. Phase 1 — env vars + `server/config/env.js`
2. Phase 2 — `Admin` model
3. Phase 3 — `seedAdmin.js` script
4. Phase 4 — `requireAdminAuth` middleware
5. Phase 5 — `adminAuthController` + `adminDashboardController`
6. Phase 6 — `adminRoutes.js` + mount in `app.js`
7. Phase 7 — backend tests
8. Phase 8 — `client/src/lib/api.js`
9. Phase 9 — `adminService.js`
10. Phase 10 — Redux `authSlice`
11. Phase 11 — TanStack Query hooks
12. Phase 12 — React components
13. Phase 13 — Router integration
14. Phase 14 — frontend tests

---

## Security Checklist

- [ ] JWT stored only in HTTP-only cookie (never localStorage)
- [ ] Cookie `secure: true` in production
- [ ] Login returns same error for wrong email and wrong password (no enumeration)
- [ ] Rate limit on login endpoint (env-configurable)
- [ ] `requireAdminAuth` checks both token validity AND `role === 'admin'`
- [ ] No public admin registration endpoint
- [ ] Admin password hashed with bcrypt (saltRounds: 12)
- [ ] CORS restricted to `CLIENT_URL`
- [ ] Sensitive fields (`password`) never returned from controllers
- [ ] `server/config/env.js` fails fast on missing required vars
