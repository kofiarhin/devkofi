# Newsletter Subscribers Export Feature – Full Implementation Plan

**Spec:** Newsletter Subscribers Export Feature – Implementation Spec  
**Date:** 2026-04-22  
**Stack:** MERN (React + Vite, Node/Express, MongoDB, TanStack Query, Redux Toolkit)

---

## 1) Scope + Acceptance Mapping

### Required outcomes
- Admin can export newsletter subscribers from Admin Dashboard → Newsletter Subscribers tab.
- Two formats: CSV and JSON.
- Export includes fields: `email`, `subscribedAt` (`createdAt` alias).
- Export endpoints are admin-auth protected.
- UX supports idle/loading/error states.

### Direct acceptance criteria mapping
- **Export button visible** → Add dropdown button in newsletter tab UI.
- **CSV + JSON download works** → Add API service calls + blob download helper.
- **Files contain correct data** → Backend sort/transform/headers verified in tests.
- **Protected routes** → `requireAdminAuth` middleware on export routes.
- **Handles empty state** → CSV header-only + JSON empty array.
- **Shows loading + error states** → per-format loading flags + toast/error message.

---

## 2) Current Codebase Fit (What already exists)

- Admin auth + middleware already implemented (`requireAdminAuth`).
- Admin dashboard route set already mounted under `/api/admin`.
- Newsletter subscriber list endpoint exists with pagination.
- Admin dashboard newsletter tab exists in `client/src/Pages/AdminDashboard/AdminDashboard.jsx`.
- API layer (`client/src/services/adminService.js`) already centralizes admin requests.
- Backend Jest tests exist in `server/tests/admin.test.js` and can be extended.

This means the feature can be added incrementally without architecture changes.

---

## 3) Backend Plan

### Phase B1 — Add shared export transformer utilities

**Files**
- `server/controllers/adminDashboardController.js` (or extract to `server/utils/newsletterExport.js`)

**Changes**
- Add transformation helper:
  - Input: `NewsletterSubscriber[]`
  - Output shape:
    - `{ email: string, subscribedAt: string }`
  - `subscribedAt = createdAt.toISOString()`
- Keep transformation centralized to ensure CSV/JSON parity.

**Done when**
- One source of truth for export row mapping exists.

---

### Phase B2 — Implement JSON export controller

**Files**
- `server/controllers/adminDashboardController.js`

**New handler**
- `exportNewsletterSubscribersJson(req, res)`

**Behavior**
1. Query all subscribers sorted by `createdAt: -1`.
2. Transform to export shape.
3. Build filename: `newsletter-subscribers-YYYY-MM-DD.json` (UTC date).
4. Set headers:
   - `Content-Type: application/json; charset=utf-8`
   - `Content-Disposition: attachment; filename="..."`
5. Return JSON payload.

**Edge handling**
- Empty list returns `[]`.

**Done when**
- Endpoint responds with downloadable attachment and correct payload.

---

### Phase B3 — Implement CSV export controller

**Files**
- `server/controllers/adminDashboardController.js`

**New handler**
- `exportNewsletterSubscribersCsv(req, res)`

**Behavior**
1. Query all subscribers sorted by `createdAt: -1`.
2. Transform via shared helper.
3. Build CSV string:
   - Header row: `email,subscribedAt`
   - Data rows in sorted order.
4. Escape CSV safely:
   - Wrap values with quotes when needed.
   - Escape inner quotes.
5. Build filename: `newsletter-subscribers-YYYY-MM-DD.csv`.
6. Set headers:
   - `Content-Type: text/csv; charset=utf-8`
   - `Content-Disposition: attachment; filename="..."`
7. Send raw CSV text.

**Edge handling**
- Empty list returns only header row + newline.

**Done when**
- CSV opens cleanly in spreadsheet tools and matches spec.

---

### Phase B4 — Register new protected routes

**Files**
- `server/routes/adminRoutes.js`

**Add routes (protected)**
- `GET /newsletter/export/csv` → `requireAdminAuth` + CSV handler
- `GET /newsletter/export/json` → `requireAdminAuth` + JSON handler

**Done when**
- Routes are reachable only with admin auth.

---

### Phase B5 — Backend Jest coverage

**Files**
- `server/tests/admin.test.js`

**Add tests**
1. `GET /api/admin/newsletter/export/csv` authenticated:
   - status `200`
   - `Content-Type` includes `text/csv`
   - `Content-Disposition` includes `.csv`
   - body contains header `email,subscribedAt`
2. `GET /api/admin/newsletter/export/json` authenticated:
   - status `200`
   - `Content-Type` includes `application/json`
   - `Content-Disposition` includes `.json`
   - response array rows contain `email` + `subscribedAt`
3. Unauthorized checks (both endpoints):
   - no cookie → `401`
4. Empty list behavior:
   - clear `NewsletterSubscriber` collection for test case
   - CSV returns header only
   - JSON returns `[]`

**Done when**
- Tests validate type, filename, auth, empty behavior.

---

## 4) Frontend Plan

### Phase F1 — Add export API methods (service layer only)

**Files**
- `client/src/services/adminService.js`

**Add methods**
- `exportNewsletterSubscribersCsv()`
- `exportNewsletterSubscribersJson()`

**Implementation detail**
- Use `api.get(url, { responseType: 'blob' })`.
- Keep API logic outside components.

**Done when**
- Components call service methods only.

---

### Phase F2 — Add download helper utility

**Files**
- `client/src/utils/downloadFile.js` (new)

**Utility behavior**
- Accepts `{ blob, filename }`
- Creates object URL, triggers hidden anchor click, revokes URL.

**Done when**
- Download trigger logic is reusable and isolated from UI component complexity.

---

### Phase F3 — Add export UI controls + states

**Files**
- `client/src/Pages/AdminDashboard/AdminDashboard.jsx`
- `client/src/Pages/AdminDashboard/AdminDashboard.module.scss` (existing) or migrate this part to Tailwind classes in JSX if preferred

**UI changes (Newsletter tab)**
- Add “Export” button with dropdown items:
  - Export CSV
  - Export JSON
- Add local state:
  - `isExportMenuOpen`
  - `isExportingCsv`
  - `isExportingJson`
  - optional `exportError`
- Disable corresponding option while exporting.
- Button label while exporting: `Exporting...`.

**Behavior**
1. Click CSV/JSON option.
2. Call corresponding service method.
3. Read filename from `Content-Disposition`; fallback to generated local filename.
4. Pass blob + filename to download utility.
5. On failure, show toast/message and keep UI responsive.

**Done when**
- Export is one-click from menu, with loading and error feedback.

---

### Phase F4 — Frontend Vitest tests

**Files**
- `client/src/Pages/AdminDashboard/AdminDashboard.test.jsx` (new or extend existing test suite)

**Add tests**
1. Export controls render in newsletter tab.
2. Clicking CSV triggers service call and download helper.
3. Clicking JSON triggers service call and download helper.
4. Error path shows message/toast.
5. Loading state disables option and updates label.

**Test strategy**
- Mock `adminService` export methods.
- Mock `downloadFile` utility.
- Use Testing Library with async assertions.

**Done when**
- Required frontend behaviors are covered and deterministic.

---

## 5) Data + Formatting Rules

### Sort order
- Always `createdAt DESC` before transform/export.

### Field mapping
- `email` → passthrough.
- `subscribedAt` → `createdAt.toISOString()`.

### File naming
- CSV: `newsletter-subscribers-YYYY-MM-DD.csv`
- JSON: `newsletter-subscribers-YYYY-MM-DD.json`
- Date source: server-side UTC date for consistency.

### Content types
- CSV: `text/csv; charset=utf-8`
- JSON: `application/json; charset=utf-8`

---

## 6) Error Handling + Security

### Security
- Reuse `requireAdminAuth` on both export routes.
- No public access path for exports.

### Backend error handling
- If DB/query fails, return consistent server error response shape (existing pattern).

### Frontend error handling
- Show toast or inline error text on export failure.
- Reset loading flags in `finally` block.

---

## 7) Execution Order (TDD-first)

1. **Backend tests first** for new CSV/JSON export endpoints + unauthorized + empty states.
2. Implement backend controllers/routes until tests pass.
3. **Frontend tests next** for export actions/loading/errors.
4. Implement service + utility + dashboard UI until tests pass.
5. Run full test suite and do manual verification from admin dashboard.

---

## 8) Definition of Done Checklist

- [ ] `GET /api/admin/newsletter/export/csv` implemented + admin-protected.
- [ ] `GET /api/admin/newsletter/export/json` implemented + admin-protected.
- [ ] Output sorted by newest subscriber first.
- [ ] CSV headers exactly `email,subscribedAt`.
- [ ] JSON shape exactly array of `{ email, subscribedAt }`.
- [ ] Empty export behavior implemented (CSV header-only, JSON `[]`).
- [ ] Admin dashboard newsletter tab has export dropdown with CSV/JSON options.
- [ ] Loading and error states implemented in UI.
- [ ] Backend Jest tests added and passing.
- [ ] Frontend Vitest tests added and passing.

---

## 9) Optional Enhancements (post-MVP)

- Stream CSV response for very large datasets.
- Add audit log entry for export actions (admin id + timestamp).
- Add optional date-range filters before exporting.
- Add e2e test (Playwright) to verify browser download UX.
