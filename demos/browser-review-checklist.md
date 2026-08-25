# DevKofi Browser Review Checklist

For user-facing work, verify the actual approved flow when browser tooling is available.

## Viewports

- Desktop width representative of a normal laptop/desktop.
- Mobile width representative of a narrow phone.

## State Coverage

Check the states relevant to the ticket:

- initial/loading;
- empty/no-data;
- validation failure;
- API/network failure;
- success;
- authenticated versus unauthenticated;
- student versus admin where role behavior is affected.

## Core Product Checks

When relevant, exercise:

- homepage/navigation and CTA clarity;
- course/pricing discovery;
- Join Mentorship submission;
- contact/newsletter submission;
- login/verification/private-route behavior;
- templates/portal/messages flows;
- download behavior.

## Quality Checks

- no new console errors;
- no unexpected failed network requests;
- keyboard navigation works for changed interactions;
- labels, focus behavior, semantics, and accessible names are reasonable;
- responsive layout remains usable;
- loading/error/success messages explain what happened and what to do next;
- copy is clear for the intended DevKofi user.

Report only what was actually inspected. Mark unavailable checks `Not run` rather than passing them by assumption.
