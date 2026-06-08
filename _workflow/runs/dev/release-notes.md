# Release Notes

- Request: Restore the missing Projects page list.
- User-facing changes: Projects load during local development; API failures show a `Try again` action.
- Developer changes: Added deterministic API URL normalization and a Vite `/api` proxy to the local Express server.
- New routes/APIs: none
- New env vars: none
- Database/schema changes: none
- Dependencies added/removed: none
- Test commands run: Focused Vitest suites, full client suite, client build, scoped and repository-wide lint, live API/browser verification.
- Known limitations: Exact deployed site was not supplied, so live deployment verification was not performed. Existing unrelated lint and test failures remain.
- Follow-up work: Repair stale unrelated repository tests/lint.
- Suggested commit message: `fix projects API loading and retry state`
