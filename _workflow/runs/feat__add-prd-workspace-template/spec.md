# Add Setup PRD Workspace To DevKofi Templates

## 1. Metadata

- Spec filename: `_workflow/runs/feat__add-prd-workspace-template/spec.md`
- Date: 2026-08-21
- Request ID / slug: `add-prd-workspace-template`
- Request source: Direct user request and Grill confirmation
- Execution mode: `complete-workflow`
- Request classification: Feature/content catalog update
- Scope level: Small
- Risk level: Low

## 2. Original Request

- Raw user request: `@GitHub add this to devkofi templates`
- Normalized request: Add the public Setup PRD Workspace repository to DevKofi's data-driven template catalog with a direct **Use Template** action.
- Source: `_workflow/runs/feat__add-prd-workspace-template/request.md`

## 3. Questions And Answers

- Question asked: What should the new card's primary button do?
- Answer received: Lock in the recommendation.
- Confirmed answer: Render **Use Template** and open `https://github.com/kofiarhin/setup-prd-workspace`.
- Questions skipped: None.
- Remaining open questions: None blocking.

## 4. Problem Definition

- Problem: The new reusable skill is public but is not discoverable from DevKofi's templates page.
- Why it matters: DevKofi visitors should be able to find and use the project without contacting the owner first.
- Current pain point: The templates endpoint contains only Codex Workflow Kit.
- Expected value: A second catalog card provides a direct path to installation and usage documentation.

## 5. Current State Analysis

- `server/data/templates.json` is the authoritative catalog and currently contains one entry.
- `GET /api/templates` returns that JSON unchanged through `server/controllers/templatesController.js`.
- `client/src/Pages/Templates/Templates.jsx` renders entries returned by the endpoint.
- When `templateUrl` exists, the card renders **Use Template**; otherwise it renders **Request this template**.
- `server/tests/templates.test.js` checks the public response shape and equality with the JSON file.
- The test currently contains a stale `length >= 3` assertion despite the catalog containing one entry.

## 6. Desired End State

- The templates endpoint contains the existing Codex entry and a new unique Setup PRD Workspace entry.
- The templates page automatically renders the new card without JSX or CSS changes.
- The primary action opens the public repository in a new tab.
- Existing catalog behavior remains backward compatible.

## 7. Scope

### In scope

- Add one object to `server/data/templates.json`.
- Update `server/tests/templates.test.js` with a specific regression assertion for the new entry.
- Replace the stale arbitrary minimum-count assertion with validation aligned to the catalog.
- Run targeted backend verification and the client production build.

### Out of scope

- UI layout or styling changes.
- A template details page, downloadable release asset, pricing, filtering, or search.
- API, database, authentication, environment, dependency, or deployment changes.
- Edits to the Setup PRD Workspace repository.

## 8. Users And Use Cases

- Primary users: Developers browsing DevKofi templates.
- Secondary user: DevKofi's owner maintaining the catalog.
- Main use case: Open the templates page, find Setup PRD Workspace, and select **Use Template** to access the repository.
- Edge use case: The entry must still render when optional `githubUrl` and `releaseUrl` are absent.

## 9. Functional Requirements

- Add ID `setup-prd-workspace`.
- Add title `Setup PRD Workspace`.
- Add a concise description explaining the PRD-to-AI-workspace outcome.
- Add category `AI Workflow`.
- Add tags `Claude Code`, `PRD`, and `AI Workflow`.
- Add `templateUrl` equal to `https://github.com/kofiarhin/setup-prd-workspace`.
- Do not add `githubUrl` when it would duplicate the same destination.
- Preserve the existing catalog entry.

## 10. Non-Functional Requirements

- Performance: No meaningful change; one small static JSON object.
- Reliability: JSON must remain valid and the endpoint test must pass.
- Security/privacy: Add only a public repository URL; no secrets or private data.
- Accessibility: Existing accessible link markup remains unchanged.
- Maintainability: Keep the change data-driven and avoid unnecessary component conditionals.
- DX: Use a stable unique ID and explicit regression assertion.

## 11. Affected Surfaces

- Implementation data: `server/data/templates.json`
- Tests: `server/tests/templates.test.js`
- UI surface: `/templates`, consumed automatically; no JSX/CSS edits planned
- API route: Existing `GET /api/templates`; response gains one backward-compatible array item
- Workflow artifacts: `_workflow/runs/feat__add-prd-workspace-template/*`
- Database/schema/config/env/dependencies: None

## 12. Dependency And Integration Map

- Static catalog → templates controller → `/api/templates` → template service/query → Templates page.
- External integration: Public GitHub URL only.
- Ordering: Write the regression test first, observe failure, then add the data entry.
- Migration/setup: None.

## 13. Data And State Impact

- Data model: Existing public template object shape gains another instance, not a schema change.
- Database: None.
- Client/global state: None.
- Cache/session/local storage: Existing endpoint caching behavior only.
- Backward compatibility: Additive response change.

## 14. UX / API / Workflow Expectations

- UX: A second card displays the agreed metadata and **Use Template** action.
- API: JSON array includes the new object with the existing public shape.
- Error/loading/empty states: Unchanged.
- Link behavior: Existing `target="_blank"` and `rel="noreferrer"` behavior applies.
- Workflow: No request/contact step is required for this public template.

## 15. Execution Strategy

1. Update the API test first: remove the brittle minimum-three assumption and assert the exact new entry and URL.
2. Run the targeted test and record the expected Red failure for the missing entry.
3. Add the catalog object.
4. Run the targeted test for Green.
5. Review/refine metadata and uniqueness, then rerun the test.
6. Run the client production build and final diff audit.

Avoid UI component edits, dependency changes, or deployment work.

## 16. Verification Strategy

- Targeted backend test: `npm test -- server/tests/templates.test.js --runInBand`
- Static JSON parse/uniqueness check if needed.
- Frontend production build: `npm run build --prefix client`
- Final diff audit: `git diff --stat` and `git diff`
- Manual/code-surface confirmation: `templateUrl` follows the existing **Use Template** rendering branch.

## 17. Acceptance Criteria

- [ ] `server/data/templates.json` remains valid JSON and preserves the existing entry.
- [ ] The catalog contains exactly one unique `setup-prd-workspace` entry.
- [ ] The entry contains the agreed title, description, category, tags, and `templateUrl`.
- [ ] The existing Templates component renders **Use Template** for the entry without code changes.
- [ ] The targeted backend test passes.
- [ ] The client production build passes.
- [ ] No unrelated implementation, dependency, configuration, or deployment files change.

## 18. Edge Cases And Failure Modes

- Duplicate ID: Prevent through a uniqueness assertion.
- Incorrect property name: Test `templateUrl` explicitly.
- Duplicate actions: Omit `githubUrl` for the same repository destination.
- Invalid JSON: Parse through the backend test/build tooling.
- Existing test inconsistency: Replace arbitrary count with entry-specific coverage rather than weakening overall shape validation.

## 19. Risks And Mitigations

- Technical risk: Low; malformed JSON could break the endpoint. Mitigation: targeted test.
- Product risk: Wrong CTA could send users to contact. Mitigation: explicit `templateUrl` assertion.
- Security risk: None beyond linking to a verified public repository.
- Scope risk: Unnecessary UI redesign. Mitigation: restrict edits to catalog data, test, and run-scoped artifacts.

## 20. Assumptions

- The repository URL remains public and canonical.
- DevKofi's deployment reads `server/data/templates.json` from the committed application.
- Existing Templates rendering behavior is correct and needs no visual changes.
- Confidence: High, based on repository inspection.

## 21. Open Questions

- Blocking: None.
- Non-blocking: A downloadable release asset could be added later.
- Execution impact: None.

## 22. Task Extraction Notes

- Use one vertical task: expose the public Setup PRD Workspace card end-to-end through the existing catalog flow.
- Keep test and data changes together because they prove one independently verifiable outcome.
- Do not split frontend/backend layers; no frontend implementation edit is necessary.
- Apply Build → Refine → Polish with TDD Red → Green → Refactor evidence in each iteration.

## 23. Frontend Taste Application

- Frontend Taste Application: Not applicable.
- Reason: No JSX, CSS, Tailwind, UI generation, redesign, or visual polish is planned. The existing component renders the new data automatically.
- Propagation: Record `Not applicable` in tasks, review, verification, release notes, summary, and health check.
