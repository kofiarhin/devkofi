# Deployment Vitest repair — 12 November 2026

Branch: `fix/deploy-vitest-suite`, based on local `eec5b2a`.
The existing env-file access and sudo environment-forwarding fixes are preserved.
The follow-up authorizes a local commit after repeating the full test suite and
reviewing the diff. No push, merge, deployment, service restart, secret change,
or production configuration change is authorized.

## Baseline and causes

The current checkout reproduced **31 failed / 132 passed tests in 26 files**,
with failures in 11 files. This differs from the earlier reported Docker result
of 30 failed / 118 passed; the current observed baseline governs this repair.

| Test file | Failures | Cause and correction |
| --- | ---: | --- |
| `client/test/admin/AdminDashboard.test.jsx` | 4 | Contact messages now use a row View action opening a details panel, rather than subject-button navigation. Empty states say “No messages/subscribers found.” Assert the panel's subject, sender and message and the current empty states. |
| `client/test/navigation/AdminNavigation.test.jsx` | 1 | Mobile navigation has Services, Work, Systems and Contact rather than a Home link. Check those destinations while retaining admin/logout visibility checks. |
| `client/test/seo/discoveryFiles.test.js` | 3 | Vite rewrites the browser-style `new URL` asset expression to `/public/...`, which is not a filesystem directory. Resolve files with Node's path utilities relative to the test module. All three public files already exist under `client/public` and are copied by `COPY client/ ./`. |
| `client/test/seo/seoMetadata.test.jsx` | 1 | Services metadata now describes Workflow Audit, Pilot Sprint and Production AI System engagements. Assert that copy and the Workflow Audit service schema; retain canonical URL, schema structure and noindex checks. |
| `client/src/Pages/AdminDashboard/AdminDashboard.test.jsx` | 4 | The explicit service mock omitted `deleteNewsletterSubscriber`, accessed when the newsletter tab mounts. Supply mocks for the contact/subscriber mutation exports alongside the existing export mocks. |
| `client/test/BookCall.test.jsx` | 6 | Booking now moves from calendar to details to confirmation, hides unavailable slots, and uses different labels. Await the real animated transitions and check the submitted payload, conflict error, required fields and confirmation. Accept the optional weekday comma emitted by different Node/ICU versions while retaining the exact date/time assertions. |
| `client/tests/HomeShowcase.test.jsx` | 3 | Whole-page article counts include new engagement/workflow cards. Scope project assertions to Selected Work, and explicitly keep the Engineering Systems section free of a second project gallery. |
| `client/tests/ShowcaseRoutes.test.jsx` | 1 | Work loading/error copy changed, and its retry control was genuinely lost. Update copy expectations and restore the button wired to the existing query's `refetch`. The focused test failed specifically on the missing button before the application fix. |
| `client/tests/projects.test.js` | 1 | ThriftChef's thumbnail moved from a local WebP to the existing Cloudinary URL. Preserve all identity, featured/live, link and ordering assertions. |
| `client/tests/auth.test.js` | 4 | Pricing copy changed and student join/onboarding/dashboard pages were intentionally removed in `cdd93c7`. Replace obsolete source-file assertions with runtime checks of retired routes returning Not Found and noindex; retain the pricing/contact fallback contract. |
| `client/tests/settings.test.js` | 3 | Student settings and profile hooks were intentionally removed in `cdd93c7`. Verify the retired URL for both anonymous/admin states and current desktop/mobile navigation, including admin controls. |

Docker had an additional fixture gap: `client/tests/projects.test.js` reads
`server/data/projects.data.json`, but the client-test stage copied only `client/`.
`Dockerfile.verify` now copies that one public project-data fixture to its expected
path. The verification-specific ignore file already includes tests and public
files; no ignore rules or production Dockerfiles need changes.

## Changed files

The 11 test files above, plus:

- `client/test/renderApp.jsx`: shared real-router/provider setup for retired-route tests.
- `client/src/Pages/Work/Work.jsx`: restore the error-state retry action using existing styling.
- `Dockerfile.verify`: include the required project-data fixture in the client-test stage.
- `docs/deployment/standalone.md`: update the obsolete Vitest blocker note.
- `context/current-state.md`: record observed implementation and verification status.
- This verification report.

No tests are skipped or disabled. The suite retains all 163 tests. Authentication,
API behavior, production environment files, permissions, dependencies, lockfiles,
deployment guards and `scripts/deploy.sh` are unchanged by this repair.

## Verification

- **Passed:** targeted repair checks. The first 11-file rerun passed 66/68 tests;
  the remaining two were Node/ICU weekday-comma differences. After correcting
  those expectations, `npm --prefix client run test -- --run test/BookCall.test.jsx`
  passed all 7 booking tests. The complete suite below verifies all repaired files
  together.
- **Passed:** `npm --prefix client run test -- --run --maxWorkers=2`
  (JSON reporter used to capture results): **26 files, 163 passed, 0 failed,
  0 skipped** on local Node 22.23.2. Worker count changes concurrency only.
  Repeated before the user-approved local commit: **163 passed, 0 failed,
  0 skipped across 26 files**, exit status 0; staged diff reviewed again.
- **Passed:** `npm --prefix client run lint`.
- **Passed:** Docker client-test stage lint and Vitest on Node 20:
  **26 files, 163 passed, 0 failed**. Command:
  `sudo -n docker --host=unix:///var/run/docker.sock build -f Dockerfile.verify --target client-test -t devkofi-verify-vitest-fix:local .`.
  Export and unpack completed; image inspection confirmed
  `sha256:e1db0c460803a25524045f27a72c61d82a984b1604348997cc8a80f7351223ba`.
- **Passed:** `git diff --check` and review against `review.md`.
- **Passed:** Chromium checks of `/work` at 1440px and 390px against a temporary
  local Vite preview: error state, keyboard focus/Enter on Try again, a new
  projects request, successful recovery and no horizontal overflow or page
  runtime exceptions. Error-state screenshots inspected at both widths. The
  task-owned preview was stopped afterward.
- **Not run:** deployment/preflight, backend tests, production connectivity and
  production services. This is a client verification repair, not a release.

An initial local full-suite command and Docker build command wrapper returned
signal 15 before final results. The local suite was rerun with two workers and
completed successfully. The original Docker child build continued, so its log
was monitored rather than starting a duplicate build. Its lint and full test
stage completed successfully.

## Review scope

The application change is limited to restoring Work's retry action. The prior
test expectations do not justify reintroducing deleted mentorship/settings
features or changing current product copy. The navigation/auth tests continue to
exercise the existing admin boundaries.

An existing React warning about duplicate `/contact` keys in the footer appears
in route tests. It predates this repair and is not suppressed. Browser checks
use mocked local API responses and block external assets; they establish retry
interaction and layout behavior, not production connectivity or image delivery.
