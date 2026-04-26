# Admin Navigation Preservation Implementation Plan

## Objective
Implement the admin navigation preservation feature described in `_spec/admin-navigation-preservation-spec.md`.

Authenticated admins should keep access to the public site navigation from both public and protected admin pages. Protected admin routes should render inside a shared navigation shell, while unauthenticated visitors should continue seeing the existing public navigation with no admin links.

---

## Constraints And Existing Decisions
- Frontend is React with Vite, React Router, Redux Toolkit, TanStack Query, and SCSS/Tailwind coexistence.
- This feature touches existing SCSS-styled navigation components, so keep styling in the existing SCSS files.
- Do not introduce a new design system or new styling framework.
- Do not add backend endpoints.
- Do not hard-code API URLs.
- Use existing admin session and logout hooks:
  - `client/src/hooks/queries/useAdminSession.js`
  - `client/src/hooks/mutations/useLogoutAdmin.js`
- Use Redux only for existing admin auth state and side nav UI state.
- Do not store navigation link definitions in Redux.
- Keep `/admin/login` as a focused standalone route.
- Keep `AdminRoute` focused on auth gating.
- Omit `Footer` from protected admin pages unless product direction changes.
- No new third-party dependency is expected.

---

## Implementation Slices

### Slice 1: Confirm Current Navigation And Auth Surfaces

Files to inspect before editing:
- `client/src/App.jsx`
- `client/src/components/Header/Header.jsx`
- `client/src/components/Header/header.styles.scss`
- `client/src/components/SideNav/SideNav.jsx`
- `client/src/components/SideNav/sideNav.styles.scss`
- `client/src/components/AdminRoute/AdminRoute.jsx`
- `client/src/hooks/queries/useAdminSession.js`
- `client/src/hooks/mutations/useLogoutAdmin.js`
- `client/src/redux/auth/authSlice.js`
- `client/src/redux/navigation/navigationSlice.js`
- `client/package.json`

Tasks:
1. Verify current route nesting.
   - Public routes are under `PublicLayout`.
   - Protected admin routes are currently outside `PublicLayout`.
   - `/admin/login` remains standalone.
2. Verify current auth shape.
   - `auth.admin` indicates authenticated admin.
   - `auth.isChecked` gates protected route loading.
   - `useAdminSession` currently enables only on admin routes.
3. Verify current side nav state.
   - `navigation.isOpen` controls mobile `SideNav`.
   - `toggleSideNav` is the current open/close action.
4. Verify current icon dependency.
   - `Header` and `SideNav` currently use `react-icons/fa`.
   - Do not add a second icon package for this feature.

Expected checkpoint:
- Exact current behavior is confirmed before changing routing and navigation.

---

### Slice 2: Add Shared Navigation Constants

Files:
- Add `client/src/constants/navigation.js`

Tasks:
1. Create public navigation item constants.
   - `Home` -> `/`
   - `About` -> `/about`
   - `Projects` -> `/projects`
   - `Contact` -> `/contact`
2. Create public action item constant.
   - `Book a Call` -> `/book-a-call`
3. Create admin navigation item constants.
   - `Dashboard` -> `/admin/dashboard`
4. Keep data simple and presentation-free.
   - Use plain objects with `label` and `to`.
   - Avoid component classes, Redux references, and auth checks in this file.
5. Add optional metadata only if it reduces route matching duplication.
   - Example: `{ label: 'Dashboard', to: '/admin/dashboard', matchPrefix: '/admin' }`
   - Do not mark `/admin/login` as a protected nav active match.

Expected checkpoint:
- Desktop and mobile navigation can render from the same source of truth.

---

### Slice 3: Update Admin Session Checking For Public Refreshes

Files:
- `client/src/hooks/queries/useAdminSession.js`

Tasks:
1. Adjust query enablement so public pages can discover an existing admin session after refresh.
   - Preferred: run the session query for all routes with `retry: false`.
   - Acceptable variant: skip only `/admin/login` if needed to avoid redundant login-page work.
2. Keep public pages non-blocking.
   - Do not render a global loading screen on public routes while the session check is pending.
   - `AdminRoute` remains responsible for protected-route loading UI while `!isChecked`.
3. Keep existing success behavior.
   - If response says authenticated, dispatch `setAdmin`.
   - If not authenticated, dispatch `clearAdmin`.
   - Dispatch `setChecked`.
4. Keep existing error behavior.
   - On error, dispatch `clearAdmin`.
   - Dispatch `setChecked`.
5. Avoid route-specific stale state issues.
   - If skipping `/admin/login`, make sure login/logout flows still set and clear admin state through existing mutations.
6. Verify query key remains stable.
   - Keep `['adminSession']` unless a route-specific key is truly needed.

Expected checkpoint:
- Refreshing `/`, `/about`, or another public page while an admin session exists can populate `auth.admin`, allowing admin navigation to appear.

---

### Slice 4: Add Protected Admin Layout

Files:
- `client/src/App.jsx`
- Optional extraction: `client/src/routes/AdminLayout.jsx`

Tasks:
1. Add an `AdminLayout`.
   - Reads `navigation.isOpen` from Redux.
   - Renders `Header`.
   - Renders `SideNav` when open.
   - Renders `<Outlet />`.
   - Does not render `Footer`.
2. Keep `PublicLayout` behavior unchanged.
   - Public layout still renders `Header`, optional `SideNav`, `<Outlet />`, and `Footer`.
3. Nest protected admin pages under `AdminRoute` and `AdminLayout`.
   - `/admin/dashboard`
   - `/admin/messages/:messageId`
4. Keep `/admin/login` outside both `PublicLayout` and `AdminLayout`.
5. Keep `AdminRoute` unchanged unless tests reveal a routing edge case.
   - It should still return loading state while `!isChecked`.
   - It should still redirect unauthenticated users to `/admin/login`.

Recommended route shape:

```jsx
<Route path="/admin/login" element={<AdminLogin />} />

<Route element={<AdminRoute />}>
  <Route element={<AdminLayout />}>
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/messages/:messageId" element={<AdminMessageDetails />} />
  </Route>
</Route>
```

Expected checkpoint:
- Protected admin pages render the same navigation shell as public pages, without the footer.

---

### Slice 5: Refactor Header For Admin-Aware Navigation

Files:
- `client/src/components/Header/Header.jsx`
- `client/src/components/Header/header.styles.scss`

Tasks:
1. Replace hard-coded public link markup with mapped navigation constants.
2. Read authenticated admin state from Redux.
   - `const admin = useSelector((state) => state.auth.admin);`
3. Switch navigation links that need active styling to `NavLink`.
   - Preserve logo as a standard `Link`.
   - Use `aria-current="page"` behavior from `NavLink`.
4. Render public links for every mounted header state.
   - Home
   - About
   - Projects
   - Contact
5. Render admin-only links when `admin` exists.
   - Dashboard link to `/admin/dashboard`.
   - Dashboard should be styled as a secondary action, not the same as Book a Call.
6. Render `Book a Call` as the existing primary CTA.
7. Add global Logout button when `admin` exists.
   - Use `useLogoutAdmin`.
   - Disable while `isPending`.
   - Text can be `Logout` and `Logging out...`.
8. Improve mobile menu trigger semantics.
   - Use `<button type="button" aria-label="Open navigation">`.
   - Keep existing `FaBars` icon inside the button.
9. Add route-aware admin active state.
   - Dashboard should appear active for `/admin/dashboard`.
   - For `/admin/messages/:messageId`, Dashboard can also appear active because it is an admin sub-route.
   - Do not show Dashboard active on `/admin/login`.
10. Preserve visual behavior.
   - Keep sticky dark glass header.
   - Keep lime accent.
   - Keep desktop/mobile breakpoint behavior.
   - Avoid layout jump when admin links appear by using consistent button height.

SCSS tasks:
1. Add styles for:
   - `.nav-item.active`
   - `.btn-admin`
   - `.btn-logout`
   - `.menu-button`
2. Keep mobile actions hidden on desktop as before.
3. Use transform/opacity/color/border transitions only.
4. Keep button text readable on small desktop widths.

Expected checkpoint:
- Header shows public links always, admin links only for authenticated admins, and uses accessible controls.

---

### Slice 6: Refactor SideNav For Admin-Aware Mobile Navigation

Files:
- `client/src/components/SideNav/SideNav.jsx`
- `client/src/components/SideNav/sideNav.styles.scss`

Tasks:
1. Replace hard-coded side nav links with shared navigation constants.
2. Read `admin` from Redux.
3. Use `useLogoutAdmin` for mobile logout.
4. Use `useLocation` if needed for admin route prefix active matching.
5. Close the side nav after:
   - Any navigation link click.
   - Logout button click.
6. Render public items for everyone.
7. Render Dashboard and Logout only when `admin` exists.
8. Keep `Book a Call` in the side nav for both visitor and admin users.
9. Improve close button semantics.
   - Use `<button type="button" aria-label="Close navigation">`.
   - Keep existing `FaTimes` icon inside the button.
10. Add navigation semantics.
   - Wrapper can use `role="dialog"` with `aria-modal="true"` or a labeled `nav`.
   - Include `aria-label="Mobile navigation"` on the nav region.
11. Avoid active-state false positives.
   - Dashboard active for `/admin/dashboard` and admin detail routes.
   - Dashboard not active for `/admin/login`.

SCSS tasks:
1. Update selectors if icons become nested inside buttons.
2. Add `.logout-btn` styling aligned with link typography.
3. Ensure button reset styles do not break keyboard focus.
4. Add visible focus styles for links and buttons.
5. Keep full-screen overlay behavior.
6. Ensure mobile link text does not overflow on narrow screens.

Expected checkpoint:
- Mobile side nav mirrors desktop behavior and remains keyboard-accessible.

---

### Slice 7: Preserve Dashboard Local Header Behavior

Files:
- `client/src/Pages/AdminDashboard/AdminDashboard.jsx`
- `client/src/Pages/AdminDashboard/AdminDashboard.module.scss`, only if global header creates spacing issues

Tasks:
1. Keep the existing dashboard header and logout button for this pass.
   - This reduces workflow risk and matches the spec's preferred option.
2. Verify two logout entry points do not conflict.
   - Global header logout.
   - Dashboard local logout.
3. Confirm dashboard content spacing still works below the sticky global header.
4. Confirm message details page spacing still works below the sticky global header.
5. Avoid unnecessary dashboard layout redesign.

Expected checkpoint:
- Admin pages gain global navigation without removing existing dashboard controls.

---

### Slice 8: Add Navigation Tests

Files:
- Add `client/test/navigation/AdminNavigation.test.jsx`
- Update existing tests only if route/layout changes require it:
  - `client/test/admin/AdminDashboard.test.jsx`
  - `client/test/admin/AdminMessageDetails.test.jsx`

Test setup tasks:
1. Create a small test store factory.
   - Include `auth` reducer.
   - Include `navigation` reducer.
   - Preload `auth.admin` as either `null` or an admin object.
   - Preload `auth.isChecked`.
2. Wrap tested components in:
   - `Provider`
   - `QueryClientProvider` when hooks require it
   - `MemoryRouter`
3. Mock `useLogoutAdmin` where testing logout click behavior.
4. Mock admin page data hooks only when rendering full admin pages.

Tests to add:
1. Public unauthenticated header hides admin navigation.
   - Render public layout or `Header`.
   - Assert Dashboard is absent.
   - Assert Logout is absent.
   - Assert Home and About are present.
2. Public authenticated header shows admin navigation.
   - Preload admin state.
   - Assert Home and About remain present.
   - Assert Dashboard is present and links to `/admin/dashboard`.
   - Assert Logout is present.
3. Protected dashboard route renders shared header.
   - Preload authenticated admin and checked state.
   - Render route tree with `/admin/dashboard`.
   - Assert logo, Home, About, Dashboard are present.
4. Protected message detail route renders shared header.
   - Preload authenticated admin and checked state.
   - Mock `useContactMessage`.
   - Render `/admin/messages/123`.
   - Assert Home, About, Dashboard are present.
5. Mobile side nav includes admin-only links only when authenticated.
   - Render `SideNav` with no admin and assert Dashboard absent.
   - Render `SideNav` with admin and assert Dashboard present.
6. Mobile side nav logout calls logout mutation.
   - Mock logout mutate.
   - Click Logout.
   - Assert mutate called.
7. Unauthenticated protected route still redirects.
   - Render `AdminRoute` route tree with `auth.admin = null` and `isChecked = true`.
   - Assert redirect target or login route content appears.
8. Protected route still shows loading while unchecked.
   - Render with `auth.isChecked = false`.
   - Assert loading spinner is present.

Expected checkpoint:
- Authenticated, unauthenticated, public, protected, desktop, and mobile navigation states are covered.

---

### Slice 9: Verification

Commands:

```bash
npm run test:client
```

If navigation changes touch lint-sensitive files broadly:

```bash
cd client && npm run lint
```

Optional smoke test:

```bash
npm run dev
```

Manual checks:
1. Log in as admin.
2. Open `/admin/dashboard`.
   - Header is visible.
   - Home, About, Projects, Contact, Dashboard, Book a Call, and Logout are available on desktop.
   - Footer is not shown under admin dashboard content.
3. Open `/admin/messages/:messageId`.
   - Header is visible.
   - Home/About remain available.
   - Dashboard remains available.
4. Open `/`.
   - If admin session is active, Dashboard and Logout are visible.
   - Public page does not block while session is checked.
5. Open `/about`.
   - Admin navigation persists after refresh when session is valid.
6. Log out from global header.
   - Admin state clears.
   - User lands on `/admin/login`.
   - Dashboard and Logout disappear from public navigation.
7. Test mobile viewport.
   - Open side nav.
   - Public links are visible.
   - Dashboard and Logout are visible only for authenticated admin.
   - Link click closes the side nav.

Expected checkpoint:
- The implementation satisfies the spec without creating regressions in public navigation or admin auth gating.

---

## Suggested Commit Breakdown
1. `add shared navigation constants`
2. `preserve header on admin routes`
3. `add admin-aware desktop navigation`
4. `add admin-aware mobile navigation`
5. `test admin navigation preservation`

Keep commits smaller if route layout and navigation refactors become easier to review separately.

---

## Risks And Mitigations

### Risk: Public pages show stale admin navigation
Mitigation:
- Run the admin session query on public routes after refresh.
- Clear admin state on session query error or unauthenticated response.
- Keep logout invalidating `['adminSession']`.

### Risk: Public pages block on admin session check
Mitigation:
- Do not add a global loading guard to `PublicLayout`.
- Keep loading UI isolated to `AdminRoute` while protected auth is unchecked.

### Risk: Header becomes cramped on desktop when admin links appear
Mitigation:
- Use compact secondary action styling for Dashboard and Logout.
- Keep `Book a Call` primary but not oversized.
- Consider reducing desktop nav gap slightly if needed.

### Risk: Mobile side nav toggling becomes inconsistent
Mitigation:
- Keep using existing `navigation.isOpen`.
- Close menu after link and logout actions.
- Avoid adding separate local open state.

### Risk: Dashboard active state appears on `/admin/login`
Mitigation:
- Admin layout is not used on `/admin/login`.
- Prefix matching for Dashboard must explicitly exclude `/admin/login`.

### Risk: Existing tests fail because protected routes now include Header
Mitigation:
- Prefer queries scoped to page-specific content where needed.
- Update tests only where added navigation creates duplicate text or roles.

---

## Definition Of Done
- Protected admin pages render inside a shared admin navigation layout.
- Authenticated admins can navigate to Home and About from protected admin pages.
- Authenticated admins see Dashboard navigation from public pages.
- Unauthenticated users do not see Dashboard or Logout in public navigation.
- `/admin/login` remains standalone.
- `AdminRoute` continues to guard protected pages.
- Public page rendering does not block on session loading.
- Desktop and mobile navigation use shared navigation constants.
- Global Logout works for authenticated admins.
- Mobile SideNav closes after navigation and logout actions.
- Navigation controls have accessible button/link semantics.
- `npm run test:client` passes.

---

## Frontend Pre-flight Matrix
- [ ] Global state is used only for auth state and side nav open/closed state.
- [ ] Admin session state still comes from the existing admin session endpoint.
- [ ] Mobile navigation remains readable without horizontal overflow.
- [ ] No full-height route shell uses `h-screen`.
- [ ] Public Home/About do not block on admin session loading.
- [ ] Protected routes still show loading while auth is unchecked.
- [ ] Header and SideNav include accessible labels and button semantics.
- [ ] No cards are added for this navigation change.
- [ ] Animations are limited to lightweight opacity, color, and transform transitions.
