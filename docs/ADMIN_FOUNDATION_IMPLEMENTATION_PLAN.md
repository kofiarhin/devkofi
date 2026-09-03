# DevKofi Admin Foundation — Implementation Plan

**Status:** Proposed; not approved for implementation  
**Specification:** `docs/ADMIN_FOUNDATION_SPEC.md`  
**Baseline:** `main` at `a2a9019b98c91faa591bcf402f547525d7f16407`  
**Planned branch:** `feat/admin-foundation`  
**Method:** Vertical slices using RED → GREEN → REFACTOR → VERIFY  
**Last updated:** 2026-09-03

## 1. Delivery Rules

- Obtain explicit approval of the specification and this plan before implementation.
- Revalidate the latest `main` commit before creating the implementation branch.
- Keep implementation off `main`.
- Stop if the working tree or target branch contains unrelated changes.
- Do not add dependencies, modify deployment configuration, merge, or deploy without separate approval.
- Treat authentication, authorization, CSRF, schema, and destructive-action changes as governed changes.
- If implementation discovers a material scope, architecture, schema, permission, or security change, stop and revise the specification/plan.
- Each slice must be independently reviewable.
- Write the smallest meaningful failing test first, confirm RED, implement, confirm GREEN, refactor, then run neighboring regression checks.

## 2. Preconditions

Before Slice 1:

1. Kofi confirms that registered member accounts are out of scope.
2. Kofi approves DevKofi Admin as a second authorized writer to the shared `blogposts` collection.
3. Kofi approves archive semantics for articles/messages and hard removal for newsletter subscribers.
4. Confirm the production client and API hosts.
5. Confirm access to non-secret deployment configuration evidence needed to diagnose login.
6. Record the starting commit and branch.
7. Inspect open admin-related branches/PRs to avoid duplicate work.
8. Run or inspect the current targeted test baseline.

Expected baseline commands:

```bash
npm test -- --runInBand
npm run test:client -- --run
npm --prefix client run lint
npm --prefix client run build
```

If repository-wide checks have unrelated known failures, record exact failures and continue only with an approved scoped verification strategy.

## 3. Slice 1 — Authentication Diagnosis and Contract Tests

### Outcome

Establish evidence for why production login fails and lock the intended authentication contract before modifying behavior.

### RED

Add or refine server tests for:

- empty and malformed login payloads;
- normalized email;
- invalid credentials;
- valid login response and cookie attributes by environment;
- unauthenticated and authenticated `/auth/me`;
- expired/invalid token;
- idempotent logout;
- login rate limiting;
- allowed and denied CORS origins with credentials.

Add or refine client tests for:

- required fields;
- one submitted request with current field values;
- pending state and duplicate-submit prevention;
- invalid credentials;
- 429 response;
- network/server failure;
- successful navigation;
- refresh session restoration;
- 401 session clearing.

Confirm new tests fail for missing behavior or expose the production-contract mismatch.

### Diagnose

Inspect deployed evidence without exposing secrets:

- browser network request URL, request body presence, origin, status, response, and cookie acceptance;
- API environment variable presence by name only;
- production/staging CORS origin list;
- admin record existence and password-hash compatibility;
- relevant API logs with secrets redacted.

### GREEN

Implement the smallest required correction in existing auth/config/client boundaries.

Likely files:

- `server/config/env.js`
- `server/controllers/adminAuthController.js`
- `server/utils/adminAuth.js`
- `server/routes/adminRoutes.js`
- `server/app.js`
- `client/src/lib/api.js`
- `client/src/Pages/Login/AdminLogin.jsx`
- auth hooks/slice tests

Do not guess cookie settings. Base changes on the deployed topology evidence.

### VERIFY

- Run focused auth server tests.
- Run focused client auth/login tests.
- Browser-check local login, refresh, protected redirect, logout, and error states.
- Record whether production remains unverified until separately deployed.

## 4. Slice 2 — Shared Admin API Utilities

### Outcome

Create consistent, safe foundations for subsequent admin endpoints.

### RED

Test:

- ObjectId validation;
- bounded pagination;
- escaped/bounded search;
- safe response projections;
- duplicate-key-to-409 mapping;
- centralized error propagation;
- unauthorized access for every protected route family.

### GREEN

Extract focused utilities only where they reduce duplication:

- pagination parser;
- ObjectId guard;
- escaped search helper;
- explicit response mappers;
- article input validator.

Keep routes thin and avoid a generic abstraction layer.

### VERIFY

Run focused utility/controller tests plus existing admin regression tests.

## 5. Slice 3 — Admin Shell and Routing

### Outcome

Replace the single tabbed admin page with a scalable protected shell while preserving current functionality.

### RED

Client tests for:

- protected nested routes;
- active navigation state;
- desktop and mobile navigation;
- logout;
- keyboard access;
- route titles;
- current booking/message/subscriber components reachable at new routes;
- redirects from any retained legacy admin URLs.

### GREEN

Implement:

- `AdminLayout`;
- navigation configuration;
- overview, articles, bookings, messages, subscribers, and settings routes;
- shared page header;
- shared loading/error/empty-state components where justified;
- SCSS Module styling.

Move existing admin functionality rather than rewriting it.

Likely files:

- `client/src/App.jsx`
- `client/src/components/AdminRoute/AdminRoute.jsx`
- new admin layout/navigation components;
- existing admin dashboard and operation components;
- related SCSS Modules and tests.

### VERIFY

- Run focused routing/layout tests.
- Browser-check desktop and mobile navigation.
- Verify keyboard navigation and logout.
- Inspect console for errors.

## 6. Slice 4 — Dashboard Overview Vertical Slice

### Outcome

Deliver one database-backed overview request and usable overview page.

### RED — Server

Test `GET /api/admin/overview` for:

- 401 without admin session;
- correct counts for article statuses;
- correct upcoming/cancelled booking counts;
- correct unread/archive message counts;
- verified/unverified subscriber counts;
- deterministic recent activity ordering;
- safe response shape;
- empty database;
- database error propagation.

### GREEN — Server

Implement an overview controller using bounded aggregate/count queries. Do not return raw documents when normalized activity entries suffice.

Likely files:

- `server/controllers/adminOverviewController.js`
- `server/routes/adminRoutes.js`
- server tests

### RED — Client

Test:

- loading;
- successful metric cards;
- empty values;
- error with retry;
- recent activity;
- accessible labels.

### GREEN — Client

Add:

- service request;
- `useAdminOverview` query hook;
- overview page;
- metric cards/recent activity UI.

### VERIFY

- Focused server/client tests.
- Browser-check layout at desktop and mobile widths.
- Compare displayed values with controlled fixtures/local database evidence.

## 7. Slice 5 — Article Model Compatibility and Admin Read APIs

### Outcome

Safely expand the shared article lifecycle and deliver the admin list/detail read path.

### RED — Model

Test:

- existing IdeaHub-style published document remains valid;
- draft permits null `publishedAt`;
- published requires complete publishable fields at the application boundary;
- archived timestamp behavior;
- status enum;
- unique slug;
- origin defaults for admin records;
- public queries exclude draft/archived.

### GREEN — Model

Expand `BlogPost` compatibly. Avoid bulk migration. Preserve the collection name and existing published documents.

### RED — API

Test:

- protected paginated list;
- search by escaped title/slug/excerpt/tag input;
- status filter;
- stable sorting;
- invalid filters;
- article detail;
- invalid/missing IDs;
- no secret/internal leakage.

### GREEN — API

Add admin article list/detail controllers and routes with normalized responses.

### VERIFY

- Model tests.
- Admin article API tests.
- Existing public blog API/model regression tests.
- Confirm existing fixtures still read successfully.

## 8. Slice 6 — Article Create/Edit UI and APIs

### Outcome

An admin can create a draft, edit it, and preview its public rendering.

### RED — Server

Test:

- valid draft creation;
- admin origin metadata;
- field normalization;
- invalid/oversized fields;
- unsafe/malformed URLs;
- cover image alt requirement;
- duplicate slug 409;
- allowlisted update fields;
- invalid/missing IDs;
- archived edit restrictions.

### GREEN — Server

Add create and patch endpoints using explicit validated payload construction.

### RED — Client

Test:

- article list loading/empty/error;
- search/filter/pagination;
- create form validation;
- save draft;
- edit existing draft;
- duplicate-slug feedback;
- preview using public Markdown behavior;
- unsaved-change warning;
- mutation success and cache invalidation.

### GREEN — Client

Implement article services, query/mutation hooks, list page, form page, and preview.

Use local form state. Do not add a form or editor dependency.

### VERIFY

- Focused server/client tests.
- Browser-create and edit a disposable local test article.
- Verify preview, validation, unsaved warning, and network payload.
- Do not write production data.

## 9. Slice 7 — Article Publish, Unpublish, Archive, Restore

### Outcome

Complete the controlled article lifecycle.

### RED — Server

Test:

- publish valid draft;
- reject incomplete draft publication;
- set/preserve `publishedAt` correctly;
- unpublish to draft;
- archive draft and published article;
- reject publishing archived article;
- restore archived article to draft;
- idempotency/conflict rules;
- authorization on all lifecycle endpoints;
- public visibility changes by status.

### GREEN — Server

Implement explicit lifecycle endpoints. Do not implement hard deletion.

### RED — Client

Test:

- lifecycle actions and confirmation dialogs;
- status labels;
- disabled invalid actions;
- successful invalidation of list, detail, overview, and public blog queries;
- failed mutation recovery.

### GREEN — Client

Add lifecycle controls to article list/detail/edit surfaces.

### VERIFY

- Full article model/API/client suite.
- Browser-check draft → publish → unpublish → archive → restore.
- Confirm public blog only shows published state.

## 10. Slice 8 — Contact-Message Management

### Outcome

Complete safe message triage without hard deletion.

### RED — Model/API

Test:

- model defaults for archive fields;
- paginated search;
- read/unread/archive filters;
- read-state mutation and `readAt`;
- archive and restore timestamps;
- GET detail has no mutation side effect;
- invalid/missing IDs;
- authorization;
- overview invalidation expectations.

### GREEN — Server

Extend the model compatibly and add explicit message mutation routes.

### RED — Client

Test:

- search/filter/pagination;
- message detail;
- mark read/unread;
- archive/restore confirmation;
- list and overview query invalidation;
- loading/empty/error states.

### GREEN — Client

Implement the message management page and hooks while reusing the current detail surface where practical.

### VERIFY

Run focused tests and browser-check all states.

## 11. Slice 9 — Newsletter-Subscriber Management

### Outcome

Provide safe subscriber administration without exposing verification secrets.

### RED — Server

Test:

- response projection excludes verification token fields;
- search and verified-state filters;
- bounded pagination;
- exports exclude secrets;
- authenticated hard removal;
- invalid/missing IDs;
- unauthorized rejection;
- repeat removal behavior.

### GREEN — Server

Update list projection/filtering and add removal route.

### RED — Client

Test:

- list/search/filter/pagination;
- CSV/JSON export regression;
- confirmation names the subscriber;
- successful removal and cache invalidation;
- failed removal feedback.

### GREEN — Client

Implement subscriber management in the admin shell.

### VERIFY

- Focused API and UI tests.
- Inspect list/export payloads to confirm secrets are absent.
- Browser-check export and disposable local subscriber removal only.

## 12. Slice 10 — Booking Integration and Regression Hardening

### Outcome

Preserve existing booking CRUD while aligning it with the new shell and shared feedback patterns.

### RED

Add only missing tests for:

- new route integration;
- overview invalidation after update/cancel/delete;
- responsive management surface;
- confirmation focus behavior;
- stale/failed mutation behavior.

### GREEN

Move/adapt existing booking components with minimal behavior changes.

### VERIFY

- Existing booking server suite.
- Existing admin booking client suite.
- Browser-check filter, detail, edit, reschedule, cancel, and delete confirmation with local test data.

## 13. Slice 11 — Security Review and Hardening

### Outcome

Close security gaps introduced by new cookie-authenticated mutations and expanded data access.

### Assess

Document the production client/API origin relationship and select the appropriate CSRF defense. Do not implement a speculative mechanism before this evidence exists.

### RED

Test:

- cross-origin rejection;
- credentialed allowed-origin requests;
- unauthorized mutations;
- invalid/malicious update operators ignored or rejected;
- bounded payloads;
- safe error responses;
- token/password/subscriber-secret absence;
- public draft/archive exclusion.

### GREEN

Implement the smallest approved defenses, potentially including strict origin verification and a CSRF token flow if required by the deployed topology.

Any new dependency or material auth architecture change requires a revised approval.

### VERIFY

Run the complete admin security test subset and browser network inspection.

## 14. Slice 12 — Full Verification and Review

### Automated checks

Run and record exact outcomes:

```bash
npm test -- --runInBand
npm run test:client -- --run
npm --prefix client run lint
npm --prefix client run build
```

Also run focused commands during each slice so failures are attributable.

### Browser verification

Using an isolated local/test environment:

- login validation and success;
- refresh persistence;
- protected route redirect;
- logout;
- overview loading/success/error;
- article create/edit/preview/lifecycle;
- booking filters and mutations;
- message read/archive lifecycle;
- subscriber search/export/removal;
- desktop and mobile widths;
- keyboard navigation;
- dialogs and focus restoration;
- console and failed network requests.

### Review

Review the final diff against `review.md`.

Must-fix conditions include:

- unprotected admin endpoint;
- secret exposure;
- public draft/archive exposure;
- destructive action without confirmation;
- unexpected dependency/lockfile/deployment change;
- failure of required targeted checks;
- unrelated file changes;
- undocumented schema or architecture drift.

## 15. Slice 13 — Documentation and Project-Memory Synchronization

Only after implementation and verification evidence:

- update `context/current-state.md` with implemented versus verified state;
- update `context/architecture.md` for the two-writer blog boundary and admin architecture;
- update `context/decisions.md` with confirmed article lifecycle and destructive-action rules;
- update `context/lessons.md` only with evidence-backed lessons;
- update `roadmap.md` status proportionately;
- update relevant README/API documentation if behavior changed;
- synchronize the DevKofi IdeaHub record at a meaningful checkpoint and only with authorization.

Do not claim merged, deployed, released, or production-verified state without direct evidence.

## 16. Proposed Commit Boundaries

Commit only after the relevant slice passes its required checks and commit authority is confirmed.

1. `test(admin): define authentication contract`
2. `fix(admin): restore reliable admin sessions`
3. `feat(admin): add protected admin shell`
4. `feat(admin): add dashboard overview`
5. `feat(admin): add article read management`
6. `feat(admin): add article authoring`
7. `feat(admin): add article lifecycle controls`
8. `feat(admin): add message triage`
9. `feat(admin): add subscriber management`
10. `refactor(admin): integrate booking management`
11. `test(admin): harden security and regressions`
12. `docs(admin): record verified foundation state`

Commit boundaries may be combined when a smaller coherent vertical slice is clearer, but tests and implementation should remain together where practical.

## 17. Pull Request Handoff

After implementation verification and separate authorization:

- push `feat/admin-foundation`;
- open a draft PR targeting the latest `main`;
- include scope, schema changes, API routes, screenshots, test evidence, known baseline failures, security decisions, and manual verification;
- do not enable auto-merge;
- do not merge;
- do not deploy.

## 18. Completion Checklist

- [ ] Scope assumptions explicitly approved
- [ ] Production auth failure evidence captured
- [ ] Authentication tests and fix completed
- [ ] Admin shell completed
- [ ] Overview completed
- [ ] Article read/create/edit/preview/lifecycle completed
- [ ] Booking integration verified
- [ ] Message triage completed
- [ ] Subscriber management completed
- [ ] Security review completed
- [ ] Server tests passed or exact failures recorded
- [ ] Client tests passed or exact failures recorded
- [ ] Changed-file/relevant lint passed or exact failures recorded
- [ ] Production build passed or exact failure recorded
- [ ] Desktop/mobile browser verification completed
- [ ] Console/network evidence reviewed
- [ ] Final diff reviewed with no unresolved Must fix findings
- [ ] Project memory synchronized from evidence
- [ ] Draft PR created only if separately authorized
- [ ] Merge not performed
- [ ] Deployment not performed
