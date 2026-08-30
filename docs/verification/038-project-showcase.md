# Issue #38 delivery evidence

Baseline: `8b6fb1efe3e4b5aee738a14336ac96ea9b1c59e3`.
Before publication, rebased onto `f4bc003406a6d68a7acd1e370a3aa54e1bb5885b` to preserve the separately merged Ideas Hub cover from PR #40. That upstream change only replaces its catalog thumbnail URL. Both approved covers remain intact.
Implementation branch: `fix/38-responsive-project-showcase`.
Contract/approval: `spec/038-project-showcase.md`, `plans/038-project-showcase.md`, explicit conversation approval.
State: implemented; automated verification partially complete; browser acceptance blocked; not merged/deployed.

## Changes

| Surface | Ordered project cards |
| --- | --- |
| Home | Hibachi, Brain, ThriftChef |
| Work | Hibachi, Brain, LeadRadar, Forge, ThriftChef |
| Engineering Systems | AI Dev Workspace, Codex Workflow Kit, Agent System, Context API, Ideas Hub |

Home's Systems section is editorial copy plus a link. Cards use stable curated keys, contain the complete artwork in a reserved 16:9 frame and no longer zoom on hover. Existing demo/repository URLs, the approved Agent System cover and Hibachi's null repository URL are preserved.

The media helper generates 320/480/640/960/1280/1920/2560px candidates for supported public Cloudinary uploads. `sizes` follows the 900px grid breakpoint, clamped gutters, 32px gap and 1400px container. Signed/tokenized, unknown/complex transforms, explicit DPR transforms and non-Cloudinary URLs pass through. Derived-image failure retries the original once; absent/failed originals display a labelled fallback while retaining project title and links.

Provider reference: [Cloudinary responsive HTML](https://cloudinary.com/documentation/responsive_html).

## TDD evidence

| Slice | RED observed | GREEN observed |
| --- | --- | --- |
| Curation/Home | 5 failures: seven Home cards, wrong featured set, catalog overlap, Systems cards visible during project error | 9 tests passed |
| Responsive helper | 5 failures: absent responsive variants; then 2 safety cases for explicit DPR/unknown crop transformations | 22 tests passed |
| Card states | 4 failures: missing attributes, original retry, absent-image and failed-source fallback | 5 tests passed |
| Neighboring routes | Existing compatibility contract exercised without changing route definitions | 5 route tests and 3 SEO tests passed |

Refactoring stayed within scope: isolated image state in `ProjectImage`, pure source helper, stable catalog keys, clearer Work/Systems copy. No new dependencies, manifest/lockfile changes, backend/API/schema changes or asset replacement.

## Automated checks

Environment: Node 24.19.0 / npm 11.9.0. The repository declares Node 20.x / npm 10.x; this session does not establish verification on that supported runtime. Existing dependencies were restored with `npm ci --ignore-scripts --no-audit --no-fund`, with lockfiles unchanged.

| Check | Result |
| --- | --- |
| Focused Vitest: media, cards, Home, catalog, routes and SEO | Passed: 44 tests across 6 files |
| ESLint on all changed JS/JSX files | Passed |
| `npm --prefix client run build` | Passed; existing large-bundle warning remains |
| `npm --prefix client run test -- --run` | Failed; 21 failures also reproduced on untouched baseline |
| `npm --prefix client run lint` | Failed; identical baseline output: 36 errors and 1 warning |
| `git diff --check` | Passed |

Baseline failures are not waived or fixed by this PR. Full-suite failures cover legacy booking copy/flows, removed mentorship/settings paths, old project metadata expectations, duplicate navigation queries and crawler-file path resolution. Lint failures cover existing unused bindings and undeclared test globals. No new failure names were introduced when compared with the clean baseline.

Focused command:

```bash
npm --prefix client run test -- --run tests/projectMedia.test.js tests/ProjectCard.test.jsx tests/HomeShowcase.test.jsx tests/ShowcaseRoutes.test.jsx tests/studioSelectors.test.js test/seo/seoMetadata.test.jsx
```

## Live image-delivery evidence

Read-only HTTP GETs used the helper's URL format:

| Asset/request | HTTP | Actual response |
| --- | --- | --- |
| Agent System, `c_scale,w_320/f_auto,q_auto` | 200 | JPEG, 320×180, 12,888 bytes |
| Agent System, `c_scale,w_1280/f_auto,q_auto` | 200 | WebP, 1280×720, 59,958 bytes |
| Existing Hibachi cover, `c_scale,w_640/f_auto,q_auto` | 400 | `X-Cld-Error: Invalid image file` |
| Original existing Hibachi cover | 200 | `image/webp`, 5,826 bytes; provider reports 400×250 |

Hibachi's original remains unchanged. Automated component tests verify original fallback and terminal placeholder behavior, but no browser evidence establishes the live fallback visually. Other catalog variants were not exhaustively fetched. This provider problem remains a review item; the responsive-source acceptance criterion is not fully satisfied for every asset.

## Browser verification gap / handoff

The control-browser skill's browser rejected `http://127.0.0.1:5173` with `ERR_BLOCKED_BY_CLIENT`, then explicitly reported that its URL policy blocks the local preview and forbids workaround browser access. No alternate browser surface or deployment was used to bypass it.

Not run: before/after screenshots, browser `currentSrc` selection, high-DPR checks, visual clipping/overflow, real keyboard focus, page console/network review. DOM/component tests are not substitutes for these checks.

Before merging, in an authorized local browser environment:

1. Run the app with a read-only project-data fixture or the normal development API; no production writes are needed.
2. Inspect Home, Work and Engineering Systems at 320, 375, 390, 768 and 1440px. Confirm complete cover content, no horizontal overflow, stable space during loading/failure, readable titles and keyboard-accessible links.
3. Use fresh contexts at DPR 1 and high-DPR mobile (2 or 3); capture each image's `currentSrc`, rendered width, response dimensions/status and screenshot. Confirm the browser chooses sensible candidates for the actual layout.
4. Exercise missing/failed sources and original fallback, including Hibachi. Check page loading/error/retry and empty collection behavior.
5. Confirm `/products` and `/projects` resolve to `/work`, `/templates` to `/engineering-systems`.
6. Resolve or explicitly approve the documented baseline-check/provider exceptions; attach before/after screenshots and mark final acceptance status. Do not close #38 before acceptance is complete.

## Review

- Must fix before declaring completion: missing browser acceptance evidence; full-client verification exceptions need explicit resolution/approval; Hibachi responsive variants are not healthy.
- Should fix separately: existing legacy tests/lint drift and source asset health, without unrelated changes in this PR.
- In-scope review passed: centralized curation, private URL preservation, safe source handling, bounded failure state, source replacement recovery, stable layout CSS, no new dependencies or secret exposure.
- Project memory updated proportionately in current-state, decisions, lessons and roadmap. Historical redesign notes are explicitly labelled historical rather than silently treated as current release facts.
