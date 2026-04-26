# Admin Booking Management Feature Spec

## Goal
Give authenticated admins a complete management view for Book a Call bookings. Admins must be able to view, edit, cancel, and delete call bookings from the existing admin dashboard.

This extends the current booking implementation:
- Public users can already create bookings through `/api/bookings`.
- Admins can already fetch bookings through `GET /api/admin/bookings`.
- The dashboard UI does not yet expose booking management.
- The admin API does not yet support booking detail, update, cancel, or delete actions.

---

## Scope
In scope:
- Admin dashboard booking tab.
- Protected admin booking list.
- Protected admin booking detail/view experience.
- Protected admin edit/reschedule flow.
- Protected admin cancel action.
- Protected admin delete action.
- Backend validation that preserves slot booking rules.
- Frontend services, TanStack Query hooks, and mutation hooks.
- Backend and frontend tests.

Out of scope:
- Public user self-service rescheduling or cancellation.
- Calendar provider sync.
- Video meeting link generation.
- Payment logic.
- Email templates beyond optional basic notifications.
- Role levels beyond existing admin authentication.

---

## Current State

Relevant existing files:
- `server/models/Booking.js`
- `server/controllers/bookingController.js`
- `server/controllers/adminDashboardController.js`
- `server/routes/adminRoutes.js`
- `server/middleware/requireAdminAuth.js`
- `client/src/Pages/AdminDashboard/AdminDashboard.jsx`
- `client/src/Pages/AdminDashboard/AdminDashboard.module.scss`
- `client/src/services/adminService.js`
- `client/src/hooks/queries/useContactMessages.js`
- `client/src/hooks/queries/useNewsletterSubscribers.js`
- `client/src/lib/api.js`
- `client/test/admin/AdminDashboard.test.jsx`
- `server/tests/admin.test.js`
- `server/tests/booking.test.js`

Existing booking fields:
- `name`
- `email`
- `company`
- `message`
- `slotStart`
- `slotEnd`
- `status`, currently `booked` or `cancelled`
- timestamps

Existing uniqueness rule:
- Active `booked` records must be unique by `slotStart`.
- Cancelled records do not block the same time slot.

---

## Product Behavior

### Admin User Flow
1. Admin signs in through the existing admin login.
2. Admin opens `/admin/dashboard`.
3. Admin sees a new `Bookings` tab alongside `Contact Messages` and `Newsletter Subscribers`.
4. Admin can scan all bookings in a table.
5. Admin can filter bookings by status and date range.
6. Admin can open a booking detail panel or detail view.
7. Admin can edit booking details.
8. Admin can reschedule a booking to another valid available weekday GMT slot.
9. Admin can cancel a booking without deleting its historical record.
10. Admin can permanently delete a booking after confirmation.

### Booking Status Behavior
- `booked`: active booking that blocks its `slotStart`.
- `cancelled`: historical booking that no longer blocks its `slotStart`.
- Delete: permanent removal from MongoDB.

Do not add a separate `deleted` status for this pass. Delete should remove the document.

### Edit Behavior
Admin can edit:
- Name
- Email
- Company
- Message
- Slot start
- Status, only when changing between `booked` and `cancelled`

When `slotStart` changes:
- Backend must recompute `slotEnd`.
- Backend must validate that the new slot follows the same booking rules as public booking creation.
- Backend must reject duplicate active slots with `409`.
- Backend must allow keeping the same active slot for the same booking.
- Backend must allow changing a cancelled booking back to booked only if its slot is valid and unoccupied.

### Cancel Behavior
- Cancel action sets `status` to `cancelled`.
- Cancel action does not delete the booking.
- Cancelled bookings remain visible by default unless filters hide them.
- Cancelling an already cancelled booking should return the existing cancelled booking without error, or return a clear `400`. Prefer idempotent success for better admin UX.

### Delete Behavior
- Delete requires a confirmation in the UI.
- Delete removes the booking document from MongoDB.
- Delete should return `204 No Content` or `{ success: true }`. Prefer `{ success: true }` for consistency with current API style.
- Deleted bookings should disappear from the list after cache invalidation.

---

## Backend API

All routes must be mounted under existing `server/routes/adminRoutes.js` and protected with `requireAdminAuth`.

### GET `/api/admin/bookings`
Existing endpoint. Extend it to support pagination and stable filters.

Query params:
- `page`, optional, default `1`
- `limit`, optional, default `20`, max `100`
- `status`, optional, one of `booked`, `cancelled`, or `all`
- `from`, optional ISO date
- `to`, optional ISO date
- `search`, optional text matched against name, email, or company

Behavior:
- Default sort by `slotStart` ascending for upcoming bookings.
- If no `status` is provided, include all statuses.
- If `status=all`, include all statuses.
- Validate `from` and `to`.
- Validate `status`.
- Use pagination metadata consistent with other admin endpoints.

Response:

```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "mongo-id",
        "name": "Laura Bolas",
        "email": "laura@example.com",
        "company": "Devkofi",
        "message": "Project discussion",
        "slotStart": "2026-04-27T09:00:00.000Z",
        "slotEnd": "2026-04-27T09:30:00.000Z",
        "status": "booked",
        "createdAt": "2026-04-26T10:00:00.000Z",
        "updatedAt": "2026-04-26T10:00:00.000Z"
      }
    ],
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

### GET `/api/admin/bookings/:bookingId`
Fetch one booking for detail view.

Validation:
- Reject invalid Mongo ObjectId with `400`.
- Return `404` when the booking does not exist.

Response:

```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "mongo-id",
      "name": "Laura Bolas",
      "email": "laura@example.com",
      "company": "Devkofi",
      "message": "Project discussion",
      "slotStart": "2026-04-27T09:00:00.000Z",
      "slotEnd": "2026-04-27T09:30:00.000Z",
      "status": "booked",
      "createdAt": "2026-04-26T10:00:00.000Z",
      "updatedAt": "2026-04-26T10:00:00.000Z"
    }
  }
}
```

### PATCH `/api/admin/bookings/:bookingId`
Update booking fields and optionally reschedule.

Body:

```json
{
  "name": "Laura Bolas",
  "email": "laura@example.com",
  "company": "Devkofi",
  "message": "Updated context",
  "slotStart": "2026-04-28T10:30:00.000Z",
  "status": "booked"
}
```

Validation:
- Reject invalid ObjectId with `400`.
- Return `404` when booking does not exist.
- If `name` is present, it must not be empty.
- If `email` is present, it must be valid enough for contact.
- If `status` is present, it must be `booked` or `cancelled`.
- If `slotStart` is present and status is or becomes `booked`, validate weekday, time boundary, business hours, and future date.
- If changing to `cancelled`, keep existing `slotStart` and `slotEnd` unless a valid `slotStart` is also intentionally provided.
- Reject active slot conflicts with `409`.
- Recompute `slotEnd` whenever `slotStart` changes.

Response:

```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "mongo-id",
      "name": "Laura Bolas",
      "email": "laura@example.com",
      "company": "Devkofi",
      "message": "Updated context",
      "slotStart": "2026-04-28T10:30:00.000Z",
      "slotEnd": "2026-04-28T11:00:00.000Z",
      "status": "booked",
      "createdAt": "2026-04-26T10:00:00.000Z",
      "updatedAt": "2026-04-26T11:00:00.000Z"
    }
  }
}
```

### PATCH `/api/admin/bookings/:bookingId/cancel`
Cancel a booking without removing it.

Response:

```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "mongo-id",
      "status": "cancelled"
    }
  }
}
```

Implementation note:
- Return the full normalized booking object, not only `id` and `status`, if that is easier for frontend cache updates.

### DELETE `/api/admin/bookings/:bookingId`
Delete a booking permanently.

Validation:
- Reject invalid ObjectId with `400`.
- Return `404` when booking does not exist.

Response:

```json
{
  "success": true
}
```

---

## Backend Implementation Notes

### Controller Placement
Keep booking admin actions in `server/controllers/adminDashboardController.js` unless the file becomes too large. If splitting is preferred, add `server/controllers/adminBookingsController.js` and import its handlers in `server/routes/adminRoutes.js`.

Recommended handlers:
- `getBookings`
- `getBookingById`
- `updateBooking`
- `cancelBooking`
- `deleteBooking`

### Shared Helpers
Add small helper functions near existing admin controller code:
- `toBookingRow(booking)`
- `validateBookingId(bookingId)`
- `normalizeBookingPatch(body)`
- `buildBookingListQuery(query)`
- `assertNoActiveSlotConflict({ bookingId, slotStart })`

Use existing slot utilities from `server/utils/bookingSlots.js`:
- `getSlotEnd`
- `isValidBookableSlot`

Do not duplicate slot validation logic.

### Data Safety
- Never expose internal Mongoose fields such as `__v`.
- Do not expose password hashes or admin session internals.
- Keep backend as the source of truth for status, slot validity, and conflicts.
- Trim text fields.
- Lowercase and trim email.

### Concurrency
The existing partial unique index on `{ slotStart: 1 }` for active `booked` records remains required.

When updating or reactivating a booking:
- Check for conflicts before save for a helpful `409`.
- Still catch duplicate key errors and convert them to `409`, because race conditions can bypass the pre-check.

---

## Frontend API And Hooks

All frontend API calls must use `client/src/lib/api.js` through `client/src/services/adminService.js`.

Extend `client/src/services/adminService.js`:

```js
export const getBookings = (params = {}) =>
  api.get('/api/admin/bookings', { params });

export const getBookingById = (bookingId) =>
  api.get(`/api/admin/bookings/${bookingId}`);

export const updateBooking = (bookingId, payload) =>
  api.patch(`/api/admin/bookings/${bookingId}`, payload);

export const cancelBooking = (bookingId) =>
  api.patch(`/api/admin/bookings/${bookingId}/cancel`);

export const deleteBooking = (bookingId) =>
  api.delete(`/api/admin/bookings/${bookingId}`);
```

Add hooks:
- `client/src/hooks/queries/useAdminBookings.js`
- `client/src/hooks/queries/useAdminBooking.js`
- `client/src/hooks/mutations/useUpdateBooking.js`
- `client/src/hooks/mutations/useCancelBooking.js`
- `client/src/hooks/mutations/useDeleteBooking.js`

Query keys:
- `['adminBookings', filters]`
- `['adminBooking', bookingId]`

Mutation behavior:
- Invalidate `['adminBookings']` after update, cancel, or delete.
- Invalidate `['adminBooking', bookingId]` after update or cancel.
- Remove or invalidate detail cache after delete.
- Show inline mutation errors in the UI.

Do not store booking server data in Redux.

---

## Admin UI Requirements

Update:
- `client/src/Pages/AdminDashboard/AdminDashboard.jsx`
- `client/src/Pages/AdminDashboard/AdminDashboard.module.scss`

Optional extracted components:
- `client/src/components/AdminBookings/AdminBookingsTab.jsx`
- `client/src/components/AdminBookings/AdminBookingDetails.jsx`
- `client/src/components/AdminBookings/AdminBookingEditForm.jsx`
- `client/src/components/AdminBookings/AdminBookingFilters.jsx`
- `client/src/components/AdminBookings/admin-bookings.module.scss`

Prefer extraction if `AdminDashboard.jsx` becomes hard to scan.

### Dashboard Tabs
Add `Bookings` as the first tab or third tab. Recommended order:
1. `Bookings`
2. `Contact Messages`
3. `Newsletter Subscribers`

Reason:
- Bookings are operational and time-sensitive.

### Booking List
Display columns:
- Date
- Time
- Name
- Email
- Company
- Status
- Created
- Actions

Actions:
- View
- Edit
- Cancel, visible or enabled when status is `booked`
- Delete

Date/time display:
- Keep GMT visible.
- Use compact, readable labels such as `Mon 27 Apr 2026` and `09:00 GMT`.
- Do not use browser-local timezone labels for booking slots in this first pass.

### Filters
Provide:
- Status segmented control or select: `All`, `Booked`, `Cancelled`
- Date range inputs: `From`, `To`
- Search input for name, email, or company
- Reset filters action

Filtering can be server-driven through query params. Do not implement duplicate client-only filtering as the primary behavior.

### View Details
Use a side panel or modal within the dashboard.

Details must show:
- Name
- Email
- Company, if present
- Message, if present
- Slot start and end in GMT
- Status
- Created date
- Updated date

Actions inside details:
- Edit
- Cancel
- Delete

### Edit Form
Fields:
- Name, required
- Email, required
- Company, optional
- Message, optional multiline
- Slot date, required when status is `booked`
- Slot time, required when status is `booked`
- Status, `booked` or `cancelled`

UI behavior:
- Labels above inputs.
- Inline field errors below inputs.
- Save button disabled while saving.
- Show a non-field error when backend returns conflict or validation failure.
- Preserve entered values when a save fails.
- Close the panel or switch back to details after a successful save.

Slot input:
- Use the same 30-minute GMT schedule rules as the public booking flow.
- Prefer a simple date input plus time select for admin editing.
- Time options should be `09:00` through `16:30` in 30-minute increments.
- Disable or reject weekends.
- Show helper text: `Bookings are scheduled in GMT.`

### Cancel Confirmation
Before cancelling:
- Show confirmation text that names the booking and slot.
- Confirm button text: `Cancel booking`.
- Cancel button text: `Keep booking`.

After cancelling:
- Update status in the list.
- Release the slot for future bookings because the backend status becomes `cancelled`.

### Delete Confirmation
Before deleting:
- Show confirmation text that clearly says deletion is permanent.
- Confirm button text: `Delete booking`.
- Cancel button text: `Keep booking`.

After deleting:
- Remove row from the current list after cache invalidation.
- Close detail/edit panel if it was open.

---

## Frontend Design Direction

Apply the existing admin visual language:
- Dark zinc background.
- Lime accent.
- SCSS module styling.
- Dense operational table layout.
- Compact controls.
- No large marketing hero.
- No decorative gradients.
- No oversized card stacks.

Layout:
- Keep dashboard max width near the existing `1200px` unless the bookings table needs `max-width: 1400px`.
- Use table overflow for small screens.
- Keep action buttons visually stable with fixed-height controls.
- Prefer border and spacing over nested cards.

State requirements:
- Loading: skeleton rows that match the booking table columns, not a generic spinner only.
- Empty: clear message such as `No bookings found`.
- Error: inline error block with retry action.
- Saving: disable form controls and show `Saving...`.
- Cancelling: disable cancel controls and show `Cancelling...`.
- Deleting: disable delete controls and show `Deleting...`.

Accessibility:
- New tab button must expose active state through `aria-selected` if implemented as a tablist.
- Modal or side panel must have accessible title and close button.
- Confirmation dialogs must keep focus inside while open if using a modal.
- Form inputs need visible labels.
- Mutation errors should be announced with `role="alert"`.
- Detail updates can use `role="status"` for successful save/cancel messages.

---

## Backend Tests

Update or add tests under:
- `server/tests/admin.test.js`
- Optionally `server/tests/adminBookings.test.js`

Cover:
- `GET /api/admin/bookings` requires authentication.
- `GET /api/admin/bookings` returns paginated bookings.
- `GET /api/admin/bookings` filters by status.
- `GET /api/admin/bookings` rejects invalid status.
- `GET /api/admin/bookings` rejects invalid `from` or `to`.
- `GET /api/admin/bookings/:bookingId` returns one booking.
- `GET /api/admin/bookings/:bookingId` rejects invalid ObjectId.
- `GET /api/admin/bookings/:bookingId` returns `404` for missing booking.
- `PATCH /api/admin/bookings/:bookingId` updates name, email, company, and message.
- `PATCH /api/admin/bookings/:bookingId` reschedules to a valid available slot.
- `PATCH /api/admin/bookings/:bookingId` recomputes `slotEnd`.
- `PATCH /api/admin/bookings/:bookingId` rejects weekend slots.
- `PATCH /api/admin/bookings/:bookingId` rejects outside-hours slots.
- `PATCH /api/admin/bookings/:bookingId` rejects duplicate active slots with `409`.
- `PATCH /api/admin/bookings/:bookingId` can keep the booking's existing active slot.
- `PATCH /api/admin/bookings/:bookingId/cancel` sets status to `cancelled`.
- `PATCH /api/admin/bookings/:bookingId/cancel` allows the same slot to be booked later.
- `DELETE /api/admin/bookings/:bookingId` removes the booking.
- All new write routes require authentication.

Run:

```bash
npm test
```

---

## Frontend Tests

Update:
- `client/test/admin/AdminDashboard.test.jsx`

Add if components are extracted:
- `client/test/admin/AdminBookingsTab.test.jsx`
- `client/test/admin/AdminBookingEditForm.test.jsx`

Cover:
- Bookings tab renders.
- Booking table shows rows from mocked hook data.
- Loading skeleton renders.
- Empty state renders.
- Error state renders with retry action.
- Status filter changes query state.
- Search input changes query state.
- View action opens details.
- Edit action opens edit form.
- Save calls update mutation with normalized payload.
- Conflict error from update mutation is shown.
- Cancel action asks for confirmation and calls cancel mutation.
- Delete action asks for confirmation and calls delete mutation.
- Cancelled bookings do not show an enabled cancel action.

Run:

```bash
npm run test:client
```

---

## Acceptance Criteria
- Admin dashboard has a `Bookings` tab.
- Authenticated admin can view booking rows.
- Unauthenticated requests to every admin booking endpoint return `401`.
- Admin can open booking details.
- Admin can edit contact fields.
- Admin can reschedule to a valid, available GMT slot.
- Backend rejects invalid reschedules and duplicate active slots.
- Admin can cancel a booking and the status changes to `cancelled`.
- Cancelled bookings no longer block the original slot.
- Admin can delete a booking after confirmation.
- Frontend booking admin data uses TanStack Query hooks and `adminService`.
- No API URL is hard-coded in frontend code.
- UI includes loading, empty, error, saving, cancelling, deleting, and conflict states.
- Backend tests pass with `npm test`.
- Frontend tests pass with `npm run test:client`.

---

## Implementation Order
1. Add backend admin booking route handlers for detail, update, cancel, and delete.
2. Extend `GET /api/admin/bookings` with pagination, status filter validation, date filters, and search.
3. Add backend tests for all admin booking routes.
4. Extend `client/src/services/adminService.js`.
5. Add admin booking query and mutation hooks.
6. Add `Bookings` tab UI to the admin dashboard, extracting components if needed.
7. Add edit, cancel confirmation, and delete confirmation UI.
8. Add frontend tests for admin booking behavior.
9. Run backend and frontend test suites.

---

## Frontend Pre-flight Matrix
- [ ] Global state is not used for booking server data.
- [ ] Server state uses TanStack Query hooks.
- [ ] Mobile layout avoids horizontal page overflow; the table can scroll inside its wrapper.
- [ ] Full-height sections do not use `h-screen`.
- [ ] Loading, empty, error, disabled, saving, cancelling, deleting, conflict, and success states exist.
- [ ] Cards are used only for the existing dashboard shell or modal/panel surfaces.
- [ ] Animations are limited to transform and opacity transitions.
