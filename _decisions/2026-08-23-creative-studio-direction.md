# DevKofi Creative Technology Studio Direction

- Date: 2026-08-23
- Status: Accepted

## Decision

Reposition DevKofi from a mentorship platform to Kofi's creative technology studio. Mentorship is deprecated as a public product direction. Existing operational functionality and stored data remain until a separate audit and removal plan is approved.

## Context

Kofi's active practice spans full-stack product engineering, AI-assisted systems, photography, content, and creative technology. The mentorship identity no longer represents that work.

## Options considered

1. Keep mentorship as the primary identity.
2. Retain mentorship as a secondary public service.
3. Make the studio primary and deprecate mentorship.

## Selected option

Option 3.

## Consequences

- Public navigation, copy, pricing, and case studies change.
- Existing persistence, notification, authentication, and admin behavior remain protected.
- Legacy removal becomes a separate governed migration.
- Product truth and repository documentation must be updated together.

## Affected files

`PRD.md`, product context, roadmap, public frontend surfaces, run artifacts, and the Ideas Hub DevKofi record.

## Follow-up

Audit legacy mentorship code and data only after the studio redesign is verified and a separate removal package is approved.
