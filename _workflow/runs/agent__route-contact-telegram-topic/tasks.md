# Task Plan

## TASK-001 — Deliver complete contacts to the Telegram topic

- Status: Done
- Priority: P0
- Parallel safe: no
- Depends on: approved `_workflow/runs/agent__route-contact-telegram-topic/spec.md`
- Blocks: none
- File locks: released
- Claim status: done
- Claimed by: Codex
- Agent role: sequential implementer
- Merge risk: medium

### Objective

Keep MongoDB as the source of truth while routing complete contact notifications to the configured Telegram contact topic, including ordered splitting for oversized bodies.

### Files affected

- `server/tests/telegramService.test.js`
- `server/utils/telegramService.js`
- `.env.example`
- `_workflow/runs/agent__route-contact-telegram-topic/`

### Checklist

- [x] Add tests before implementation.
- [x] Route valid contact thread IDs.
- [x] Omit missing/invalid thread IDs.
- [x] Preserve all short-message fields.
- [x] Split oversized bodies without data loss.
- [x] Send long parts sequentially.
- [x] Preserve booking behavior and error semantics.
- [x] Document the new env variable.
- [x] Run focused verification and attempt the full suite.
- [x] Audit the final diff and secrets.
- [x] Open draft PR #28 against `main`.

### Iteration 1 — Build

- Goal: Route complete short contact notifications to the configured topic.
- Changes made: Added the valid positive-integer thread-ID resolver and attached `message_thread_id` only to contact payloads.
- Test plan: Assert topic ID 2 and every short contact field.
- Red phase evidence: At test-first commit `7920fa2`, focused Jest failed the short-topic assertion because the payload lacked `message_thread_id`.
- Green phase evidence: After `3eacf07`, focused Jest passed the routing and complete-content tests.
- Refactor phase evidence: Kept thread selection isolated in `getTelegramThreadId`; reran focused Jest successfully.
- Test commands run: focused Jest at test-first and implementation commits.
- Verification command/result: 13/13 focused tests passed.
- Review findings: Booking payload remains topic-free; missing config remains backward compatible.
- Acceptance status: Passed.
- Remaining issues: None.
- Next action: Iteration 2.

### Iteration 2 — Refine

- Goal: Deliver oversized Unicode message bodies completely in order.
- Changes made: Added code-point-safe, escape-aware chunking, metadata-first formatting, numbered body parts, and sequential sends.
- Test plan: Reconstruct a 5,000-code-point body containing an emoji and check every payload's route and size.
- Red phase evidence: At `7920fa2`, focused Jest expected three sends but received one.
- Green phase evidence: After implementation, three messages were sent in order and reconstructed exactly.
- Refactor phase evidence: Split raw characters before HTML escaping to avoid broken entities; focused Jest remained 13/13.
- Test commands run: focused Jest at test-first and implementation commits.
- Verification command/result: 13/13 focused tests passed.
- Review findings: Chunk payloads remain below 4,096 characters with label headroom.
- Acceptance status: Passed.
- Remaining issues: None.
- Next action: Iteration 3.

### Iteration 3 — Polish

- Goal: Harden invalid configuration, partial failure, documentation, and regressions.
- Changes made: Added invalid-ID cases, stop-on-first-failure coverage, syntax checks, env documentation, and final diff audit.
- Test plan: Reject invalid IDs, preserve booking behavior, and prove an Axios rejection stops later parts.
- Red phase evidence: At `7920fa2`, the partial-failure test resolved instead of rejecting because only one request was made.
- Green phase evidence: Sequential delivery now rejects on the failing part and sends no later parts.
- Refactor phase evidence: Final static review found no further safe simplification; syntax checks, focused Jest, and diff check passed.
- Test commands run: `node --check` for service/tests; focused Jest; full Jest attempt; `git diff --check`.
- Verification command/result: focused 13/13 passed; full suite blocked by unavailable local MongoDB and was stopped after unrelated timeouts.
- Review findings: No credential, dependency, schema, controller, frontend, course-registration, deployment, or booking scope creep.
- Acceptance status: Passed for the task; unrelated full-suite infrastructure limitation documented.
- Remaining issues: Live Telegram delivery requires deployment configuration.
- Next action: Owner review of draft PR #28.

### Acceptance criteria

- [x] MongoDB create remains before Telegram attempt.
- [x] Valid contact topic ID is sent on every contact part.
- [x] Missing/invalid topic IDs are omitted.
- [x] Short contacts include every field.
- [x] Long bodies are delivered completely in order.
- [x] Payloads stay within the configured Telegram size ceiling.
- [x] User HTML is escaped.
- [x] Booking behavior is unchanged.
- [x] Telegram failure remains best-effort at the controller boundary.
- [x] `.env.example` documents the new variable.
- [x] Focused tests pass.
- [x] Scope and secret boundaries are respected.
- [x] Draft PR #28 is open.

### Acceptance result

- [x] All in-scope criteria met.
- [~] Live Telegram delivery not tested because deployment is out of scope.
- [~] Full database-backed suite requires a local MongoDB service.

### Verification commands

- `PUPPETEER_SKIP_DOWNLOAD=true npm ci --cache /tmp/devkofi-npm-cache --prefer-offline --no-audit --no-fund`
- `node --check server/utils/telegramService.js`
- `node --check server/tests/telegramService.test.js`
- `./node_modules/.bin/jest --forceExit --runInBand server/tests/telegramService.test.js`
- `./node_modules/.bin/jest --forceExit --runInBand` (blocked by MongoDB)
- `git diff --check FETCH_HEAD...HEAD`

### Stop condition

Completed. PR remains draft; no merge or deployment performed.

### Out of scope

Course registration, bot commands/webhooks, database changes, frontend changes, deployment, merge, and production secrets.

## Frontend Taste Application

Frontend Taste Application: Not applicable.
