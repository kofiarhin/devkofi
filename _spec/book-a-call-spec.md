# Book a Call Feature Implementation Spec

## Goal
Add a public "Book a Call" feature where visitors can select an available weekday time slot between 9:00 AM and 5:00 PM GMT and submit their contact details.

Unavailable slots must be visible but not selectable. Booking must be validated on the backend so two users cannot book the same slot.

---

## Scope
- Public booking page or section
- Weekday calendar view, Monday through Friday only
- GMT booking hours from 09:00 through 17:00
- Slot availability fetched from the backend
- Booking creation endpoint
- Admin visibility for booked calls
- Tests for availability, validation, and booking behavior

Out of scope for this pass:
- Payment
- Video call provider integration
- User accounts
- Calendar sync with Google/Outlook
- Rescheduling and cancellation links

---

## Product Behavior

### Public User Flow
1. User opens the booking page.
2. User sees the current booking week with Monday-Friday columns.
3. User can move to the next or previous week.
4. Slots are shown in GMT.
5. Available slots can be selected.
6. Unavailable slots are disabled and cannot be selected.
7. After selecting a slot, user enters:
   - Name
   - Email
   - Optional company/project context
   - Optional message
8. User submits the booking.
9. Backend re-checks availability before saving.
10. User sees a confirmation state with the selected date/time in GMT.

### Slot Rules
- Time zone: GMT for all storage, display, and validation in this first version.
- Bookable days: Monday, Tuesday, Wednesday, Thursday, Friday.
- Bookable hours: 09:00 to 17:00 GMT.
- Slot duration: 30 minutes.
- Last selectable slot starts at 16:30 GMT.
- Past slots are unavailable.
- Weekends are unavailable.
- Duplicate bookings for the same slot are rejected.

---

## Data Model

Add:

server/models/Booking.js

```js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    company: { type: String, trim: true, default: "" },
    message: { type: String, trim: true, default: "" },
    slotStart: { type: Date, required: true },
    slotEnd: { type: Date, required: true },
    status: {
      type: String,
      enum: ["booked", "cancelled"],
      default: "booked",
    },
  },
  { timestamps: true }
);

bookingSchema.index(
  { slotStart: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "booked" },
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
```

Implementation note:
- Store `slotStart` and `slotEnd` as UTC Date values that represent GMT times.
- Do not trust client-generated availability. The server is the source of truth.

---

## Backend Files

Add:
- server/models/Booking.js
- server/controllers/bookingController.js
- server/routes/bookingRoutes.js
- server/utils/bookingSlots.js
- server/tests/booking.test.js

Update:
- server/app.js
- server/controllers/adminDashboardController.js
- server/routes/adminRoutes.js

---

## Backend API

### GET /api/bookings/availability

Query:
- `weekStart=YYYY-MM-DD`

Behavior:
- `weekStart` must resolve to the Monday of the requested week.
- Generate all Monday-Friday 30-minute slots from 09:00 to 16:30 GMT.
- Mark slots unavailable when:
  - Slot is in the past
  - Existing active booking has the same `slotStart`
  - Slot is outside weekday business hours

Response:

```json
{
  "success": true,
  "timezone": "GMT",
  "slotDurationMinutes": 30,
  "days": [
    {
      "date": "2026-04-27",
      "weekday": "Monday",
      "slots": [
        {
          "slotStart": "2026-04-27T09:00:00.000Z",
          "slotEnd": "2026-04-27T09:30:00.000Z",
          "label": "09:00",
          "available": true
        }
      ]
    }
  ]
}
```

### POST /api/bookings

Body:

```json
{
  "name": "Laura Bolas",
  "email": "laura@example.com",
  "company": "Optional company",
  "message": "Optional project context",
  "slotStart": "2026-04-27T09:00:00.000Z"
}
```

Validation:
- `name` is required.
- `email` is required and must be valid enough for contact.
- `slotStart` is required.
- Slot must be Monday-Friday.
- Slot must start on a 00 or 30 minute boundary.
- Slot must be between 09:00 and 16:30 GMT.
- Slot must not be in the past.
- Slot must not already be booked.

Success response:

```json
{
  "success": true,
  "booking": {
    "id": "mongo-id",
    "name": "Laura Bolas",
    "email": "laura@example.com",
    "slotStart": "2026-04-27T09:00:00.000Z",
    "slotEnd": "2026-04-27T09:30:00.000Z",
    "status": "booked"
  }
}
```

Conflict response:

```json
{
  "success": false,
  "error": "This slot is no longer available"
}
```

Use HTTP `409` for a slot conflict.

---

## Admin API

Extend admin dashboard data with booked calls.

Add:
- `GET /api/admin/bookings`
- Optional query filters: `status`, `from`, `to`

Response should omit unnecessary sensitive data and include only:
- Booking id
- Name
- Email
- Company
- Message
- Slot start
- Slot end
- Status
- Created date

Admin routes must use `requireAdminAuth`.

---

## Slot Utility

Add:

server/utils/bookingSlots.js

Functions:
- `getWeekMonday(dateInput)`
- `isWeekday(date)`
- `isValidBookableSlot(slotStart)`
- `getSlotEnd(slotStart)`
- `generateWeekSlots(weekStart, bookedSlotStarts, now = new Date())`

Rules:
- Avoid locale-dependent parsing.
- Use explicit UTC getters/setters.
- Treat GMT as UTC for this version.
- Return consistent ISO strings.

---

## Frontend Files

Add new code under the project-rule structure where practical:
- client/src/pages/BookCall/BookCall.jsx
- client/src/pages/BookCall/book-call.styles.scss
- client/src/components/BookingCalendar/BookingCalendar.jsx
- client/src/components/BookingCalendar/booking-calendar.styles.scss
- client/src/components/BookingForm/BookingForm.jsx
- client/src/components/BookingForm/booking-form.styles.scss
- client/src/services/bookingService.js
- client/src/hooks/queries/useBookingAvailability.js
- client/src/hooks/mutations/useCreateBooking.js
- client/test/BookCall.test.jsx

Compatibility note:
- The repo currently has legacy `client/src/Pages/`. Prefer the new lowercase `client/src/pages/` for this feature, but keep imports consistent with the actual file path used by the implementation.
- Existing UI areas use SCSS. Use SCSS for this feature unless the repo is migrated to Tailwind first. Do not mix Tailwind into this feature if SCSS remains the local convention.

---

## Frontend Routing

Update:
- client/src/App.jsx

Add route:

```jsx
<Route path="/book-a-call" element={<BookCall />} />
```

Update navigation where appropriate:
- Header CTA should point to `/book-a-call`.
- Existing contact page can include a secondary link to `/book-a-call`.

---

## Frontend API Rules

All booking API calls must go through:
- client/src/lib/api.js
- client/src/services/bookingService.js

Do not call Axios directly from components.

Do not hard-code `http://localhost:5000` in new booking code.

Required service functions:

```js
export const getBookingAvailability = async (weekStart) => {};
export const createBooking = async (payload) => {};
```

Required hooks:
- `useBookingAvailability(weekStart)`
- `useCreateBooking()`

Use TanStack Query for server state.

---

## UI Requirements

### Page Layout
- Public page title: "Book a Call"
- Short supporting copy: "Choose a weekday slot between 9:00 AM and 5:00 PM GMT."
- Two-column desktop layout:
  - Left: calendar and week controls
  - Right: selected slot summary and booking form
- Single-column mobile layout:
  - Week controls
  - Day selector or stacked days
  - Slots
  - Form

### Calendar Controls
- Previous week button
- Next week button
- Current visible week label
- Disable previous-week navigation when all previous slots would be in the past

### Slot States
Each slot must have clear states:
- Available
- Selected
- Unavailable
- Loading skeleton
- Error state for failed availability fetch
- Empty state if no slots are available for the selected week

Unavailable slot behavior:
- Render as disabled.
- Use `disabled` on buttons.
- Include `aria-disabled="true"` when relevant.
- Do not allow keyboard selection.

### Form States
- Submit disabled until a valid slot and required fields are present.
- Loading state during booking submission.
- Inline field errors.
- Conflict state when backend returns `409`.
- Success confirmation after booking.

---

## Accessibility
- Booking page should have one `h1`.
- Calendar section should use `aria-labelledby`.
- Slot buttons must have accessible labels such as:
  - "Monday 27 April, 09:00 GMT, available"
  - "Monday 27 April, 09:00 GMT, unavailable"
- Selected slot should expose `aria-pressed="true"`.
- Disabled slots must not be focusable as active controls.
- Form inputs need visible labels above inputs.
- Error messages should be associated with fields where practical.
- Confirmation should be announced with `role="status"` or equivalent.

---

## Design Direction
Use a restrained scheduling interface, not a marketing hero.

Visual guidance:
- Favor clean grid structure over large decorative cards.
- Use compact weekday columns on desktop.
- Use segmented day controls on mobile if columns become too narrow.
- Keep GMT visible near the calendar controls and in the selected-slot summary.
- Use one accent color for selected slots and primary action.
- Avoid decorative gradients, large hero typography, and oversized cards.

Interaction guidance:
- Slot hover and active states should use transform and opacity only.
- Avoid heavy animations.
- Preserve layout dimensions so slots do not shift when selected, disabled, or loading.

---

## Email Notification
If email credentials are already configured, send a simple admin notification after successful booking using the existing email utility.

Email should include:
- Name
- Email
- Company, if present
- Message, if present
- Slot start/end in GMT

Booking must still succeed if notification sending fails. Log the email failure server-side without exposing implementation details to the user.

---

## Environment Variables
No new required environment variables are needed for the first pass.

If adding notification recipients, add:
- `BOOKING_NOTIFY_EMAIL`

Update:
- .env.example

Do not hard-code email recipients in source code.

---

## Tests

### Backend Tests
Add:
- server/tests/booking.test.js

Cover:
- Availability returns Monday-Friday only.
- Availability returns slots between 09:00 and 16:30 GMT.
- Booked slots return `available: false`.
- Past slots return `available: false`.
- POST rejects weekend slots.
- POST rejects slots outside business hours.
- POST rejects duplicate slot bookings with `409`.
- POST creates a valid booking.
- Admin bookings endpoint requires auth.

Run:

```bash
npm test
```

### Frontend Tests
Add:
- client/test/BookCall.test.jsx

Cover:
- Page renders.
- Availability loading state renders.
- Available slot can be selected.
- Unavailable slot cannot be selected.
- Submit button is disabled until valid required fields are present.
- Conflict error is shown when create booking returns `409`.
- Confirmation state renders after successful booking.

Run:

```bash
npm run test:client
```

---

## Acceptance Criteria
- `/book-a-call` route exists.
- User can view Monday-Friday GMT availability.
- User can navigate booking weeks.
- User cannot select unavailable, weekend, outside-hours, or past slots.
- Backend rejects invalid or duplicate slots.
- Successful booking is persisted in MongoDB.
- Admin can view booked calls behind auth.
- Frontend API calls use the shared API client and booking service.
- UI includes loading, empty, error, selected, disabled, and success states.
- Backend and frontend tests pass.

---

## Implementation Order
1. Add booking slot utility and backend tests for slot generation.
2. Add Booking model, controller, routes, and app route registration.
3. Add booking creation validation and duplicate-slot protection.
4. Add admin bookings endpoint.
5. Add frontend booking service and TanStack Query hooks.
6. Add BookCall page, calendar, and form components.
7. Add route and navigation links.
8. Add frontend tests.
9. Run backend and frontend test suites.

---

## Frontend Pre-flight Matrix
- [ ] Global state is not used for booking availability or form data.
- [ ] Server state uses TanStack Query hooks.
- [ ] Mobile layout collapses to a single column with no horizontal scrolling.
- [ ] Full-height sections do not use `h-screen`.
- [ ] Loading, empty, error, disabled, selected, conflict, and success states exist.
- [ ] Cards are used only where they clarify grouping.
- [ ] Any animation uses transform and opacity, with no layout-shifting slot states.
