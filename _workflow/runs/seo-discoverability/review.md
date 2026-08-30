# SEO Discoverability Review

## Result

**Needs Human Review / verification pending.** The implementation matches the approved content + search/AI discoverability scope, but executable checks could not be run.

## What Was Reviewed

- seven canonical route metadata definitions;
- runtime title/description/canonical/robots/social metadata behavior;
- truthful base Organization/Person/WebSite JSON-LD;
- route-level page/service JSON-LD;
- Home, Services, About, and Journal content changes;
- static robots/sitemap/llms discovery files;
- focused test coverage authored for metadata and discovery files;
- exact GitHub diff and changed-file surface.

## Findings

### Passed by code/evidence review

- Scope is isolated to the approved frontend/content/SEO surface.
- Canonical route set matches the redesign IA.
- Private/admin/verification/unknown routes are marked noindex by runtime configuration.
- No fake reviews, ratings, client outcomes, ranking guarantees, traffic statistics, or unsupported credentials were introduced.
- `llms.txt` is not presented as a Google ranking factor.
- Dynamic Work and Lab data behavior was not rewritten.
- No dependency, backend, auth, data model, CI, or deployment edits were introduced.
- Service structured data was refined to a clearer Schema.org ItemList/ListItem/Service hierarchy.

### Remaining concerns

1. **SPA rendering:** page-specific content and metadata still depend on JavaScript for non-root routes. SSR/prerendering is the stronger future technical improvement for broad crawler compatibility, but requires a separately approved architecture/dependency decision.
2. **Journal depth:** Journal currently announces topics rather than publishing crawlable articles. Real first-hand articles/case studies will add substantially more topical authority than metadata alone.
3. **Dynamic project evidence:** Work remains API-backed. Rich standalone case-study URLs would be a future discoverability improvement if the product direction supports them.
4. **Verification:** focused tests, lint, and production build are authored/planned but unexecuted in this connector session.

## Scope Creep Audit

None detected. No merge, deployment, production verification, backlink work, paid API use, local SEO, SSR/prerender change, or unrelated refactor was performed.
