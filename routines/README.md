# DevKofi Routines

This directory defines proposed recurring operator work. **No routine or schedule is active because this file exists.** Activation requires separate explicit approval.

Start with read-only/documentation routines.

## Routine Contract

Every proposed routine must state:

- trigger/cadence;
- inputs;
- output;
- permissions required;
- explicit limits/exclusions;
- failure behavior;
- whether it is read-only or state-changing.

## Recommended First Routine — Morning Brief

- Trigger: manual/on-demand initially; a future schedule requires approval.
- Inputs: `AGENTS.md`, `roadmap.md`, `review.md`, relevant `context/`, real `customers/` evidence, and available Git/GitHub status.
- Output: concise `/morning-brief` with at most one recommended next ticket outcome.
- Permissions: read-only.
- Limits: no code/docs edits, no ticket creation, no GitHub writes, no external state changes.
- Failure: report missing/stale evidence and make no changes.

## Possible Later Routine — Weekly Ops Review

- Trigger: proposed weekly cadence only after approval.
- Inputs: open issues/PRs, recent customer notes, roadmap, current-state evidence.
- Output: grouped issues/risks and one high-leverage recommendation.
- Permissions: read-only unless separately expanded.
- Limits: no code edits, merges, deploys, customer-data changes, or autonomous feature creation.
- Failure: report unavailable sources and stop without changes.
