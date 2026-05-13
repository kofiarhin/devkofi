# Spec: Newsletter Email Verification

## 1. Metadata

- Spec filename: `_spec/2026-05-13-newsletter-email-verification.md`
- Date: 2026-05-13
- Request ID / slug: `newsletter-email-verification`
- Request source: Direct user prompt synced to `WORK_REQUEST.md`
- Execution mode: `complete-workflow`
- Request classification: `feature`
- Scope level: `medium`
- Risk level: `medium`

## 2. Original Request

- Raw user request: "add email verification when user submits email for newsletter"
- Normalized request: When a visitor submits an email through the newsletter signup, persist them as unverified, send a verification email containing a tokenized link, and only mark them as verified after the link is clicked.
- Source prompt / WORK_REQUEST reference: `WORK_REQUEST.md` (current entry, 2026-05-13).

## 3. Questions And Answers

- Questions asked:
  1. How should an unverified subscriber be stored?
  2. When the user clicks the verification link, what should they see?
  3. When the user submits an email that is already pending or verified, what should happen?
  4. How long should the verification token be valid?
- Answers received:
  1. Store immediately with `verified=false`.
  2. Frontend route `/newsletter/verify` calls a backend verify endpoint and shows states.
  3. Resend the verification email if pending; return a friendly `alreadySubscribed` if already verified.
  4. 24 hours.
- Questions skipped: None.
- Remaining open questions: None blocking. Minor unknowns are documented as assumptions in section 20.

## 4. Problem Definition

- Problem being solved: The current newsletter signup accepts any well-formed email without confirming that the address actually belongs to the submitter, so the list can fill with typos, malicious entries, and impersonations.
- Why it matters: Sending mail to unverified addresses hurts deliverability, can violate anti-spam expectations, and pollutes any future broadcast list.
- Current pain point: A successful submit immediately persists `{ email }` and shows "Thanks for subscribing!" with no proof-of-ownership.
- Expected value: Only verified addresses count as subscribers; the user learns they have to confirm; the list stays clean.

## 5. Current State Analysis

- Existing behavior: `POST /api/newsletter/subscribe` validates the email, dedupes by lowercased email, and creates a `NewsletterSubscriber` document.
- Existing architecture/components:
  - Backend: `server/routes/newsletterRoutes.js` mounts the subscribe route under `/api/newsletter`, with a 1-hour rate limit window (default max 5 per IP); `server/controllers/newsletterController.js` owns the create logic; `server/models/NewsletterSubscriber.js` is a tiny mongoose model.
  - Frontend: `client/src/components/Newsletter/Newsletter.jsx` renders the marketing block; `NewsletterSignupForm.jsx` owns the form state, mutation, and validation; `useSubscribeNewsletter` wraps a TanStack mutation; `newsletterService.js` POSTs through the shared `lib/api` axios instance.
  - Email: `server/utils/emailService.js` already wires nodemailer to SMTP via `EMAIL_HOST/PORT/USER/PASS`, used by the contact form.
- Existing files/modules likely involved:
  - `server/models/NewsletterSubscriber.js`
  - `server/controllers/newsletterController.js`
  - `server/routes/newsletterRoutes.js`
  - `server/utils/emailService.js`
  - `server/tests/newsletter.test.js`
  - `server/app.js`
  - `client/src/components/Newsletter/NewsletterSignupForm.jsx`
  - `client/src/services/newsletterService.js`
  - `client/src/hooks/mutations/useSubscribeNewsletter.js`
  - `client/src/App.jsx`
  - `client/test/newsletter/Newsletter.test.jsx`
  - `.env.example`
- Existing data flow: Form → `subscribeToNewsletter` axios call → Express route → controller → `NewsletterSubscriber.create` → JSON response → success/error UI.
- Existing API/UI/CLI/workflow behavior: A `201` with `success:true, alreadySubscribed:false, message:"Thanks for subscribing!"` for new emails, or `200` with `alreadySubscribed:true` for duplicates. No mail is sent.
- Existing tests or verification coverage: `server/tests/newsletter.test.js` covers valid create, invalid payload, and duplicate; `client/test/newsletter/Newsletter.test.jsx` covers form render, validation, loading, success, and error.

## 6. Desired End State

- Expected final behavior:
  1. Submitting an email writes a `NewsletterSubscriber` row with `verified=false`, a fresh `verifyToken`, and a 24-hour `verifyTokenExpiresAt`.
  2. The backend sends an email containing a link to `${CLIENT_URL}/newsletter/verify?token=...`.
  3. The success UI tells the user to check their inbox.
  4. Clicking the link calls `GET /api/newsletter/verify?token=...`, which on success flips `verified=true`, clears the token, and sets `verifiedAt`.
  5. The frontend verify page renders success / expired / invalid / already-verified states.
  6. Re-submitting a pending email rotates the token and re-sends the email; re-submitting a verified email returns a friendly already-subscribed message.
- User-facing outcome: Users see a "Check your email" confirmation, click the link, and see a branded confirmation page.
- Developer-facing outcome: Subscriber records carry a verification state; the verify endpoint and frontend route exist; tests cover the new paths.
- System/workflow outcome: List quality improves; future broadcast tooling can rely on `verified=true`.
- Backward compatibility expectations: Existing legacy rows have no `verified` field — treat missing-or-true as verified (default `verified: false` only for new documents). No data migration required; existing rows remain in the list.

## 7. Scope

- In scope:
  - Schema fields: `verified`, `verifyToken`, `verifyTokenExpiresAt`, `verifiedAt`.
  - Token generation and storage on subscribe.
  - Email sending via existing `emailService` (new `sendNewsletterVerificationEmail`).
  - New `GET /api/newsletter/verify` endpoint.
  - Frontend `/newsletter/verify` route + page.
  - Update success copy on the signup form.
  - Tests for both backend and frontend changes.
  - `.env.example` updates if any new vars are needed (none planned, but document).
- Out of scope:
  - Unsubscribe and preference-center flows.
  - Admin UI for managing verification status.
  - Switching email provider away from SMTP/nodemailer.
  - Bulk migration of existing rows.
- Non-goals:
  - Double-opt-in tracking, analytics events, captcha, GDPR consent text.
- Explicit boundaries:
  - Do not refactor the existing rate limiter.
  - Do not change the contact-form email flow.
  - Do not introduce new dependencies (use `crypto.randomBytes`).

## 8. Users And Use Cases

- Primary users: Newsletter signup visitors.
- Secondary users: Site owner reviewing list quality.
- Main use cases:
  1. New visitor submits a valid email and receives a verification link.
  2. Visitor clicks a valid link within 24h and is confirmed.
  3. Visitor clicks an expired or invalid link and gets a clear state.
  4. Visitor re-submits the same email while pending and receives a fresh link.
  5. Already-verified visitor re-submits and sees a friendly "already subscribed" message.
- Edge use cases:
  - Visitor clicks the link twice (second click should be idempotent).
  - SMTP send fails after row creation (row remains pending; user can re-submit to retry).
  - Token tampered with or truncated (treated as invalid).

## 9. Functional Requirements

- Required behaviors:
  - Subscribe endpoint produces and persists a token, sets `verified=false`, and triggers a verification email.
  - Verify endpoint accepts `?token=`, validates against stored hash, checks expiry, flips `verified=true`, clears token fields, sets `verifiedAt`.
  - Re-submit while pending: rotate token, update expiry, resend email.
  - Re-submit while verified: do not send mail; respond `alreadySubscribed:true`.
  - Verify with already-verified row: respond as success/already-verified (idempotent).
  - Verify with unknown/expired token: respond with `expired` or `invalid` status (HTTP `410` for expired, `400` for invalid).
- Inputs:
  - Subscribe: `{ email: string }`.
  - Verify: query string `token`.
- Outputs:
  - Subscribe: `{ success: boolean, alreadySubscribed: boolean, message: string }`.
  - Verify: `{ success: boolean, status: "verified"|"already_verified"|"expired"|"invalid", message: string }`.
- State changes:
  - Insert or update `NewsletterSubscriber` document.
  - Token cleared after successful verification.
- Error states: Invalid email payload, missing token, expired token, unknown token, SMTP failure (logged, request still succeeds for the user with the pending row in place).
- Permissions/auth expectations: Both endpoints are public and unauthenticated. Rate limits apply.

## 10. Non-Functional Requirements

- Performance expectations: Token generation and validation must be O(1) — direct field lookup by hashed token.
- Reliability expectations: Failure to send email must not roll back the subscriber row; logged and surfaced via the existing error logging.
- Security/privacy expectations:
  - Token is a 32-byte hex string; stored as SHA-256 hash, never logged in plaintext.
  - Verify route is rate-limited to defeat token brute-force.
  - Email content escapes user-controlled values; the only injected value is the verification URL.
  - No PII leaked in responses beyond what the client already supplies.
- Accessibility expectations: New verify page uses semantic landmarks and announces status via `role="status"` / `role="alert"`.
- Maintainability expectations: Mirror the existing controller/service/route layout. No new dependencies.
- DX expectations: Tests are colocated with existing test files; `.env.example` documents any new vars.

## 11. Affected Surfaces

- Files likely affected:
  - `server/models/NewsletterSubscriber.js` (add fields + index)
  - `server/controllers/newsletterController.js` (rewrite subscribe + add verify)
  - `server/routes/newsletterRoutes.js` (mount verify route + share rate limiter or add one)
  - `server/utils/emailService.js` (add `sendNewsletterVerificationEmail`)
  - `server/tests/newsletter.test.js` (extend coverage)
  - `client/src/components/Newsletter/NewsletterSignupForm.jsx` (update success copy)
  - `client/src/services/newsletterService.js` (add `verifyNewsletter`)
  - `client/src/hooks/mutations/useSubscribeNewsletter.js` (no change expected; mutation already wraps service)
  - `client/src/hooks/queries/useVerifyNewsletter.js` (new — query hook for token-based verify call)
  - `client/src/Pages/NewsletterVerify/NewsletterVerify.jsx` (new page)
  - `client/src/Pages/NewsletterVerify/newsletter-verify.styles.scss` (new minimal stylesheet)
  - `client/src/App.jsx` (mount new route under public layout)
  - `client/test/newsletter/Newsletter.test.jsx` (update success copy expectations)
  - `client/test/newsletter/NewsletterVerify.test.jsx` (new test)
  - `.env.example` (no new vars expected; confirm during build)
- Directories likely affected: `server/controllers/`, `server/routes/`, `server/models/`, `server/utils/`, `server/tests/`, `client/src/Pages/NewsletterVerify/`, `client/src/services/`, `client/src/hooks/queries/`, `client/test/newsletter/`.
- UI surfaces: Newsletter signup card (success copy), new verify page.
- API routes: `POST /api/newsletter/subscribe` (changed), `GET /api/newsletter/verify` (new).
- Components: `NewsletterSignupForm`, `NewsletterVerify`.
- Services: `newsletterService` (frontend), `emailService` (backend).
- Database/schema: `NewsletterSubscriber` gains four fields + a sparse index on `verifyToken`.
- Config/env vars: Uses existing `CLIENT_URL`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`. No new vars planned.
- Tests: Backend Jest + frontend Vitest.
- Docs: `.env.example` only if vars change.
- Workflow artifacts: Spec, task plan, progress, handoff, review, release, summary.

## 12. Dependency And Integration Map

- Internal dependencies: `server/utils/emailService.js`, `server/config/env.js`, `client/src/lib/api.js`.
- External packages/services: Existing `nodemailer`, `express-rate-limit`, `crypto` (built-in), `mongoose`, `@tanstack/react-query`, `react-router-dom`.
- Integration points: Express → Mongo for token storage; nodemailer → SMTP for sending; React Router for the verify route.
- Ordering constraints: Backend changes ship first because the frontend verify page depends on the new endpoint.
- Migration/setup requirements: None required for the change to ship. Existing rows continue to work because legacy documents without `verified` are treated as already verified at the application layer (we only ever check `verified === false`).

## 13. Data And State Impact

- Data models: `NewsletterSubscriber` gains `verified: Boolean`, `verifyToken: String` (sparse, indexed), `verifyTokenExpiresAt: Date`, `verifiedAt: Date`.
- Database changes: Schema-level only; mongoose will accept legacy documents transparently. A sparse index on `verifyToken` keeps verify lookups fast.
- State management changes: Frontend gains a small page-level state for the verify outcome. No Redux changes; TanStack mutation handles it.
- Cache/session/local storage impact: None.
- Backward compatibility impact: Existing rows are untouched; subscribe responses keep the same shape (additive fields only).

## 14. UX / API / Workflow Expectations

- UX expectations:
  - Signup success message changes to: "Check your email to confirm your subscription."
  - Verify page renders four explicit states: verifying (loading), success, expired, invalid.
  - Each state uses a `role="status"` or `role="alert"` region.
  - "Back to homepage" link is present in all terminal states.
- API contract expectations:
  - `POST /api/newsletter/subscribe`:
    - 201 `{ success: true, alreadySubscribed: false, pendingVerification: true, message: "Check your email to confirm your subscription." }` on new or rotated-pending row.
    - 200 `{ success: true, alreadySubscribed: true, pendingVerification: false, message: "You're already subscribed." }` when row exists and `verified=true`.
    - 400 `{ success: false, error }` on invalid payload.
    - 429 `{ success: false, error }` on rate limit.
  - `GET /api/newsletter/verify?token=...`:
    - 200 `{ success: true, status: "verified", message }` when token valid.
    - 200 `{ success: true, status: "already_verified", message }` when row is already verified (idempotent re-click).
    - 410 `{ success: false, status: "expired", message }` when token is found but expired.
    - 400 `{ success: false, status: "invalid", message }` when token is missing or unknown.
- CLI/workflow behavior: Not applicable beyond the workflow artifacts.
- Error handling expectations:
  - SMTP failures are logged with `console.error` and do not break the API response (row is created/updated; user is told to check email).
  - Unknown/expired tokens never reveal whether the email exists.
- Empty/loading/success/failure states: Verify page must render all four explicitly; signup form keeps existing loading/success/error treatments.

## 15. Execution Strategy

- Recommended implementation approach:
  1. Backend slice (model + subscribe rewrite + verify endpoint + email sender + tests).
  2. Frontend slice (success copy + verify page + service/hook + route + tests).
- Suggested sequencing: Backend first because the frontend verify page exercises the new endpoint via Vitest mocks and (manually) end-to-end.
- Safe rollout/migration approach: Additive schema changes only; legacy rows are untouched. Deploys can roll forward without coordination.
- Files to inspect before editing:
  - `server/controllers/contactController.js` (pattern for combining DB-first + best-effort email).
  - `server/routes/contactRoutes.js` (rate limiter pattern, if needed).
  - `client/src/Pages/NotFound/NotFound.jsx` (simple page shape).
  - `client/src/Pages/Templates/Templates.jsx` (TanStack pattern).
- Decisions to avoid until more evidence exists:
  - Whether to send a goodbye email on unsubscribe (out of scope).
  - Whether to add a "resend verification" button on the form (defer; today the user just re-submits).

## 16. Verification Strategy

- Required automated checks:
  - Backend: `cd server && npx jest tests/newsletter.test.js --runInBand` covering create-pending, rotate-on-resubmit, friendly already-verified response, verify success, verify expired, verify invalid, verify idempotent already-verified.
  - Frontend: `cd client && npm run lint` and `cd client && npm run build`. Targeted Vitest: `cd client && npx vitest run test/newsletter/Newsletter.test.jsx test/newsletter/NewsletterVerify.test.jsx`.
- Required manual checks: Visual inspection of verify page states is encouraged but not required; documented in the review.
- Test types needed: Integration (supertest), unit/component (Vitest + RTL).
- Build/lint/typecheck expectations: Project currently has lint + build commands; no typecheck script.
- Acceptance evidence required: Test output snippets recorded inside iteration evidence.
- Proof of completion: Tests pass, lint clean, build succeeds, final diff audit clean.

## 17. Acceptance Criteria

- [ ] `NewsletterSubscriber` model exposes `verified`, `verifyToken`, `verifyTokenExpiresAt`, and `verifiedAt` fields with the documented defaults.
- [ ] `POST /api/newsletter/subscribe` returns `pendingVerification: true` for new or pending-rotated rows and `alreadySubscribed: true` for already-verified rows.
- [ ] Submitting a pending email a second time rotates the stored token and triggers a fresh send.
- [ ] `GET /api/newsletter/verify?token=...` returns `status: "verified"` for a valid token, `status: "expired"` for an expired token, `status: "invalid"` for an unknown token, and `status: "already_verified"` for an idempotent re-click.
- [ ] Verification email is dispatched via `emailService` and contains a link to `${CLIENT_URL}/newsletter/verify?token=...`.
- [ ] Newsletter signup form shows the new "Check your email to confirm" message on success.
- [ ] `/newsletter/verify` frontend route exists and renders loading, success, expired, invalid states.
- [ ] Backend Jest tests pass for the new flows; frontend lint passes and `client` build succeeds.
- [ ] No new dependencies introduced; `.env.example` is updated only if new vars are required.

## 18. Edge Cases And Failure Modes

- Edge cases:
  - User submits an email with mixed case and trailing whitespace — normalize before hashing/lookup.
  - User clicks the verification link twice — second click is idempotent.
  - User clicks an expired link — show expired state.
  - User submits a typoed address, then re-submits the correct one — both rows exist as pending; only the correct one is verified.
  - SMTP misconfigured locally — the row is still created and the developer sees a console error.
- Failure modes:
  - SMTP transient failure → log and continue.
  - Mongo unique-index race on parallel submits → catch duplicate key, treat as re-submit.
- Regression risks:
  - Tests previously asserted "Thanks for subscribing!" — those assertions must be updated.
  - Components and tests that assume `success.message` is the old string must be reviewed.
- Recovery expectations: Failed sends recover by re-submission (token is rotated and a fresh email goes out).

## 19. Risks And Mitigations

- Technical risks: Forgetting to hash tokens at rest (mitigate: store the SHA-256 digest, only emit the plaintext token in the email). Forgetting to drop or sparse-index `verifyToken` could fail uniqueness checks for cleared tokens — use a sparse index.
- Product/UX risks: Confused users who do not realize they need to check email — mitigate by changing the success copy explicitly.
- Security risks: Token enumeration — mitigated by 32-byte randomness, hashed at rest, and the existing rate limiter applied to the verify route.
- Scope risks: Tempting to add resend buttons, captchas, or admin UI — explicitly out of scope.
- Mitigation plan: Stick to the task plan; create follow-up tasks for anything larger.

## 20. Assumptions

- Explicit assumptions:
  1. The site already has working SMTP credentials in non-test environments; tests do not require live email delivery.
  2. `process.env.CLIENT_URL` is the canonical frontend origin used in verification links.
  3. Legacy `NewsletterSubscriber` documents (created before this change) should be treated as already verified; we never auto-mark them or send retroactive emails.
  4. The verify endpoint is acceptable as `GET` (one-click links in email). The corresponding rate limit lives on the same router as subscribe.
- Confidence level: High for assumptions 1–3; medium for 4 (some teams prefer POST + a frontend "confirm" button to defeat email-scanner prefetching, but GET is acceptable here because we never log the consumed token and the operation is idempotent).
- What to revisit if assumptions are wrong:
  - If email-scanner prefetch becomes a problem, switch to a frontend POST flow that requires a button click.
  - If retroactive verification is desired, add a one-off script under `server/scripts/`.

## 21. Open Questions

- Blocking questions: None.
- Non-blocking questions: Should we also send a "verified, you're in" confirmation email after the click? (defer)
- Execution impact: None.

## 22. Task Extraction Notes

- Suggested vertical task boundaries:
  - TASK-001: Backend verification flow (model fields + rewritten subscribe + verify endpoint + email sender + tests).
  - TASK-002: Frontend verification flow (success copy + verify page + service/hook + route + tests).
- Suggested first task: TASK-001 (backend) because TASK-002 depends on the new endpoint contract.
- Suggested task ordering: TASK-001 → TASK-002.
- Areas that should not become separate tasks: Do not split "model" and "controller" into separate tasks; they ship together. Do not split "service" and "page" on the frontend; they ship together.
- How the 3-pass Build -> Refine -> Polish loop should apply:
  - Iteration 1 Build: minimum working slice (schema + endpoints; or page + route).
  - Iteration 2 Refine: tighten edge cases (expired/invalid tokens, copy/state coverage).
  - Iteration 3 Polish: cleanup, final verification, docs touchups.
