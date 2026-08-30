# DevKofi Search & AI Discoverability Specification

**Status:** Approved
**Approval date:** 2026-08-30
**Execution mode:** complete-workflow
**Repository:** `kofiarhin/devkofi`
**Branch:** `feat/creative-studio-redesign`
**PR:** #30

## Goal

Increase the clarity and retrievability of DevKofi's founder-led creative technology studio content for conventional search engines and AI-powered search/agent systems while preserving the approved editorial redesign and existing application behavior.

## User-visible Outcome

A visitor, crawler, or AI retrieval system should be able to quickly determine:

1. what DevKofi is;
2. who Kofi Arhin is;
3. which product, design, full-stack and AI-engineering services DevKofi provides;
4. which work, reusable systems and journal topics demonstrate expertise;
5. how to start a project;
6. which URLs are canonical public destinations.

## Content Strategy

Use the SEO skill's people-first and AI-citability principles:

- answer the page's intent directly near the top;
- define DevKofi and Kofi with concrete, truthful entities and capabilities;
- use descriptive headings instead of purely abstract editorial headings where that improves retrieval;
- keep copy natural and useful rather than keyword-stuffed;
- connect Work, Services, About, Lab, Journal and Start a Project with descriptive internal links already present in the redesign;
- do not invent results, customer claims, statistics, testimonials or credentials;
- do not force word-count targets.

## Metadata

Each canonical route must receive:

- unique `<title>`;
- unique meta description;
- canonical URL;
- `robots=index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1`;
- Open Graph title, description, URL, type, site name and image;
- Twitter/X card title, description and image;
- page-appropriate JSON-LD.

Because the app is a client-rendered Vite SPA, page-specific tags may be applied at runtime. The base `index.html` must still contain meaningful default metadata and entity-level JSON-LD for non-JavaScript consumers. SSR/prerendering is explicitly outside this approved pass.

## Structured Data

Use only truthful Schema.org data:

- site-wide `Organization`, `Person` and `WebSite` identity in base HTML;
- route-level `WebPage`, `CollectionPage`, `AboutPage`, or `ContactPage` metadata as appropriate;
- `Service` entities for the three actual service engagements;
- no FAQ rich-result markup;
- no fake reviews, ratings, locations, awards or unsupported properties.

## Crawl & Agent Surfaces

Add:

- `/robots.txt` allowing normal crawling and explicitly allowing OAI-SearchBot, GPTBot, ClaudeBot and PerplexityBot; include sitemap location;
- `/sitemap.xml` listing the seven canonical studio URLs;
- `/llms.txt` describing DevKofi and linking the canonical sections as an optional machine-readable navigation aid. Do not represent it as a Google ranking/citation factor.

## Content Changes

### Home
- define DevKofi explicitly as a founder-led creative technology studio;
- mention product strategy, UX/UI/product design, full-stack web development and AI engineering naturally;
- make the primary explanatory section self-contained and quotable;
- clarify founder expertise without inventing claims.

### Services
- make service intent explicit in H1 and opening copy;
- use concrete service labels covering product strategy, UX/UI, full-stack delivery, AI-enabled product work and product evolution;
- preserve the three-engagement structure and current process.

### About
- make Kofi Arhin's identity and relationship to DevKofi explicit;
- describe relevant MERN/full-stack and AI engineering expertise accurately;
- retain the founder-led studio model and existing principles.

### Work
- preserve API-backed project gallery and case-study behavior;
- add route metadata describing the work as evidence of product engineering and digital product delivery; do not rewrite dynamic project data in this pass.

### Lab
- preserve API-backed template/library behavior;
- add route metadata describing reusable developer/product systems; do not rewrite dynamic template data in this pass.

### Journal
- clarify topical focus around AI engineering, full-stack product development, product strategy and build notes;
- retain honest `Publishing soon` status; do not fabricate articles or publication dates.

### Start a Project
- clarify that the enquiry route covers web apps, full-stack MVPs, AI-enabled tools and product design/engineering;
- preserve form behavior, validation and persistence.

## Acceptance Criteria

- [ ] all seven canonical routes have unique SEO metadata configuration;
- [ ] base HTML has useful default metadata and truthful entity graph;
- [ ] Home, Services, About and Journal copy is materially more explicit for search intent and AI extraction;
- [ ] Start a Project intent is explicit without changing form behavior;
- [ ] `robots.txt`, `sitemap.xml` and `llms.txt` exist with canonical DevKofi URLs;
- [ ] no unsupported ranking claims, fake metrics, fake reviews or invented customer outcomes are added;
- [ ] no dependency, backend, data model, auth, deployment or infrastructure changes are introduced;
- [ ] focused tests cover route metadata and static discovery files;
- [ ] available verification is attempted and truthfully reported;
- [ ] PR #30 remains draft, unmerged and undeployed.

## Verification Plan

Preferred commands when a runnable worktree is available:

```bash
npm run test:client -- --run client/test/seo/seoMetadata.test.jsx
npm run test:client -- --run client/test/seo/discoveryFiles.test.js
npm run lint --prefix client
npm run build --prefix client
```

Then inspect generated `client/dist/robots.txt`, `client/dist/sitemap.xml`, and `client/dist/llms.txt`.

GitHub connector execution does not expose a command-running worktree. If no external check runner is available, implementation must remain `Needs Human Review` / verification pending rather than being marked Done.

## Risks

- SPA runtime metadata is less robust for non-JavaScript crawlers than SSR/prerendered HTML; this pass improves the current architecture without changing it.
- Journal remains intentionally thin until real articles are published.
- Search rankings and AI citations cannot be guaranteed by any implementation.

## Out of Scope

SSR/prerendering, dependencies, keyword-volume tooling, backlinks, local SEO, deployment, merge, production verification, and unrelated redesign changes.
