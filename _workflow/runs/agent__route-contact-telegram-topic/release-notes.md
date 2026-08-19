# Release Notes

- Request: Send complete website contact enquiries to the dedicated Telegram topic.
- User-facing changes: DevKofi receives contact enquiries in the configured `Contact Enquiries` topic; long bodies arrive as ordered numbered parts.
- Developer changes: Added validated contact thread routing and escape-aware Unicode chunking.
- New routes/APIs: none.
- New env vars: `TELEGRAM_CONTACT_THREAD_ID`.
- Database/schema changes: none.
- Dependencies added/removed: none.
- Test commands: focused Jest passed 13/13; syntax and diff checks passed; full Jest blocked by unavailable local MongoDB.
- Known limitations: Requires deployment configuration and has not been live-tested against Telegram.
- Follow-up: Configure topic ID 2 after merge; design course-registration routing separately.
- Suggested commit message: `feat: route complete contacts to Telegram topic`
