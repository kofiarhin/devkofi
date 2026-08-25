# DevKofi Roadmap

Source: `README.md` plus current repository/package evidence inspected during the AI operating-workspace migration.

## Current Goal

Advance the existing DevKofi mentorship platform through the roadmap outcomes already documented in `README.md`, beginning with the first listed outcome: client analytics and QA.

The roadmap order is product direction, not implementation evidence. Each outcome must still become a focused `/ticket` and pass the ticket → spec → plan → implementation workflow.

## Priorities

1. **Client analytics & QA — Proposed**
   - Add/strengthen Vitest coverage for critical pages such as Home and Join Mentorship.
   - Introduce analytics only through environment-controlled configuration.
   - Exact analytics provider and event contract: `Unresolved`.

2. **Server hardening — Proposed**
   - Complete validation and rate limiting for contact/newsletter intake.
   - Keep transactional-email recipient configuration in environment variables rather than literals.

3. **Mentor portal — Proposed**
   - Expand `/portal` from its current dashboard shell toward real assignments, messages, and template-backed data.
   - Any new MongoDB collections or authorization changes require explicit approval through the normal workflow.

4. **Download center — Proposed**
   - Improve template ZIP generation/status handling and make planned/unavailable states clearer in the UI.

## Exclusions

- No additional product feature is approved merely because this operating workspace exists.
- Production deployment, billing changes, destructive customer/data operations, and security-policy decisions remain human-owned.
- Authentication, permissions, migrations, new dependencies, and external analytics/services require a scoped ticket/spec/plan and explicit approval.
- Legacy workflow cleanup/deletion is outside the current migration; legacy files are retained but inactive.

## Definition of Done

A roadmap outcome is complete only when:

- one or more approved tickets cover the stated outcome without hidden scope;
- implementation exists in the repository;
- relevant automated checks have been run and inspected;
- user-facing work has been browser-reviewed at relevant desktop/mobile widths when tooling is available;
- required error/loading/success/accessibility states are checked;
- the final diff passes `review.md` with no unresolved `Must fix` findings;
- `context/current-state.md` and other durable context are updated from observed evidence;
- merged/deployed/released status is claimed only when separately verified.
