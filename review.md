# DevKofi Review Standard

Use this standard after implementation and before describing work as complete.

## Must fix

A finding is `Must fix` when it:

- does not satisfy the active ticket/spec/approved plan or introduces material scope creep;
- breaks a critical user flow such as mentorship enrollment, contact/newsletter intake, authentication, role-gated templates/portal, pricing, or messaging;
- weakens authentication/authorization, exposes private data, leaks secrets, or hard-codes environment-specific credentials/URLs;
- introduces unapproved dependencies, migrations, payment/security/permission behavior, or destructive data operations;
- changes unexpected runtime/deployment/CI files without approval;
- causes relevant tests, lint, or build checks to fail;
- duplicates server state into Redux or moves API/network logic directly into UI components without a documented reason;
- silently changes the documented styling convention or mixes Tailwind/SCSS approaches without an approved decision;
- claims implemented/verified/merged/deployed/released status without evidence.

## Should fix

A finding is `Should fix` when the outcome works but quality is materially weaker because of:

- confusing or low-trust copy for prospective/current mentees;
- missing or weak loading, empty, validation, error, or success feedback;
- avoidable mobile/responsive issues;
- keyboard, label, focus, semantic, or contrast accessibility gaps;
- unnecessary abstraction, duplication, dead code, or broad refactoring beyond the ticket;
- weak test coverage around changed behavior or important edge cases;
- inconsistent API/error handling relative to existing project patterns;
- documentation/context drift that could mislead the next ticket.

## Okay to ship

A change is `Okay to ship` when:

- the approved outcome and acceptance criteria are satisfied;
- the diff is focused and expected;
- relevant TDD/verification evidence is recorded;
- existing React Query/Redux/service boundaries and backend MVC conventions are preserved unless the approved spec intentionally changes them;
- relevant desktop/mobile UI flows and failure/success states were inspected when browser tooling is available;
- console/network issues introduced by the change are absent or explicitly understood;
- no secret, permission, customer-data, dependency, migration, or deployment risk is hidden;
- durable project documents reflect only what current evidence supports.

## Frontend Review

For user-facing changes, check:

- first-use clarity for a prospective mentee or enrolled user;
- primary CTA visibility and expected next step;
- responsive layout at desktop and mobile widths;
- loading, empty, validation, error, and success states;
- keyboard navigation, labels, focus behavior, semantics, and contrast;
- console and network errors;
- consistency with existing DevKofi visual conventions.

Use `.agents/skills/design-taste-frontend/SKILL.md` when relevant to frontend UI work if that skill remains present, but do not let visual polish expand the approved scope.

## Evidence Rules

- A morning brief, ticket, spec, or plan is not implementation evidence.
- A check counts only when it was actually run and inspected.
- Application tests/builds not run must be reported as `Not run`.
- `context/current-state.md` must separate implemented from verified.
- Update architecture/decisions/lessons only when repository evidence or explicit human decisions justify the change.
