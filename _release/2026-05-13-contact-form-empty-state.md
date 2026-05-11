# Contact Form Empty State Release Notes

## Request

Add a UI-only empty state to the current contact form/page.

## User-Facing Changes

- The contact form now shows: "Start by entering your details and message." before the visitor enters any form content.
- The empty state hides after the visitor types in a field or selects an existing project prompt chip.

## Developer Changes

- Added trimmed form-empty detection in `client/src/Pages/Contact/Contact.jsx`.
- Added styling for the inline contact empty state in `client/src/Pages/Contact/contact.styles.scss`.
- Added focused tests in `client/test/contact/Contact.test.jsx`.

## New Routes/APIs

none

## New Env Vars

none

## Database/Schema Changes

none

## Dependencies Added/Removed

none

## Test Commands Run

- `cd client && npm test -- --run client/test/contact/Contact.test.jsx` - failed, wrong filter path relative to `client`.
- `cd client && npm test -- --run test/contact/Contact.test.jsx` - passed, 3 tests.
- `cd client && npm run build` - passed with a non-failing Vite chunk size warning.

## Known Limitations

- Browser screenshot verification was not run.
- The existing contact form still uses its existing backend submission hook; this request did not add or change backend behavior.

## Follow-Up Work

- Optional visual QA screenshot pass for `/contact`.

## Suggested Commit Message

`feat: add contact form empty state`
