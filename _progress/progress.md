# Progress Log

Agents must read this file before planning and before touching code for each task.

Append a new entry after each task. Do not replace previous entries except to correct factual errors.

This file is append-only task history. `_handoff/current.md` is the live resume state for the active workflow, and `_summary/` is completed workflow history.

If `_handoff/current.md` conflicts with this file, trust this file for completed task history and update handoff accordingly.

## Task Status Transitions

Every task must move through:

```txt
Planned -> Ready -> In Progress -> Verified -> Reviewed -> Done
```

Allowed terminal states:

- `Done`
- `Blocked`
- `Needs Human Review`

If verification cannot run, record the task as `Needs Human Review`, not `Done`.

Every task must record explicit acceptance results. A task cannot be `Done` unless every required acceptance criterion is checked `[x]`; any `[ ]` or `[~]` result means the task is `Blocked` or `Needs Human Review`.

Every executable task must complete Iteration 1 Build, Iteration 2 Refine, and Iteration 3 Polish before it can be marked `Done`. Record separate evidence for each iteration: goal, changes made, verification command/result, review findings, acceptance status, remaining issues, and next action.

If verification fails during any iteration, record the failure recovery protocol result inside that iteration: failing command, captured error, in-scope/unrelated classification, targeted fix attempt, exact rerun result, and final task status.

Dirty worktree protection must be documented before implementation: existing dirty files, files planned for the workflow, and overlap risk.

## Execution Modes

Default execution mode is `complete-workflow`.

- `plan-only`: ask questions, write spec, write task plan, then stop.
- `single-task`: execute only the next ready task through the full 3-pass hardening loop, update artifacts, then stop.
- `complete-workflow`: execute all generated tasks sequentially until the request/spec is complete or a stop condition is reached; each executable task must complete the full 3-pass hardening loop before the next task starts.
- `parallel-workflow`: orchestrator plans tasks, creates queue/claims/locks, assigns safe tasks to worker agents, then performs merge review and final artifacts.
- `parallel-worker`: worker claims and executes exactly one eligible parallel-safe task, records final status, releases locks, and stops.
- `parallel-orchestrator`: orchestrator validates queue/claims/locks, reviews worker outputs, runs final verification, and completes final artifacts.

Do not stop after `TASK-001` unless execution mode is explicitly `single-task` or a stop condition is reached.

## Entry Template

### `<YYYY-MM-DD HH:MM>` - `<TASK-ID>`

- Status: `<Done / Blocked / Needs Human Review>`
- Lifecycle transition reached: `<Planned -> Ready -> In Progress -> Verified -> Reviewed -> Done, or terminal stop>`
- Files changed: `<paths or none>`
- Dirty worktree protection: `<initial status, planned files, overlap risk>`
- Parallel metadata: `Priority=<P0/P1/P2>; Parallel safe=<yes/no>; Depends on=<task ids or none>; Blocks=<task ids or none>; File locks=<paths>; Claim status=<unclaimed/claimed/in-progress/done/blocked/needs-review>; Claimed by=<agent>; Agent role=<role>; Merge risk=<low/medium/high>`
- Parallel claim/lock status: `<claim recorded, active locks, released locks, unexpected overlap, or not applicable for sequential mode>`
- Worker status: `<orchestrator/worker id, one claimed task, current iteration, final status, or not applicable>`
- Merge review status: `<pending/passed/needs-review/failed/not applicable>`
- Iteration evidence:
  - Iteration 1 - Build: `<goal, changes made, verification command/result, review findings, acceptance status, remaining issues, next action>`
  - Iteration 2 - Refine: `<goal, changes made, verification command/result, review findings, acceptance status, remaining issues, next action>`
  - Iteration 3 - Polish: `<goal, changes made, verification command/result, review findings, acceptance status, remaining issues, final verdict>`
- Acceptance result: `<all criteria [x], or list unmet/partial criteria>`
- Verification result: `<commands and result, or why verification could not run>`
- Failure recovery notes: `<none, or failing command/error/classification/fix/rerun/final result>`
- Review result: `<reviewed / issues found / not reviewed with reason>`
- Blockers: `<none or details>`
- Next step: `<next task, review, summary, or stop reason>`

After appending each task entry, update `_handoff/current.md` with the latest current state.

## Task Entries

### `2026-05-16 00:00` - `TASK-001` (github-template-actions)

- Status: `Done`
- Lifecycle transition reached: `Planned -> Ready -> In Progress -> Verified -> Reviewed -> Done`
- Files changed: `server/data/templates.json`, `client/src/Pages/Templates/Templates.jsx`, `WORK_REQUEST.md`, `_spec/2026-05-16-github-template-actions.md`, `_task/2026-05-16-github-template-actions.md`, `_handoff/current.md`
- Dirty worktree protection: Initial `git status --short` returned no entries. Planned implementation files were `server/data/templates.json` and `client/src/Pages/Templates/Templates.jsx`; no overlap risk.
- Parallel metadata: Priority=P0; Parallel safe=no; Depends on=none; Blocks=final review/release/summary; File locks=`server/data/templates.json`, `client/src/Pages/Templates/Templates.jsx`, workflow artifacts; Claim status=done; Claimed by=codex; Agent role=orchestrator; Merge risk=low
- Parallel claim/lock status: not applicable for sequential complete-workflow mode.
- Worker status: not applicable.
- Merge review status: not applicable.
- Iteration evidence:
  - Iteration 1 - Build: Goal=implement smallest working data/UI slice. Changes=added `codex-workflow-kit` object to `server/data/templates.json`; destructured `githubUrl`, `templateUrl`, and `releaseUrl`; added conditional primary/fallback action rendering; added secondary GitHub/Download actions; added requested action wrapper and secondary CSS. Verification=`node -e "JSON.parse(require('fs').readFileSync('server/data/templates.json','utf8')); console.log('templates json ok')"` passed; `npx eslint client/src/Pages/Templates/Templates.jsx` passed; `npx jest server/tests/templates.test.js --runInBand --forceExit` passed 1/1. Review=service/hook/controller changes are unnecessary because the static JSON response is returned as-is. Acceptance=met. Remaining=run production build and broad checks. Next=Iteration 2.
  - Iteration 2 - Refine: Goal=run broader validation and classify failures. Changes=none. Verification=`npm run build --prefix client` passed; `npm run lint --prefix client` failed with unrelated pre-existing lint errors in `BookCall.jsx`, `Contact.jsx`, `AIWorkflowSection.jsx`, `Pricing.jsx`, `client/test/BookCall.test.jsx`, and `client/tests/data.js`. Review=Vite build proves JSX syntax and production compilation; full lint failures do not involve edited files. Acceptance=met for in-scope behavior. Remaining=unrelated repo lint debt. Next=Iteration 3.
  - Iteration 3 - Polish: Goal=final targeted lint, design pre-flight, and diff audit. Changes=none. Verification=`npx eslint src/Pages/Templates/Templates.jsx` from `client/` passed; `git diff -- server/data/templates.json client/src/Pages/Templates/Templates.jsx` reviewed; `git diff --stat` reviewed. Review=implementation diff matches saved spec; loading/error/empty branches unchanged; external links include `target="_blank"` and `rel="noreferrer"`; actions flex-wrap for small widths; no new dependencies or backend controller changes. Acceptance=all criteria met. Remaining=unrelated full-client lint failures. Final verdict=Done.
- Acceptance result:
  - [x] Added exact `codex-workflow-kit` template with all requested URLs.
  - [x] Destructured optional GitHub URL fields.
  - [x] Template URL renders "Use Template" external primary CTA.
  - [x] Missing template URL preserves "Request this template" `/contact` fallback.
  - [x] GitHub URL renders "GitHub" external secondary CTA.
  - [x] Release URL renders "Download" external secondary CTA.
  - [x] Requested CSS added.
  - [x] Loading/error/empty states preserved.
  - [x] JSON, Vite build, JSX syntax, and backend route checks attempted and documented.
- Verification result: JSON parse passed; backend template route test passed 1/1; target Templates.jsx lint passed; Vite build passed; full client lint attempted and failed only on unrelated existing files.
- Failure recovery notes: Full client lint failure classified as unrelated because no reported file is part of this workflow. No in-scope fix needed; targeted lint for the edited page passes.
- Review result: Reviewed; no in-scope issues found.
- Blockers: None.
- Next step: Final review, release notes, summary, health check, final response.

### `2026-05-15 13:30` - `TASK-001`

- Status: `Done`
- Lifecycle transition reached: `Planned -> Ready -> In Progress -> Verified -> Reviewed -> Done`
- Files changed: `server/data/templates.json`, `server/controllers/templatesController.js`, `server/routes/templateRoutes.js`, `server/app.js`, `server/tests/templates.test.js`
- Dirty worktree protection: Initial `git status --short` showed pre-existing dirty workflow files (`RUN_WORKFLOW.md`, `WORK_REQUEST.md`, `_handoff/current.md`, `_progress/progress.md`, `_task/README.md`, `docs/PROMPTS.md`, untracked `_parallel/`). Planned backend implementation files were not dirty before editing. No overlap risk on TASK-001 files.
- Parallel metadata: Priority=P0; Parallel safe=yes; Depends on=none; Blocks=TASK-003; File locks=server/data/templates.json, server/controllers/templatesController.js, server/routes/templateRoutes.js, server/app.js, server/tests/templates.test.js; Claim status=done; Claimed by=backend-worker; Agent role=parallel-worker; Merge risk=low
- Parallel claim/lock status: Claim recorded; all backend file locks released after final status.
- Worker status: backend-worker; one claimed task; Iteration 3 - Polish complete; final status `Done`.
- Merge review status: passed
- Iteration evidence:
  - Iteration 1 - Build: Goal=add smallest working JSON-backed endpoint. Changes=created templates.json (3 objects), controller returning JSON, route on GET /, mount at `/api/templates`. Verification=`npx jest tests/templates.test.js --runInBand` -> Tests: 1 passed, 1 total (Jest exit-1 from unrelated MongoDB connect attempt; assertions passed). Review=pattern mirrors projectsController. Acceptance=met. Remaining=none. Next=Iteration 2 tighten shape.
  - Iteration 2 - Refine: Goal=tighten endpoint verification and shape. Changes=test asserts status 200, JSON content-type, array, length>=3, per-object id/title/description/category strings and non-empty string-tag array, plus exact match to raw `templates.json`. Verification=`npx jest tests/templates.test.js --runInBand` -> Tests: 1 passed, 1 total. Review=shape coverage matches spec section 17. Acceptance=met. Remaining=none. Next=Iteration 3 polish.
  - Iteration 3 - Polish: Goal=final route/data cleanup and verification. Changes=none beyond review pass. Verification=`npx jest tests/templates.test.js --runInBand` (rerun) -> Tests: 1 passed, 1 total. Review=no regressions; matches `/api/projects` style; no new deps. Acceptance=met. Remaining=none. Final verdict=Done.
- Acceptance result: All criteria [x]
- Verification result: `npx jest tests/templates.test.js --runInBand` (from `server/`) -> Tests: 1 passed, 1 total.
- Failure recovery notes: None. Jest process did not exit cleanly due to unrelated MongoDB connection attempt in `server/config/db.js`; classified out-of-scope. Test assertions all passed; no fix needed for in-scope behavior.
- Review result: Reviewed; no issues found in scope.
- Blockers: None
- Next step: TASK-002 verification (frontend lint + build).

### `2026-05-15 13:45` - `TASK-002`

- Status: `Done`
- Lifecycle transition reached: `Planned -> Ready -> In Progress -> Verified -> Reviewed -> Done`
- Files changed: `client/src/services/templateService.js`, `client/src/hooks/queries/useTemplates.js`, `client/src/Pages/Templates/Templates.jsx`
- Dirty worktree protection: Planned frontend implementation files were not dirty before editing. Templates.jsx was previously placeholder-only and was replaced with fetched-data rendering. No overlap with other workflows.
- Parallel metadata: Priority=P0; Parallel safe=yes; Depends on=none (after contract fixed in spec); Blocks=TASK-003; File locks=client/src/services/templateService.js, client/src/hooks/queries/useTemplates.js, client/src/Pages/Templates/Templates.jsx; Claim status=done; Claimed by=frontend-worker; Agent role=parallel-worker; Merge risk=low
- Parallel claim/lock status: Claim recorded; all frontend file locks released after final status.
- Worker status: frontend-worker; one claimed task; Iteration 3 - Polish complete; final status `Done`.
- Merge review status: passed
- Iteration evidence:
  - Iteration 1 - Build: Goal=wire page to fetched data with basic states. Changes=added templateService.js using shared `api` client, added useTemplates query hook (staleTime 5 min), replaced local templateCards array with `useTemplates()` destructuring `data`, `error`, `isError`, `isLoading`. Verification=deferred to later iterations. Review=convention matches newsletterService/useContactMessages. Acceptance=service/hook/page wiring met. Remaining=add explicit loading/error/empty UI. Next=Iteration 2 add states.
  - Iteration 2 - Refine: Goal=tighten error handling, normalization, responsive cards, accessibility. Changes=added getTemplatesErrorMessage; added skeleton loading grid with `aria-busy`/`aria-live` and visually-hidden text; added error and empty branches; added defensive Array.isArray(tags) and fallbacks for missing title/description/category. Verification=`npx eslint src/Pages/Templates/Templates.jsx src/services/templateService.js src/hooks/queries/useTemplates.js` (from `client/`) -> no errors. Review=all four states render; tags list only when non-empty; landmarks preserved. Acceptance=met. Remaining=none. Next=Iteration 3 polish.
  - Iteration 3 - Polish: Goal=final lint/build verification and design pre-flight. Changes=none. Verification=`npm run build --prefix client` -> built in 9.35s, 0 errors (pre-existing chunk-size advisory only, unrelated). Review=no regressions; responsive 900px/620px breakpoints preserved; `prefers-reduced-motion` respected. Acceptance=met. Remaining=none. Final verdict=Done.
- Acceptance result: All criteria [x]
- Verification result: ESLint clean on three target files; `npm run build --prefix client` succeeded.
- Failure recovery notes: None.
- Review result: Reviewed; no issues found in scope.
- Blockers: None
- Next step: TASK-003 orchestrator merge review and final artifacts.

### `2026-05-15 14:00` - `TASK-003`

- Status: `Done`
- Lifecycle transition reached: `Planned -> Ready -> In Progress -> Verified -> Reviewed -> Done`
- Files changed: `_task/2026-05-15-build-templates-data-flow.md`, `_parallel/claims.md`, `_parallel/locks.md`, `_parallel/agent-status.md`, `_progress/progress.md`, `_handoff/current.md`, `_review/2026-05-15-build-templates-data-flow.md`, `_release/build-templates-data-flow.md`, `_summary/2026-05-15-build-templates-data-flow.md`
- Dirty worktree protection: Initial `git status --short` only shows `?? CLAUDE.md` (untracked, IDE-related, unrelated to workflow). Workflow artifact files are the only paths edited in TASK-003. No overlap with worker file locks.
- Parallel metadata: Priority=P1; Parallel safe=no; Depends on=TASK-001, TASK-002; Blocks=final response; File locks=workflow artifacts only; Claim status=done; Claimed by=orchestrator; Agent role=orchestrator; Merge risk=medium
- Parallel claim/lock status: Claim recorded; all orchestrator workflow-artifact locks released after final status.
- Worker status: orchestrator; one claimed task; Iteration 3 - Polish complete; final status `Done`.
- Merge review status: passed
- Iteration evidence:
  - Iteration 1 - Build: Goal=collect worker outputs and run initial merge review. Changes=re-read both worker file locks and confirmed no overlap; re-read implementation files committed in `24831f5` to verify the contract is consistent. Verification=`git status --short` -> only `?? CLAUDE.md` untracked; `git log --oneline -15` -> implementation present in `24831f5`. Review=no file-lock overlap; no scope creep. Acceptance=met. Remaining=none. Next=run verification suite in Iteration 2.
  - Iteration 2 - Refine: Goal=resolve in-scope integration defects and rerun targeted verification. Changes=none (no defects found). Verification=`npx jest tests/templates.test.js --runInBand` (server/) Tests: 1 passed; `npx eslint ...` (client/) no errors; `npm run build --prefix client` built in 9.35s, 0 errors. Review=all targeted checks pass. Acceptance=met. Remaining=none. Next=finalize artifacts in Iteration 3.
  - Iteration 3 - Polish: Goal=final artifact completion and workflow health check. Changes=updated task plan iteration evidence; appended progress entries; updated parallel claims/locks/agent-status; created review/release/summary; updated handoff; ran health check. Verification=`git diff --stat` -> shows workflow artifact updates only; implementation files unchanged from committed state. Review=all required artifacts present; spec section 17 acceptance criteria all [x]. Acceptance=met. Remaining=none. Final verdict=Done.
- Acceptance result: All criteria [x]
- Verification result: Backend Jest test passed; client ESLint and build passed; final diff audit documented.
- Failure recovery notes: None.
- Review result: Reviewed; no in-scope issues.
- Blockers: None
- Next step: Final response with workflow health `Passed`.

### `2026-05-13 08:10` - `TASK-001` (newsletter-email-verification)

- Status: `Done`
- Lifecycle transition reached: `Planned -> Ready -> In Progress -> Verified -> Reviewed -> Done`
- Files changed: `server/models/NewsletterSubscriber.js`, `server/controllers/newsletterController.js`, `server/routes/newsletterRoutes.js`, `server/utils/emailService.js`, `server/tests/newsletter.test.js`, `.env.example`
- Dirty worktree protection: Initial `git status --short` showed only the workflow's own `WORK_REQUEST.md` edit. Planned backend implementation files were not dirty before editing. No overlap risk.
- Parallel metadata: Sequential `complete-workflow` mode; parallel fields not applicable.
- Parallel claim/lock status: not applicable.
- Worker status: not applicable.
- Merge review status: not applicable.
- Iteration evidence:
  - Iteration 1 - Build: Goal=minimum working slice (schema fields, subscribe rewrite, verify endpoint, email sender, baseline coverage). Changes=added `verified`, `verifyToken` (sparse index), `verifyTokenExpiresAt`, `verifiedAt` to NewsletterSubscriber; rewrote subscribe to generate a 32-byte hex token, persist its SHA-256 hash with a 24h expiry, rotate on pending resubmit, return friendly already-subscribed on verified resubmit, dispatch email via `emailService` (best-effort); added verify controller branching on found/expired/already-verified/clear-token-on-success; added `sendNewsletterVerificationEmail` to `emailService.js`; mounted `GET /verify` with its own rate limiter (default 30/hr). Verification=`npx jest server/tests/newsletter.test.js --runInBand --forceExit` first run timed out on a 5s `beforeAll` Mongoose cold-start; second run after raising hook timeout to 30s passed all 10 assertions. Review=controller mirrors `contactController` DB-first + best-effort-email pattern. Acceptance=met for create-pending and verify-success. Remaining=tighten messaging and test names. Next=Iteration 2 Refine.
  - Iteration 2 - Refine: Goal=harden token-reuse messaging and clarify idempotency semantics. Changes=updated invalid-status message to "Verification link is invalid or has already been used."; renamed re-click test to reflect single-use behaviour and asserted the friendly message. Verification=`npx jest server/tests/newsletter.test.js --runInBand --forceExit` -> 10 passed, 1 suite. Review=behaviour and copy now match (tokens are single-use; `already_verified` only fires on race where a verified row still holds a token). Acceptance=met. Remaining=document the optional env var. Next=Iteration 3 Polish.
  - Iteration 3 - Polish: Goal=document new optional env vars, run final verification. Changes=added `NEWSLETTER_RATE_LIMIT` (existing default) and `NEWSLETTER_VERIFY_RATE_LIMIT` (new) entries to `.env.example`. Verification=`npx jest server/tests/newsletter.test.js --runInBand --forceExit` -> 10 passed, 1 suite. Review=no new dependencies; mirrors existing controller patterns; tokens stored hashed; no plaintext logging. Acceptance=met. Remaining=none. Final verdict=Done.
- Acceptance result:
  - [x] Schema fields present
  - [x] Subscribe pending response shape
  - [x] Pending resubmit rotates token + resends
  - [x] Verified resubmit returns alreadySubscribed (no mail)
  - [x] GET /verify returns verified/expired/invalid/already_verified
  - [x] Email dispatched via emailService with CLIENT_URL link
  - [x] Backend tests pass (10/10)
- Verification result: `npx jest server/tests/newsletter.test.js --runInBand --forceExit` from repo root -> Test Suites: 1 passed, 1 total; Tests: 10 passed, 10 total. Time ~7.5s.
- Failure recovery notes: First Iteration-1 run failed because Jest's default 5s `beforeAll` timeout was shorter than the Atlas cold-start connect end-to-end (~7s including model setup). Classified in-scope (test ergonomics). Targeted fix: added `jest.setTimeout(30000)` and a 30s timeout argument to `beforeAll`. Rerun: all 10 tests passed.
- Review result: Reviewed; no in-scope defects. Tokens are 32 random bytes, SHA-256 hashed at rest, never logged.
- Blockers: None.
- Next step: TASK-002 (frontend) Iteration 1 - Build.

### `2026-05-13 08:35` - `TASK-002` (newsletter-email-verification)

- Status: `Done`
- Lifecycle transition reached: `Planned -> Ready -> In Progress -> Verified -> Reviewed -> Done`
- Files changed: `client/src/services/newsletterService.js`, `client/src/hooks/queries/useVerifyNewsletter.js` (new), `client/src/Pages/NewsletterVerify/NewsletterVerify.jsx` (new), `client/src/Pages/NewsletterVerify/newsletter-verify.styles.scss` (new), `client/src/App.jsx`, `client/src/components/Newsletter/NewsletterSignupForm.jsx`, `client/test/newsletter/Newsletter.test.jsx`, `client/test/newsletter/NewsletterVerify.test.jsx` (new)
- Dirty worktree protection: Only `WORK_REQUEST.md` and TASK-001 backend files were dirty before TASK-002 started. No overlap with planned frontend files.
- Parallel metadata: Sequential `complete-workflow` mode; parallel fields not applicable.
- Parallel claim/lock status: not applicable.
- Worker status: not applicable.
- Merge review status: not applicable.
- Iteration evidence:
  - Iteration 1 - Build: Goal=success-copy update, new page, route, service, query hook, baseline tests. Changes=added `verifyNewsletter` to `newsletterService.js` (returns the JSON body for API-shaped errors instead of re-throwing); added `useVerifyNewsletter` query hook (`enabled` gated on token, `retry: false`, `staleTime: Infinity`); created `NewsletterVerify` page with success/expired/invalid/already-verified/loading states and styles; mounted `/newsletter/verify` under the public layout in `App.jsx`; updated `NewsletterSignupForm` success-copy fallback to "Check your email to confirm your subscription."; updated existing `Newsletter.test.jsx` for new copy; added `NewsletterVerify.test.jsx`. Verification=`npx vitest run test/newsletter/Newsletter.test.jsx test/newsletter/NewsletterVerify.test.jsx` initial run: 10 passed / 3 failed in verify page (regex matched headline + body text); 1 pre-existing failure in `renders the redesigned newsletter content` because headline copy and body copy in `newsletter.constants.js` had drifted from the assertion. Review=loading and four terminal states render; route reachable. Acceptance=met for primary success path. Remaining=disambiguate test queries, refresh stale assertions. Next=Iteration 2 Refine.
  - Iteration 2 - Refine: Goal=resolve in-scope test failures and tighten page logic. Changes=switched verify-page assertions to a headline-class selector to avoid double matches; updated the pre-existing assertion to current constants (`Keep your build moving`, `MERN tactics, AI workflow notes`); simplified `resolveStatus` (no double `invalid` return) and replaced `isLoading || isFetching` with plain `isLoading` (combined with `staleTime: Infinity` there is no background refetch). Verification=`npx vitest run test/newsletter/Newsletter.test.jsx test/newsletter/NewsletterVerify.test.jsx` -> Tests: 13 passed, 0 failed; Test Files: 2 passed. Review=all six verify-page scenarios pass, including the network-error fallback. Acceptance=met. Remaining=lint + build. Next=Iteration 3 Polish.
  - Iteration 3 - Polish: Goal=lint and production build. Changes=none beyond polish review. Verification=`npx eslint <changed files>` -> no output (clean); `npm run build` -> built in 8.82s, 0 errors (pre-existing chunk-size advisory only, unrelated). Review=no regressions; new page renders with semantic landmarks (`<main>` + `aria-labelledby`); icons hidden from screen readers; loading and result regions announce via `role="status"` / `role="alert"`. Acceptance=met. Remaining=none. Final verdict=Done.
- Acceptance result:
  - [x] Signup success copy updated
  - [x] `/newsletter/verify` route renders loading / success / expired / invalid / already-verified states
  - [x] Vitest passes (13/13)
  - [x] ESLint clean on changed files
  - [x] `npm run build` succeeds
- Verification result: Vitest 13/13 pass; ESLint clean; production build OK (8.82s).
- Failure recovery notes: Two in-scope adjustments — disambiguated DOM queries in `NewsletterVerify.test.jsx` (test assertions matched both headline and body) and refreshed two assertions in `Newsletter.test.jsx` that had drifted from `newsletter.constants.js`. Both fixes are inside files this task already owns; classified as in-scope hygiene rather than scope creep.
- Review result: Reviewed; no in-scope defects.
- Blockers: None.
- Next step: Final diff audit, review, release notes, summary.
