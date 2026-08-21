# Task Plan

## TASK-001 — Publish Setup PRD Workspace in the template catalog

- Priority: P1
- Status: Complete
- Outcome: DevKofi exposes one data-driven Setup PRD Workspace card with a direct **Use Template** action.
- Files locked:
  - `server/tests/templates.test.js`
  - `server/data/templates.json`
  - `_workflow/runs/feat__add-prd-workspace-template/*`
- Dependencies: None
- Parallel-safe: No; this is the only task.
- Frontend Taste Application: Not applicable; no JSX or CSS changes.

### Build iteration

- Red: Add an exact regression assertion for the absent catalog entry and observe failure.
- Green: Add the approved catalog data and pass the targeted test.
- Refactor: Keep assertions explicit and remove the stale minimum-count assumption.

### Refine iteration

- Harden uniqueness and duplicate-action coverage.
- Rerun the targeted test.
- Missing-test exception: Additional assertions may pass immediately because the Build implementation already satisfies the invariants.

### Polish iteration

- Validate JSON/catalog integrity, run the client production build, and audit the final diff.
- Missing-test exception: Polish changes only workflow evidence unless verification exposes a defect.

### Acceptance evidence

- `npm test -- server/tests/templates.test.js --runInBand`
- `npm run build --prefix client`
- Final `git diff` and `git status` audit

### Completion

- Build: Red observed for missing entry; Green after catalog update.
- Refine: Unique-ID and duplicate-action assertions pass.
- Polish: Catalog integrity and client production build pass; final diff is scope-clean.
