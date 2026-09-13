# 039: Blog Reads via IdeaHub API — Implementation Plan

## Source

- Ticket: `tickets/039-blog-via-ideahub-api.md`
- Spec: `spec/039-blog-via-ideahub-api.md`
- Approval: Kofi approved the server-to-server plan in the ChatGPT GitHub workflow.

## Slice 1 — IdeaHub public read boundary

1. Add public blog list/detail response types and service methods in `kofiarhin/ideahub-api`.
2. Add unauthenticated `GET /api/v1/blog-posts` and `GET /api/v1/blog-posts/:slug` routes outside the protected GPT router.
3. Expose only published, presentation-safe fields.
4. Add focused route tests for unauthenticated list/detail, pagination, 404, and protection regression.
5. Run/inspect IdeaHub API test, typecheck, and build evidence when available.

## Slice 2 — DevKofi server-to-server proxy

1. Update `server/controllers/blogController.js` to use `IDEAHUB_API_URL` and HTTP calls instead of the `BlogPost` model.
2. Preserve pagination, detail response shape, and the existing cover-image fallback.
3. Map missing configuration to 503, upstream 404 to the current article-not-found response, and other upstream errors to 502.
4. Update `.env.example` with `IDEAHUB_API_URL`.
5. Rewrite focused server blog tests around the upstream HTTP boundary.

## Slice 3 — Repository truth and review

1. Update `context/architecture.md` to replace the shared-database read boundary with the IdeaHub API boundary.
2. Update `context/current-state.md` with implemented/verified state only after evidence exists.
3. Review diffs for scope creep, secret exposure, unrelated database changes, and accidental public write routes.
4. Open separate draft PRs for `ideahub-api` and `devkofi`.

## Verification order

IdeaHub API must be implemented and verified first because DevKofi depends on its public contract. DevKofi verification then proves its existing `/api/blog` contract against mocked upstream behavior. Cross-service live verification remains pending until deployment/configuration is separately authorized.

## Stop boundaries

Do not merge, deploy, alter Heroku config, expose protected GPT/write endpoints, change the blog schema, or modify unrelated MongoDB access under this approval.
