# DevKofi Current State

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
