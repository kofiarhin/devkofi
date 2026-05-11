# Contact Form Empty State Spec

## Request Summary

Add a UI-only empty state to the existing contact form/page.

## Date

2026-05-13

## Source Prompt

`workflow add a contact form empty state`

Follow-up answers:

- Use the current contact form/page in the app. If there is no contact form, create a small UI-only contact section where it naturally fits.
- Show the empty state before the user types anything.
- Use this message: "Start by entering your details and message."
- UI-only for now. Do not connect to backend/contact submission behavior.
- Execution preference: complete-workflow.

## Questions Asked And Answers Received

1. Which contact form should get the empty state?
   - Use the current contact form/page in the app. If no contact form exists, create a small UI-only contact section where it naturally fits.
2. When should the empty state appear?
   - Before the user types anything.
3. What should the empty state say?
   - "Start by entering your details and message."
4. Should this connect to backend/contact submission behavior?
   - UI-only for now. Do not connect to backend/contact submission behavior.

## Assumptions

- The existing `client/src/Pages/Contact/Contact.jsx` page is the correct target.
- "Before the user types anything" means while all form fields are still empty. Clicking an existing prompt chip counts as adding content and should hide the empty state because it fills subject/message fields.
- Existing backend submission behavior should remain untouched even though the current contact page already uses `useContactMutation`.
- No new route or section is needed because `/contact` already exists.

## Goal

Show a polished, accessible empty state in the existing contact form before the visitor enters any details.

## Non-Goals

- Do not change backend APIs, services, or database models.
- Do not alter contact form validation rules.
- Do not redesign the full contact page.
- Do not change deployment configuration.

## Users

- Site visitors preparing to submit a project inquiry through the contact page.

## Functional Requirements

- Detect when all contact form fields are empty.
- Render the exact empty state message before any field has content:
  - "Start by entering your details and message."
- Hide the empty state after the user types in any contact field.
- Hide the empty state after a prompt chip populates the form.
- Preserve existing validation, pending, error, success, and reset behavior.
- Keep the change UI-only; no new backend calls or service changes.

## UI Expectations

- Empty state should live inside the existing contact form and fit the current dark glass visual language.
- Empty state must be accessible as text content and should not block form fields.
- It should work on mobile and desktop without layout overlap.
- Use existing dependencies and patterns. `@phosphor-icons/react` and `framer-motion` are already installed.

## API Expectations

- No API changes.
- No new frontend service calls.
- Existing contact submission behavior remains unchanged.

## Data Model Expectations

- No model, schema, or persistence changes.

## Edge Cases

- Whitespace-only typed content should not count as meaningful content for the empty state.
- Resetting the form after success returns all fields to empty and should show the empty state again.
- Validation errors should continue to show normally after submit attempts.

## Constraints

- Follow existing SCSS styling for the contact page; do not mix in Tailwind for this feature.
- Apply the `design-taste-frontend` skill for frontend UI decisions.
- Dirty worktree protection: initial status contains many pre-existing deleted agent/workflow files and modified `AGENTS.md`; planned implementation files are limited to contact page files, a focused test, and workflow artifacts. No overlap with pre-existing dirty implementation files was observed.

## Success Criteria

- The contact page renders the empty state message before the user enters contact form content.
- The empty state disappears once any contact form field has non-whitespace content.
- Existing contact form submission behavior and validation remain intact.
- A frontend test covers the empty state initial and hide-on-input behavior.
- Build or test verification is attempted and results are recorded.

## Out Of Scope Items

- Backend contact endpoint changes.
- Admin contact message behavior.
- Full contact page redesign.
- New dependencies.
- Deployment changes.

## Open Questions

- None blocking.
