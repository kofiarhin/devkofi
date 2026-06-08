# Task Plan

- Spec file used: `_workflow/runs/dev/spec.md`
- Planning date: 2026-06-08
- Explicit spec approval: User approved on 2026-06-08
- Execution mode: `complete-workflow`
- Progress read: `_workflow/runs/dev/progress.md`
- Summary read: `_workflow/runs/dev/summary.md`
- Spec sections used: Sections 5-22, including affected surfaces,
  dependencies, execution strategy, verification, acceptance criteria, risks,
  assumptions, and task extraction.

## TASK-001: Upgrade and verify devkofi-api on Heroku-24

- Status: Done
- Lifecycle: Planned -> Ready -> In Progress -> Verified -> Reviewed -> Done
- Objective: Ensure `main` contains `dev`, deploy `main` to `devkofi-api` on
  Heroku-24, and prove the release and application are healthy.
- Files affected: Git history on `main` and run-scoped workflow artifacts only.
- Application code changed: No.

### Iteration 1 Build

- Goal: Integrate branches, set Heroku-24, and deploy main.
- Changes made: Confirmed main already contained dev; `git merge dev` returned
  `Already up to date`; set stack to Heroku-24; created empty commit `ee6093b`;
  pushed main to Heroku.
- Test plan: Git ancestry, stack output, and deployment exit code.
- Red phase evidence: Pre-change stack was `heroku-22`.
- Green phase evidence: Build succeeded on Heroku-24 and released `v200`.
- Refactor phase evidence: Infrastructure-only exception; no code changed.
- Test commands run: Git status/ancestry/log; Heroku stack; Git push.
- Verification command/result: `git push heroku main` exited 0 and Heroku
  reported `Verifying deploy... done`.
- Review findings: Node 20.20.2 EOL and 8 npm audit vulnerabilities were
  warnings, not deployment failures.
- Acceptance status: Passed.
- Remaining issues: Runtime and HTTP stability checks.
- Next action: Iteration 2 Refine.

### Iteration 2 Refine

- Goal: Validate release, dyno startup, and runtime compatibility.
- Changes made: None.
- Test plan: Inspect release, dyno, logs, runtime versions, and config names.
- Red phase evidence: Infrastructure-only exception.
- Green phase evidence: Release `v200`; web.1 `up`; server started, connected to
  MongoDB, and reached `starting -> up`; Node `v20.20.2`; npm `10.9.8`.
- Refactor phase evidence: Infrastructure-only exception; no code changed.
- Test commands run: Heroku releases, ps, logs, run node/npm versions, and
  config-name listing.
- Verification command/result: Passed. No startup, dependency-load,
  Node-execution, or missing-environment error was observed.
- Review findings: First Node version check collided with a concurrent Eco
  one-off dyno; serial retry passed.
- Acceptance status: Passed.
- Remaining issues: HTTP and final audit.
- Next action: Iteration 3 Polish.

### Iteration 3 Polish

- Goal: Confirm stable HTTP health and audit the final deployment.
- Changes made: None.
- Test plan: HTTP request, newest logs, final stack/release/ps, deployed Git
  ref, Git status, and diff.
- Red phase evidence: Infrastructure-only exception.
- Green phase evidence: `/api/projects` returned HTTP 200 with 7,106 bytes;
  repeated router logs returned 200; web.1 remained up; Heroku remote and local
  main both resolve to `ee6093b`.
- Refactor phase evidence: Infrastructure-only exception; no code changed.
- Test commands run: Bounded `heroku logs --tail`, `Invoke-WebRequest`, final
  Heroku checks, `git ls-remote`, `git status`, and diff audit.
- Verification command/result: Passed.
- Review findings: Initial Start-Job tail wrapper timed out locally; finite
  pipeline and bounded logs succeeded. Parallel Git audit commands timed out;
  serial retries passed.
- Acceptance status: Passed.
- Remaining issues: Node 20 should be upgraded before Heroku makes the warning
  a build error; dependency vulnerabilities require separate review.
- Next action: Workflow complete.

### Acceptance Result

- [x] Main contains current dev without losing main-only work.
- [x] Active stack is `heroku-24`.
- [x] Heroku Git deployment succeeded.
- [x] Successful release `v200` recorded.
- [x] Web dyno is up.
- [x] No startup, dependency-load, Node-execution, or missing-environment
  failure exists.
- [x] Deployed application responds successfully over HTTP.
- [x] Command output, errors, and fixes are documented.

### Stop Condition

- Not reached. Deployment succeeded on the first push.

### Out Of Scope

- Node major-version upgrade, dependency remediation, feature changes, and
  unrelated cleanup.
