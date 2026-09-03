# DevKofi Admin Foundation — Technical Specification

**Status:** Proposed  
**Repository:** `kofiarhin/devkofi`  
**Baseline:** `main` at `a2a9019b98c91faa591bcf402f547525d7f16407`  
**Target implementation branch:** `feat/admin-foundation`  
**Last updated:** 2026-09-03

## 1. Purpose

Complete a secure, usable administration foundation for DevKofi. An authenticated administrator must be able to sign in, see an operational overview, manage articles, and manage the existing booking, contact-message, and newsletter-subscriber records without direct database access.

This specification extends the existing admin implementation. It does not replace working booking management or public blog presentation.

## 2. Current Repository Evidence

The baseline already contains:

- an `Admin` model with email, password hash, and role;
- JWT-based admin authentication using an HTTP-only cookie;
- login, logout, and session endpoints;
- a login rate limiter;
- a protected React route;
- an admin dashboard with bookings, contact messages, and newsletter subscribers;
- booking list, detail, update, cancel, and delete behavior;
- contact-message list and detail behavior;
- newsletter list and CSV/JSON export behavior;
- public read-only blog endpoints over the shared `blogposts` collection;
- server Jest/Supertest tests and client Vitest/Testing Library tests.

Known gaps:

- the production login shown on `devkofi.com/admin/login` is not working reliably and has not been runtime-diagnosed;
- there is no aggregate overview endpoint or overview UI;
- there is no admin article CRUD;
- messages cannot be marked read/unread or archived through admin APIs;
- subscribers cannot be searched or removed through the admin UI;
- the admin screen is a tabbed page rather than a scalable admin shell;
- the legacy `adminUsersController.js` imports absent models and is not routed;
- project memory currently defines IdeaHub as the only blog writer, which conflicts with adding DevKofi article writes.

## 3. Confirmed Product Outcome

An administrator can:

1. authenticate securely and maintain a session across refreshes;
2. enter a protected, responsive admin application;
3. view headline database-backed operational metrics and recent activity;
4. create, edit, preview, publish, unpublish, archive, restore, search, filter, and paginate articles;
5. manage existing bookings;
6. read, classify, archive, restore, and search contact messages;
7. search, filter, export, and remove newsletter subscribers;
8. receive clear loading, empty, success, validation, authorization, conflict, and server-error feedback.

## 4. Scope

### 4.1 In Scope

- production admin-login diagnosis and configuration correction;
- single-admin-compatible authentication and authorization;
- admin application shell and navigation;
- dashboard overview metrics;
- article management;
- booking management integration into the new shell;
- contact-message management;
- newsletter-subscriber management;
- API validation, pagination, filtering, and safe response shapes;
- targeted automated tests;
- browser verification;
- documentation and project-memory updates after implementation evidence exists.

### 4.2 Out of Scope

- public member registration or member authentication;
- a new customer/member `User` model;
- multi-tenant organizations;
- granular role/permission administration;
- WYSIWYG editing;
- media uploads or a new media-storage provider;
- article collaboration, review assignments, scheduled publishing, or revision history;
- direct generic MongoDB collection browsing;
- analytics providers;
- production data migrations that rewrite existing documents;
- deployment, merge, or production data mutation without separate approval.

### 4.3 Scope Assumption Requiring Approval

For this milestone, “users” are not new registered member accounts. Existing bookings, contact messages, and subscribers remain separate operational record types. The legacy unrouted `adminUsersController.js` is not revived.

## 5. Actors and Authorization

### Administrator

- Authenticates with an existing `Admin` record.
- May access every `/api/admin/**` management endpoint after authentication.
- May use all admin UI routes.

### Public visitor

- May access existing public routes.
- May list and view only published blog posts.
- Must never receive drafts, archived posts, admin metadata, subscriber verification tokens, admin password hashes, or internal errors.

### Authorization rule

Every management endpoint except login, logout, and session inspection must use `requireAdminAuth`. Client route protection is a usability layer, not the security boundary.

## 6. Authentication Contract

### 6.1 Existing Endpoints

| Method | Route | Behavior |
| --- | --- | --- |
| POST | `/api/admin/auth/login` | Validate credentials, rate-limit attempts, set session cookie, return safe admin identity |
| POST | `/api/admin/auth/logout` | Clear session cookie |
| GET | `/api/admin/auth/me` | Return authenticated state and safe admin identity |

### 6.2 Requirements

- Normalize email by trimming and lowercasing.
- Never reveal whether an email exists.
- Never return password hashes or JWTs in JSON.
- Keep the JWT in an HTTP-only cookie.
- Production cookie settings must work across the deployed client/API topology.
- CORS must allow only configured origins and must allow credentials.
- Login must reject empty, malformed, or oversized payloads before database work.
- Expired, malformed, or absent tokens must produce an unauthenticated state without leaking verification details.
- Logout must be idempotent.
- The UI must not display a stale authenticated dashboard after a 401.
- The login form must disable duplicate submissions and distinguish validation, invalid credentials, rate limit, connectivity, and unexpected server failures.

### 6.3 Production Diagnosis Checklist

Before changing authentication code, verify:

- `VITE_API_URL` points to the intended production API;
- the deployed API receives the submitted JSON body;
- the browser request includes the expected `Origin`;
- the API response includes the expected `Set-Cookie`;
- the browser accepts and returns the cookie;
- configured client origins match the production and staging URLs;
- `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `MONGO_URI` are present in the API environment;
- an admin record exists with a bcrypt-compatible password hash;
- seed behavior does not overwrite an existing administrator unexpectedly.

Secret values must not be logged or copied into documentation.

## 7. Admin Information Architecture

### 7.1 Routes

| Client route | Purpose |
| --- | --- |
| `/admin/login` | Authentication |
| `/admin/dashboard` | Overview |
| `/admin/articles` | Article list |
| `/admin/articles/new` | Create article |
| `/admin/articles/:articleId/edit` | Edit article |
| `/admin/bookings` | Booking management |
| `/admin/messages` | Contact-message management |
| `/admin/messages/:messageId` | Message detail |
| `/admin/subscribers` | Newsletter management |
| `/admin/settings` | Current admin identity and logout; no credential editing in this milestone |

### 7.2 Shell

The protected admin shell must provide:

- desktop sidebar and compact mobile navigation;
- current-section indication;
- admin email;
- logout action;
- page title and optional contextual action;
- keyboard-accessible navigation;
- responsive content width and tables;
- a consistent feedback pattern for loading, errors, empty data, success messages, and confirmations.

Use existing SCSS Modules. Do not introduce a new styling dependency.

## 8. Dashboard Overview

### 8.1 Endpoint

`GET /api/admin/overview`

Example response:

```json
{
  "success": true,
  "data": {
    "articles": {
      "total": 12,
      "published": 9,
      "draft": 2,
      "archived": 1
    },
    "bookings": {
      "total": 20,
      "upcoming": 4,
      "cancelled": 3
    },
    "messages": {
      "total": 34,
      "unread": 5,
      "archived": 2
    },
    "subscribers": {
      "total": 110,
      "verified": 96,
      "unverified": 14
    },
    "recentActivity": []
  }
}
```

### 8.2 Metric Rules

- Article totals use status counts.
- Upcoming bookings are `booked` records with `slotStart >= now`.
- Unread messages have `isRead: false` and are not archived.
- Subscriber totals separate verified and unverified.
- Recent activity is derived deterministically from existing record timestamps and returned as a normalized list; no new activity collection is introduced.
- The server owns metric definitions.
- The client makes one overview request and must not assemble metrics through unrestricted parallel collection reads.

## 9. Article Management

### 9.1 Model Changes

Extend `BlogPost` while preserving the existing `blogposts` collection:

- `status`: `draft | published | archived`;
- `publishedAt`: nullable; required by application validation when published;
- `archivedAt`: nullable;
- `updatedBy`: optional reference or safe admin identifier if a stable reference is available;
- `origin.generator`: preserve existing IdeaHub origin and use `devkofi-admin` for admin-created records;
- `origin.sourceType`: preserve existing values and use `manual` for admin-created records.

Existing published documents remain valid. No bulk rewrite is required.

Indexes:

- preserve unique slug;
- preserve status/published ordering;
- add indexes only when justified by actual list filters;
- any index change must be tested against the test database and documented.

### 9.2 Fields

| Field | Validation |
| --- | --- |
| title | required, trimmed, bounded length |
| slug | required, lowercase URL-safe value, unique |
| excerpt | required, trimmed, bounded length |
| content | required Markdown, bounded length |
| tags | normalized unique strings with count and length limits |
| sources | array of valid title/HTTPS URL pairs |
| coverImageUrl | nullable HTTPS URL |
| coverImageAlt | required when cover image exists |
| seoTitle | required, trimmed, bounded length |
| seoDescription | required, trimmed, bounded length |
| status | draft, published, or archived |
| publishedAt | server-controlled or validated timestamp for published content |

Raw HTML remains disabled in the public Markdown renderer.

### 9.3 Admin Endpoints

| Method | Route | Behavior |
| --- | --- | --- |
| GET | `/api/admin/articles` | Paginated list with search and status filter |
| POST | `/api/admin/articles` | Create draft or published article |
| GET | `/api/admin/articles/:articleId` | Fetch one article by MongoDB ID |
| PATCH | `/api/admin/articles/:articleId` | Update validated fields |
| POST | `/api/admin/articles/:articleId/publish` | Publish and set `publishedAt` |
| POST | `/api/admin/articles/:articleId/unpublish` | Return published article to draft |
| POST | `/api/admin/articles/:articleId/archive` | Soft-delete article |
| POST | `/api/admin/articles/:articleId/restore` | Restore archived article to draft |

No hard-delete article endpoint is included.

### 9.4 Article Behavior

- Duplicate slugs return `409`.
- Invalid IDs return `400`; missing records return `404`.
- Archived articles cannot be published until restored.
- Public endpoints continue filtering `status: "published"`.
- Admin list defaults to newest updated first.
- Search covers title, slug, excerpt, and tags using escaped input.
- Filters and pagination are server-side.
- The article form supports explicit Save Draft and Publish actions.
- Navigating away with unsaved edits requires confirmation.
- Preview renders the same Markdown component behavior used publicly.
- Mutations invalidate only relevant TanStack Query keys.

### 9.5 Shared IdeaHub Writer Boundary

Current project memory says IdeaHub is the only writer to `blogposts`. This milestone changes that rule:

- IdeaHub remains allowed to insert validated published posts.
- DevKofi Admin becomes a second authorized writer for manual lifecycle management.
- Unique slug remains the cross-writer conflict boundary.
- Both writers must conform to the compatible schema.
- No webhook, queue, or service-to-service call is introduced.
- The architecture and decision records must be updated only after implementation is approved and verified.

## 10. Booking Management

Preserve existing routes and behavior. Integrate the current booking UI into `/admin/bookings`.

Required behavior:

- paginated list;
- status, date-range, and text filters;
- detail view;
- edit contact fields;
- reschedule only to valid, available future slots;
- cancel and restore where allowed;
- delete only after explicit confirmation;
- invalidate relevant overview and booking queries after mutation;
- retain server-side slot-conflict enforcement.

No booking schema expansion is required by this milestone.

## 11. Contact-Message Management

### 11.1 Model

Preserve `isRead` and `readAt`. Add:

- `isArchived`: Boolean, default false, indexed only if query evidence justifies it;
- `archivedAt`: nullable Date.

### 11.2 Endpoints

| Method | Route | Behavior |
| --- | --- | --- |
| GET | `/api/admin/contact-messages` | Paginate, search, and filter by read/archive status |
| GET | `/api/admin/contact-messages/:messageId` | Return one message |
| PATCH | `/api/admin/contact-messages/:messageId/read-state` | Mark read or unread; maintain `readAt` |
| POST | `/api/admin/contact-messages/:messageId/archive` | Archive without deleting |
| POST | `/api/admin/contact-messages/:messageId/restore` | Restore archived message |

Opening a message may mark it read through an explicit mutation. A GET request must remain side-effect free.

No hard-delete message endpoint is included in the foundation.

## 12. Newsletter-Subscriber Management

### 12.1 Data Safety

Responses must never expose `verifyToken` or `verifyTokenExpiresAt`.

### 12.2 Endpoints

| Method | Route | Behavior |
| --- | --- | --- |
| GET | `/api/admin/newsletter-subscribers` | Paginate, search by email, filter verified state |
| DELETE | `/api/admin/newsletter-subscribers/:subscriberId` | Remove after explicit UI confirmation |
| GET | `/api/admin/newsletter/export/csv` | Preserve safe export |
| GET | `/api/admin/newsletter/export/json` | Preserve safe export |

Removal is a hard deletion because it represents removal from the mailing list. The success response must not return verification secrets. This action requires a clear confirmation identifying the email being removed.

## 13. API Conventions

- Routes remain thin.
- Controllers orchestrate request behavior.
- Domain validation is extracted into focused utilities where reuse or complexity warrants it.
- Use consistent envelopes:
  - success: `{ success: true, data }`;
  - failure: `{ success: false, error, details? }`.
- Validation details must be safe and field-oriented.
- Pagination response: `{ items, page, limit, total, totalPages }` within `data`.
- Maximum page size: 100.
- Search input must be trimmed, bounded, and regex-escaped.
- Invalid ObjectIds return 400 before database lookup.
- Duplicate-key errors become 409.
- Unexpected errors flow to centralized error handling.
- Do not expose stack traces in production.
- Do not add dependencies unless separately approved.

## 14. Client State and Data Flow

- TanStack Query owns all server records.
- Redux continues to store only admin session metadata.
- API calls stay in service modules.
- Query and mutation hooks stay outside page components.
- Components consume normalized hook results.
- Mutations invalidate the smallest relevant query set.
- Forms keep local draft state.
- No server collections are copied into Redux.

Suggested query-key families:

- `['adminSession']`
- `['adminOverview']`
- `['adminArticles', filters]`
- `['adminArticle', articleId]`
- `['adminBookings', filters]`
- `['adminMessages', filters]`
- `['adminMessage', messageId]`
- `['adminSubscribers', filters]`

## 15. UX and Accessibility Requirements

- Every form field has a programmatic label.
- Validation errors associate with fields and are announced.
- Dialogs trap focus, close with Escape where safe, and restore focus.
- Destructive confirmations name the affected record.
- Tables have headings and usable mobile overflow or card layouts.
- Status is not communicated by color alone.
- Active navigation exposes `aria-current`.
- Loading states do not cause route flicker.
- Empty states explain the available next action.
- Keyboard-only login, navigation, filtering, editing, publishing, and confirmation flows must work.
- Respect the existing DevKofi visual language and SCSS Module convention.

## 16. Security Requirements

- Authenticate and authorize on the server.
- Retain login rate limiting.
- Assess CSRF for cookie-authenticated mutations before implementation; implement an origin/CSRF defense appropriate to the separated production client/API topology.
- Allowlist CORS origins and credentialed methods.
- Use bounded body sizes and field lengths.
- Never log passwords, JWTs, subscriber tokens, or environment secrets.
- Never return secrets to the client.
- Do not accept arbitrary MongoDB filters, sort expressions, or update operators.
- Construct update payloads from explicit allowlists.
- Prevent mass assignment.
- Require explicit UI confirmation for archival/removal/deletion.
- Keep public blog queries restricted to published posts.

## 17. Error and Edge Cases

The implementation must cover:

- missing, invalid, and expired admin sessions;
- invalid login payload and rate limiting;
- database unavailable;
- invalid ObjectIds;
- missing records;
- duplicate article slug;
- concurrent article update conflict at least at slug/index level;
- malformed URLs and source arrays;
- draft without `publishedAt`;
- publishing incomplete content;
- archived record mutation;
- empty result sets;
- page number beyond available results;
- network interruption after a submitted mutation;
- stale cached overview after mutation;
- subscriber removal already completed;
- booking slot conflict.

## 18. Acceptance Criteria

### Authentication

- Valid configured admin credentials establish a working production-compatible session.
- Invalid credentials do not reveal account existence.
- Refresh retains a valid session.
- Unauthenticated users cannot access admin UI data or APIs.
- Logout and token expiry remove access.

### Dashboard

- Overview metrics match database fixtures in automated tests.
- Recent activity is deterministic and excludes secrets.
- Loading, empty, and failure states are visible and accessible.

### Articles

- Admin can complete the full draft-to-published-to-draft lifecycle.
- Admin can edit, archive, and restore.
- Duplicate slugs are rejected without overwriting.
- Public routes expose only published articles.
- Existing IdeaHub-created published posts remain readable and manageable.

### Operations

- Existing booking behavior remains functional.
- Messages support search, read state, archive, and restore.
- Subscribers support safe list/search/filter/export/removal.
- Subscriber tokens never appear in responses or exports.

### Quality

- Relevant server and client tests pass.
- Changed files pass lint.
- The production client build succeeds.
- Desktop and mobile admin flows are browser-verified.
- Console and relevant network requests show no unexpected errors.
- No merge or deployment is claimed without separate evidence and approval.

## 19. Verification Matrix

| Area | Automated verification | Browser verification |
| --- | --- | --- |
| Auth | Jest/Supertest endpoint tests; client login/session tests | Login, refresh, redirect, logout, error states |
| Overview | Controller/API fixture tests; component states | Metric layout desktop/mobile |
| Articles | Model, API, service, hook, form, list, lifecycle tests | Create, preview, publish, edit, archive, restore |
| Bookings | Existing regression suite plus route integration | Filter, edit, cancel, delete confirmation |
| Messages | API and UI mutation/filter tests | Read/unread, archive/restore |
| Subscribers | Safe projection, search/filter/export/delete tests | Search, export, removal confirmation |
| Security | Unauthorized-route and safe-response tests | Cookie/session behavior, no secret exposure |
| Build | Client lint and production build | Console/network inspection |

## 20. Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Production cookie/CORS mismatch | Diagnose deployed request/response evidence before code changes |
| Shared collection schema drift with IdeaHub | Maintain backward-compatible fields and document both writers |
| Destructive admin actions | Prefer archive for content/messages; explicit confirmation for hard deletion |
| Scope expansion into member accounts | Keep member identity outside this milestone |
| Large all-at-once delivery | Implement independent vertical slices with reviewable tests |
| Existing repository-wide lint/test failures | Run targeted checks first and report unrelated baseline failures separately |
| Stale dashboard data | Define query invalidation after every mutation |
| Secret leakage | Explicit projections, response mappers, and security tests |

## 21. Dependencies and Constraints

- No new npm dependency is expected.
- JavaScript remains the implementation language.
- Existing Express/Mongoose/React/TanStack Query/Redux/SCSS patterns remain authoritative.
- MongoDB remains the operational source of truth.
- Implementation begins only after this specification and its plan are explicitly approved.
- Merge and deployment are separate approval gates.
