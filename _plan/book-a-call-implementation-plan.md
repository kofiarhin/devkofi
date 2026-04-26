# Book a Call Feature Implementation Plan

**Spec:** `_spec/book-a-call-spec.md`  
**Date:** 2026-04-26  
**Branch:** `main`

---

## Overview

Implement a public `/book-a-call` booking flow backed by MongoDB availability checks.

The feature lets visitors choose a Monday-Friday slot between 09:00 and 17:00 GMT. Slots are 30 minutes long, the last valid slot starts at 16:30 GMT, and unavailable slots are visible but disabled. The backend must be the source of truth for slot validity and duplicate booking prevention.

Implementation should proceed backend-first so the frontend can consume stable response shapes.

---

## Current Repo Context

- Frontend is React/Vite with React Router.
- TanStack Query is already wired in `client/src/main.jsx`.
- Shared API client exists at `client/src/lib/api.js`.
- Existing UI areas mostly use SCSS, so the booking UI should use SCSS for consistency.
- Backend is Express with flat `server/` structure.
- MongoDB models use Mongoose.
- Admin routes already exist under `/api/admin` and use `requireAdminAuth`.
- Frontend package already includes `@phosphor-icons/react`, `framer-motion`, `@tanstack/react-query`, and `axios`.

Important implementation note:
- `client/src/lib/api.js` currently falls back to `http://localhost:5000`. The booking feature must not add any new hard-coded API URL logic. A separate cleanup may be needed later to remove the existing fallback if enforcing the API URL rule globally.

---

## Files to Create / Modify

| Action | File |
|--------|------|
| Create | `server/models/Booking.js` |
| Create | `server/utils/bookingSlots.js` |
| Create | `server/controllers/bookingController.js` |
| Create | `server/routes/bookingRoutes.js` |
| Create | `server/tests/booking.test.js` |
| Modify | `server/app.js` |
| Modify | `server/controllers/adminDashboardController.js` |
| Modify | `server/routes/adminRoutes.js` |
| Modify | `.env.example` if `BOOKING_NOTIFY_EMAIL` is added |
| Create | `client/src/pages/BookCall/BookCall.jsx` |
| Create | `client/src/pages/BookCall/book-call.styles.scss` |
| Create | `client/src/components/BookingCalendar/BookingCalendar.jsx` |
| Create | `client/src/components/BookingCalendar/booking-calendar.styles.scss` |
| Create | `client/src/components/BookingForm/BookingForm.jsx` |
| Create | `client/src/components/BookingForm/booking-form.styles.scss` |
| Create | `client/src/services/bookingService.js` |
| Create | `client/src/hooks/queries/useBookingAvailability.js` |
| Create | `client/src/hooks/mutations/useCreateBooking.js` |
| Create | `client/test/BookCall.test.jsx` |
| Modify | `client/src/App.jsx` |
| Modify | `client/src/components/Header/Header.jsx` |
| Modify | `client/src/components/SideNav/SideNav.jsx` if mobile nav has a Contact CTA |
| Modify | `client/src/Pages/Contact/Contact.jsx` if adding secondary booking link |

---

## Phase 1: Backend Slot Foundation

### Goal
Create deterministic GMT slot logic before adding routes or persistence.

### Tasks
- [ ] Create `server/utils/bookingSlots.js`.
- [ ] Use UTC date methods only.
- [ ] Treat GMT as UTC for this version.
- [ ] Avoid locale-dependent parsing and formatting in validation logic.
- [ ] Export:
  - `getWeekMonday(dateInput)`
  - `isWeekday(date)`
  - `isValidBookableSlot(slotStart)`
  - `getSlotEnd(slotStart)`
  - `generateWeekSlots(weekStart, bookedSlotStarts, now = new Date())`

### Slot Rules to Encode
- [ ] Monday-Friday only.
- [ ] Valid start times are every 30 minutes.
- [ ] First slot starts at `09:00:00.000Z`.
- [ ] Last slot starts at `16:30:00.000Z`.
- [ ] Slot end is always start + 30 minutes.
- [ ] Past slots return unavailable in generated availability.
- [ ] `weekStart` normalizes to the Monday of the requested week.

### Suggested Utility Behavior

```js
const SLOT_DURATION_MINUTES = 30;
const BUSINESS_START_HOUR = 9;
const BUSINESS_END_HOUR = 17;
const BOOKABLE_WEEKDAYS = [1, 2, 3, 4, 5];
```

Use `Date.UTC(year, month, day, hour, minute, 0, 0)` when constructing slots.

### Backend Tests for This Phase
Add focused utility coverage inside `server/tests/booking.test.js` or a separate utility test if the repo style supports it.

Test cases:
- [ ] Monday normalization works when input is Monday.
- [ ] Monday normalization works when input is midweek.
- [ ] Generated week contains exactly 5 days.
- [ ] Each day contains 16 slots.
- [ ] First label is `09:00`.
- [ ] Last label is `16:30`.
- [ ] Weekend dates are invalid.
- [ ] `17:00` start is invalid.

---

## Phase 2: Booking Model

### Goal
Persist bookings with duplicate protection at the database level.

### Tasks
- [ ] Create `server/models/Booking.js`.
- [ ] Add fields:
  - `name`
  - `email`
  - `company`
  - `message`
  - `slotStart`
  - `slotEnd`
  - `status`
- [ ] Add timestamps.
- [ ] Add unique partial index on `{ slotStart: 1 }` for active `booked` records.

### Important Details
- Keep `email` lowercase and trimmed.
- Default `company` and `message` to empty strings.
- Default `status` to `booked`.
- Use partial unique index so future cancelled records do not block a slot forever.

### Risk
Mongo unique indexes are enforced only when indexes exist. In tests and startup, ensure the model index is built. Duplicate booking logic should also check manually before save, then still handle duplicate key errors from Mongo as the final race-condition defense.

---

## Phase 3: Public Booking API

### Goal
Expose availability and create-booking endpoints.

### Files
- `server/controllers/bookingController.js`
- `server/routes/bookingRoutes.js`
- `server/app.js`

### Routes
- [ ] `GET /api/bookings/availability`
- [ ] `POST /api/bookings`

### GET /api/bookings/availability
Implementation steps:
- [ ] Read `weekStart` from query.
- [ ] Validate/normalize it with `getWeekMonday`.
- [ ] Query active bookings for that week:
  - `slotStart >= weekMonday`
  - `slotStart < nextWeekMonday`
  - `status: "booked"`
- [ ] Convert booked `slotStart` values into a `Set` of ISO strings.
- [ ] Call `generateWeekSlots`.
- [ ] Return:

```json
{
  "success": true,
  "timezone": "GMT",
  "slotDurationMinutes": 30,
  "days": []
}
```

Error handling:
- [ ] Invalid `weekStart` returns HTTP `400`.
- [ ] Unexpected errors flow to the centralized Express error handler.

### POST /api/bookings
Implementation steps:
- [ ] Validate `name`, `email`, and `slotStart`.
- [ ] Parse `slotStart` into a Date.
- [ ] Reject invalid dates.
- [ ] Reject non-bookable slots using `isValidBookableSlot`.
- [ ] Reject past slots.
- [ ] Compute `slotEnd` with `getSlotEnd`.
- [ ] Check for existing active booking with same `slotStart`.
- [ ] Save booking.
- [ ] Catch duplicate key errors and return HTTP `409`.
- [ ] Return the created booking with a sanitized response shape.

Error responses:
- [ ] HTTP `400` for invalid input.
- [ ] HTTP `409` for unavailable slot.
- [ ] No raw Mongo errors in public responses.

### Email Notification
Only implement now if the existing email utility is straightforward to reuse.

If implemented:
- [ ] Use existing `server/utils/emailService.js`.
- [ ] Add optional `BOOKING_NOTIFY_EMAIL` to `.env.example`.
- [ ] Do not fail the booking if email sending fails.
- [ ] Log notification failure server-side.

If deferred:
- [ ] Leave a small controller TODO or plan note only if acceptable.
- [ ] Do not add unused env vars.

---

## Phase 4: Admin Booking API

### Goal
Allow authenticated admins to view booked calls.

### Files
- `server/controllers/adminDashboardController.js`
- `server/routes/adminRoutes.js`

### Tasks
- [ ] Import `Booking`.
- [ ] Add `getBookings`.
- [ ] Support optional query filters:
  - `status`
  - `from`
  - `to`
- [ ] Sort newest upcoming or created bookings consistently. Recommended: `slotStart: 1` for upcoming calls.
- [ ] Return only:
  - `id`
  - `name`
  - `email`
  - `company`
  - `message`
  - `slotStart`
  - `slotEnd`
  - `status`
  - `createdAt`
- [ ] Register `GET /api/admin/bookings` behind `requireAdminAuth`.

### Admin Test Cases
- [ ] Unauthenticated request returns `401`.
- [ ] Authenticated request returns bookings.
- [ ] Date filters constrain results.

---

## Phase 5: Backend Test Pass

### Goal
Lock backend behavior before building UI against it.

### Test Coverage
In `server/tests/booking.test.js`, cover:
- [ ] Availability returns Monday-Friday only.
- [ ] Availability returns slots from `09:00` to `16:30`.
- [ ] Booked slots return `available: false`.
- [ ] Past slots return `available: false`.
- [ ] `POST /api/bookings` rejects weekend slots.
- [ ] `POST /api/bookings` rejects outside-hours slots.
- [ ] `POST /api/bookings` rejects non-30-minute boundaries.
- [ ] `POST /api/bookings` rejects duplicate slots with `409`.
- [ ] `POST /api/bookings` creates a valid booking.
- [ ] `GET /api/admin/bookings` requires auth.

### Run

```bash
npm test
```

Only move to frontend once the backend contract is stable.

---

## Phase 6: Frontend API Layer

### Goal
Add booking server-state access using the shared API client.

### Files
- `client/src/services/bookingService.js`
- `client/src/hooks/queries/useBookingAvailability.js`
- `client/src/hooks/mutations/useCreateBooking.js`

### Service Functions

```js
export const getBookingAvailability = async (weekStart) => {
  const { data } = await api.get("/bookings/availability", {
    params: { weekStart },
  });
  return data;
};

export const createBooking = async (payload) => {
  const { data } = await api.post("/bookings", payload);
  return data;
};
```

Confirm the shared client base URL already includes `/api` through `VITE_API_URL`; if not, match existing service conventions in the repo.

### Query Hook
- [ ] Query key: `["bookingAvailability", weekStart]`.
- [ ] Enabled only when `weekStart` exists.
- [ ] Use `staleTime` short enough for availability. Recommended: `30 * 1000`.
- [ ] Refetch after successful booking.

### Mutation Hook
- [ ] Wrap `createBooking`.
- [ ] On success, invalidate `["bookingAvailability"]`.
- [ ] Let components handle `409` conflict messaging.

---

## Phase 7: Frontend Date Helpers

### Goal
Keep calendar behavior consistent and testable.

### Recommended Location
Use a small local helper module if needed:
- `client/src/pages/BookCall/bookCallDateUtils.js`

### Tasks
- [ ] Compute current week Monday in UTC/GMT.
- [ ] Format `weekStart` as `YYYY-MM-DD`.
- [ ] Format slot labels and accessible labels with GMT.
- [ ] Determine whether previous-week navigation should be disabled.

Keep helper logic small. The backend remains the final validator.

---

## Phase 8: Booking Page Shell

### Goal
Add the public route and page-level state.

### File
- `client/src/pages/BookCall/BookCall.jsx`
- `client/src/pages/BookCall/book-call.styles.scss`
- `client/src/App.jsx`

### Tasks
- [ ] Create page with one `h1`.
- [ ] Track local UI state:
  - `weekStart`
  - `selectedSlot`
  - `bookingSuccess`
- [ ] Fetch availability through `useBookingAvailability(weekStart)`.
- [ ] Pass availability state to `BookingCalendar`.
- [ ] Pass `selectedSlot` and mutation state to `BookingForm`.
- [ ] Add route:

```jsx
<Route path="/book-a-call" element={<BookCall />} />
```

### Layout
Desktop:
- [ ] Two-column CSS Grid.
- [ ] Calendar area is wider than form area.
- [ ] Use contained layout, not full-screen hero styling.

Mobile:
- [ ] Single column.
- [ ] No horizontal scrolling.
- [ ] Calendar remains usable with stacked day sections or a segmented day control.

---

## Phase 9: Booking Calendar Component

### Goal
Render availability and enforce disabled slot selection in the UI.

### File
- `client/src/components/BookingCalendar/BookingCalendar.jsx`
- `client/src/components/BookingCalendar/booking-calendar.styles.scss`

### Props

```js
{
  days,
  isLoading,
  isError,
  error,
  selectedSlot,
  onSelectSlot,
  weekLabel,
  onPreviousWeek,
  onNextWeek,
  isPreviousDisabled
}
```

### UI States
- [ ] Loading skeleton matching calendar dimensions.
- [ ] Error state with retry affordance if available.
- [ ] Empty state when no slots are available.
- [ ] Available slot.
- [ ] Selected slot.
- [ ] Unavailable slot.

### Accessibility
- [ ] Calendar wrapper uses `section` and `aria-labelledby`.
- [ ] Slot buttons include explicit accessible labels.
- [ ] Selected slot uses `aria-pressed="true"`.
- [ ] Unavailable slots use `disabled`.
- [ ] Unavailable slots should not call `onSelectSlot`.
- [ ] Week navigation buttons have clear labels.

### Interaction
- [ ] Available slot click selects slot.
- [ ] Selecting a different slot updates selection.
- [ ] Disabled slot click has no effect.
- [ ] Hover/active states use transform and opacity only.

---

## Phase 10: Booking Form Component

### Goal
Collect contact details and submit a selected slot.

### File
- `client/src/components/BookingForm/BookingForm.jsx`
- `client/src/components/BookingForm/booking-form.styles.scss`

### Fields
- [ ] Name, required.
- [ ] Email, required.
- [ ] Company, optional.
- [ ] Message, optional.

### Behavior
- [ ] Submit disabled until a slot, name, and email are present.
- [ ] Show selected slot summary in GMT.
- [ ] Use visible labels above inputs.
- [ ] Show helper/error text below fields.
- [ ] Show mutation loading state.
- [ ] Show HTTP `409` as "This slot is no longer available. Choose another time."
- [ ] Show generic error for other failures.
- [ ] On success, clear form and show confirmation state.

### Accessibility
- [ ] Associate field errors with fields where practical.
- [ ] Confirmation uses `role="status"`.
- [ ] Do not rely on color alone for error or disabled states.

---

## Phase 11: Navigation Integration

### Goal
Make the booking flow reachable from public navigation.

### Files
- `client/src/components/Header/Header.jsx`
- `client/src/components/SideNav/SideNav.jsx`
- `client/src/Pages/Contact/Contact.jsx`

### Tasks
- [ ] Change primary header CTA from `/contact` to `/book-a-call` if product direction allows.
- [ ] Keep Contact available as a regular route or secondary link.
- [ ] Add matching mobile navigation link in `SideNav`.
- [ ] Add a secondary booking link on Contact if useful.

### Copy
Use direct labels:
- `Book a Call`
- `Contact`

Avoid explanatory UI text that describes how the interface works.

---

## Phase 12: Frontend Styling and Design QA

### Goal
Deliver a restrained, usable scheduling interface that fits the existing site.

### Styling Rules
- [ ] Use SCSS for this feature unless the app is migrated to Tailwind first.
- [ ] Do not mix Tailwind into the booking feature.
- [ ] Use one accent color for selected slots and primary action.
- [ ] Avoid decorative gradients and oversized hero composition.
- [ ] Keep weekday/slot dimensions stable across states.
- [ ] Use CSS Grid for desktop layout.
- [ ] Use mobile single-column layout below tablet widths.
- [ ] Avoid `h-screen`.

### Design Skill Pre-flight
- [ ] Global state is not used for booking availability or form data.
- [ ] Server state uses TanStack Query.
- [ ] Mobile layout collapses cleanly.
- [ ] Full-height sections do not use `h-screen`.
- [ ] Loading, empty, error, disabled, selected, conflict, and success states exist.
- [ ] Cards are used only for functional grouping.
- [ ] Animations are transform/opacity only and do not shift layout.

---

## Phase 13: Frontend Tests

### Goal
Verify the booking UI behavior without relying on the live backend.

### File
- `client/test/BookCall.test.jsx`

### Test Strategy
Use React Testing Library with mocked service/hook responses, following existing test setup.

### Test Cases
- [ ] Page renders `Book a Call`.
- [ ] Loading skeleton renders while availability is loading.
- [ ] Available slot can be selected.
- [ ] Unavailable slot is disabled.
- [ ] Unavailable slot cannot be selected.
- [ ] Submit button is disabled without selected slot.
- [ ] Submit button is disabled without required fields.
- [ ] Submit button enables with selected slot, name, and email.
- [ ] Conflict error renders on `409`.
- [ ] Confirmation state renders after success.

### Run

```bash
npm run test:client
```

---

## Phase 14: End-to-End Manual QA

### Goal
Check the complete behavior in a browser.

### Setup
Run:

```bash
npm run dev
```

### Manual Checks
- [ ] `/book-a-call` loads.
- [ ] Header CTA opens booking page.
- [ ] Week controls work.
- [ ] Past slots are disabled.
- [ ] Weekend slots do not render.
- [ ] Unavailable slot cannot be selected by mouse.
- [ ] Unavailable slot cannot be selected by keyboard.
- [ ] Available slot selection updates summary.
- [ ] Form submits a valid booking.
- [ ] Submitted slot becomes unavailable after refresh/refetch.
- [ ] Duplicate booking returns conflict state.
- [ ] Mobile viewport has no horizontal scrolling.
- [ ] Text does not overflow controls.
- [ ] Admin bookings endpoint is protected.

---

## Phase 15: Final Verification

Run:

```bash
npm test
npm run test:client
npm run build --prefix client
```

Expected:
- Backend tests pass.
- Frontend tests pass.
- Client production build passes.
- No new hard-coded API URLs are introduced.
- No secrets are added.

If any existing unrelated test fails, record the failure clearly and separate it from booking-feature regressions.

---

## Implementation Slices

### Slice 1: Backend Contract
- Slot utility
- Booking model
- Public routes
- Backend tests

Exit criteria:
- `npm test` passes for booking tests.
- API response shape matches spec.

### Slice 2: Admin Visibility
- Admin bookings controller
- Admin route
- Admin tests

Exit criteria:
- Unauthenticated admin bookings request is rejected.
- Authenticated admin can read sanitized booking records.

### Slice 3: Frontend Data Layer
- Booking service
- Query hook
- Mutation hook
- Date helpers

Exit criteria:
- Hooks use shared API client and TanStack Query.
- No component contains API calls.

### Slice 4: Booking UI
- Page shell
- Calendar component
- Form component
- SCSS
- Route registration

Exit criteria:
- `/book-a-call` route works.
- All required UI states are present.

### Slice 5: Navigation and QA
- Header/mobile nav links
- Contact page link if appropriate
- Frontend tests
- Manual browser pass

Exit criteria:
- Booking page is reachable.
- Tests and build pass.

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Duplicate bookings from simultaneous users | Use both manual availability check and Mongo unique partial index. |
| Timezone drift | Use UTC date methods only and label all UI as GMT. |
| Frontend stale availability | Invalidate availability query after successful booking and handle `409` conflict. |
| Inconsistent folder casing | Prefer `client/src/pages/BookCall`, but ensure imports match exact path. |
| Existing API client fallback violates project rule | Do not introduce new hard-coded URLs; consider separate cleanup for `client/src/lib/api.js`. |
| Disabled slots still reachable by keyboard | Use actual `disabled` buttons for unavailable slots. |
| Layout breaks on mobile | Use single-column layout and stable slot dimensions below tablet widths. |

---

## Definition of Done

- [ ] `_spec/book-a-call-spec.md` requirements are implemented.
- [ ] `/book-a-call` exists and is linked from public navigation.
- [ ] Backend validates all booking rules independently of the frontend.
- [ ] Duplicate slots are rejected with HTTP `409`.
- [ ] Availability endpoint accurately marks unavailable slots.
- [ ] Admin bookings endpoint is protected and returns sanitized data.
- [ ] Frontend uses `client/src/lib/api.js`, `services/`, and TanStack Query hooks.
- [ ] UI includes loading, empty, error, disabled, selected, conflict, and success states.
- [ ] Accessibility requirements are met for labels, slot buttons, disabled states, and confirmation.
- [ ] `npm test` passes.
- [ ] `npm run test:client` passes.
- [ ] `npm run build --prefix client` passes.
