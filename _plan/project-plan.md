# DevKofi — Project Plan

## Current State Summary

DevKofi is a MERN mentorship platform with a Vite React frontend and Express/MongoDB backend. The core user-facing features are built and deployed (Vercel + Heroku).

### What is built and working

- **Homepage** — Landing, feature sections, pricing, all wired up
- **Auth** — Register, login, JWT-based auth with role gating (student/admin)
- **Onboarding** — Multi-step intake form writing to `user.profile`
- **Dashboard** — Student dashboard (plan summary, readiness, next action, enrollment status) and admin dashboard
- **Settings** — Full profile editing page with dirty-state tracking, completeness meter, plan/support summary, and save/reset flows
- **Enrollment** — Join flow, enrollment status cards, admin approval/reject/activate
- **Team access requests** — Enterprise page, team enrollment, admin review
- **Pricing** — Server-driven pricing plans, client-side pricing page
- **Projects** — Projects page with project list
- **Admin users** — Admin-only user management view
- **Navigation** — Header, side nav, private/admin route guards, scroll-to-top
- **Backend API** — Auth, profile, onboarding, enrollment, access requests, dashboard summary, pricing, projects, team, admin routes

### What is deployed

- Frontend: Vercel (devkofi.com)
- Backend: Heroku (devkofi-883f1d7b0ba0.herokuapp.com)
- Database: MongoDB (Atlas)

---

## Outstanding Work — Prioritized Phases

### Phase 1 — Security and Production Hardening

**Priority: High — should ship before any new features**

These are gaps that affect the live deployed app.

#### 1.1 CORS lockdown

`server/app.js:25-31` currently uses `origin: "*"`. This must be tightened before any sensitive data flows through the API.

**Tasks:**
- [ ] Replace wildcard CORS with environment-driven allowed origins
- [ ] Use `CLIENT_URL` env var for the frontend origin
- [ ] Test that deployed frontend still works with restricted CORS
- [ ] Update `.env.example` with `CLIENT_URL`

#### 1.2 Rate limiting

No rate limiting exists on any endpoint. Auth endpoints are especially vulnerable.

**Tasks:**
- [ ] Add `express-rate-limit` to root dependencies
- [ ] Apply strict rate limit to `/api/auth/register` and `/api/auth/login`
- [ ] Apply moderate rate limit to write endpoints (PATCH, POST)
- [ ] Apply lenient global rate limit to all routes

#### 1.3 Input validation hardening

Some controllers validate inline, but there is no consistent validation layer.

**Tasks:**
- [ ] Evaluate whether to adopt `express-validator` or `zod` as a standard
- [ ] Add validation middleware for auth routes (register body shape, email format, password strength)
- [ ] Add validation middleware for enrollment and access request routes
- [ ] Add validation middleware for team routes

#### 1.4 Environment variable safety

Some backend values are still hard-coded (e.g., admin email recipients in email utilities).

**Tasks:**
- [ ] Audit `server/utility/` for hard-coded emails and secrets
- [ ] Move all recipients and config values to `.env`
- [ ] Add missing entries to `.env.example`
- [ ] Add fail-fast guards for critical env vars on server startup

---

### Phase 2 — Testing Coverage

**Priority: High — locks down existing features before new development**

#### 2.1 Backend test expansion

`server/__test__/coreFlows.test.js` exists but coverage is limited.

**Tasks:**
- [ ] Add profile PATCH tests (allowed fields, forbidden fields, validation errors)
- [ ] Add onboarding intake tests (happy path, missing required fields)
- [ ] Add enrollment flow tests (create, approve, reject, activate)
- [ ] Add access request flow tests
- [ ] Add team enrollment tests
- [ ] Add auth edge case tests (duplicate email, invalid credentials, expired token)
- [ ] Add rate limit tests if rate limiting is added in Phase 1

#### 2.2 Frontend test coverage

Client-side test coverage is minimal.

**Tasks:**
- [ ] Add Vitest tests for Settings page (form hydration, dirty state, save flow, validation)
- [ ] Add Vitest tests for Login and Register pages (form submission, error handling)
- [ ] Add Vitest tests for Dashboard (student vs admin rendering, data display)
- [ ] Add Vitest tests for Onboarding flow
- [ ] Add Vitest tests for EnrollmentStatusCard behavior
- [ ] Add Vitest tests for Header/SideNav navigation state

#### 2.3 E2E baseline

Playwright config exists (`playwright.config.js`) but tests are minimal.

**Tasks:**
- [ ] Add E2E test for register → onboarding → dashboard flow
- [ ] Add E2E test for login → settings → save flow
- [ ] Add E2E test for unauthenticated route protection
- [ ] Add E2E test for admin user management

---

### Phase 3 — Auth Improvements

**Priority: Medium — improves user experience and security**

#### 3.1 Password reset flow

No password reset exists.

**Tasks:**
- [ ] Add `POST /api/auth/forgot-password` endpoint (sends reset email with token)
- [ ] Add `POST /api/auth/reset-password` endpoint (accepts token + new password)
- [ ] Add `ForgotPassword` page (`client/src/Pages/ForgotPassword/`)
- [ ] Add `ResetPassword` page (`client/src/Pages/ResetPassword/`)
- [ ] Add routes in `App.jsx`
- [ ] Add link from Login page

#### 3.2 Email verification

No email verification exists for new accounts.

**Tasks:**
- [ ] Add `isEmailVerified` field to User model
- [ ] Send verification email on registration
- [ ] Add `GET /api/auth/verify-email/:token` endpoint
- [ ] Add `VerifyEmail` page or confirmation view
- [ ] Gate enrollment behind verified email (optional for v1)

#### 3.3 Account identity editing

Settings page currently shows name/email as read-only because `PATCH /api/profile/me` only updates `profile.*`.

**Tasks:**
- [ ] Add `PATCH /api/auth/me` endpoint for `firstName`, `lastName` updates
- [ ] Add email change flow with re-verification (optional, can defer)
- [ ] Update Settings page to allow name editing
- [ ] Add `useUpdateAccountMutation` hook

---

### Phase 4 — Mentor Portal

**Priority: Medium — core product expansion**

The dashboard currently shows summary cards but no actionable mentor/student interaction tools.

#### 4.1 Messaging system

**Tasks:**
- [ ] Design message model (sender, receiver, content, timestamps, read status)
- [ ] Add `Message` Mongoose model
- [ ] Add `POST /api/messages` and `GET /api/messages/:conversationId` endpoints
- [ ] Add `Messages` page with conversation list and message thread
- [ ] Add `useMessagesQuery` and `useSendMessageMutation` hooks
- [ ] Add unread message count to dashboard
- [ ] Evaluate whether Socket.IO is needed (if real-time is required) or polling is sufficient for v1

#### 4.2 Assignments / milestones

**Tasks:**
- [ ] Design assignment model (title, description, dueDate, status, feedback)
- [ ] Add `Assignment` Mongoose model
- [ ] Add CRUD endpoints for assignments (admin creates, student views/submits)
- [ ] Add `Assignments` page or section in student dashboard
- [ ] Add admin assignment management in admin dashboard
- [ ] Add hooks for assignment queries and mutations

#### 4.3 Session scheduling

**Tasks:**
- [ ] Design session model (date, time, mentor, student, notes, status)
- [ ] Add `Session` Mongoose model
- [ ] Add endpoints for session CRUD
- [ ] Add session display in student and admin dashboards
- [ ] Add calendar or schedule view (optional for v1)

---

### Phase 5 — Download Center and Templates

**Priority: Medium — marketing and onboarding value**

README mentions a templates gallery and download handler, but current implementation is limited.

#### 5.1 Template catalogue

**Tasks:**
- [ ] Verify `GET /api/templates` endpoint returns correct data from config
- [ ] Add template status badges (available, planned, coming soon)
- [ ] Add download tracking (optional)
- [ ] Add template preview/description pages

#### 5.2 ZIP generation

**Tasks:**
- [ ] Automate template ZIP generation from source repos or folders
- [ ] Add `GET /api/download?name=` streaming endpoint
- [ ] Add download button in template cards
- [ ] Gate downloads behind authentication if needed

---

### Phase 6 — Analytics and Observability

**Priority: Low — nice-to-have for growth tracking**

#### 6.1 Client analytics

**Tasks:**
- [ ] Add lightweight page-view tracking (environment-toggled)
- [ ] Track key conversion events (register, onboarding complete, enrollment)
- [ ] Keep analytics provider pluggable via env config

#### 6.2 Server logging

**Tasks:**
- [ ] Add structured request logging (only if needed — AGENT.md says no Morgan by default)
- [ ] Add error tracking for production (Sentry or similar, env-toggled)
- [ ] Add health check improvements for monitoring

---

### Phase 7 — UI Polish and UX Improvements

**Priority: Low — ongoing refinement**

#### 7.1 Responsive audit

**Tasks:**
- [ ] Audit all pages for mobile responsiveness
- [ ] Fix any layout issues in Settings, Dashboard, Onboarding
- [ ] Test on common mobile viewports

#### 7.2 Loading and error states

**Tasks:**
- [ ] Add skeleton loaders for dashboard cards
- [ ] Add consistent error boundaries
- [ ] Add empty state illustrations where useful

#### 7.3 Dark mode

AGENT.md mentions dark-mode friendly. Currently not implemented.

**Tasks:**
- [ ] Add CSS custom properties for color theming
- [ ] Add dark mode toggle (stored in localStorage)
- [ ] Update SCSS across all components

---

## Implementation Order Recommendation

```
Phase 1 (Security)  →  Phase 2 (Tests)  →  Phase 3 (Auth)
                                           →  Phase 4 (Portal)
                                           →  Phase 5 (Downloads)
Phase 6 (Analytics) and Phase 7 (Polish) are ongoing/parallel
```

Phases 1 and 2 should ship first because they protect existing functionality. Phases 3-5 can be worked in parallel or sequenced based on product priority. Phases 6-7 are continuous improvement.

---

## Key Technical Decisions to Make

1. **Validation library** — Pick one (express-validator vs zod) and standardize
2. **Messaging architecture** — Polling vs Socket.IO for mentor-student chat
3. **Analytics provider** — Lightweight custom vs third-party (Plausible, PostHog, etc.)
4. **Email provider** — Currently Gmail app password via Nodemailer; may need to move to a transactional service (SendGrid, Resend) for reliability at scale
5. **File storage** — Templates currently reference local/config files; may need cloud storage (S3, Cloudinary) for scale

---

## Files Reference

### Server entry points
- `server/app.js` — Express app setup, middleware, route mounting
- `server/server.js` — Server start + DB bootstrap

### Key controllers
- `server/controllers/authController.js` — Register, login, me
- `server/controllers/profileController.js` — Profile CRUD, onboarding intake, onboarding status
- `server/controllers/enrollmentController.js` — Enrollment management
- `server/controllers/dashboardController.js` — Student dashboard summary
- `server/controllers/adminController.js` — Admin operations
- `server/controllers/adminUsersController.js` — Admin user management
- `server/controllers/accessRequestController.js` — Team access requests
- `server/controllers/teamController.js` — Team operations

### Key client pages
- `client/src/App.jsx` — Router config
- `client/src/Pages/Home/Home.jsx` — Homepage
- `client/src/Pages/Dashboard/Dashboard.jsx` — Dashboard shell (student/admin)
- `client/src/Pages/Settings/Settings.jsx` — Profile settings
- `client/src/Pages/Onboarding/Onboarding.jsx` — Intake form
- `client/src/Pages/Join/Join.jsx` — Enrollment join flow
- `client/src/Pages/Enterprise/Enterprise.jsx` — Team access page

### State management
- `client/src/redux/auth/authSlice.js` — Auth state (user, token)
- `client/src/redux/navigation/navigationSlice.js` — UI state (sidenav open/close)
- `client/src/hooks/` — React Query hooks for all server state
