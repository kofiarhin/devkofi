# 039: Route DevKofi Blog Reads Through IdeaHub API

**Status:** Approved  
**Project:** DevKofi  
**Destination:** GitHub implementation  
**Priority:** High

## 1. Goal

Move DevKofi public blog reads away from direct access to the shared `blogposts` MongoDB collection and through public read endpoints owned by `kofiarhin/ideahub-api`.

**Finish line:** DevKofi's existing `/api/blog` and `/api/blog/:slug` routes return published blog data by calling IdeaHub API server-to-server, with no direct `BlogPost` query in those request paths.

## 2. Context & Evidence

**Current behavior:** DevKofi's blog controller queries the local `BlogPost` Mongoose model against the shared MongoDB database.

**Desired behavior:** IdeaHub API becomes the sole blog-data access boundary for DevKofi public reads. DevKofi keeps its existing browser-facing API contract and proxies those reads server-to-server.

### Evidence status

**Confirmed:**
- DevKofi currently exposes `GET /api/blog` and `GET /api/blog/:slug`.
- Current public blog reads use `server/models/BlogPost.js` directly.
- IdeaHub API already owns authenticated blog read/write operations against the same `blogposts` collection.
- Kofi approved server-to-server integration and public unauthenticated IdeaHub API endpoints for published blog reads.

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

**Error:** Missing IdeaHub configuration returns a service-unavailable response. Upstream IdeaHub failures return a gateway-style server error without exposing secrets.

**Success:** Published list/detail responses render through the existing frontend contract.

### Edge cases

- Archived/unpublished posts are never returned from public IdeaHub endpoints.
- Missing slug returns 404 through DevKofi.
- Page and limit remain bounded.
- Existing stored cover image is preserved; the known fallback still applies when the target post lacks one.

## 5. Constraints & Unresolved Decisions

### Technical

- DevKofi remains JavaScript/CommonJS.
- IdeaHub API remains TypeScript/Express.
- No new dependencies are required.

### Security / Permissions

- Only the two published-read endpoints are public.
- Internal generation/write metadata must not be exposed by the public API.
- Secrets remain in environment variables.

### Unresolved decisions

**None.**

## 6. Acceptance Criteria

- [ ] IdeaHub API exposes unauthenticated paginated published-post reads.
- [ ] IdeaHub API exposes unauthenticated published-post detail by slug.
- [ ] Archived/unpublished posts are excluded.
- [ ] GPT/write/archive/restore routes remain authenticated.
- [ ] DevKofi public blog routes no longer query `BlogPost` directly.
- [ ] DevKofi browser-facing routes and response behavior remain compatible.
- [ ] Missing upstream post returns 404.
- [ ] Upstream configuration/network failures are handled explicitly.
- [ ] Relevant automated tests pass in repository CI or another executable environment.

## 7. Repository Inspection & Implementation Plan

**Inspection status:** Complete for the affected blog route/controller/model/tests and IdeaHub API app/service/types/tests.

### Implementation approach

1. Add public-safe list/detail service methods and public routes to IdeaHub API.
2. Add route-level tests proving unauthenticated access and published-only behavior.
3. Replace DevKofi blog-controller Mongoose reads with server-to-server HTTP calls.
4. Update DevKofi tests and environment documentation.
5. Update repository architecture/current-state docs from observed implementation evidence.

## 8. Implementation Authority

**Approval status:** Approved.

**Approved scope:** The server-to-server migration described in this ticket and the approved shared plan in the ChatGPT GitHub workflow.

Ticket/spec/plan creation does not expand scope beyond this outcome. Merge, deployment, and external runtime configuration remain separately controlled.

## 9. Verification & Completion Handoff

**Implementation status:** Not implemented at ticket creation.

Verification will record actual CI/test/build evidence after implementation.

## 10. Lifecycle State

**Ticket:** 039  
**Implementation:** Not started  
**Verification:** Not run  
**Approval:** Approved  
**Commit:** Not created  
**Push:** Not pushed  
**Pull request:** Not created  
**Deployment:** Not requested  
**Completion:** Incomplete
