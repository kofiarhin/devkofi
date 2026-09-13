# 039: Route DevKofi Blog Reads Through IdeaHub API

**Status:** Implemented / awaiting release verification  
**Project:** DevKofi  
**Destination:** GitHub implementation  
**Priority:** High

## 1. Goal

Move DevKofi public blog reads away from direct access to the shared `blogposts` MongoDB collection and through public read endpoints owned by `kofiarhin/ideahub-api`.

**Finish line:** DevKofi's existing `/api/blog` and `/api/blog/:slug` routes return published blog data by calling IdeaHub API server-to-server, with no direct `BlogPost` query in those request paths.

## 2. Context & Evidence

**Previous behavior:** DevKofi's blog controller queried the local `BlogPost` Mongoose model against the shared MongoDB database.

**Implemented behavior:** IdeaHub API is the intended blog-data access boundary for DevKofi public reads. DevKofi keeps its existing browser-facing API contract and proxies those reads server-to-server.

### Evidence status

**Confirmed:**
- DevKofi exposes `GET /api/blog` and `GET /api/blog/:slug`.
- Before this ticket, public blog reads used `server/models/BlogPost.js` directly.
- Kofi approved server-to-server integration and public unauthenticated IdeaHub API endpoints for published blog reads.
- IdeaHub API draft PR #12 implements the public read boundary.
- DevKofi draft PR #54 removes direct `BlogPost` use from `server/controllers/blogController.js` and adds the server-to-server client.

**Proposed:** None.

**Assumptions:** The IdeaHub API base URL will be supplied to DevKofi through `IDEAHUB_API_URL` in runtime environment configuration before release.

## 3. Scope & Exclusions

### In scope

- Public IdeaHub API endpoint for paginated published posts.
- Public IdeaHub API endpoint for one published post by slug.
- DevKofi server-to-server calls to those endpoints.
- Preserve DevKofi browser-facing `/api/blog` and `/api/blog/:slug` response behavior.
- Preserve the existing cover-image fallback.
- Automated tests for the new boundary and failure behavior.
- Environment documentation for `IDEAHUB_API_URL`.

### Out of scope

- Browser-to-IdeaHub calls.
- Public write/update/archive/restore/search/intelligence endpoints.
- New authentication or CORS model.
- Database migration or schema change.
- Merge, deployment, or Heroku config mutation.

### Must remain unchanged

- DevKofi frontend blog service and routes.
- IdeaHub GPT/write endpoints remain authenticated.
- Non-blog DevKofi MongoDB features remain unchanged.

## 4. Expected Behavior & Edge Cases

### Primary flow

1. Browser requests DevKofi `/api/blog` or `/api/blog/:slug`.
2. DevKofi server calls the configured IdeaHub API public blog endpoint.
3. IdeaHub API reads published data from `blogposts`.
4. DevKofi returns its existing response shape to the browser.

### Relevant states

**Empty:** The list endpoint returns an empty `posts` array with valid pagination metadata.

**Error:** Missing IdeaHub configuration returns 503. Upstream IdeaHub/network failures return 502 without exposing credentials.

**Success:** Published list/detail responses preserve the existing frontend contract.

### Edge cases

- Archived/unpublished posts are filtered from public IdeaHub queries.
- Missing slug returns 404 through DevKofi.
- Page and limit remain bounded.
- Existing stored cover image is preserved; the known fallback still applies when the target post lacks one.

## 5. Constraints & Unresolved Decisions

### Technical

- DevKofi remains JavaScript/CommonJS.
- IdeaHub API remains TypeScript/Express.
- No new dependencies were introduced.

### Security / Permissions

- Only the two published-read endpoints are public.
- Internal generation/write metadata is excluded from the public projection.
- Secrets remain in environment variables.

### Unresolved decisions

**None.**

## 6. Acceptance Criteria

- [x] IdeaHub API exposes unauthenticated paginated published-post reads.
- [x] IdeaHub API exposes unauthenticated published-post detail by slug.
- [x] Public IdeaHub service queries require `status: "published"`.
- [x] GPT/write/archive/restore routes remain under the existing authenticated `/api/v1/gpt` router.
- [x] DevKofi public blog routes no longer query `BlogPost` directly.
- [x] DevKofi browser-facing routes and response behavior remain compatible in automated controller coverage.
- [x] Missing upstream post returns 404.
- [x] Upstream configuration/network failures are handled explicitly.
- [x] IdeaHub API typecheck, tests, and build passed on the implementation head; DevKofi backend tests passed on the implementation head.
- [ ] Cross-service deployed behavior is live-verified.

## 7. Repository Inspection & Implementation Plan

**Inspection status:** Complete for the affected blog route/controller/model/tests and IdeaHub API app/service/types/tests.

### Actual implementation

1. Added `src/public-blog-service.ts` and `src/public-blog-router.ts` in IdeaHub API.
2. Mounted the public router at `/api/v1/blog-posts` while keeping the GPT app protected.
3. Added `server/services/ideaHubBlogService.js` in DevKofi.
4. Replaced direct `BlogPost` reads in `server/controllers/blogController.js` with the IdeaHub service.
5. Added focused IdeaHub public-route tests and DevKofi controller/client tests.
6. Added `IDEAHUB_API_URL` to `.env.example` and updated architecture/current-state documentation.

## 8. Implementation Authority

**Approval status:** Approved.

**Approved scope:** The server-to-server migration described in this ticket and the approved shared plan in the ChatGPT GitHub workflow.

Merge, deployment, production environment configuration, and live-release verification remain separately controlled.

## 9. Verification & Completion Handoff

### Implementation status

**Implemented on feature branches.**

### Automated verification

**IdeaHub API PR #12 / head `384991f3972bf22b6f1420aef2f5766f968630df`:**
- Typecheck — Passed.
- Test — Passed.
- Build — Passed.
- Deploy to Heroku — Skipped on feature branch.

**DevKofi PR #54 / implementation head `8692994a1448cb9fffa3cb505f33ce64618f52bf`:**
- Backend tests — Passed in `Validate backend`.
- Feature-branch deployment/live-verification jobs — Skipped.

Documentation commits after that implementation head do not change runtime code; their final PR-head CI status should still be inspected before merge.

### Functional verification

- Public route behavior — covered by automated tests.
- DevKofi proxy behavior, pagination, fallback, 404, 502/503 paths — covered by automated tests.
- Live IdeaHub → MongoDB → DevKofi cross-service flow — Not run; deployment/runtime config not authorized.

### Review findings

**Must fix:** None found in the reviewed branch diffs.

**Should fix:** None required within approved scope.

**Verified within scope:** Repository implementation and automated code-path verification.

### Limitations / human review

- `IDEAHUB_API_URL` must be configured in the DevKofi backend runtime before release.
- IdeaHub API must be deployed before DevKofi can consume the new public endpoint in production.
- Merge/deployment/live verification remain separate actions.

## 10. Lifecycle State

**Ticket:** 039  
**Implementation:** Implemented  
**Verification:** Partial — automated repository checks passed; live cross-service verification pending  
**Approval:** Approved  
**Commit:** Created on both feature branches  
**Push:** Pushed  
**Pull request:** Draft — IdeaHub API #12 and DevKofi #54  
**Deployment:** Not requested  
**Completion:** Incomplete pending release/configuration/live verification
