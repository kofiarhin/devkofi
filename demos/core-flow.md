# DevKofi Core Flow

Evidence basis: current `README.md`. The repository documents these as existing product capabilities; this workspace setup did not browser-verify them.

## Primary Prospective-Mentee Flow

1. **Discover**
   - User: lands on the homepage.
   - Product: presents the mentorship offer through Landing, Overview, Scale, IntegrateAI, Pricing, FAQ, and Newsletter sections.
   - Expected outcome: the visitor can understand the program and identify a relevant next step.

2. **Evaluate**
   - User: reviews curriculum/course outline and pricing information.
   - Product: presents program modules/requirements and pricing data.
   - Expected outcome: the visitor can decide whether to continue toward mentorship enrollment.

3. **Join mentorship**
   - User: opens and completes the Join Mentorship form.
   - Product: client mutation sends enrollment data to the documented `POST /api/mentorship` API.
   - Expected outcome: validation and request state are clear to the user.

4. **Enrollment processing**
   - User: submits valid enrollment details.
   - Product: README documents persistence plus welcome/verification email and staff notification behavior.
   - Expected outcome: the user reaches a clear success/next-step state.

## Authenticated Resource Flow

1. User authenticates through the existing auth flow.
2. Private routes gate templates/portal experiences.
3. Role-aware UI separates student/admin experiences where documented.
4. Expected outcome: users see only the resources/actions permitted by their role.

## Verification Status

- Intended/documented behavior: captured above from repository documentation.
- Browser verified during setup: `No`.
- API/database/email behavior verified during setup: `No`.

Use `demos/browser-review-checklist.md` during user-facing implementation work.
