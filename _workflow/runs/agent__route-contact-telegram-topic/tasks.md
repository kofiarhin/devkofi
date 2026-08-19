# Task Plan

## TASK-001 — Deliver complete contacts to the Telegram topic

- Status: Ready
- Priority: P0
- Parallel safe: no
- Depends on: approved `_workflow/runs/agent__route-contact-telegram-topic/spec.md`
- Blocks: final review and draft PR
- File locks: `server/tests/telegramService.test.js`, `server/utils/telegramService.js`, `.env.example`, `_workflow/runs/agent__route-contact-telegram-topic/`
- Claim status: claimed
- Claimed by: Codex
- Agent role: sequential implementer
- Merge risk: medium

### Objective

Keep MongoDB as the source of truth while routing complete contact notifications to the configured Telegram contact topic, including ordered splitting for oversized bodies.

### Files likely affected

- `server/tests/telegramService.test.js`
- `server/utils/telegramService.js`
- `.env.example`
- `_workflow/runs/agent__route-contact-telegram-topic/progress.md`
- `_workflow/runs/agent__route-contact-telegram-topic/handoff.md`
- Final run artifacts

### Checklist

- [ ] Add tests before implementation.
- [ ] Route valid contact thread IDs.
- [ ] Omit missing/invalid thread IDs.
- [ ] Preserve all short-message fields.
- [ ] Split oversized bodies without data loss.
- [ ] Send long parts sequentially.
- [ ] Preserve booking behavior and error semantics.
- [ ] Document the new env variable.
- [ ] Attempt focused and broad verification.
- [ ] Audit the final diff and secrets.
- [ ] Open a draft PR against `main`.

### Iteration 1 — Build

- Goal: Route complete short contact notifications to the configured topic.
- Changes made: Pending.
- Test plan: Add a failing Jest test for `message_thread_id` and complete short-message content.
- Red phase evidence: Tests committed before implementation; execution pending availability.
- Green phase evidence: Pending.
- Refactor phase evidence: Pending.
- Test commands run: Pending.
- Verification command/result: `npm test -- --runInBand server/tests/telegramService.test.js` / pending.
- Review findings: Pending.
- Acceptance status: Pending.
- Remaining issues: Long-message handling.
- Next action: Implement smallest routing change.

### Iteration 2 — Refine

- Goal: Deliver oversized Unicode message bodies completely in order.
- Changes made: Pending.
- Test plan: Add exact reconstruction and per-part routing assertions before implementation.
- Red phase evidence: Tests committed before implementation; execution pending availability.
- Green phase evidence: Pending.
- Refactor phase evidence: Pending.
- Test commands run: Pending.
- Verification command/result: focused Jest test / pending.
- Review findings: Pending.
- Acceptance status: Pending.
- Remaining issues: Invalid config and documentation.
- Next action: Add splitting and sequential send helpers.

### Iteration 3 — Polish

- Goal: Harden invalid configuration, request failure, documentation, and regressions.
- Changes made: Pending.
- Test plan: Add invalid-thread and rejection assertions before final cleanup.
- Red phase evidence: Tests committed before implementation; execution pending availability.
- Green phase evidence: Pending.
- Refactor phase evidence: Pending.
- Test commands run: Pending.
- Verification command/result: focused and full Jest / pending.
- Review findings: Pending.
- Acceptance status: Pending.
- Remaining issues: Pending.
- Next action: Final audit and workflow artifacts.

### Overall test plan

- Jest with mocked Axios.
- Assert exact Telegram endpoint and timeout.
- Assert full short-message text.
- Assert every contact payload uses the topic.
- Reconstruct long body from ordered payloads.
- Assert invalid thread IDs are omitted.
- Assert Axios failure rejects and stops later sends.
- Retain booking regression coverage.

### Acceptance criteria

- [ ] All criteria in the approved spec are met.
- [ ] No secret is committed.
- [ ] No controller, schema, course registration, deployment, or dependency change is introduced.

### Acceptance result

- [~] Implementation not started.
- [~] Verification not started.

### Verification commands

- `npm test -- --runInBand server/tests/telegramService.test.js`
- `npm test -- --runInBand`

### Stop condition

Mark `Needs Human Review` if verification cannot run or remains failed; do not claim `Done`.

### Out of scope

Course registration, bot commands/webhooks, database changes, frontend changes, deployment, merge, and production secrets.

## Frontend Taste Application

Frontend Taste Application: Not applicable.
