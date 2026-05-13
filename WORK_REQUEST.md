# Work Request

This file is auto-managed by the workflow. It stores the latest active work request, usually copied from the user's direct Codex prompt.

Users do not need to edit this file manually. You may edit it when you want to stage a request before asking the agent to run the workflow.

The workflow will ask clarifying questions, run dirty worktree protection, generate a saved spec in `_spec/`, create a vertical task plan in `_task/`, execute tasks one by one until the request is complete or stopped, record acceptance results, update `_progress/progress.md` and `_handoff/current.md` after each task, run a final diff audit, write a workflow review in `_review/`, create release notes in `_release/`, and write a final summary in `_summary/`.

## Request

Add email verification when a user submits their email for the newsletter.

Requirements (clarified):
- Store the new subscriber immediately with `verified=false`, a verification token, and an expiry; flip `verified=true` when the user clicks the link.
- Verification link points to a frontend route (`/newsletter/verify?token=...`) that calls a backend verify endpoint and shows success / expired / invalid states.
- On re-submit: if the address is pending, rotate the token and re-send the verification email. If the address is already verified, return a friendly `alreadySubscribed` response.
- Verification token TTL: 24 hours.

Execution mode: complete-workflow

Follow the workflow exactly:
- detailed spec
- task plan
- Build -> Refine -> Polish for each task
- progress
- handoff
- review
- release notes
- summary
- health check

## Question Preference

Choose one:

- `ask questions`: default. Ask focused questions until about 90% understanding before writing the spec.
- `skip questions`: do not ask questions; generate a best-effort spec and record assumptions.

Default: `ask questions`

Clarifying handling:

- Four focused questions were asked and answered (subscriber state, verification UX, duplicate behavior, token TTL). Remaining minor choices recorded as assumptions in the spec.

## Optional Execution Preference

Choose one:

- `plan-only`: ask questions, write spec, write task plan, then stop.
- `single-task`: ask questions, write spec, write task plan, execute only the next ready task, verify and review it, update artifacts, then stop.
- `complete-workflow`: ask questions, write spec, write task plan, then execute all generated tasks sequentially until the request/spec is complete or a stop condition is reached.

Default: `complete-workflow`

Selected: `complete-workflow`

## Optional Context

- User or business goal: Stop accepting unverified emails into the newsletter list and confirm intent before delivery.
- Target users: Visitors who submit their email through the newsletter form; site owner who maintains the subscriber list.
- Expected behavior: Submitting an email stores the subscriber as unverified, sends a verification email, and the link confirms the subscription.
- UI expectations: The signup form should communicate the new pending state ("Check your email to confirm"). A new `/newsletter/verify` route renders success / expired / invalid states.
- API expectations: `POST /api/newsletter/subscribe` issues a token and sends an email. New `GET /api/newsletter/verify?token=...` marks the subscriber as verified.
- Data model expectations: `NewsletterSubscriber` gains `verified`, `verifyToken`, `verifyTokenExpiresAt`, and `verifiedAt`.
- Edge cases: expired token, unknown token, already-verified subscriber clicking again, duplicate submission while pending, missing SMTP config.
- Constraints: Use existing `nodemailer`-based `server/utils/emailService.js` and `CLIENT_URL` env var. No hard-coded URLs. Rate limit must still cover the new verify route.
- Success criteria: Subscriber row starts with `verified=false`, verification email is dispatched, clicking a valid token within 24h flips `verified=true`, expired/invalid tokens show a clear state, duplicate submission paths behave correctly.
- Preferred verification: Backend Jest tests against the new flow; frontend lint + build; targeted Vitest for the signup state change and verify page.
- Dirty worktree notes: To be captured from `git status --short` at the start of this workflow.
- Release notes expectations: New verify endpoint, new frontend route, new model fields, no new dependencies.

## Out Of Scope

- Replacing nodemailer / SMTP with a different email provider.
- Adding unsubscribe / preference-center flows.
- Admin UI surface for managing verification state.
- Re-architecting the existing rate limiter.
- Database migrations for historical subscribers (treat existing rows as legacy; new behavior applies from change forward).
