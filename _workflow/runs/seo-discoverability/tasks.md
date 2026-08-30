# SEO Discoverability Task Plan

Spec: `_workflow/runs/seo-discoverability/spec.md`
Approval: user explicitly approved the plan on 2026-08-30.
Execution mode: `complete-workflow`

## TASK-001 — Establish metadata and entity foundation

**State:** Ready

Value: every canonical public route exposes a clear title, description, canonical URL, social metadata and truthful structured data without adding a dependency.

Files:
- `client/src/components/SEO/SEO.jsx` (new)
- `client/src/constants/seo.js` (new)
- `client/src/App.jsx`
- `client/index.html`
- `client/test/seo/seoMetadata.test.jsx` (new)

Acceptance:
- unique metadata for all seven canonical studio routes;
- Organization/Person/WebSite identity in base HTML;
- route-level JSON-LD uses truthful supported schema types;
- redirects/admin behavior unchanged.

Verification: focused Vitest, lint, build when runnable.

## TASK-002 — Strengthen core page content for retrieval and citability

**State:** Planned

Value: core public copy answers what DevKofi is, what it does, who Kofi is, and what topics it covers using explicit, natural language.

Files:
- `client/src/Pages/Home/Home.jsx`
- `client/src/Pages/Services/Services.jsx`
- `client/src/Pages/About/About.jsx`
- `client/src/Pages/Journal/Journal.jsx`
- `client/src/Pages/Contact/Contact.jsx`

Acceptance:
- Home contains a self-contained definition of DevKofi and concrete capabilities;
- Services uses concrete search-intent terminology without keyword stuffing;
- About identifies Kofi and relevant engineering disciplines accurately;
- Journal declares topical focus while retaining `Publishing soon` honesty;
- contact form behavior is untouched while project types are clearer in surrounding copy.

Verification: relevant existing navigation/contact tests plus lint/build when runnable.

## TASK-003 — Add crawl and AI-readable discovery files

**State:** Planned

Value: crawlers receive explicit canonical route discovery and machine-readable site navigation.

Files:
- `client/public/robots.txt` (new)
- `client/public/sitemap.xml` (new)
- `client/public/llms.txt` (new)
- `client/test/seo/discoveryFiles.test.js` (new)

Acceptance:
- sitemap lists only the seven canonical studio URLs;
- robots permits normal crawling, explicitly permits selected AI search crawlers and references the sitemap;
- llms.txt accurately summarizes the studio and canonical sections without ranking claims;
- no admin, verification, legacy redirect, API or private route is advertised.

Verification: focused Vitest/static-file assertions and build artifact inspection when runnable.

## TASK-004 — Final SEO scope review and evidence

**State:** Planned

Value: the SEO patch is reviewed against the approved scope and exact branch revision.

Files:
- `_workflow/runs/seo-discoverability/progress.md`
- `_workflow/runs/seo-discoverability/verification.md`
- `_workflow/runs/seo-discoverability/review.md`
- `_workflow/runs/seo-discoverability/release-notes.md`
- `_workflow/runs/seo-discoverability/summary.md`
- `_workflow/runs/seo-discoverability/handoff.md`
- `_workflow/runs/seo-discoverability/health-check.md`

Acceptance:
- exact changed-file scope reviewed;
- verification results distinguished from implementation state;
- no merge/deploy claim;
- remaining SPA/prerender limitation recorded.
