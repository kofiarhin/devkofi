# Release Notes: Newsletter Email Verification

- Request: Add email verification when a user submits their email for the newsletter.

## User-facing changes

- Submitting an email on the newsletter signup card now shows "Check your email to confirm your subscription." instead of the immediate "Thanks for subscribing!" copy.
- A verification email is sent containing a one-click link.
- Clicking the link lands on a new `/newsletter/verify` page that shows success, expired, invalid, or already-verified states.
- Re-submitting a pending email rotates the token and re-sends the verification email.
- Re-submitting an already-confirmed email shows a friendly "You're already subscribed." message and does not send another email.

## Developer changes

- `NewsletterSubscriber` schema now carries `verified`, `verifyToken` (SHA-256 hashed, sparse-indexed), `verifyTokenExpiresAt`, and `verifiedAt`. Legacy rows without these fields keep working — the controller only ever checks `verified === true`.
- `server/controllers/newsletterController.js` rewritten to handle pending creation, pending rotation, verified short-circuit, and the new verify endpoint.
- `server/utils/emailService.js` exposes `sendNewsletterVerificationEmail({ email, verifyUrl })`.
- Frontend adds `verifyNewsletter` in `client/src/services/newsletterService.js`, a `useVerifyNewsletter` query hook, the `NewsletterVerify` page, and a `/newsletter/verify` route under the public layout.

## New routes/APIs

- `GET /api/newsletter/verify?token=<plaintext-token>` → JSON `{ success, status, message }` where `status` is one of `verified | already_verified | expired | invalid`.
- `POST /api/newsletter/subscribe` response shape adds `pendingVerification: boolean` (true for new/rotated, false for already-verified). Existing `success`, `alreadySubscribed`, and `message` fields remain.

## New env vars

- `NEWSLETTER_RATE_LIMIT` (optional, default `5`) — existing limiter, now documented.
- `NEWSLETTER_VERIFY_RATE_LIMIT` (optional, default `30`) — limits per-IP calls to the verify endpoint.

## Database/schema changes

- `NewsletterSubscriber` gains four new fields (`verified`, `verifyToken`, `verifyTokenExpiresAt`, `verifiedAt`) and a sparse index on `verifyToken`. No data migration required; legacy rows are not touched.

## Dependencies added/removed

`none`

## Test commands run

- `npx jest server/tests/newsletter.test.js --runInBand --forceExit` → 10 / 10 passed.
- `cd client && npx vitest run test/newsletter/Newsletter.test.jsx test/newsletter/NewsletterVerify.test.jsx` → 13 / 13 passed.
- `cd client && npx eslint <changed files>` → clean.
- `cd client && npm run build` → built in 8.82s, 0 errors (pre-existing chunk-size advisory, unrelated).

## Known limitations

- Verification email send is best-effort. If SMTP fails the row is still created in pending state and the failure is logged; the user can re-submit to rotate the token and retry.
- Verify endpoint is `GET`. Email-scanner prefetch is an inherent risk of `GET`-based confirmation flows; switch to POST-on-button if it becomes a real problem.
- No data backfill for historical subscribers — they remain in the list with no `verified` field and are treated as already verified by the application.

## Follow-up work

- Optional Mongo TTL index on `verifyTokenExpiresAt` to garbage-collect orphaned pending rows.
- Optional "resend verification email" button.
- Optional admin UI surface for verification state.

## Suggested commit message

```
feat(newsletter): require email verification before adding to list

- Add verified/verifyToken/verifyTokenExpiresAt/verifiedAt to NewsletterSubscriber
- Subscribe stores a hashed 24h token and sends a verification email via emailService
- New GET /api/newsletter/verify endpoint with verified/expired/invalid/already_verified states
- /newsletter/verify page renders the verification outcome
- Signup form now tells users to check their email
```
