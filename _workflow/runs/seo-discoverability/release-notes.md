# Release Notes — DevKofi Search & AI Discoverability

**Release state:** branch implementation only; not merged or deployed.

## Added

- route-aware SEO metadata for all seven canonical studio pages;
- canonical, robots, Open Graph, Twitter/X, and JSON-LD updates without a new dependency;
- default static site/entity metadata in `client/index.html`;
- `robots.txt`, `sitemap.xml`, and optional `llms.txt`;
- focused tests for route metadata and discovery files.

## Improved

- Home now states what DevKofi is and the digital products/engineering capabilities it covers more explicitly;
- Services now describes product strategy, UX/UI design, full-stack development, AI-enabled features, and the delivery process in searchable language;
- About now provides clearer founder/entity and engineering expertise context;
- Journal now names its AI engineering, full-stack development, product strategy, testing, and developer-workflow topics while retaining honest pre-publication status.

## Preserved

- existing redesign visuals and navigation;
- API-backed Work and Lab behavior;
- contact form persistence/validation behavior;
- newsletter/admin/auth behavior;
- no dependency, backend, database, deployment, or infrastructure changes.

## Verification Note

Executable tests, lint, and build have not run for this branch revision in this session. Treat the release as implemented but unverified until those checks pass.
