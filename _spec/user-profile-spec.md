# Profile / Account Settings Implementation Spec

## What already exists

The backend is already close enough to support this without adding a new resource:

- `GET /api/profile/me` and `PATCH /api/profile/me` already exist and are protected by `requireAuth` (`server/routes/profileRoutes.js:1-10`).
- `GET /api/profile/me` returns `firstName`, `lastName`, `email`, and `profile` (`server/controllers/profileController.js:25-35`).
- `PATCH /api/profile/me` already supports partial updates for `profile.*` fields (`server/controllers/profileController.js:38-63`).
- onboarding writes into `user.profile`, so the onboarding form and settings page are editing the same source of truth (`server/controllers/profileController.js:65-124`, `server/models/User.js:3-32`).
- `GET /api/onboarding/status` already returns `onboardingCompleted`, `onboardingStep`, `selectedPlan`, and `readinessScore`, which is perfect for the completeness meter (`server/routes/onboardingRoutes.js:1-13`, `server/controllers/profileController.js:126-155`).
- enrollment data already exists and should be used for the plan/support summary instead of trusting only profile state (`server/models/Enrollment.js:3-53`, `server/controllers/enrollmentController.js:6-18`, `server/controllers/dashboardController.js:15-18`).

## Important constraints from the current code

Two things matter before building the page:

1. **Top-level account fields are not patchable yet.**  
   `PATCH /api/profile/me` only updates `profile.*`. It does **not** update `firstName`, `lastName`, or `email` (`server/controllers/profileController.js:3-21`, `38-57`).

   So for v1:
   - `firstName`, `lastName`, `email`, `role` should be **read-only**
   - editable fields should be only the onboarding/profile fields

2. **The current PATCH whitelist is too permissive.**  
   It allows editing:
   - `onboardingCompleted`
   - `onboardingStep`
   - `selectedPlan`
   - `supportPreference`  
   (`server/controllers/profileController.js:3-21`)

   That is risky because:
   - `onboardingCompleted` and `onboardingStep` should not be user-editable
   - `selectedPlan` can drift from actual `Enrollment.planSlug`
   - support level is currently derived from plan in the dashboard, not truly owned by profile (`server/controllers/dashboardController.js:33-40`)

   For this feature, I’d tighten that controller first.

---

# Detailed spec

## 1) Route + navigation

### Add route
Update `client/src/App.jsx` to add a new private route:

- `/settings` inside the existing `PrivateRoute` block (`client/src/App.jsx:50-57`)

### Add entry points
Add links to settings from:

- `client/src/components/Header/Header.jsx`
- `client/src/components/SideNav/SideNav.jsx`

Optional:
- add a secondary CTA in `StudentDashboard` like “Edit profile” or “Complete profile” (`client/src/Pages/Dashboard/StudentDashboard/StudentDashboard.jsx:31-69`)

## 2) Page goal

Create a page where an authenticated user can:

- view their account identity
- edit their onboarding/profile fields
- see profile completeness
- see plan/support/enrollment summary
- save updates safely
- be warned before losing unsaved changes

This should be a **student-facing settings page**, but it will also work for admins since the same `profile` object exists for all users.

---

## 3) Files to add

### New client files
- `client/src/Pages/Settings/Settings.jsx`
- `client/src/Pages/Settings/settings.styles.scss`
- `client/src/hooks/useProfileMeQuery.js`
- `client/src/hooks/useUpdateProfileMutation.js`

Optional, if you want smaller units:
- `client/src/components/ProfileCompletenessCard/ProfileCompletenessCard.jsx`
- `client/src/components/PlanSupportSummaryCard/PlanSupportSummaryCard.jsx`
- `client/src/components/UnsavedChangesBanner/UnsavedChangesBanner.jsx`

### Existing client files to update
- `client/src/App.jsx`
- `client/src/components/Header/Header.jsx`
- `client/src/components/SideNav/SideNav.jsx`

### Existing server files to update
- `server/controllers/profileController.js`

### Tests
- extend `server/__test__/coreFlows.test.js`
- optionally add frontend tests under `client/test/...` if you want page-level coverage

---

## 4) Data sources for the page

The page should load from **three existing endpoints**.

### A. Profile data
Use `GET /api/profile/me`

Purpose:
- populate editable profile form
- populate read-only account card

Expected source:
- `user.firstName`
- `user.lastName`
- `user.email`
- `user.profile.*`  
(`server/controllers/profileController.js:25-35`)

### B. Completeness data
Use `GET /api/onboarding/status`

Purpose:
- drive the completeness meter
- reuse server-owned readiness logic instead of duplicating it

Expected source:
- `onboardingCompleted`
- `onboardingStep`
- `readinessScore`
- `selectedPlan`  
(`server/controllers/profileController.js:126-155`)

### C. Plan/support summary
Use `GET /api/enrollments/me`

Purpose:
- show actual plan/application status
- avoid relying only on `profile.selectedPlan`

Expected source:
- latest enrollment
- `planSlug`
- `status`
- `applicationStatus`
- `paymentStatus`  
(`server/controllers/enrollmentController.js:6-18`, `server/models/Enrollment.js:16-49`)

---

## 5) Page layout

Use the repo’s current pattern: page component + SCSS module-style page stylesheet. The codebase is SCSS-driven already, so keep this feature consistent with that.

### Recommended structure

### Header block
- Title: `Account Settings`
- Subtitle: `Manage your mentorship profile, links, and readiness`

### Main content
Two-column layout on desktop, stacked on mobile.

### Left column: editable form
#### Section 1: Engineering profile
Editable:
- `currentRole`
- `skillLevel`
- `mernExperience`
- `aiExperience`

#### Section 2: Goals and context
Editable:
- `primaryGoal`
- `biggestBlocker`
- `currentProjectSummary`
- `preferredStartTimeline`

#### Section 3: Links and location
Editable:
- `githubUrl`
- `portfolioUrl`
- `linkedinUrl`
- `timezone`
- `country`

### Right column: summary cards
#### Card 1: Account
Read-only:
- full name
- email
- role
- auth provider if useful

Source:
- `user` from `/api/profile/me`
- `role` may come from auth store or `/api/auth/me`; easiest is auth store unless you want full consistency

#### Card 2: Profile completeness
Show:
- percentage
- `readinessScore / 10`
- completion label
- missing fields list

Use the same 10-field logic already in `getOnboardingStatus`:
- currentRole
- skillLevel
- mernExperience
- aiExperience
- primaryGoal
- biggestBlocker
- currentProjectSummary
- timezone
- country
- preferredStartTimeline  
(`server/controllers/profileController.js:131-143`)

#### Card 3: Plan and support summary
Show:
- selected plan
- enrollment status
- application status
- payment status
- support level

Source priority:
1. latest enrollment
2. fallback to `profile.selectedPlan`
3. fallback to `"none"`

This matches current dashboard logic better than using the legacy top-level `user.plan` field, which is still marked as legacy in the model (`server/models/User.js:47-58`, `server/controllers/dashboardController.js:15-18`).

#### Card 4: Save state
Show:
- “All changes saved”
- or “You have unsaved changes”

Optional sticky save bar on desktop/mobile.

---

## 6) Editable fields for v1

### Editable
These should be user-editable in the settings form:

- `timezone`
- `country`
- `currentRole`
- `skillLevel`
- `mernExperience`
- `aiExperience`
- `primaryGoal`
- `biggestBlocker`
- `githubUrl`
- `portfolioUrl`
- `linkedinUrl`
- `currentProjectSummary`
- `preferredStartTimeline`

These map directly to `user.profile` and already exist in the schema (`server/models/User.js:3-30`).

### Read-only in v1
Do **not** allow editing from this first version:

- `firstName`
- `lastName`
- `email`
- `role`
- `selectedPlan`
- `supportPreference`
- `onboardingCompleted`
- `onboardingStep`

Reason:
- top-level identity fields are not supported by the current PATCH endpoint
- plan should come from enrollment, not user-edited profile
- onboarding state should be system-owned

---

## 7) Backend changes

No new endpoint is required, but one controller change is recommended before shipping.

### Update `editableFields` in `server/controllers/profileController.js`

### Remove from public editable whitelist
- `onboardingCompleted`
- `onboardingStep`
- `selectedPlan`

Potentially also remove:
- `supportPreference`

New safe whitelist:

```js
const editableFields = [
  "timezone",
  "country",
  "currentRole",
  "skillLevel",
  "mernExperience",
  "aiExperience",
  "primaryGoal",
  "biggestBlocker",
  "githubUrl",
  "portfolioUrl",
  "linkedinUrl",
  "currentProjectSummary",
  "preferredStartTimeline",
];
```

### Optional validation hardening
Before update:
- trim strings
- validate `skillLevel` enum
- validate URLs for `githubUrl`, `portfolioUrl`, `linkedinUrl` when provided
- reject unknown keys explicitly

### Why this matters
Right now a user could PATCH fake onboarding completion or plan info directly, because the controller accepts those fields (`server/controllers/profileController.js:3-21`).

---

## 8) Client hook spec

### `useProfileMeQuery.js`
Purpose:
- fetch initial profile/account state

Query key:
- `["profile-me"]`

Behavior:
- use auth token from Redux, with same fallback pattern used elsewhere in hooks
- throw normalized errors
- `enabled: !!token`

### `useUpdateProfileMutation.js`
Purpose:
- send partial PATCH updates to `/api/profile/me`

Mutation payload:
- only changed fields from the editable form

On success:
- invalidate:
  - `["profile-me"]`
  - `["onboarding-status"]`
  - `["student-dashboard-summary"]`
  - `["admin-users"]`  
    because admin views read profile values (`client/src/Pages/Dashboard/AdminUsers/AdminUsers.jsx:67-91`)

Optional:
- patch the `auth.user.profile` snapshot in Redux/localStorage if you want state consistency after save

---

## 9) Form behavior spec

### Initial state
- load from `profileMe.profile`
- fallback to empty strings using the same field shape as onboarding (`client/src/Pages/Onboarding/Onboarding.jsx:8-21`)

### Dirty state
Track an `initialSnapshot` and compare against current form.

Dirty = true when sanitized current form differs from snapshot.

### Validation
Required:
- `currentRole`
- `skillLevel`
- `mernExperience`
- `aiExperience`
- `primaryGoal`
- `biggestBlocker`
- `currentProjectSummary`
- `timezone`
- `country`
- `preferredStartTimeline`

Optional:
- `githubUrl`
- `portfolioUrl`
- `linkedinUrl`

URL fields:
- empty is valid
- non-empty must be valid URL

### Save button rules
- disabled while loading initial data
- disabled while mutation pending
- disabled when not dirty
- disabled when validation fails

### Reset button
- reset form to initial snapshot
- clear inline validation errors
- clear dirty state

### Success state
After save:
- show inline success message
- refresh completeness card
- refresh student dashboard summary
- clear dirty state

---

## 10) Dirty state warning spec

Need two protections:

### Browser/tab close
Use `beforeunload` when `isDirty === true`.

### In-app route changes
At minimum:
- intercept settings page “Cancel”
- intercept nav links you control from inside the page
- show `window.confirm("You have unsaved changes. Leave without saving?")`

If the installed router API supports a blocker cleanly in your version, you can upgrade this later. For v1, browser unload + explicit cancel/nav confirmation is enough.

---

## 11) Completeness meter spec

### Server-owned score
Use `readinessScore` from `/api/onboarding/status` as the numeric source of truth (`server/controllers/profileController.js:131-150`).

### Client display
- `percentage = Math.round((readinessScore / 10) * 100)`
- states:
  - `0–39%`: Incomplete
  - `40–79%`: In progress
  - `80–99%`: Nearly complete
  - `100%`: Complete

### Missing fields helper
Because `/api/onboarding/status` only returns the count, compute the missing labels client-side from the profile object.

Example labels:
- Current role
- Skill level
- MERN experience
- AI experience
- Primary goal
- Biggest blocker
- Project summary
- Timezone
- Country
- Start timeline

This is useful because it turns the meter into a real action list.

---

## 12) Plan / support info summary spec

### Data source priority
1. latest enrollment
2. profile fallback
3. “none”

### Display rules
#### Plan
- `enrollment.planSlug || profile.selectedPlan || "none"`

#### Enrollment status
- `enrollment.status || "none"`

#### Application status
- `enrollment.applicationStatus || "draft"`

#### Payment status
- `enrollment.paymentStatus || "not_required"`

#### Support level
Keep it consistent with current dashboard behavior:
- `pro => high-touch`
- `standard => structured`
- else `not-set`  
(`server/controllers/dashboardController.js:33-40`)

### CTA
- primary: `Go to dashboard`
- secondary: `View pricing`

Do not allow direct editing of plan in v1 from this page.

---

## 13) UX copy spec

### Page title
`Account Settings`

### Save CTA
`Save changes`

### Secondary CTA
`Reset`

### Success
`Profile updated successfully.`

### Dirty warning
`You have unsaved changes.`

### Empty summary fallback
`No plan selected yet.`

### Completeness helper
`Complete your profile to improve your mentorship setup.`

---

## 14) Styling spec

Keep it aligned with the current repo:

- page-level SCSS file
- reuse dashboard card visual language where possible
- mobile-first
- form fields should use the same visual tone as login/onboarding
- side summary cards should stack below form on small screens

Recommended layout:
- max-width container
- form sections as cards
- sticky action bar at bottom of viewport on mobile when dirty
- keep visual hierarchy clean, not heavy

---

## 15) Edge cases

### User has never completed onboarding
- show mostly empty form
- completeness reflects low score
- plan summary may show none
- save should still work

### User has onboarding complete but no enrollment
- completeness can be 100%
- plan summary may still say none
- show CTA to pricing/join flow

### User has enrollment but stale `profile.selectedPlan`
- plan summary should trust enrollment first

### PATCH returns success but query cache is stale
- always invalidate profile/onboarding/dashboard queries on success

### API returns missing profile
- initialize from empty defaults; schema already defaults profile to `{}` (`server/models/User.js:66`)

---

## 16) Testing spec

## Backend
Extend the existing Jest/Supertest flow (`server/__test__/coreFlows.test.js`).

### Add cases
1. authenticated user can `GET /api/profile/me`
2. authenticated user can `PATCH /api/profile/me` with allowed fields
3. PATCH rejects request with no allowed fields
4. PATCH does **not** allow updating `onboardingCompleted`
5. PATCH does **not** allow updating `selectedPlan`
6. onboarding status score changes after profile update

## Frontend
If you add Vitest coverage for the page:

### Suggested tests
- renders loading state
- hydrates form from profile query
- save button disabled when unchanged
- dirty banner appears after edit
- reset restores initial values
- save mutation sends only changed fields
- completeness card updates after save
- read-only account summary shows name/email
- plan summary prefers enrollment over profile fallback

---

## 17) Acceptance criteria

This feature is done when:

- authenticated users can open `/settings`
- the page preloads account + profile values
- editable fields save through `PATCH /api/profile/me`
- unsaved changes are detected
- browser close warns when dirty
- profile completeness is shown using onboarding status
- plan/support/enrollment summary is shown from real enrollment data
- names/email are visible but read-only
- forbidden fields are not user-editable on the backend
- dashboard/admin-derived views stay in sync after save

---

## 18) Recommended implementation order

1. tighten `profileController` whitelist
2. add `useProfileMeQuery`
3. add `useUpdateProfileMutation`
4. build `Settings.jsx`
5. add `/settings` route
6. add header/sidenav links
7. wire invalidations
8. add tests

## Best v1 scope
Do **not** expand this into account security or plan management yet.

Keep v1 focused on:
- profile editing
- completeness
- read-only account info
- read-only plan/support summary

That gives you a clean, low-friction ship using what the codebase already has.
