# Shared Understanding Handoff

## Original Request

Add ThriftChef to the list of DevKofi projects.

## Confirmed Understanding

DevKofi reads its portfolio project records from `server/data/projects.data.json`. The requested change is a single new record for the deployed ThriftChef application.

## Decisions Made

- Use the next unique numeric ID: `32`.
- Set status to `Active`.
- Use the production Vercel URL for the demo.
- Use the ThriftChef GitHub repository URL.
- Use the recommended GitHub OpenGraph preview as the thumbnail.
- Do not mark ThriftChef as a specially featured project.

## Assumptions

- The existing project JSON schema and list ordering remain unchanged.
- The deployed Vercel URL is the canonical public demo.
- GitHub's OpenGraph endpoint is acceptable as a portfolio thumbnail fallback.

## In Scope

- Add one ThriftChef record to `server/data/projects.data.json`.
- Preserve valid JSON and existing project records.
- Verify the project data is returned by the existing projects API.
- Run focused tests and the relevant build/check commands available in the repository.

## Out Of Scope

- Redesigning the DevKofi projects UI.
- Changing API contracts, routes, or database storage.
- Editing other project records.
- Changing or redeploying ThriftChef.
- Adding new featured-project logic.

## Acceptance Criteria

1. The projects data contains exactly one ThriftChef record with unique ID `32`.
2. The record uses the approved description, four feature bullets, `Active` status, production demo URL, repository URL, and OpenGraph thumbnail.
3. `server/data/projects.data.json` remains valid JSON.
4. The existing projects API returns the new record without code changes.
5. Relevant automated checks pass, or any pre-existing failures are clearly documented.
6. No unrelated files or project records are changed.

## Risks And Edge Cases

- Duplicate IDs or names could break assumptions in consumers.
- A malformed trailing comma could make the JSON module unloadable.
- GitHub OpenGraph thumbnails are externally hosted and may change appearance.
- Existing tests may not explicitly cover the newest project, so a focused assertion may be added only if consistent with current test conventions.

## Remaining Open Questions

None.

## Normalized Workflow Request

Add ThriftChef as project ID `32` in `server/data/projects.data.json`, status `Active`, with its Vercel demo, GitHub repository, and approved GitHub OpenGraph thumbnail. Preserve the schema and existing records, make no UI/API redesigns, and verify JSON validity plus relevant tests/builds.
