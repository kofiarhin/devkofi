# Work Request

## Source

Conversation with the repository owner on 2026-08-19.

## Request

Connect the existing DevKofi contact form to the Telegram bot and central private Telegram group so every contact submission:

1. is saved to the existing MongoDB contact-message collection first;
2. is forwarded into the `Contact Enquiries` topic in `DevKofi Messages Hub`;
3. remains fully readable in Telegram, including long messages;
4. keeps the existing email fallback/notification behavior.

## Confirmed Telegram Routing

- Group: `DevKofi Messages Hub`
- Chat ID: `-1004424464936`
- Topic: `Contact Enquiries`
- Topic ID: `2`
- Bot username: `@devkofi_messages_hub_bot`

The bot token is a secret and must never be committed or printed.

## In Scope

- Contact-form Telegram topic routing.
- Complete contact notification formatting.
- Ordered splitting for messages that exceed Telegram's per-message limit.
- Environment-variable documentation.
- Unit tests for routing, full short messages, splitting, and failure behavior.
- Draft pull request.

## Out of Scope

- Course registration routing.
- New database schemas or migrations.
- Deployment.
- Production environment changes.
- Committing credentials or tokens.

## Execution Mode

`complete-workflow`
