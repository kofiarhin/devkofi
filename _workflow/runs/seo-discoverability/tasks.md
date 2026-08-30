# SEO Discoverability Task Plan

Spec: `_workflow/runs/seo-discoverability/spec.md`
Approval: user explicitly approved the plan on 2026-08-30.
Execution mode: `complete-workflow`

## TASK-001 — Establish metadata and entity foundation

**State:** Needs Human Review

Implemented:
- dependency-free route metadata component;
- unique metadata for all seven canonical studio routes;
- base Organization, Person, and WebSite JSON-LD;
- route-level WebPage/CollectionPage/AboutPage/ContactPage/Service data;
- noindex handling for admin, verification, and unknown routes;
- focused metadata tests authored.

Verification limitation: tests, lint, and build could not be executed through the GitHub connector and branch CI does not run on this feature branch.

## TASK-002 — Strengthen core page content for retrieval and citability

**State:** Needs Human Review

Implemented:
- Home now defines DevKofi and core product/engineering capabilities explicitly;
- Services names product strategy, UX/UI, full-stack development, and AI-enabled product work;
- About defines founder/engineering entity context more clearly;
- Journal explicitly declares its AI engineering and product-development subject matter while retaining `Publishing soon` status;
- existing form and API-backed page behavior left untouched.

Verification limitation: code review completed, but executable client checks were unavailable.

## TASK-003 — Add crawl and AI-readable discovery files

**State:** Needs Human Review

Implemented:
- `robots.txt` with sitemap and selected AI-search crawler access;
- `sitemap.xml` with exactly seven canonical public studio routes;
- optional `llms.txt` machine-readable navigation file with no Google ranking claim;
- focused static-file tests authored.

Verification limitation: file contents were fetched back from the exact implementation revision and manually inspected, but build-copy/static tests were not executable.

## TASK-004 — Final SEO scope review and evidence

**State:** Needs Human Review

Completed review/evidence:
- exact implementation diff reviewed through GitHub compare;
- only 13 client/SEO files changed in the implementation commit;
- service ItemList schema refined in a follow-up commit;
- no server, dependency, auth, data, deployment, or infrastructure files changed;
- GitHub returned no status checks and no workflow runs for the implementation revision;
- no merge or deployment performed.

Remaining gate: run the focused tests, client lint, and client build in a command-capable checkout before treating the SEO pass as verified.
