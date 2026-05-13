# GitHub Template Actions Task Plan

- Spec file used: `_spec/2026-05-16-github-template-actions.md`
- Planning date: 2026-05-16
- Progress and summary files read: `_progress/progress.md`, `_summary/2026-05-13-newsletter-email-verification.md`
- Handoff read: `_handoff/current.md`
- Dirty worktree at planning: `git status --short` returned no entries.
- Detailed spec sections used: Sections 5, 6, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, and 22.

## Task List

### TASK-001: Add GitHub-backed actions to templates

- Task ID: `TASK-001`
- Status: `Done`
- Priority: `P0`
- Parallel safe: `no`
- Depends on: `none`
- Blocks: final review, release notes, summary
- File locks: `server/data/templates.json`, `client/src/Pages/Templates/Templates.jsx`, workflow artifacts
- Claim status: `done`
- Claimed by: `codex`
- Agent role: `orchestrator`
- Merge risk: `low`

Objective:
Add the Codex Workflow Kit template and render optional GitHub, template generation, and release-download actions without changing existing fallback behavior.

Files likely affected:
- `server/data/templates.json`
- `client/src/Pages/Templates/Templates.jsx`
- `_progress/progress.md`
- `_handoff/current.md`
- `_review/2026-05-16-github-template-actions.md`
- `_release/github-template-actions.md`
- `_summary/2026-05-16-github-template-actions.md`

Checklist:
- [ ] Add the exact new template object to JSON.
- [ ] Destructure `githubUrl`, `templateUrl`, and `releaseUrl`.
- [ ] Render "Use Template" external primary CTA when `templateUrl` exists.
- [ ] Render `/contact` fallback when `templateUrl` is missing.
- [ ] Render "GitHub" and "Download" external secondary CTAs when URLs exist.
- [ ] Add requested action wrapper and secondary action styles.
- [ ] Preserve loading/error/empty branches.
- [ ] Run validation and record evidence.

Iteration plan for Iteration 1 Build:
- Goal: Implement the smallest working data and JSX/CSS change.
- Changes made: Added the `codex-workflow-kit` template object and replaced the single card CTA with conditional primary/fallback and secondary external links.
- Verification command/result: `node -e "JSON.parse(require('fs').readFileSync('server/data/templates.json','utf8')); console.log('templates json ok')"` passed; `npx eslint client/src/Pages/Templates/Templates.jsx` passed; `npx jest server/tests/templates.test.js --runInBand --forceExit` passed 1/1.
- Review findings: Data and JSX match the requested labels, hrefs, target, and rel attributes. No service or controller change needed because JSON fields pass through unchanged.
- Acceptance status: Core acceptance met.
- Remaining issues: Run production build and broad lint check.
- Next action: Run client build/lint and classify any failures.

Iteration plan for Iteration 2 Refine:
- Goal: Fix any syntax, style, or fallback issues found in Build.
- Changes made: No implementation changes needed after targeted checks.
- Verification command/result: `npm run build --prefix client` passed; `npm run lint --prefix client` failed on pre-existing unrelated files (`BookCall.jsx`, `Contact.jsx`, `AIWorkflowSection.jsx`, `Pricing.jsx`, `client/test/BookCall.test.jsx`, `client/tests/data.js`).
- Review findings: Build proves JSX syntax and production bundling. Full client lint failure is unrelated to the edited templates page; targeted lint for the edited page is clean.
- Acceptance status: In-scope acceptance met; unrelated lint debt documented.
- Remaining issues: None in scope.
- Next action: Rerun targeted lint and perform final diff audit.

Iteration plan for Iteration 3 Polish:
- Goal: Final validation, design pre-flight, and diff audit readiness.
- Changes made: No implementation changes needed.
- Verification command/result: `npx eslint src/Pages/Templates/Templates.jsx` from `client/` passed; `git diff -- server/data/templates.json client/src/Pages/Templates/Templates.jsx` and `git diff --stat` reviewed.
- Review findings: Diff is limited to requested implementation files plus workflow artifacts. Loading, error, and empty branches are unchanged. Design pre-flight passed for this scoped UI change: no global state changes, responsive flex wrapping exists for actions, no full-height `h-screen`, no `useEffect` animation, loading/error/empty states remain present, card pattern is existing repo UI, no CPU-heavy animation added.
- Acceptance status: All criteria met.
- Remaining issues: Full client lint has unrelated existing failures.
- Next action: Create review, release notes, summary, and final handoff.

Acceptance criteria:
- [ ] `server/data/templates.json` contains the exact `codex-workflow-kit` template with GitHub, template generation, and release URLs.
- [ ] `Templates.jsx` destructures `githubUrl`, `templateUrl`, and `releaseUrl`.
- [ ] GitHub-backed template renders "Use Template", "GitHub", and "Download" external links.
- [ ] Existing templates without `templateUrl` still render "Request this template" to `/contact`.
- [ ] Requested CSS classes are present in the existing style block.
- [ ] Loading, error, and empty states remain unchanged.
- [ ] JSON validity, client build, JSX syntax, and backend template route checks are attempted and documented.

Acceptance result:
- [x] `server/data/templates.json` contains the exact `codex-workflow-kit` template with GitHub, template generation, and release URLs.
- [x] `Templates.jsx` destructures `githubUrl`, `templateUrl`, and `releaseUrl`.
- [x] GitHub-backed template renders "Use Template", "GitHub", and "Download" external links.
- [x] Existing templates without `templateUrl` still render "Request this template" to `/contact`.
- [x] Requested CSS classes are present in the existing style block.
- [x] Loading, error, and empty states remain unchanged.
- [x] JSON validity, client build, JSX syntax, and backend template route checks were attempted and documented.

Verification commands:
- `node -e "JSON.parse(require('fs').readFileSync('server/data/templates.json','utf8')); console.log('templates json ok')"`
- `npm run build --prefix client`
- `npm run lint --prefix client`
- `npx jest server/tests/templates.test.js --runInBand --forceExit`

Stop condition:
- Stop if validation fails for an in-scope issue that cannot be corrected without broad refactor, new dependencies, credentials, or unrelated changes.

Out-of-scope items:
- Database changes.
- Backend controller changes unless required by verification.
- New dependencies.
- Deployment changes.
