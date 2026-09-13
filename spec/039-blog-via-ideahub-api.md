# 039: Blog Reads via IdeaHub API — Technical Spec

## Source ticket

`tickets/039-blog-via-ideahub-api.md`

## Goal

Keep DevKofi's browser-facing blog API unchanged while moving the data read boundary to IdeaHub API.

## Contract

### IdeaHub API public endpoints

`GET /api/v1/blog-posts?page=<page>&limit=<limit>`

Returns:

```json
{
  "posts": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPosts": 0,
    "totalPages": 1,
    "hasPreviousPage": false,
    "hasNextPage": false
  }
}
```

`GET /api/v1/blog-posts/:slug`

Returns:

```json
{
  "post": {}
}
```

Only documents with `status: "published"` are eligible. Missing published slug returns 404.

Public responses expose only presentation-safe blog fields: identifiers, title, slug, excerpt, content, tags, sources, cover image fields, SEO fields, published/created/updated timestamps, status, and canonical URL. Generation metadata, Cloudinary management metadata, idempotency data, and archived metadata are not public.

### Existing protected IdeaHub API

Everything under `/api/v1/gpt` keeps the current Bearer authentication and behavior. No write endpoint becomes public.

### DevKofi server contract

Existing endpoints remain:

- `GET /api/blog?page=<page>&limit=<limit>`
- `GET /api/blog/:slug`

The controller calls `${IDEAHUB_API_URL}/api/v1/blog-posts` server-to-server and returns the current DevKofi response shape.

`IDEAHUB_API_URL` is environment configuration and must not be hard-coded.

## Failure mapping

- Missing `IDEAHUB_API_URL` → DevKofi 503 with a generic configuration/service-unavailable error.
- IdeaHub API 404 for a slug → DevKofi keeps `{ "success": false, "error": "Article not found" }` with 404.
- Other IdeaHub API/network failures → DevKofi 502 with a generic blog-service error.
- No upstream credentials are required for the two public read routes.

## Compatibility

- Frontend `client/src/services/blogService.js` stays unchanged.
- Existing cover-image fallback stays in DevKofi and is applied to upstream list/detail data.
- Non-blog DevKofi database access stays unchanged.
- `server/models/BlogPost.js` may remain for historical/schema-test compatibility but must no longer be used by the public blog controller.

## Verification

### IdeaHub API

- Public list works without Authorization.
- Public detail works without Authorization.
- Pagination is bounded and reports correct metadata.
- Only published documents are queried.
- Missing slug returns 404.
- Existing GPT endpoints still reject missing auth.
- Typecheck/build/tests pass.

### DevKofi

- `/api/blog` forwards page/limit to IdeaHub API and preserves response shape.
- `/api/blog/:slug` proxies successful detail.
- 404 maps correctly.
- Missing configuration and upstream failure are explicit.
- Known cover-image fallback remains.
- Backend Jest suite passes; client/build checks are only required if affected.

## Release boundary

This change is not complete for production until `IDEAHUB_API_URL` is configured in the DevKofi backend runtime and both repositories are separately merged/deployed. Those actions are outside this implementation approval.
