# Contact Telegram Topic Delivery Spec

## 1. Metadata

- Spec filename: `_workflow/runs/agent__route-contact-telegram-topic/spec.md`
- Date: 2026-08-19
- Request ID / slug: `route-contact-telegram-topic`
- Request source: Conversation and `_workflow/runs/agent__route-contact-telegram-topic/request.md`
- Execution mode: `complete-workflow`
- Request classification: `feature`
- Scope level: `small`
- Risk level: `medium`

## 2. Original Request

- Raw request: Make Telegram the primary contact-notification channel for DevKofi while keeping contact messages saved in the database, with a structure that can later become a central message hub.
- Normalized request: Route every successfully persisted website contact submission into the existing private Telegram group's `Contact Enquiries` topic and keep the entire message readable, including submissions longer than one Telegram message.
- Source: `_workflow/runs/agent__route-contact-telegram-topic/request.md`

## 3. Questions And Answers

- Should Telegram replace database persistence? No. MongoDB remains the source of record and must succeed first.
- Which Telegram destination should receive contacts? Group `DevKofi Messages Hub`, topic `Contact Enquiries`.
- Confirmed routing identifiers: chat ID `-1004424464936`, topic ID `2`.
- Should email remain? Yes, retain the existing best-effort email behavior.
- Should long messages be truncated? No. Split them into ordered continuation messages.
- Should course registration be added now? No, explicitly out of scope.
- Should production secrets be committed? No.
- Remaining blocking questions: None.

## 4. Problem Definition

Contact data currently appears in multiple channels and the Telegram integration does not target the dedicated contact topic. The owner needs one central, readable operational inbox while preserving database records. The change must prevent Telegram's message-size limit from silently dropping or truncating long enquiries.

## 5. Current State Analysis

- `server/controllers/contactController.js` validates and creates `ContactMessage` before sending the HTTP response and attempting email and Telegram notifications.
- `server/utils/telegramService.js` formats contact and booking notifications and calls Telegram `sendMessage` using `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.
- The current Telegram payload does not include `message_thread_id`.
- Contact formatting already includes ID, name, email, subject, message, and submitted timestamp in HTML.
- A single Telegram request is used regardless of message length.
- `server/tests/telegramService.test.js` mocks Axios and covers escaping, formatting, skip behavior, and one successful request.
- `.env.example` documents the current Telegram variables but no contact topic ID.
- MongoDB persistence ordering already meets the save-first requirement and does not need a schema change.

## 6. Desired End State

- A successful contact is stored in MongoDB before notification work.
- Contact Telegram notifications are sent to `TELEGRAM_CONTACT_THREAD_ID`.
- Short contacts are delivered as one complete formatted Telegram message.
- Oversized contacts are delivered as an ordered metadata message plus numbered message-body parts, with no content removed.
- Every part targets the same configured chat and contact topic.
- Booking notification behavior remains backward compatible.
- Existing email behavior remains unchanged.
- The implementation is configurable; no real token, chat ID, or topic ID is hard-coded into source.

## 7. Scope

### In scope

- Telegram contact-topic routing.
- Safe parsing of an optional positive integer thread ID.
- Full contact metadata and body delivery.
- Ordered long-message splitting.
- Tests and environment documentation.
- Draft PR.

### Out of scope

- Course registration notifications.
- Telegram webhook or polling bot commands.
- Database model changes.
- Frontend redesign.
- Deployment or production configuration.
- Token rotation or secret management operations.

### Non-goals

- Turning Telegram into the database.
- Building a two-way CRM.
- Adding dependencies.

## 8. Users And Use Cases

- Primary user: DevKofi owner reading new website enquiries in Telegram.
- Secondary user: Developer configuring deployment environment variables.
- Main use case: A visitor submits a normal contact enquiry and the complete notification appears in the contact topic.
- Edge use case: A visitor submits a message longer than Telegram's limit and all ordered parts arrive.
- Failure use case: Telegram is disabled, unconfigured, or fails; the saved database record and existing email attempt are not rolled back.

## 9. Functional Requirements

1. Read `TELEGRAM_CONTACT_THREAD_ID` only for contact notifications.
2. Add `message_thread_id` to every contact `sendMessage` payload when the value is a valid positive integer.
3. Preserve backward compatibility by omitting `message_thread_id` when absent or invalid.
4. Include contact ID, name, email, subject, full message body, and submitted timestamp.
5. HTML-escape all user-controlled values.
6. Keep short notifications within Telegram's 4,096-character parsed-text limit.
7. Split long bodies on Unicode code points into ordered, numbered parts; never slice an HTML entity or remove characters.
8. Send parts sequentially to preserve order.
9. Preserve the current skip and error semantics.
10. Preserve booking notification behavior.
11. Do not change controller persistence or response ordering.

## 10. Non-Functional Requirements

- Reliability: database persistence remains independent from best-effort notification delivery.
- Security/privacy: no secrets in source, tests, logs, workflow artifacts, or PR text.
- Maintainability: use small helper functions and existing Axios/mocking conventions.
- Performance: sequential requests only for oversized contacts; normal contacts remain one request.
- DX: document the new environment variable clearly.
- Accessibility: Not applicable; no UI change.

## 11. Affected Surfaces

- `server/utils/telegramService.js`
- `server/tests/telegramService.test.js`
- `.env.example`
- `_workflow/runs/agent__route-contact-telegram-topic/tasks.md`
- `_workflow/runs/agent__route-contact-telegram-topic/progress.md`
- `_workflow/runs/agent__route-contact-telegram-topic/handoff.md`
- `_workflow/runs/agent__route-contact-telegram-topic/review.md`
- `_workflow/runs/agent__route-contact-telegram-topic/verification.md`
- `_workflow/runs/agent__route-contact-telegram-topic/release-notes.md`
- `_workflow/runs/agent__route-contact-telegram-topic/summary.md`
- API routes: existing contact endpoint only; contract unchanged.
- Database/schema: no change.
- Dependencies: no change.

## 12. Dependency And Integration Map

- Contact controller -> MongoDB `ContactMessage.create` -> email attempt + Telegram service.
- Telegram service -> Axios -> Telegram Bot API `sendMessage`.
- Runtime config -> `TELEGRAM_NOTIFICATIONS_ENABLED`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, new `TELEGRAM_CONTACT_THREAD_ID`.
- Tests -> Jest Axios mock.
- Ordering constraint: persist first, then notify; long Telegram parts must be sequential.

## 13. Data And State Impact

- Data models: unchanged.
- Database: unchanged.
- Client/server state: unchanged.
- Cache/session/local storage: unchanged.
- Backward compatibility: existing deployments without the new variable continue sending contacts to the configured chat's default thread.

## 14. UX / API / Workflow Expectations

- Website success/error response behavior remains unchanged.
- Telegram short-message layout remains concise and contains all fields.
- Long messages show the contact metadata first, then `Message (1/N)`, `Message (2/N)`, etc.
- Telegram failures remain best-effort and are caught by the existing controller flow.
- Empty/loading states: Not applicable.
- API contract: unchanged.

## 15. Execution Strategy

1. Save approved spec and task plan.
2. Add tests first for topic payloads, complete short messages, ordered long-message splitting, invalid/missing topic fallback, and request failure.
3. Implement thread-ID parsing and message-part construction.
4. Refine Unicode-safe chunking and sequential delivery.
5. Polish naming, exports, docs, and regression coverage.
6. Run focused Jest tests, then broader relevant tests if available.
7. Audit the final diff for scope and secrets.
8. Open a draft PR only; do not merge or deploy.

## 16. Verification Strategy

- Focused command: `npm test -- --runInBand server/tests/telegramService.test.js`
- Broader command: `npm test -- --runInBand`
- Static review of every Telegram payload.
- Confirm all long-message parts have identical `chat_id` and `message_thread_id`.
- Reconstruct the original long message from test payloads and compare exactly.
- Verify no token-like value is present in the diff.
- If local/CI execution is unavailable, record the gap and mark the task `Needs Human Review` rather than `Done`.

## 17. Acceptance Criteria

- [ ] The contact record is still created before Telegram is attempted.
- [ ] A valid `TELEGRAM_CONTACT_THREAD_ID=2` produces `message_thread_id: 2` on every contact Telegram request.
- [ ] A missing or invalid thread ID is omitted without breaking existing behavior.
- [ ] A short contact notification contains the complete ID, name, email, subject, message, and submitted timestamp.
- [ ] A contact body larger than one Telegram message is delivered completely in ordered numbered parts.
- [ ] No chunk exceeds Telegram's parsed-text limit.
- [ ] User-controlled HTML is escaped.
- [ ] Booking notifications remain unaffected.
- [ ] Telegram failure remains best-effort after database persistence.
- [ ] `.env.example` documents `TELEGRAM_CONTACT_THREAD_ID` without a secret.
- [ ] Focused tests pass.
- [ ] No deployment, course registration, schema change, or credential commit occurs.
- [ ] A draft PR is opened against `main`.

## 18. Edge Cases And Failure Modes

- Thread ID missing, blank, nonnumeric, fractional, zero, or negative: omit topic routing.
- Message contains HTML metacharacters: escape before sending.
- Message contains surrogate pairs/emoji: split by code point, not UTF-16 unit.
- Escaped characters expand request-text length: size calculations must respect Telegram's parsed-text semantics and leave room for labels.
- One part fails: stop sequential sending and surface the existing service error; do not pretend later parts were delivered.
- Telegram disabled/unconfigured: retain existing skipped result.
- Axios rejection: preserve current logged best-effort failure path.
- Very long subject/name: existing validation bounds keep metadata within the limit.

## 19. Risks And Mitigations

- Risk: wrong topic ID. Mitigation: environment configuration plus payload test using confirmed ID 2.
- Risk: silent truncation. Mitigation: exact reconstruction test.
- Risk: broken HTML from splitting. Mitigation: split raw text first, then escape each chunk.
- Risk: booking regression. Mitigation: preserve generic sender and existing booking test.
- Risk: exposed token. Mitigation: never copy screenshot values; use environment placeholders only.
- Risk: no executable checkout through connector. Mitigation: rely on PR CI if available and document any verification gap.

## 20. Assumptions

- The confirmed chat and topic IDs are correct.
- The bot remains a group administrator with access to messages.
- Existing contact validation constrains metadata fields.
- Deployment will later set the new environment variable.
- Confidence: high for code behavior; medium for live Telegram delivery until deployed.

## 21. Open Questions

- Blocking: None.
- Non-blocking: Whether future course registration should use a separate topic and env variable. Deferred.
- Execution impact: None for this PR.

## 22. Task Extraction Notes

- Use one vertical code task: deliver a persisted contact completely to the configured Telegram topic.
- Do not split controller, service, tests, and env documentation into unrelated tasks.
- Iteration 1 Build: topic routing and complete short-message test.
- Iteration 2 Refine: oversized-message splitting and exact reconstruction test.
- Iteration 3 Polish: invalid config, failure regression, docs, final audit.
- TDD-first evidence is required; if tests cannot run through the connector, record a missing-test/verification exception and stop at `Needs Human Review`.

## 23. Frontend Taste Application

Frontend Taste Application: Not applicable.

Reason: this is backend service, configuration, and test work with no frontend UI generation, JSX/TSX, CSS/Tailwind, redesign, or UI polish.
