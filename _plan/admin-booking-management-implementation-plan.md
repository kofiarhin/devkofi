# Admin Booking Management Implementation Plan

## Objective
Implement the admin booking management feature described in `_spec/admin-booking-management-spec.md`.

Admins should be able to view, filter, inspect, edit/reschedule, cancel, and delete Book a Call bookings from the protected admin dashboard. The backend remains the source of truth for booking validity, slot conflicts, status transitions, and deletion.

---

## Constraints And Existing Decisions
- Keep backend flat under `server/`; do not introduce `server/src/`.
- Keep admin routes under `/api/admin/*` and protect booking management routes with `requireAdminAuth`.
- Reuse the existing `Booking` model and its partial unique index for active `booked` slots.
- Reuse existing booking slot utilities in `server/utils/bookingSlots.js`; do not duplicate slot validation rules.
- Use `client/src/lib/api.js` through `client/src/services/adminService.js` for all frontend API calls.
- Use TanStack Query for booking server state.
- Do not store booking data in Redux.
- Follow existing admin SCSS module styling for this area.
- Apply the admin dashboard visual language: dark zinc surfaces, lime accent, compact operational tables, no marketing hero, no decorative gradients.
- No new third-party dependency is expected for this feature.

---

## Implementation Slices

### Slice 1: Backend Admin Booking API

Files:
- `server/controllers/adminDashboardController.js`
- `server/routes/adminRoutes.js`
- `server/utils/bookingSlots.js`, only if an existing helper needs a small export or reuse adjustment

Tasks:
1. Extend booking serialization.
   - Ensure `toBookingRow(booking)` returns:
     - `id`
     - `name`
     - `email`
     - `company`
     - `message`
     - `slotStart`
     - `slotEnd`
     - `status`
     - `createdAt`
     - `updatedAt`
   - Do not expose `__v`.

2. Add reusable admin booking helpers.
   - `isValidObjectId(id)`
   - `parseBookingFilters(query)`
   - `buildBookingQuery(filters)`
   - `normalizeBookingPatch(body)`
   - `findActiveSlotConflict({ bookingId, slotStart })`
   - `isDuplicateKeyError(error)`

3. Extend `getBookings`.
   - Support `page`, `limit`, `status`, `from`, `to`, and `search`.
   - Default `page=1`, `limit=20`.
   - Clamp `limit` between `1` and `100`.
   - Accept `status=booked`, `status=cancelled`, `status=all`, or omitted.
   - Reject invalid status with `400`.
   - Reject invalid `from` or `to` with `400`.
   - Search against `name`, `email`, and `company` with a case-insensitive regex.
   - Return `{ bookings, page, limit, total }`.

4. Add `getBookingById`.
   - Validate ObjectId.
   - Return `400` for invalid ID.
   - Return `404` for missing booking.
   - Return normalized booking data.

5. Add `updateBooking`.
   - Validate ObjectId.
   - Load existing booking.
   - Accept partial updates for `name`, `email`, `company`, `message`, `slotStart`, and `status`.
   - Trim text fields.
   - Lowercase and trim email.
   - Reject empty `name` when supplied.
   - Reject invalid email when supplied.
   - Reject invalid `status`.
   - If `slotStart` changes or booking becomes active `booked`, validate:
     - valid date
     - future date
     - weekday
     - 30-minute boundary
     - 09:00 through 16:30 GMT start time
   - Recompute `slotEnd` when `slotStart` changes.
   - Allow the booking to keep its current active slot.
   - Reject conflicts with another active booked record using `409`.
   - Catch duplicate key errors and return `409`.

6. Add `cancelBooking`.
   - Validate ObjectId.
   - Return `404` if missing.
   - Set status to `cancelled`.
   - Return normalized booking.
   - Keep cancellation idempotent: cancelling an already cancelled booking returns success.

7. Add `deleteBooking`.
   - Validate ObjectId.
   - Return `404` if missing.
   - Delete document.
   - Return `{ success: true }`.

8. Register routes in `server/routes/adminRoutes.js`.
   - `GET /bookings`
   - `GET /bookings/:bookingId`
   - `PATCH /bookings/:bookingId`
   - `PATCH /bookings/:bookingId/cancel`
   - `DELETE /bookings/:bookingId`
   - Ensure all are behind `requireAdminAuth`.

Expected checkpoint:
- Admin booking API supports list/detail/update/cancel/delete.
- Existing public booking routes keep working unchanged.

---

### Slice 2: Backend Tests

Files:
- `server/tests/admin.test.js`
- Optionally `server/tests/adminBookings.test.js` if keeping the admin test file readable requires a split

Tasks:
1. Import `Booking` into the admin test setup.
2. Seed at least two bookings:
   - One active `booked`.
   - One `cancelled`.
3. Clean seeded bookings in `afterAll`.
4. Add list tests.
   - Unauthenticated list returns `401`.
   - Authenticated list returns `bookings`, `page`, `limit`, and `total`.
   - Status filter returns only matching bookings.
   - `status=all` returns both active and cancelled bookings.
   - Invalid status returns `400`.
   - Invalid `from` or `to` returns `400`.
   - Search matches name, email, or company.
5. Add detail tests.
   - Authenticated detail returns one booking.
   - Invalid ObjectId returns `400`.
   - Missing valid ObjectId returns `404`.
   - Unauthenticated detail returns `401`.
6. Add update tests.
   - Updates name, email, company, and message.
   - Lowercases email.
   - Reschedules to a valid future GMT slot and recomputes `slotEnd`.
   - Allows keeping the same active slot.
   - Rejects weekend slots.
   - Rejects outside-hours slots.
   - Rejects past slots.
   - Rejects duplicate active slots with `409`.
   - Reactivates a cancelled booking only when slot is valid and unoccupied.
   - Unauthenticated update returns `401`.
7. Add cancel tests.
   - Cancels active booking.
   - Cancelling already cancelled booking returns success.
   - Cancelled booking no longer blocks its slot for public booking creation.
   - Unauthenticated cancel returns `401`.
8. Add delete tests.
   - Deletes a booking.
   - Missing booking returns `404`.
   - Invalid ObjectId returns `400`.
   - Unauthenticated delete returns `401`.

Verification:

```bash
npm test
```

Expected checkpoint:
- Backend behavior is locked before frontend work depends on it.

---

### Slice 3: Frontend Admin Services And Hooks

Files:
- `client/src/services/adminService.js`
- `client/src/hooks/queries/useAdminBookings.js`
- `client/src/hooks/queries/useAdminBooking.js`
- `client/src/hooks/mutations/useUpdateBooking.js`
- `client/src/hooks/mutations/useCancelBooking.js`
- `client/src/hooks/mutations/useDeleteBooking.js`

Tasks:
1. Extend `adminService`.
   - Add `getBookings(params)`.
   - Add `getBookingById(bookingId)`.
   - Add `updateBooking(bookingId, payload)`.
   - Add `cancelBooking(bookingId)`.
   - Add `deleteBooking(bookingId)`.
   - Keep all calls through the shared `api` client.

2. Add `useAdminBookings(filters)`.
   - Use `useQuery`.
   - Include filters in query key.
   - Enable only when `state.auth.admin` exists.
   - Return API response shape consistently with existing hooks.

3. Add `useAdminBooking(bookingId)`.
   - Use `useQuery`.
   - Query key: `['adminBooking', bookingId]`.
   - Enable only when admin exists and `bookingId` is present.

4. Add mutation hooks.
   - `useUpdateBooking()`
   - `useCancelBooking()`
   - `useDeleteBooking()`
   - Invalidate `['adminBookings']` after success.
   - Invalidate `['adminBooking', bookingId]` after update/cancel.
   - Remove or invalidate booking detail cache after delete.

Expected checkpoint:
- Frontend has a clean API layer ready for UI integration.

---

### Slice 4: Admin Bookings UI Components

Files:
- `client/src/Pages/AdminDashboard/AdminDashboard.jsx`
- `client/src/Pages/AdminDashboard/AdminDashboard.module.scss`
- Prefer adding:
  - `client/src/components/AdminBookings/AdminBookingsTab.jsx`
  - `client/src/components/AdminBookings/AdminBookingDetails.jsx`
  - `client/src/components/AdminBookings/AdminBookingEditForm.jsx`
  - `client/src/components/AdminBookings/AdminBookingFilters.jsx`
  - `client/src/components/AdminBookings/admin-bookings.module.scss`

Tasks:
1. Create formatting utilities inside the component module or a small local helper.
   - Format booking date as GMT.
   - Format booking time range as GMT.
   - Build date input values from ISO dates.
   - Build ISO `slotStart` from date input plus GMT time.
   - Generate time options from `09:00` to `16:30` in 30-minute increments.

2. Add `Bookings` tab to `AdminDashboard`.
   - Recommended tab order:
     - `Bookings`
     - `Contact Messages`
     - `Newsletter Subscribers`
   - Make tab state resilient if the tab order changes.

3. Build `AdminBookingFilters`.
   - Status select or segmented control: `All`, `Booked`, `Cancelled`.
   - Search input.
   - Date range inputs.
   - Reset filters button.
   - Keep filter state local to the bookings tab.
   - Pass filters to `useAdminBookings`.

4. Build booking table.
   - Columns:
     - Date
     - Time
     - Name
     - Email
     - Company
     - Status
     - Created
     - Actions
   - Actions:
     - View
     - Edit
     - Cancel
     - Delete
   - Disable or hide cancel for cancelled records.
   - Use fixed-height action buttons so rows do not shift.

5. Build loading, empty, and error states.
   - Loading should use skeleton table rows sized like real rows.
   - Empty state: `No bookings found`.
   - Error state: inline block with retry button.

6. Add pagination.
   - Reuse existing `Pagination` pattern where practical.
   - Keep page state inside bookings tab.
   - Reset page to `1` when filters change.

Expected checkpoint:
- Admin can browse and filter bookings in the dashboard.

---

### Slice 5: Detail, Edit, Cancel, And Delete Interactions

Files:
- Same frontend component files as Slice 4

Tasks:
1. Add details panel or modal.
   - Use local state for selected booking ID.
   - Fetch detail with `useAdminBooking`.
   - Show name, email, company, message, slot start/end, status, created, updated.
   - Include close button with accessible label.
   - Include View, Edit, Cancel, Delete flows in one controlled panel state.

2. Add edit form.
   - Fields:
     - Name
     - Email
     - Company
     - Message
     - Status
     - Slot date
     - Slot time
   - Labels above inputs.
   - Inline validation for required name/email and valid date/time selection.
   - Show helper text: `Bookings are scheduled in GMT.`
   - Disable save while pending.
   - Preserve entered values when backend rejects save.
   - Show backend validation/conflict error with `role="alert"`.

3. Add cancel confirmation.
   - Confirmation copy includes booking name and GMT slot.
   - Confirm button: `Cancel booking`.
   - Secondary button: `Keep booking`.
   - Disable confirm while pending.
   - On success, return to details or close panel and refresh list.

4. Add delete confirmation.
   - Confirmation copy states deletion is permanent.
   - Confirm button: `Delete booking`.
   - Secondary button: `Keep booking`.
   - Disable confirm while pending.
   - On success, close panel and refresh list.

5. Add success and mutation feedback.
   - Use concise status text for successful save/cancel.
   - Use `role="status"` for non-error completion feedback where practical.

Expected checkpoint:
- Admin can complete all required booking actions from the UI.

---

### Slice 6: Frontend Styling And Accessibility Pass

Files:
- `client/src/Pages/AdminDashboard/AdminDashboard.module.scss`
- `client/src/components/AdminBookings/admin-bookings.module.scss`, if extracted
- `client/src/Pages/AdminDashboard/AdminDashboard.jsx`
- Admin booking component files

Tasks:
1. Match existing admin dashboard styling.
   - Reuse dark zinc variables.
   - Reuse lime accent.
   - Use compact table spacing.
   - Avoid nested cards inside the existing dashboard card.

2. Responsive behavior.
   - Keep page width within existing admin layout.
   - Allow table wrapper to scroll horizontally on narrow screens.
   - Keep filters wrapping cleanly.
   - Avoid viewport-height assumptions.

3. Interaction states.
   - Hover states use color, border, opacity, or transform only.
   - Active button state can use a small `translateY(1px)`.
   - Disabled controls have visible disabled styling.

4. Accessibility checks.
   - Use one page `h1`, already existing in dashboard.
   - If using tab semantics, add `role="tablist"`, `role="tab"`, and `aria-selected`.
   - Panel/modal has accessible title.
   - Close buttons have labels.
   - Confirmation controls are keyboard reachable.
   - Form labels are visible.
   - Errors use `role="alert"`.
   - Success status uses `role="status"` where appropriate.

Frontend pre-flight matrix:
- [ ] Global state is not used for booking server data.
- [ ] Server state uses TanStack Query hooks.
- [ ] Mobile layout avoids horizontal page overflow; the table can scroll inside its wrapper.
- [ ] Full-height sections do not use `h-screen`.
- [ ] Loading, empty, error, disabled, saving, cancelling, deleting, conflict, and success states exist.
- [ ] Cards are used only for the existing dashboard shell or modal/panel surfaces.
- [ ] Animations are limited to transform and opacity transitions.

Expected checkpoint:
- Admin booking UI is functional, accessible, and visually consistent with the existing dashboard.

---

### Slice 7: Frontend Tests

Files:
- `client/test/admin/AdminDashboard.test.jsx`
- Add if extracted:
  - `client/test/admin/AdminBookingsTab.test.jsx`
  - `client/test/admin/AdminBookingEditForm.test.jsx`

Tasks:
1. Mock new hooks.
   - `useAdminBookings`
   - `useAdminBooking`
   - `useUpdateBooking`
   - `useCancelBooking`
   - `useDeleteBooking`

2. Update existing dashboard tests for new default tab order.
   - If `Bookings` becomes the default tab, update contact/subscriber tests to click their tabs before assertions.

3. Add bookings list tests.
   - Bookings tab renders.
   - Table shows booking row data.
   - Loading skeleton renders.
   - Empty state renders.
   - Error state renders with retry action.

4. Add filter tests.
   - Status filter updates visible query state or calls hook with new filters on rerender.
   - Search input updates filters.
   - Date range inputs update filters.
   - Reset clears filters.

5. Add details tests.
   - View action opens details.
   - Details show name, email, company, message, slot, status, created, updated.
   - Close action closes details.

6. Add edit tests.
   - Edit action opens form.
   - Fields are prefilled from selected booking.
   - Required validation prevents empty name/email save.
   - Save calls update mutation with normalized payload.
   - Backend conflict error is rendered.

7. Add cancel/delete tests.
   - Cancel action opens confirmation.
   - Confirm calls cancel mutation.
   - Cancelled booking does not expose an enabled cancel action.
   - Delete action opens permanent delete confirmation.
   - Confirm calls delete mutation.

Verification:

```bash
npm run test:client
```

Expected checkpoint:
- Frontend behavior is covered without relying on a live backend.

---

### Slice 8: Full Verification And Cleanup

Tasks:
1. Run backend tests.

```bash
npm test
```

2. Run frontend tests.

```bash
npm run test:client
```

3. Run frontend lint if the changed code is broad enough to justify it.

```bash
cd client && npm run lint
```

4. Optional manual smoke test.
   - Start app:

```bash
npm run dev
```

   - Log in as admin.
   - Open `/admin/dashboard`.
   - Verify:
     - Bookings tab loads.
     - Filtering works.
     - Detail panel opens.
     - Edit handles success and conflict.
     - Cancel changes status.
     - Delete removes row.

5. Inspect git diff.

```bash
git diff --stat
git diff
```

Expected checkpoint:
- Feature passes automated checks and is ready for review.

---

## Suggested Commit Breakdown
1. `add admin booking api`
2. `test admin booking management api`
3. `add admin booking hooks`
4. `add admin booking dashboard ui`
5. `test admin booking dashboard`

Keep commits smaller if implementation reveals a natural split.

---

## Risks And Mitigations

### Risk: Slot conflict race conditions
Mitigation:
- Keep the existing partial unique index.
- Pre-check conflicts for friendly errors.
- Catch duplicate key errors and return `409`.

### Risk: Timezone drift in admin edit form
Mitigation:
- Treat booking slots as GMT/UTC.
- Build ISO strings manually from date and time inputs using UTC semantics.
- Display slot labels with `timeZone: 'UTC'` or deterministic UTC formatting.

### Risk: Admin dashboard component becomes too large
Mitigation:
- Extract booking UI into `client/src/components/AdminBookings/`.
- Keep `AdminDashboard.jsx` responsible for shell and tab selection only.

### Risk: Existing dashboard tests break because default tab changes
Mitigation:
- Update tests to select the relevant tab explicitly.
- Keep tab labels stable.

### Risk: Destructive delete action is too easy to trigger
Mitigation:
- Require explicit confirmation dialog.
- Use clear permanent deletion copy.
- Do not trigger deletion directly from the first Delete button.

---

## Definition Of Done
- Backend admin booking routes support list, detail, update, cancel, and delete.
- Every admin booking route requires authentication.
- Backend preserves all booking slot rules during admin edits.
- Active slot conflicts return `409`.
- Admin dashboard has a usable `Bookings` tab.
- Admin can view, edit/reschedule, cancel, and delete bookings.
- UI includes loading, empty, error, saving, cancelling, deleting, conflict, and success states.
- Booking server data is handled by TanStack Query, not Redux.
- No frontend API URLs are hard-coded.
- `npm test` passes.
- `npm run test:client` passes.
