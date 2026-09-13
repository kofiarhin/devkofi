# DevKofi Current State

## Current checkpoint: IdeaHub API blog read boundary

Baseline DevKofi `main` commit: `2dd71fd1ee00fc49a4b07c41bbb459c961e82061`.

- Implemented on `feature/blog-via-ideahub-api` with draft PR #54: DevKofi keeps `/api/blog` and `/api/blog/:slug`, but the controller now calls IdeaHub API server-to-server instead of querying the `BlogPost` Mongoose model.
- `server/services/ideaHubBlogService.js` reads the configured `IDEAHUB_API_URL`, calls the public IdeaHub blog endpoints, maps missing configuration to 503, maps upstream/network failures to 502, and preserves a missing-post 404 path.
- Existing public response behavior and the known Cloudinary cover-image fallback are preserved.
- `.env.example` documents `IDEAHUB_API_URL`; runtime configuration has not been changed.
- The dependency is implemented in `kofiarhin/ideahub-api` draft PR #12 on `feature/public-blog-api`: public unauthenticated published-only `GET /api/v1/blog-posts` and `GET /api/v1/blog-posts/:slug` routes, while `/api/v1/gpt/*` remains protected.
- IdeaHub API PR #12 GitHub Actions `Validate` passed Typecheck, Test, and Build for head `384991f3972bf22b6f1420aef2f5766f968630df`; its Heroku deploy job was skipped.
- DevKofi PR #54 GitHub Actions `Validate backend` completed the backend test step successfully for implementation head `8692994a1448cb9fffa3cb505f33ce64618f52bf`; feature-branch deployment/live-verification jobs were skipped.
- Not merged, not deployed, and not live-verified. Production still requires IdeaHub API deployment, DevKofi runtime `IDEAHUB_API_URL` configuration, DevKofi deployment, and cross-service verification under separate authority.

## Current checkpoint: tool-contracts blog thumbnail fallback

Baseline `main` commit: `2f69b62b7ae7f57f575ab709e657314857626e81`.

- Implemented on `fix/production-ai-agents-thumbnail`: the public blog API supplies a Cloudinary cover-image fallback for `Production AI Agents Need Tool Contracts` when the stored `coverImageUrl` is missing. Existing posts with their own cover image are unchanged.
- Cloudinary asset confirmed: `https://res.cloudinary.com/dlsiabgiw/image/upload/v1789259864/devkofi/blog/production-ai-agents-need-tool-contracts.png` (1600×900 PNG).
- Focused server tests were added for both the blog-list and single-article API responses.
- Verified from connected-service evidence: Cloudinary reports the asset as public and available; GitHub compare shows only the intended controller, test, and current-state changes on the implementation branch; pull-request CI ran `npm test` in the `Validate backend` job successfully.
- Not run: client lint/build, browser, or live API verification. Pull-request deployment jobs were skipped.
- Not merged or deployed. Production behavior remains unchanged until the implementation branch is reviewed, merged, and separately deployed through the repository's normal release path.

## Current checkpoint: shared IdeaHub publishing

Baseline `main` commit: `d1cfda7363c10371841d897a860389e52ff555c8`.

- Historical implementation on `feat/shared-blog-publishing`: a read-only public blog API over the shared MongoDB `blogposts` collection, public `/blog` and `/blog/:slug` routes, Markdown article rendering, navigation, and article metadata/structured data.
- IdeaHub remained the writer while DevKofi originally read the same database directly. Ticket 039 supersedes that direct blog-read boundary with server-to-server IdeaHub API reads once merged and deployed.
- Duplicate slugs fail instead of overwriting an existing article. No DevKofi admin publishing UI, draft state, webhook, queue, or synchronization job is part of this architecture.
- Historical verification included focused server and client tests, changed-file client lint, and the production client build. The repository-wide client lint still had pre-existing unrelated failures.

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
