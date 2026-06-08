# Heroku-24 Upgrade And Deployment Spec

## 1. Metadata
- Spec filename: `_workflow/runs/dev/spec.md`
- Date: 2026-06-08
- Request ID / slug: `upgrade-heroku-24`
- Request source: Direct user request and follow-up
- Execution mode: `complete-workflow`
- Request classification: `ops`
- Scope level: `small`
- Risk level: `medium`

## 2. Original Request
- Raw user request: Upgrade `devkofi-api` from Heroku-22 to Heroku-24, deploy,
  verify health, and merge `dev` with `main`.
- Normalized request: Ensure `main` contains `dev`, change the app stack to
  `heroku-24`, deploy `main`, and prove the web process and application are
  healthy without unrelated code changes.
- Source prompt / request reference: `_workflow/runs/dev/request.md`

## 3. Questions And Answers
- Questions asked: Which revision should be deployed?
- Answers received: Merge `dev` with `main` and push to Heroku.
- Questions skipped: None.
- Remaining open questions: None blocking.

## 4. Problem Definition
- Problem being solved: The app remains on the `heroku-22` stack and needs a
  verified upgrade to `heroku-24`.
- Why it matters: The deployment must remain on a supported, current stack.
- Current pain point: Runtime compatibility and process health on Heroku-24
  have not been proven.
- Expected value: A successful Heroku-24 release with recorded evidence.

## 5. Current State Analysis
- Existing behavior: Heroku reports one web dyno on `heroku-22`.
- Existing architecture/components: Node/Express server started by Procfile
  command `npm run start:server`.
- Existing files/modules likely involved: `package.json`, `package-lock.json`,
  `Procfile`, and server startup/config only if compatibility fails.
- Existing data flow: Heroku Node buildpack installs dependencies and starts
  `node server/server.js`.
- Existing API/UI/CLI/workflow behavior: Deployment is Git-based through the
  `heroku` remote.
- Existing tests or verification coverage: Repository tests exist, but this
  operation is primarily verified by Heroku build/release/process/log/HTTP
  evidence.

## 6. Desired End State
- Expected final behavior: `devkofi-api` runs on `heroku-24`.
- User-facing outcome: The deployed API remains reachable.
- Developer-facing outcome: A successful release and documented runtime state.
- System/workflow outcome: Main contains dev and the Heroku release is sourced
  from main.
- Backward compatibility expectations: Existing application behavior remains
  unchanged.

## 7. Scope
- In scope: Branch integration, stack update, empty deployment commit, Heroku
  deployment, release/dyno/log/HTTP verification, and minimal proven fixes.
- Out of scope: Unrelated application changes, broad upgrades, refactors, and
  deployment platform changes.
- Non-goals: Modernizing dependencies or changing product behavior.
- Explicit boundaries: Do not edit code preemptively.

## 8. Users And Use Cases
- Primary users: Application owner and deployed API consumers.
- Secondary users: Developers deploying the repository.
- Main use cases: Deploy the current main revision on Heroku-24 and confirm
  availability.
- Edge use cases: Build succeeds but dyno crashes; runtime starts but config is
  missing; HTTP endpoint returns an unhealthy response.

## 9. Functional Requirements
- Required behaviors: Main includes dev; stack is Heroku-24; deployment creates
  a successful release; web dyno is up; deployed HTTP service responds.
- Inputs: Local branches, Heroku app configuration, buildpack, and environment.
- Outputs: Git merge/commit, Heroku release, command evidence, final report.
- State changes: Main may gain a merge and empty deployment commit; Heroku stack
  changes to Heroku-24; a new release is created.
- Error states: Merge conflict, build failure, release failure, crash loop,
  dependency/runtime mismatch, missing config, or unhealthy HTTP response.
- Permissions/auth expectations: Existing authenticated Git and Heroku CLI
  access is required.

## 10. Non-Functional Requirements
- Performance expectations: Not applicable beyond normal startup.
- Reliability expectations: All web processes reach a stable healthy state.
- Security/privacy expectations: Do not print config values or secrets.
- Accessibility expectations: Not applicable.
- Maintainability expectations: Keep changes minimal and auditable.
- DX expectations: Show each command before execution and capture results.

## 11. Affected Surfaces
- Files likely affected: Git history and run-scoped workflow artifacts;
  application files only after a proven compatibility failure.
- Directories likely affected: `_workflow/runs/dev/`.
- UI surfaces: None.
- API routes: Existing deployed routes only for health validation.
- Components: None planned.
- Services: Heroku app `devkofi-api`.
- Database/schema: None.
- Config/env vars: Validate presence-related failures without exposing values.
- Tests: Deployment and HTTP smoke checks; targeted tests only if code changes.
- Docs: Run-scoped workflow artifacts.
- Workflow artifacts: request, spec, tasks, progress, handoff, verification,
  review, release notes, and summary.

## 12. Dependency And Integration Map
- Internal dependencies: Procfile -> npm script -> Express server.
- External packages/services: Heroku Node buildpack and application add-ons.
- Integration points: Git remote `heroku`, Heroku stack, dyno manager, app URL.
- Ordering constraints: Approve spec; plan; merge; set stack; commit; deploy;
  verify release; verify dyno/logs; verify HTTP.
- Migration/setup requirements: Stack change triggers rebuild.

## 13. Data And State Impact
- Data models: No change.
- Database changes: None.
- State management changes: None.
- Cache/session/local storage impact: None expected.
- Backward compatibility impact: None expected.

## 14. UX / API / Workflow Expectations
- UX expectations: Not applicable.
- API contract expectations: Existing deployed API remains available.
- CLI/workflow behavior: Every command is announced before execution and its
  output is retained in evidence.
- Error handling expectations: Stop immediately after a failed deployment,
  diagnose, propose the smallest fix, and redeploy only after the failure is
  understood.
- Empty/loading/success/failure states: Success requires release, dyno, logs,
  and HTTP evidence; otherwise report the exact blocked/failure state.

## 15. Execution Strategy
- Recommended implementation approach: Operate from the existing main
  worktree; merge dev (expected no-op), set stack, create an empty commit, push
  main, and perform bounded verification.
- Suggested sequencing: Git verification -> merge -> stack set -> deployment
  commit -> push -> release/dyno/log checks -> HTTP smoke check.
- Safe rollout/migration approach: Record the previous stack and release before
  mutation; avoid application edits unless deployment evidence requires them.
- Files to inspect before editing: `package.json`, `Procfile`, server startup
  and environment validation code only if logs indicate a problem.
- Decisions to avoid until more evidence exists: Dependency or Node version
  changes.

## 16. Verification Strategy
- Required automated checks: Heroku release status, dyno status, bounded logs,
  current stack, and HTTP request to the deployed URL or health endpoint.
- Required manual checks: Inspect output for startup, dependency, Node runtime,
  and environment failures.
- Test types needed: Deployment smoke verification; targeted repository tests
  only if code changes.
- Build/lint/typecheck expectations: Heroku build must pass. Local checks are
  required for any compatibility code fix.
- Acceptance evidence required: Commands, exit codes, release ID, process
  state, relevant logs, and HTTP status.
- Proof of completion: App reports Heroku-24 and stable web dyno health.

## 17. Acceptance Criteria
- [ ] `main` contains the current `dev` revision without losing main-only work.
- [ ] Heroku reports `heroku-24` as the active stack.
- [ ] `git push heroku main` completes successfully.
- [ ] The resulting Heroku release is successful and its release ID is recorded.
- [ ] The web dyno is `up` and remains free of startup crash evidence.
- [ ] Logs show no dependency, Node-version, or missing-environment failure.
- [ ] The deployed application responds successfully over HTTP.
- [ ] All commands, outputs, failures, and fixes are summarized.

## 18. Edge Cases And Failure Modes
- Edge cases: Main already contains dev; stack update creates a release before
  code deployment; logs contain historical errors unrelated to the new release.
- Failure modes: Merge conflict, rejected Git push, buildpack failure,
  unsupported native dependency, wrong Node/npm runtime, absent config, crash.
- Regression risks: Deploying an unintended branch or changing code without
  evidence.
- Recovery expectations: Stop on deployment failure, isolate the exact stage,
  apply only an in-scope fix, and repeat deployment verification.

## 19. Risks And Mitigations
- Technical risks: Heroku-24 system library changes. Mitigation: inspect build
  and runtime output before changing dependencies.
- Product/UX risks: API downtime. Mitigation: verify release and process state
  immediately.
- Security risks: Accidental secret disclosure. Mitigation: inspect config
  names/status only, never values.
- Scope risks: Broad dependency churn. Mitigation: require failure evidence.
- Mitigation plan: Use exact command evidence and bounded fixes.

## 20. Assumptions
- Explicit assumptions: Existing credentials authorize Git and Heroku actions;
  current main-only commits are intentional; the app URL is suitable for an
  HTTP smoke check.
- Confidence level: High.
- What to revisit if assumptions are wrong: Stop and document authentication,
  branch, or endpoint blockers.

## 21. Open Questions
- Blocking questions: None.
- Non-blocking questions: Whether a dedicated health endpoint exists.
- Execution impact: If absent, validate the root or known API endpoint.

## 22. Task Extraction Notes
- Suggested vertical task boundaries: One ops task covering merge, upgrade,
  deployment, and health verification because each step is sequential.
- Suggested first task: Upgrade and verify `devkofi-api` on Heroku-24.
- Suggested task ordering: Git integration, mutation/deploy, verification,
  documentation.
- Areas that should not become separate tasks: Application code fixes unless a
  concrete deployment failure occurs.
- How the 3-pass Build -> Refine -> Polish loop should apply: Build performs the
  merge/stack/deploy; Refine validates release/process/logs and resolves proven
  compatibility failures; Polish performs final HTTP/runtime checks and audits
  evidence. TDD is not applicable to pure infrastructure commands; any code
  change must use targeted Red -> Green -> Refactor evidence.

Frontend Taste Application: Not applicable.
