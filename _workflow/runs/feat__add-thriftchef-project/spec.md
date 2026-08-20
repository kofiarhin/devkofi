# Specification: Add ThriftChef to DevKofi Projects

## Summary

Add the deployed ThriftChef meal-planning application to DevKofi's portfolio project data as one new active project.

## Proposed data change

Append the following record to `server/data/projects.data.json` after the current highest-ID entry:

```json
{
  "id": 32,
  "name": "ThriftChef",
  "description": "Budget-focused Aldi UK meal planner that creates practical seven-day meal plans, recipes, and a consolidated shopping list from real catalogue data.",
  "features": [
    "Budget and household-based planning",
    "Deterministic seven-day meal generation",
    "Real Aldi catalogue pricing",
    "Recipes and consolidated shopping list"
  ],
  "status": "Active",
  "demoUrl": "https://thriftchef.vercel.app",
  "repoUrl": "https://github.com/kofiarhin/thriftchef",
  "thumbnailUrl": "https://opengraph.githubassets.com/1/kofiarhin/thriftchef"
}
```

## Implementation details

1. Update only `server/data/projects.data.json` for the product change.
2. Preserve existing indentation, field order, records, and array ordering.
3. Ensure the previous final object gains the required separating comma.
4. Do not add ThriftChef to the client-side featured-name map.
5. Add or adjust a focused automated assertion only if the repository's current project-data test structure provides an appropriate location without broadening scope.

## Verification plan

- Parse `server/data/projects.data.json` as JSON.
- Assert there is exactly one record named `ThriftChef`.
- Assert ID `32` is unique.
- Assert the demo, repository, thumbnail, status, description, and features match the approved record.
- Run the relevant server/project tests discovered in the repository.
- Run the relevant client test/build or repository verification command required by `docs/VERIFY.md`.
- Review the final diff for unrelated changes and secrets.

## Rollback

Remove the single ThriftChef object and restore the preceding object as the final array item.

## Approval gate

Implementation must not begin until the user explicitly approves this specification.
