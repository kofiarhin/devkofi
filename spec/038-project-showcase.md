# Project showcase contract

Source: [issue #38](https://github.com/kofiarhin/devkofi/issues/38).
Approved in conversation before implementation. Baseline: `8b6fb1efe3e4b5aee738a14336ac96ea9b1c59e3`.
The approved Agent System asset is already merged in PR #39 and must be preserved.

## Outcome and placement

Readable complete cover artwork at every size, and one primary listing per project.

| Surface | Ordered entries |
| --- | --- |
| Home | Hibachi, Brain, ThriftChef |
| Work | Hibachi, Brain, LeadRadar, Forge, ThriftChef |
| Engineering Systems | AI Dev Workspace, Codex Workflow Kit, Agent System, Context API, Ideas Hub |

Home has one gallery of at most three cards. Its Systems section becomes editorial text plus a link.
Curated stable keys control membership; runtime hydration must not introduce duplicate cards or override Hibachi's null repository URL.

## Media

- Shared project media reserves a 16:9 frame on mobile and desktop and contains the complete image without hover zoom.
- A focused pure helper supplies responsive width candidates, `sizes`, automatic format/quality for eligible public Cloudinary upload URLs. Match the existing 900px grid breakpoint, 1400px container, 32px grid gap and page gutters.
- Preserve existing transformation/version/public-ID segments. Signed, tokenized, non-upload, custom-host and ambiguous URLs pass through unchanged rather than risking corruption.
- Non-Cloudinary sources continue working unchanged. Missing/failed images receive a stable labelled fallback; title and links remain real accessible text.
- No image SDK, new dependencies, credentials, server/schema changes, image replacement or external asset mutation.

## Verification and boundaries

TDD for selection, Home composition, responsive URL handling and image states. Run client tests, lint and build. Check Home, Work, Engineering Systems and compatibility redirects. Browser target widths: 320, 375, 390, 768, 1440px, including high-DPR selection when tooling supports it. Record any unverified behavior without claiming a pass.

Keep existing JS/React and SCSS conventions. Only relevant client, tests and delivery/context documentation change. Separate branch and draft PR authorized; merge and deployment are not authorized. Existing documentation still includes historical mentorship/redesign branch claims; those are not live release evidence.
