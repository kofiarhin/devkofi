# Architecture Context

## Intended architecture

- React/Vite public client with React Router route boundaries.
- Focused components and a central studio content registry for stable editorial content.
- TanStack Query for API-backed projects/templates and existing mutations.
- Redux Toolkit only for shared client-owned navigation/auth state.
- Existing Express/MongoDB API remains authoritative for persisted submissions and admin data.
- Shared CSS tokens plus scoped SCSS for the editorial design system.

## Current implementation

- Established MERN repository.
- React 19, Vite 7, React Router, TanStack Query, Redux Toolkit, Framer Motion, SCSS, and Tailwind 4 tooling.
- Express/Mongoose API with contact, booking, newsletter, template, project, and admin surfaces.
- Contact persistence precedes best-effort Telegram notification.
- Private admin routes use the existing session query and protected route.
- Legacy mentorship code and documentation remain present but are no longer the intended product direction.

## Boundaries and dependencies

- Public redesign may change routing, markup, content, and presentation.
- Backend contracts, database schemas, authentication, deployment, and secrets are protected from this scope.
- Framer Motion and Phosphor icons are already installed; no new UI dependency is required.

## Security and data constraints

- Do not expose environment values, private product details, contact records, or admin information.
- Preserve server-side validation, persistence, authorization, and notification boundaries.
- Do not send API-backed records into Redux.

## Unresolved technical decisions

- Whether Journal becomes API-backed after v1.
- Whether persistent theme preference is justified after validating the signature dark experience.
