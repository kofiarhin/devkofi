# DevKofi Product Context

Evidence basis: `README.md` and current repository package manifests inspected during workspace setup. No customer interviews or quantitative product metrics were supplied for this setup.

## Product

DevKofi is a mentorship platform combining a Vite/React learning portal with an Express/MongoDB API. The documented product supports mentee acquisition/onboarding, curriculum and pricing discovery, authenticated templates/portal experiences, messaging, and internal mentorship-team administration.

## Customer and Users

Supported user groups from repository documentation:

- prospective mentees evaluating the program;
- mentees/students using authenticated resources and portal experiences;
- admins/mentorship-team staff managing users, messages, enrollment, and internal workflows;
- general visitors using contact/newsletter flows.

Commercial buyer/decision-maker and segment-specific ICP details: `Unresolved`.

## Problem

The repository is organized to provide one product surface for discovering the mentorship offer, joining the program, accessing learning/template resources, and supporting admin operations rather than relying on disconnected forms/tools.

Specific validated customer pain, objections, buying triggers, and customer language: `Unresolved` until real evidence is added under `customers/`.

## Promise

Repository-supported promise: provide a web-based mentorship experience that can onboard mentees, present curriculum/pricing, deliver gated resources/portal functionality, and support the mentorship team's operational workflows.

## Scope

Documented client-facing areas include:

- homepage/marketing sections;
- course outline;
- Join Mentorship flow;
- templates gallery behind private routes;
- profile/about information;
- contact, newsletter, success, and error flows;
- portal and messages dashboards;
- development-only component playground.

Documented server capabilities include mentorship/contact/newsletter intake, JWT auth, role-restricted user/admin endpoints, pricing, GitHub info proxying, template catalog, and downloadable starter files.

## Primary Journeys

### Prospective mentee

1. Understand the mentorship offer from the homepage/curriculum/pricing.
2. Open Join Mentorship.
3. Submit enrollment information.
4. Receive the product's documented success/verification communication.

### Authenticated user

1. Authenticate through the existing auth flow.
2. Access role/gate-appropriate templates, portal, or messaging experiences.

### Mentorship team/admin

1. Authenticate with the appropriate role.
2. Use admin/user/message surfaces backed by protected API endpoints.

These journeys are documented as repository features; this setup did not browser-verify them.

## Success

Supported functional success conditions are that the documented acquisition, enrollment, authenticated-resource, and admin flows work reliably and clearly.

Quantitative product metrics, conversion targets, retention goals, and SLA targets: `Unresolved`.
