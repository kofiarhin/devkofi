# DevKofi Current State

## Current checkpoint: admin foundation implementation

Baseline `main` commit: `a2a9019b98c91faa591bcf402f547525d7f16407`.

- Implemented on `feat/admin-foundation`: production-compatible admin input hardening, trusted-origin protection for admin mutations, a protected responsive admin shell, aggregate database overview, article draft/publish/archive lifecycle management, contact-message read/archive triage, subscriber search/filter/removal, and integration of existing booking management.
- DevKofi Admin is now an additional schema-compatible writer to the shared `blogposts` collection on this branch. Existing IdeaHub-originated published documents remain compatible; public routes continue to expose only published articles.
- Registered member/customer accounts remain out of scope. The unrouted legacy `adminUsersController.js` remains inactive.
- Verified locally: 19 focused admin/navigation client tests, changed-file client lint, server JavaScript syntax checks, clean diff validation, and the production client build.
- Blocked verification: Jest/Supertest admin tests could not connect to the expected local MongoDB service. The full client suite still has 22 unrelated baseline failures recorded in existing project state; the focused admin suite passes.
- Not verified: live MongoDB behavior, production authentication/cookie behavior, desktop/mobile browser behavior, merge, or deployment.


## Current checkpoint: shared IdeaHub publishing

Baseline `main` commit: `d1cfda7363c10371841d897a860389e52ff555c8`.

- Implemented on `feat/shared-blog-publishing`: a read-only public blog API over the shared MongoDB `blogposts` collection, public `/blog` and `/blog/:slug` routes, Markdown article rendering, navigation, and article metadata/structured data.
- IdeaHub is the only writer in this MVP. Its `/generate-post` workflow inserts a validated document with `status: "published"`; DevKofi reads the same database and exposes it immediately without a second approval or ingestion layer.
- Duplicate slugs fail instead of overwriting an existing article. No DevKofi admin publishing UI, draft state, webhook, queue, or cross-service HTTP call is part of this architecture.
- Verified locally: focused server and client tests, changed-file client lint, and the production client build. The repository-wide client lint still fails on pre-existing unrelated files.
- No live MongoDB write, merge, or deployment is authorized or claimed.

## Current checkpoint: issue #38 project showcase

Baseline `main` commit: `8b6fb1efe3e4b5aee738a14336ac96ea9b1c59e3` (PR #39 is merged and supplies the approved Cloudinary Agent System cover).

- Implemented on `fix/38-responsive-project-showcase`: the approved Home/Work/Engineering Systems placement, 16:9 contained card images without hover zoom, responsive Cloudinary sources, and original-image/fallback error handling.
- Verified locally: 44 focused Vitest checks, changed-file lint, and production build. Full-suite/lint baseline failures and delivery-URL results are documented in `docs/verification/038-project-showcase.md`.
- Still unverified: real mobile/desktop layout, browser-selected `currentSrc`, high-DPR behavior, keyboard focus and screenshots. The cloud browser blocks the local preview URL; do not treat component tests as browser evidence.
- No merge or deployment of this follow-up is authorized or claimed. Issue #38 remains open pending verification and review.

The sections below are historical redesign notes. Their branch/release claims do not describe current `main`; the inspected baseline already includes the studio routes/catalog and PR #39. Legacy mentorship priorities are outside this ticket.

Evidence basis: repository files and GitHub branch evidence. Runtime behavior has not been executed from this ChatGPT GitHub workflow unless explicitly listed under Verified.

## Proposed

The existing README roadmap still contains legacy mentorship-platform outcomes. Those outcomes have not been removed or re-prioritized by this redesign branch and should be reconciled separately if DevKofi fully transitions away from the mentorship product model.

## Specified

The AI Engineering Studio redesign is specified by:

- `docs/AI_ENGINEERING_STUDIO_PRD.md`
- `docs/AI_ENGINEERING_STUDIO_SPEC.md`

## Planned

The approved execution plan is:

- `docs/AI_ENGINEERING_STUDIO_PLAN.md`

## In Progress

- Full public-site repositioning on branch `feat/ai-engineering-studio-redesign`.
- Draft-PR review and executable verification remain pending.

## Implemented

On `feat/ai-engineering-studio-redesign`, repository changes now implement the public AI Engineering Studio structure:

- target routes for Home, Services, Work, Engineering Systems, Products, About, and Book a Call;
- compatibility redirects from `/projects` to `/work` and `/templates` to `/engineering-systems`;
- founder-led AI engineering homepage and supporting page copy;
- centralized service and studio content modules;
- centralized semantic design tokens while preserving existing DevKofi green/lime branding;
- shared studio layout, CTA, project-card, split-section, and page-meta components;
- accessible left-side mobile navigation drawer behavior including focus management, Escape close, backdrop close, body scroll lock, and focus restoration;
- reusable project selectors for Work, Products, Engineering Systems, and homepage featured work;
- About and Footer messaging aligned to the AI engineering studio direction;
- selector/navigation regression tests added under `client/tests/studioSelectors.test.js`.

No server, authentication, dependency, lockfile, CI workflow, deployment, migration, or production-data changes are part of this branch.

## Verified

Repository-level review evidence:

- the implementation branch is based on the approved docs branch;
- GitHub compare shows only expected public-client, test, and this current-state documentation changes;
- no dependency or lockfile changes were introduced;
- no server/auth/deployment files were changed.

Not yet verified in an executable environment:

- `npm test`
- `npm run test:client`
- `npm --prefix client run lint`
- `npm --prefix client run build`
- desktop/mobile browser behavior
- console/network behavior

The existing GitHub workflow only deploys/builds on pushes to `main`/`master` or manual workflow dispatch, so it does not provide automatic feature-branch verification evidence.

## Released

Not released. No merge or deployment is authorized or claimed for the AI Engineering Studio redesign.

## Unresolved

- Project API records need deliberate classification (`aiEngineering`, `engineeringSystem`, `product`, `featured`, `displayOrder`) for the strongest curated Work/Systems/Products presentation; selector fallbacks currently preserve existing data compatibility.
- Exact flagship project records and screenshots should be reviewed in the live project dataset before release.
- Legacy mentorship-specific backend/admin capabilities remain in the repository and are intentionally outside this public-site redesign scope.
- Executable test/lint/build/browser verification remains required before merge.
