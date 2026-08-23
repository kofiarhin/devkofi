# DevKofi Project Context

## Summary

DevKofi is Kofi Arhin's creative technology studio. The established MERN application is transitioning from a historical mentorship platform to an editorial public experience for product engineering, creative development, photography, content, selected work, experiments, and qualified project enquiries.

## Canonical product documents

- Product direction: `PRD.md`
- Roadmap: `roadmap.md`
- Review standard: `review.md`
- Product context: `context/product.md`
- Architecture: `context/architecture.md`
- Decisions: `context/decisions.md`
- Current state: `context/current-state.md`

## Stack

- Frontend: React 19, Vite 7, React Router, TanStack Query, Redux Toolkit, Framer Motion, SCSS, Tailwind 4 tooling
- Backend: Node.js, Express 5, MongoDB, Mongoose
- Testing: Vitest/Testing Library, Jest/Supertest, Playwright
- Package manager: npm
- Deployment evidence: Vercel client and Heroku API

## Commands

```bash
npm test
npm run lint --prefix client
npm run build --prefix client
```

## Conventions

- Keep API calls in services and query/mutation hooks.
- Keep API-backed server state in TanStack Query.
- Use Redux only for shared client-owned navigation/auth state.
- Keep environment-specific values and secrets outside source.
- Preserve current backend contracts during the studio redesign.
- Use authentic media or explicit asset slots; never invent portfolio evidence.

## Known constraints

- Legacy mentorship code and stored records remain until a separate governed audit.
- Final photography, testimonials, and measurable client outcomes are unresolved.
- Merge and deployment require separate approval.
