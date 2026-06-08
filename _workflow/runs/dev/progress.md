# Progress

## 2026-06-08 - TASK-001 Heroku-24 Upgrade Complete

- Status: Done
- Lifecycle: Ready -> In Progress -> Verified -> Reviewed -> Done
- Main worktree was clean.
- `main` already contained `dev`; `git merge dev` returned `Already up to date`.
- Previous stack: `heroku-22`.
- Stack set to `heroku-24`.
- Empty deployment commit created: `ee6093b chore: upgrade Heroku stack to heroku-24`.
- Deployment: `git push heroku main` passed.
- Heroku build: Passed on Heroku-24 with `heroku/nodejs`.
- Release: `v200`, commit `ee6093b5`.
- Dyno: `web.1 up`.
- Startup: Server started, MongoDB connected, state changed to up.
- Runtime: Node `v20.20.2`, npm `10.9.8`.
- HTTP: `/api/projects` returned 200 and 7,106 bytes.
- Config check: Config variable names were present; values were not printed.
- Application code changes: None.
- Iteration 1 Build: Passed; infrastructure-only TDD exception.
- Iteration 2 Refine: Passed; infrastructure-only TDD exception.
- Iteration 3 Polish: Passed; infrastructure-only TDD exception.
- Failure recovery:
  - Concurrent Node/npm one-off dynos hit the Eco limit; serial Node retry passed.
  - Initial bounded Start-Job log tail timed out locally; finite tail and
    bounded log commands succeeded.
  - Parallel Git audit commands timed out; serial retries passed.
- Warnings:
  - Node 20.20.2 is EOL and Heroku warns future buildpacks will reject it.
  - npm audit reported 8 vulnerabilities: 4 moderate and 4 high.
- Acceptance: All criteria met.
- Next step: Final artifacts and health check.

## 2026-06-08 - Heroku-24 Upgrade Planning

- Explicit spec approval received from the user.
- Task plan saved at `_workflow/runs/dev/tasks.md`.
- `TASK-001` moved from Planned to Ready.
- Next step: Iteration 1 Build from the existing main worktree.

## 2026-06-08 - Heroku-24 Upgrade Intake

- New active request: Merge `dev` into `main`, upgrade `devkofi-api` from
  Heroku-22 to Heroku-24, deploy, and verify health.
- Shared Understanding Handoff completed.
- Read-only Heroku checks confirmed stack `heroku-22`, buildpack
  `heroku/nodejs`, and one web dyno.
- Git checks confirmed a clean `dev` worktree and that `main` already contains
  `dev`.
- Detailed spec saved at `_workflow/runs/dev/spec.md`.
- Status: Waiting at the mandatory spec approval gate.
- No merge, Heroku mutation, commit, or deployment has been performed.

## 2026-06-08 - Planning

- Request synced to `_workflow/runs/dev/request.md`.
- Detailed spec saved at `_workflow/runs/dev/spec.md`.
- Explicit approval received: `approve spec`.
- Task plan saved at `_workflow/runs/dev/tasks.md`.
- Dirty worktree: only untracked `_workflow/runs/dev/` artifacts created by this workflow.
- Next step: Execute `TASK-001` Iteration 1 Build with TDD-first Red -> Green -> Refactor.

## 2026-06-08 - TASK-001 Iteration 1 Build

- Status: In Progress
- Lifecycle transition reached: Ready -> In Progress
- Goal: Reproduce and fix local project API request routing.
- Files changed: `client/tests/projects.test.js`, `client/src/hooks/useProjects.js`, `client/vite.config.js`.
- Test plan: Assert same-origin/configured endpoint construction and local Vite `/api` proxy configuration.
- Red phase evidence: `npm run test -- --run tests/projects.test.js` failed 2 of 8 tests because `getProjectsUrl` did not exist and Vite had no `/api` proxy.
- Green phase evidence: Added `getProjectsUrl`, used it in the query, and configured Vite to proxy `/api` to `http://localhost:5000`; focused test passed 8 of 8.
- Refactor phase evidence: Reviewed the implementation and retained the minimal pure URL helper plus proxy configuration; reran focused test, passing 8 of 8.
- Test commands run:
  - `npm run test -- --run tests/projects.test.js` (expected Red failure)
  - `npm run test -- --run tests/projects.test.js` (Green pass)
  - `npm run test -- --run tests/projects.test.js` (Refactor pass)
- Verification result: Passed.
- Review findings: No UI redesign or backend/CORS change needed. Existing query and error-state behavior preserved.
- Acceptance status: Local proxy and configured/trailing-slash endpoint criteria met at unit/config level.
- Failure recovery notes: None; Red failures were expected.
- Remaining issues: Direct fetch success/failure behavior and rendered UI still need proof.
- Next step: Iteration 2 Refine.

## 2026-06-08 - TASK-001 Iteration 2 Refine

- Status: In Progress
- Goal: Harden configured deployment URLs and request failure behavior.
- Files changed: `client/tests/projects.test.js`, `client/src/hooks/useProjects.js`.
- Test plan: Call the request function with a trailing-slash API base, assert returned JSON, and assert server error text is thrown for a non-2xx response.
- Red phase evidence: Focused test failed 2 of 10 tests because `getProjects` was not exported.
- Green phase evidence: Exported `getProjects`, accepted an explicit optional base URL, and wrapped the TanStack query callback; focused test passed 10 of 10.
- Refactor phase evidence: Normalized nullish/non-string base values with `String(baseUrl || "")`; focused test passed 10 of 10.
- Test commands run:
  - `npm run test -- --run tests/projects.test.js` (expected Red failure)
  - `npm run test -- --run tests/projects.test.js` (Green pass)
  - `npm run test -- --run tests/projects.test.js` (Refactor pass)
- Verification result: Passed.
- Review findings: Explicit query callback avoids React Query context being passed as the base URL. Existing error propagation remains intact.
- Acceptance status: Configured URL, successful payload, and failed request criteria verified.
- Failure recovery notes: None; Red failures were expected.
- Remaining issues: Rendered success/error states and full build/test verification remain.
- Next step: Iteration 3 Polish.

## 2026-06-08 - TASK-001 Iteration 3 Polish

- Status: Done
- Lifecycle transition reached: In Progress -> Verified -> Reviewed -> Done
- Goal: Prove rendered records and provide recovery from transient request failures.
- Files changed: `client/tests/ProjectsPage.test.jsx`, `client/src/Pages/Projects/Projects.jsx`.
- Test plan: Render a successful project payload, render an API error, and verify retry invokes `refetch`.
- Red phase evidence: Page test failed because `Try again` was absent. A separate ambiguous `Total` assertion was classified as a test defect and corrected.
- Green phase evidence: Page tests passed 2 of 2 after retry implementation.
- Refactor phase evidence: Simplified the retry handler to `onClick={refetch}`; combined focused tests passed 12 of 12.
- Test commands run:
  - `npm run test -- --run tests/ProjectsPage.test.jsx` (Red)
  - `npm run test -- --run tests/ProjectsPage.test.jsx` (Green)
  - `npm run test -- --run tests/projects.test.js tests/ProjectsPage.test.jsx` (Refactor, 12/12)
  - `npm run build` (passed with existing chunk-size warning)
  - Scoped ESLint command (passed)
  - Full client suite (74 passed, 13 unrelated failures)
- Live verification:
  - `http://localhost:5173/api/projects` returned 16 records through the Vite proxy.
  - Browser snapshot showed Total 16 and all project cards.
  - Browser request `/api/projects` returned 200.
  - Browser console contained 0 errors and 0 warnings.
- Failure recovery notes: Repository-wide lint failed on 36 unrelated existing errors. Full client suite failed on stale Settings/auth/BookCall tests; both new project test files passed.
- Applied skill: design-taste-frontend
- Acceptance result:
  - [x] Local proxy works.
  - [x] Configured/trailing-slash URLs work.
  - [x] Projects render.
  - [x] Errors stay explicit and can be retried.
  - [x] Focused tests and build pass.
  - [x] Scope respected.
- Review result: No in-scope defects found.
- Blockers: None.
- Next step: Final review, release notes, summary, and health check.
