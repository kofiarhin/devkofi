# Profile / Account Settings — Detailed Implementation Plan

## Goal

Implement a production-leaning `/settings` experience that lets authenticated users:

- view account identity details
- edit onboarding/profile fields already stored in `user.profile`
- see profile completeness
- see plan/support summary
- save changes safely
- avoid losing unsaved changes

This plan is based on the existing codebase and keeps scope aligned to the current backend.

---

## Implementation Strategy

Build this in **7 phases**:

1. Tighten backend update rules
2. Add client data hooks
3. Add `/settings` route + navigation entry points
4. Build the settings page UI
5. Add save, reset, and dirty-state protections
6. Add completeness + plan/support summary cards
7. Add tests and final QA pass

---

## Phase 1 — Backend hardening

### Objective

Make `PATCH /api/profile/me` safe for a public user-facing settings page.

### Current issue

`server/controllers/profileController.js` currently allows fields that should not be user-editable:

- `onboardingCompleted`
- `onboardingStep`
- `selectedPlan`
- possibly `supportPreference`

That creates integrity drift between profile state and real enrollment/application state.

### Files to update

- `server/controllers/profileController.js`

### Tasks

#### 1. Replace editable whitelist

Use this whitelist only:

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

#### 2. Reject payloads with no valid editable keys

Keep the current `400` behavior, but make the error message explicit:

- `No valid profile fields provided`

#### 3. Add lightweight validation

Validation rules:

- trim all string inputs
- allow empty string for optional link fields
- validate non-empty URLs:
  - `githubUrl`
  - `portfolioUrl`
  - `linkedinUrl`
- validate `skillLevel` against allowed values if your UI uses a fixed list
- reject unknown keys silently by ignoring them, or explicitly reject them if you want stricter contracts

### Recommended server-side enums

Use the same values the client will expose.

#### `skillLevel`
- `beginner`
- `intermediate`
- `advanced`

#### `preferredStartTimeline`
- `immediately`
- `within_30_days`
- `within_90_days`
- `just_exploring`

If your onboarding flow already uses different values, keep them consistent and do not invent a second set.

### Deliverable

A safe public PATCH endpoint that only updates profile fields the user should control.

---

## Phase 2 — Client data hooks

### Objective

Add dedicated query/mutation hooks for settings so the page follows the same data-access pattern as the rest of the app.

### Files to add

- `client/src/hooks/useProfileMeQuery.js`
- `client/src/hooks/useUpdateProfileMutation.js`

### Tasks

#### 1. `useProfileMeQuery`

Responsibilities:

- call `GET /api/profile/me`
- use auth token from Redux/localStorage consistent with existing hooks
- return normalized data
- expose loading/error states

#### Query config

- query key: `["profile-me"]`
- enabled: `!!token`

#### 2. `useUpdateProfileMutation`

Responsibilities:

- call `PATCH /api/profile/me`
- send only changed editable fields
- normalize API errors
- invalidate related cache after success

#### Invalidate these query keys on success

- `["profile-me"]`
- `["onboarding-status"]`
- `["student-dashboard-summary"]`
- `["admin-users"]`

If your existing query keys differ, use the actual live keys in the repo rather than creating near-duplicates.

### Deliverable

Two reusable hooks that encapsulate all profile settings data access.

---

## Phase 3 — Route and navigation

### Objective

Expose the settings page in the authenticated app shell.

### Files to update

- `client/src/App.jsx`
- `client/src/components/Header/Header.jsx`
- `client/src/components/SideNav/SideNav.jsx`

### Tasks

#### 1. Add private route

Add:

- `/settings`

inside the authenticated route area guarded by `PrivateRoute`.

#### 2. Add navigation links

Add Settings entry points to:

- top header
- side navigation

#### 3. Optional dashboard CTA

Add a small “Edit profile” or “Complete profile” CTA in:

- `client/src/Pages/Dashboard/StudentDashboard/StudentDashboard.jsx`

This is optional for v1, but it improves discoverability.

### Deliverable

Authenticated users can reach `/settings` from the normal app navigation.

---

## Phase 4 — Build the settings page

### Objective

Create the page structure and form UI.

### Files to add

- `client/src/Pages/Settings/Settings.jsx`
- `client/src/Pages/Settings/settings.styles.scss`

### Optional extracted components

- `client/src/components/ProfileCompletenessCard/ProfileCompletenessCard.jsx`
- `client/src/components/PlanSupportSummaryCard/PlanSupportSummaryCard.jsx`
- `client/src/components/UnsavedChangesBanner/UnsavedChangesBanner.jsx`

### Page layout

Use a two-column desktop layout and stacked mobile layout.

#### Top section

- Page title: `Account Settings`
- Subtitle: `Manage your mentorship profile, links, and readiness`

#### Left column — editable form

##### Section A: Engineering profile
Editable fields:
- `currentRole`
- `skillLevel`
- `mernExperience`
- `aiExperience`

##### Section B: Goals and context
Editable fields:
- `primaryGoal`
- `biggestBlocker`
- `currentProjectSummary`
- `preferredStartTimeline`

##### Section C: Links and location
Editable fields:
- `githubUrl`
- `portfolioUrl`
- `linkedinUrl`
- `timezone`
- `country`

#### Right column — summary cards

##### Card 1: Account
Read-only:
- full name
- email
- role

##### Card 2: Profile completeness
Show:
- percentage
- readiness score
- status label
- missing fields

##### Card 3: Plan & support summary
Show:
- plan
- enrollment status
- application status
- payment status
- support level

##### Card 4: Save state
Show:
- `All changes saved`
- or `You have unsaved changes`

### Form state shape

Use the same profile keys already stored in the database:

```js
const initialForm = {
  timezone: "",
  country: "",
  currentRole: "",
  skillLevel: "",
  mernExperience: "",
  aiExperience: "",
  primaryGoal: "",
  biggestBlocker: "",
  githubUrl: "",
  portfolioUrl: "",
  linkedinUrl: "",
  currentProjectSummary: "",
  preferredStartTimeline: "",
};
```

### Field types

Recommended UI controls:

- text input:
  - `currentRole`
  - `timezone`
  - `country`
  - `githubUrl`
  - `portfolioUrl`
  - `linkedinUrl`

- select:
  - `skillLevel`
  - `preferredStartTimeline`

- textarea:
  - `mernExperience`
  - `aiExperience`
  - `primaryGoal`
  - `biggestBlocker`
  - `currentProjectSummary`

If you already use text inputs for some of these in onboarding, keep the UX consistent.

### Deliverable

A complete `/settings` page UI rendered from live API data.

---

## Phase 5 — Save flow, dirty state, reset, and navigation protection

### Objective

Make editing feel safe and intentional.

### Files to update

- `client/src/Pages/Settings/Settings.jsx`

### Tasks

#### 1. Hydrate form from query data

On successful profile query:

- map `profile` into form state
- snapshot initial sanitized values for dirty-state comparison

#### 2. Dirty-state tracking

Define `isDirty` by comparing:

- current sanitized form state
- initial sanitized snapshot

Use normalized comparison:
- trim strings
- treat `undefined` as `""`

#### 3. Validation

##### Required fields
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

##### Optional fields
- `githubUrl`
- `portfolioUrl`
- `linkedinUrl`

##### URL rule
- empty string is valid
- non-empty must be valid URL

#### 4. Save behavior

Save button should be disabled when:

- initial data is loading
- mutation is pending
- form is not dirty
- validation fails

When saving:

- compute diff payload from changed fields only
- call mutation
- on success:
  - invalidate related queries
  - refresh summary cards
  - replace initial snapshot with saved values
  - clear dirty state
  - show success feedback

#### 5. Reset behavior

Reset button should:

- restore initial snapshot
- clear field-level validation errors
- clear dirty state

#### 6. Browser/tab close warning

Use `beforeunload` when `isDirty === true`.

#### 7. In-app leave confirmation

At minimum:

- guard any “Cancel” or “Back” button inside the page
- guard navigational actions you explicitly wire inside the settings page
- use confirmation copy:
  - `You have unsaved changes. Leave without saving?`

If router-level blocking is easy in your installed version, you can add it later as a follow-up.

### Deliverable

A safe edit form with save/reset flows and unsaved-change protection.

---

## Phase 6 — Completeness meter and plan/support summary

### Objective

Turn existing backend data into useful settings-side insight.

### Data sources

#### Profile data
- `GET /api/profile/me`

#### Completeness data
- `GET /api/onboarding/status`

#### Plan/application data
- `GET /api/enrollments/me`

### Tasks

#### 1. Completeness meter

Use `readinessScore` from `/api/onboarding/status`.

##### Display formula

```js
const completionPercent = Math.round((readinessScore / 10) * 100);
```

##### Status labels
- `0–39%` → `Incomplete`
- `40–79%` → `In progress`
- `80–99%` → `Nearly complete`
- `100%` → `Complete`

#### 2. Missing fields list

Compute missing labels client-side from the profile object using the same 10 readiness fields already used in the backend:

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

Render the missing field names as an actionable checklist.

#### 3. Plan/support summary

Use source priority:

1. latest enrollment
2. `profile.selectedPlan` fallback
3. `"none"`

Recommended display mapping:

##### Plan
- `enrollment.planSlug || profile.selectedPlan || "none"`

##### Enrollment status
- `enrollment.status || "none"`

##### Application status
- `enrollment.applicationStatus || "draft"`

##### Payment status
- `enrollment.paymentStatus || "not_required"`

##### Support level
Match current dashboard logic:
- `pro` → `high-touch`
- `standard` → `structured`
- anything else → `not-set`

### Deliverable

Live summary cards powered by real user and enrollment data.

---

## Phase 7 — Testing and QA

### Objective

Lock the feature down with backend coverage and focused frontend behavior tests.

---

## Backend test plan

### Files to update

- `server/__test__/coreFlows.test.js`

### Add tests for

#### Authenticated profile read
- user can `GET /api/profile/me`
- response includes `firstName`, `lastName`, `email`, and `profile`

#### Allowed patch
- user can `PATCH /api/profile/me` with valid editable fields
- saved profile is persisted

#### Invalid patch
- request with no allowed fields returns `400`

#### Forbidden patch attempts
- `onboardingCompleted` cannot be updated
- `onboardingStep` cannot be updated
- `selectedPlan` cannot be updated

#### Completeness update
- onboarding status readiness score changes after valid profile update

---

## Frontend test plan

Follow your preferred client testing structure under `client/test/`.

### Suggested files

- `client/test/pages/Settings.test.jsx`
- `client/test/components/ProfileCompletenessCard.test.jsx` (optional)
- `client/test/components/PlanSupportSummaryCard.test.jsx` (optional)

### Add tests for

#### Page render
- shows loading state first
- hydrates form values from profile query

#### Dirty-state behavior
- editing a field shows unsaved state
- reset restores original values
- save clears dirty state

#### Validation
- invalid URL blocks save
- required fields must be present

#### Save flow
- mutation sends only changed fields
- success UI appears after save
- queries are invalidated/refetched

#### Summary cards
- account card shows read-only name/email
- completeness card shows expected percentage
- plan summary prefers enrollment over profile fallback

---

## File-by-file execution checklist

## Server

### `server/controllers/profileController.js`
- [ ] replace editable whitelist
- [ ] add input trim/sanitization
- [ ] add URL validation for link fields
- [ ] prevent system-owned field updates
- [ ] keep response shape stable

---

## Client hooks

### `client/src/hooks/useProfileMeQuery.js`
- [ ] add query for `/api/profile/me`
- [ ] normalize auth token handling
- [ ] expose loading/error/data cleanly

### `client/src/hooks/useUpdateProfileMutation.js`
- [ ] add PATCH mutation
- [ ] accept diff payload only
- [ ] invalidate related queries on success
- [ ] surface normalized errors

---

## Client routing and nav

### `client/src/App.jsx`
- [ ] register `/settings` private route

### `client/src/components/Header/Header.jsx`
- [ ] add settings link

### `client/src/components/SideNav/SideNav.jsx`
- [ ] add settings link

---

## Client page

### `client/src/Pages/Settings/Settings.jsx`
- [ ] fetch profile/onboarding/enrollment data
- [ ] map profile data into form state
- [ ] compute dirty state
- [ ] validate inputs
- [ ] compute diff payload
- [ ] submit save
- [ ] reset form
- [ ] warn before unload when dirty
- [ ] render account summary
- [ ] render completeness card
- [ ] render plan/support summary

### `client/src/Pages/Settings/settings.styles.scss`
- [ ] mobile-first page layout
- [ ] form section card styles
- [ ] summary card styles
- [ ] sticky save bar or action row
- [ ] loading/error/empty states

---

## Suggested component breakdown

If you want maintainable code without over-fragmenting the page, use this split:

### Keep in `Settings.jsx`
- page-level data fetching
- form state
- diff generation
- submit/reset logic
- unload protection

### Extract components
- `ProfileCompletenessCard`
- `PlanSupportSummaryCard`
- `AccountSummaryCard`
- `SettingsFormSection`

This keeps logic centralized while avoiding a huge JSX file.

---

## Payload contract for save

### Request

`PATCH /api/profile/me`

Example payload:

```json
{
  "currentRole": "Frontend Developer",
  "skillLevel": "intermediate",
  "timezone": "Europe/London",
  "country": "United Kingdom",
  "githubUrl": "https://github.com/devkofi"
}
```

### Response

Keep current backend response style:

```json
{
  "message": "Profile updated successfully",
  "profile": {
    "currentRole": "Frontend Developer",
    "skillLevel": "intermediate",
    "timezone": "Europe/London",
    "country": "United Kingdom",
    "githubUrl": "https://github.com/devkofi"
  }
}
```

---

## UI state matrix

## Initial load
- show loading skeleton or loading copy
- disable form controls if you prefer safer hydration

## Load error
- show retry state
- do not render editable form until profile query succeeds

## Normal state
- form editable
- save disabled until dirty

## Saving state
- disable save/reset
- show inline saving state

## Save success
- show success message
- refresh summaries
- clear dirty state

## Save error
- show inline error banner
- preserve unsaved values

---

## Recommended sequencing for actual coding

### Step 1
Backend whitelist + validation first.

### Step 2
Create `useProfileMeQuery` and `useUpdateProfileMutation`.

### Step 3
Create `/settings` page with basic form rendering only.

### Step 4
Wire save + reset + dirty detection.

### Step 5
Add completeness and plan/support summary cards.

### Step 6
Add navigation links and dashboard entry point.

### Step 7
Write backend tests.

### Step 8
Write focused frontend tests.

### Step 9
Manual QA across:
- new user with empty profile
- onboarded user with complete profile
- user with enrollment
- admin account
- dirty leave flow
- invalid URLs
- partial field updates

---

## Manual QA checklist

- [ ] unauthenticated user cannot access `/settings`
- [ ] authenticated user can access `/settings`
- [ ] page loads current profile values correctly
- [ ] read-only name/email render correctly
- [ ] editing one field enables save
- [ ] invalid URL blocks save
- [ ] reset restores original data
- [ ] save updates DB and refreshes page state
- [ ] completeness meter changes after relevant edits
- [ ] enrollment summary renders real latest enrollment
- [ ] closing tab with unsaved changes warns user
- [ ] leaving after save does not warn user
- [ ] dashboard data remains consistent after profile update

---

## Out of scope for v1

Do not include these yet:

- editing first name / last name / email
- password change
- email verification flows
- avatar upload
- billing management
- direct plan switching from settings
- notification preferences
- timezone auto-detect
- advanced router-wide transition blocking

These can be separate follow-up features.

---

## Risks and mitigation

### Risk 1 — profile plan drift
If you display `profile.selectedPlan` as primary, it may conflict with real enrollment.

**Mitigation:** always prefer enrollment data first.

### Risk 2 — PATCH endpoint abuse
If restricted fields remain editable, users can create invalid lifecycle state.

**Mitigation:** lock down whitelist before shipping the page.

### Risk 3 — stale UI after save
If only the settings page updates, dashboard/admin views may show old values.

**Mitigation:** invalidate related queries on mutation success.

### Risk 4 — unsaved work loss
Without unload protection, users can lose edits.

**Mitigation:** add `beforeunload` + in-page confirmation.

---

## Acceptance criteria

The feature is complete when:

- `/settings` exists behind auth
- current profile data loads correctly
- editable onboarding/profile fields can be updated
- system-owned fields cannot be patched by the user
- dirty-state detection works
- browser unload warning works when dirty
- completeness is shown from onboarding status
- plan/support summary is shown from enrollment data
- save/reset flows work
- backend coverage exists for allowed/forbidden patch behavior
- frontend coverage exists for main page behaviors

---

## Recommended follow-up after this feature ships

1. Allow editing top-level name fields with a dedicated validated endpoint
2. Add account security section
3. Add avatar upload
4. Add notification preferences
5. Add mentor-facing internal notes vs student-facing profile split

---

## Final build summary

This implementation is best treated as a **low-risk, high-value completion pass** on infrastructure you already have:

- backend profile APIs already exist
- onboarding already writes into `user.profile`
- enrollments already model plan/application status
- dashboard already depends on this data

So the implementation should focus on:

- tightening the PATCH contract
- building a clean `/settings` page
- connecting existing APIs
- protecting unsaved work
- keeping dashboard/admin/profile views in sync
