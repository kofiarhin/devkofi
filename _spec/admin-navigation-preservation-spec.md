# Admin Navigation Preservation Feature Spec

## Goal
Preserve the main site navigation when an admin is logged in, including public links like Home and About, while also exposing protected admin navigation for authenticated admin routes.

Admins should be able to move between:
- Public Home: `/`
- Public About: `/about`
- Other existing public site routes
- Protected admin dashboard: `/admin/dashboard`
- Protected admin detail routes such as `/admin/messages/:messageId`

The admin experience must not feel isolated from the rest of the app after login. Admin-only routes should retain a consistent navigation shell, and public navigation should remain available while still clearly showing admin context.

---

## Scope
In scope:
- Shared navigation behavior for authenticated admins.
- Desktop header updates.
- Mobile side navigation updates.
- Protected admin route layout updates.
- Admin login redirect behavior after successful login, if needed for consistency.
- Logout entry point in the authenticated navigation.
- Frontend tests for admin/public navigation visibility.

Out of scope:
- Backend authentication changes.
- New admin roles or permissions.
- Full redesign of the public header.
- Replacing the current SCSS styling system.
- Moving admin server state into Redux.
- Deployment changes.

---

## Current State

Relevant files:
- `client/src/App.jsx`
- `client/src/components/Header/Header.jsx`
- `client/src/components/Header/header.styles.scss`
- `client/src/components/SideNav/SideNav.jsx`
- `client/src/components/SideNav/sideNav.styles.scss`
- `client/src/components/AdminRoute/AdminRoute.jsx`
- `client/src/Pages/AdminDashboard/AdminDashboard.jsx`
- `client/src/Pages/AdminMessageDetails/AdminMessageDetails.jsx`
- `client/src/hooks/queries/useAdminSession.js`
- `client/src/hooks/mutations/useLogoutAdmin.js`
- `client/src/redux/auth/authSlice.js`
- `client/src/redux/navigation/navigationSlice.js`
- `client/test/admin/AdminDashboard.test.jsx`
- `client/test/admin/AdminMessageDetails.test.jsx`

Current routing behavior:
- `PublicLayout` wraps `/`, `/about`, `/projects`, `/contact`, `/book-a-call`, and `*`.
- `PublicLayout` renders `Header`, conditional `SideNav`, page content, and `Footer`.
- `/admin/login` is outside `PublicLayout`.
- Protected admin routes are outside `PublicLayout`:
  - `/admin/dashboard`
  - `/admin/messages/:messageId`
- `AdminRoute` only guards protected routes and renders `<Outlet />`.

Current limitation:
- Admin protected pages do not render the main `Header` or `SideNav`.
- There is no shared route layout for authenticated admin pages.
- Public header links are not admin-aware.
- Admins can lose direct navigation back to Home/About once inside protected routes.

---

## Desired Product Behavior

### Authenticated Admin On Public Routes
When `state.auth.admin` exists:
- Public pages still render normal public navigation.
- Header includes public links:
  - Home
  - About
  - Projects
  - Contact
  - Book a Call
- Header also includes an admin-only link:
  - Dashboard, pointing to `/admin/dashboard`
- Header includes a logout control, or the admin dashboard page header can keep logout while the global header includes Dashboard only. Preferred: expose logout in global authenticated navigation for consistency.
- Mobile `SideNav` mirrors the same authenticated links.

### Authenticated Admin On Protected Routes
When an admin opens `/admin/dashboard` or `/admin/messages/:messageId`:
- The same site header is visible.
- The mobile menu is available.
- Public links Home and About remain available.
- Protected links remain available.
- The active protected route is visually distinguishable.
- Admin route content renders below the header.
- Footer should be omitted from admin protected pages unless product direction says otherwise. Preferred: omit footer to keep admin pages operational and compact.

### Unauthenticated Visitor
When no admin is logged in:
- Public navigation remains unchanged.
- No Dashboard link is visible.
- No Logout button is visible.
- Protected admin routes still redirect to `/admin/login`.
- `/admin/login` should not show the full public navigation unless explicitly desired. Preferred: keep login as a focused standalone page.

### Logout
When an admin clicks Logout from global navigation:
- Use the existing `useLogoutAdmin` mutation.
- Clear admin state through existing mutation behavior.
- Invalidate the `adminSession` query.
- Navigate to `/admin/login`.
- Close mobile side nav if logout is triggered there.

---

## Route Architecture

Update `client/src/App.jsx` to introduce a protected admin layout instead of rendering protected pages directly under `AdminRoute`.

Recommended structure:

```jsx
<Route element={<PublicLayout />}>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/projects" element={<Projects />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/book-a-call" element={<BookCall />} />
  <Route path="*" element={<NotFound />} />
</Route>

<Route path="/admin/login" element={<AdminLogin />} />

<Route element={<AdminRoute />}>
  <Route element={<AdminLayout />}>
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/messages/:messageId" element={<AdminMessageDetails />} />
  </Route>
</Route>
```

Add `AdminLayout` near `PublicLayout` in `App.jsx`, or extract it to:
- `client/src/routes/AdminLayout.jsx`

Recommended `AdminLayout` behavior:
- Reads `navigation.isOpen` from Redux.
- Renders `Header`.
- Renders `SideNav` when open.
- Renders `<Outlet />`.
- Does not render `Footer` by default.

Example shape:

```jsx
const AdminLayout = () => {
  const { isOpen } = useSelector((state) => state.navigation);

  return (
    <>
      <Header />
      {isOpen && <SideNav />}
      <Outlet />
    </>
  );
};
```

Keep `AdminRoute` focused only on authentication and authorization.

---

## Navigation Model

Create one shared source of truth for navigation items so desktop and mobile do not drift.

Recommended file:
- `client/src/constants/navigation.js`

Export:

```js
export const publicNavItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
];

export const publicActionItem = {
  label: 'Book a Call',
  to: '/book-a-call',
};

export const adminNavItems = [
  { label: 'Dashboard', to: '/admin/dashboard' },
];
```

Optional future-proofing:
- Add `{ protected: true }` metadata for admin links.
- Add route matching metadata if `/admin/dashboard` should be active for all `/admin/*` routes.

Do not store navigation items in Redux. Redux should only hold UI state such as whether the mobile side nav is open.

---

## Header Requirements

Update:
- `client/src/components/Header/Header.jsx`
- `client/src/components/Header/header.styles.scss`

Behavior:
- Read `admin` from `state.auth`.
- Render public navigation for all non-login pages where `Header` is mounted.
- Render admin-only links only when `admin` exists.
- Use `NavLink` for links that need active state.
- Keep the logo link pointing to `/`.
- Keep Book a Call styled as the primary CTA.
- Add Dashboard as a secondary admin action, visually distinct from Book a Call.
- Add Logout as a button when global logout is included.

Recommended desktop order:
1. Home
2. About
3. Projects
4. Contact
5. Dashboard, only for admins
6. Book a Call
7. Logout, only for admins

Design guidance:
- Keep current dark glass header.
- Preserve lime accent.
- Avoid large new visual treatments.
- Use fixed-height buttons so the header does not jump when admin links appear.
- Use a subtle bordered style for Dashboard and Logout.
- Keep hover/active states based on color, border, transform, or opacity.
- Do not introduce a new styling system for this change.

Accessibility:
- Use semantic `<nav aria-label="Primary navigation">`.
- Use `<button type="button">` for Logout.
- The mobile menu trigger should be a button with an accessible label rather than only an icon click target.
- Active links should use `aria-current="page"` via `NavLink`.

---

## Mobile Side Navigation Requirements

Update:
- `client/src/components/SideNav/SideNav.jsx`
- `client/src/components/SideNav/sideNav.styles.scss`

Behavior:
- Read `admin` from `state.auth`.
- Render the same public items as the header.
- Render Dashboard only when admin exists.
- Render Logout only when admin exists.
- Close the menu after link clicks.
- Close the menu after successful logout trigger.

Implementation notes:
- Replace hard-coded duplicated links with mapped items from `constants/navigation.js`.
- Use `NavLink` for active styles.
- The Dashboard active state should apply to admin descendants. If React Router's default exact behavior is too narrow, use a route matching helper:

```js
const isAdminActive = ({ isActive }) =>
  isActive || location.pathname.startsWith('/admin');
```

Avoid marking `/admin/login` as an active protected admin nav item.

Accessibility:
- Side nav wrapper should expose a navigation label or dialog semantics.
- Close icon should be a `<button type="button" aria-label="Close navigation">`.
- Logout should be a `<button type="button">`.
- Preserve keyboard access for all links and buttons.

---

## Admin Dashboard Header Interaction

Current `AdminDashboard.jsx` already includes:
- Admin email.
- Dashboard title.
- Logout button.

After global admin navigation is added, choose one of these options:

Preferred option:
- Keep the local dashboard header logout for now to avoid changing dashboard workflow.
- Also allow global logout in `Header`.
- Ensure both call the same `useLogoutAdmin` hook.

Alternative:
- Remove local dashboard logout only after confirming the global logout has strong visibility on desktop and mobile.

For this implementation spec, keep local logout to minimize behavioral risk.

---

## Protected Route Session Behavior

Current `useAdminSession` only runs when `pathname.startsWith('/admin')`.

This is acceptable for protected route gating, but it means public pages may not know whether an admin session exists after a page refresh directly on `/` or `/about`.

To preserve admin navigation on public Home/About after refresh, update session checking.

Recommended behavior:
- Run `getAdminSession` once on app load for all routes except possibly `/admin/login`, or run it for all routes with `retry: false`.
- Set `isChecked` after success or error.
- Keep protected redirects based on `isChecked`.

Implementation approach:
- In `useAdminSession`, remove `enabled: isAdminRoute`, or replace with `enabled: true`.
- Keep failure behavior non-blocking for public pages.
- On public pages, no spinner should block rendering while admin session is checked.
- `AdminRoute` should still show its existing loading state while `!isChecked`.

Risk:
- This adds one session request on public page load.
- That is acceptable if the endpoint is lightweight and cookie-based.

Alternative lower-request approach:
- Keep session query admin-route-only.
- Persist admin state in Redux session storage.
- This is not preferred because backend remains the source of truth and session storage can become stale.

---

## Service And State Requirements

No new backend endpoints are required.

Reuse:
- `client/src/hooks/mutations/useLogoutAdmin.js`
- `client/src/hooks/queries/useAdminSession.js`
- `client/src/redux/auth/authSlice.js`
- `client/src/redux/navigation/navigationSlice.js`

Rules:
- Do not duplicate admin data into a new Redux domain.
- Do not add server state to navigation Redux.
- Do not hard-code API URLs.
- Do not make components call Axios directly.

---

## Testing Requirements

Update or add frontend tests under:
- `client/test/admin/AdminDashboard.test.jsx`
- `client/test/admin/AdminMessageDetails.test.jsx`
- Optional: `client/test/navigation/AdminNavigation.test.jsx`

Recommended new test file:
- `client/test/navigation/AdminNavigation.test.jsx`

Cover:
- Public unauthenticated header does not show Dashboard.
- Public authenticated header shows Dashboard.
- Public authenticated header keeps Home and About visible.
- Protected admin dashboard route renders Header.
- Protected admin message detail route renders Header.
- Protected admin route includes Home, About, and Dashboard links.
- Mobile side nav includes Dashboard only when admin exists.
- Mobile side nav logout calls logout mutation.
- Logout button is not rendered for unauthenticated users.
- Admin route still redirects unauthenticated users to `/admin/login`.

Test setup notes:
- Use `MemoryRouter`.
- Use a Redux test store with `auth.admin` present or null.
- Mock `useLogoutAdmin` where testing logout.
- Mock admin query hooks when rendering dashboard or message pages.

Run:

```bash
npm run test:client
```

---

## Acceptance Criteria

- Authenticated admins see public navigation links on Home and About.
- Authenticated admins see a Dashboard link on public pages.
- Protected admin pages render the shared header and mobile navigation.
- Protected admin pages preserve links back to Home and About.
- Protected admin links are hidden from unauthenticated users.
- Logout is available to authenticated admins from the navigation.
- Mobile navigation mirrors desktop navigation.
- `AdminRoute` continues to protect `/admin/dashboard` and `/admin/messages/:messageId`.
- `/admin/login` remains accessible and does not require authentication.
- Public pages do not block on admin session loading.
- No API URLs are hard-coded.
- Frontend tests cover the authenticated and unauthenticated navigation states.

---

## Implementation Order

1. Create shared navigation constants in `client/src/constants/navigation.js`.
2. Update `useAdminSession` so admin state is known after refreshing public Home/About.
3. Add `AdminLayout` and wrap protected admin routes with it.
4. Update `Header` to render public links plus authenticated admin links.
5. Update `SideNav` to use the same navigation constants and admin-aware links.
6. Add accessible button semantics for mobile menu, close, and logout controls.
7. Add or update SCSS for Dashboard, Logout, and active states.
8. Add frontend tests for public, protected, desktop, and mobile navigation behavior.
9. Run `npm run test:client`.

---

## Frontend Pre-flight Matrix

- [ ] Global state is used only for admin auth state and side nav open/closed state.
- [ ] Server session state still comes from the existing admin session endpoint.
- [ ] Mobile layout keeps navigation links readable without horizontal overflow.
- [ ] No full-height route shell uses `h-screen`.
- [ ] Admin session loading does not block public Home/About rendering.
- [ ] Protected routes still show a loading state while auth is unchecked.
- [ ] Header and side nav include accessible labels and button semantics.
- [ ] Cards are not added for the navigation change.
- [ ] Animations are limited to lightweight opacity, color, and transform transitions.
