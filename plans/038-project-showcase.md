# Approved implementation plan: project showcase

Contract: `spec/038-project-showcase.md`; source: GitHub issue #38.
Approval: Kofi explicitly replied "plan approved" in the active conversation.
Route: Codex implementation on `fix/38-responsive-project-showcase`, draft PR, no merge/deployment.

1. Curation: RED selector and Home composition expectations for the approved matrix, duplicate input and private Hibachi URL. GREEN catalog membership/featured flags and editorial Home section. Keep stable card keys. VERIFY neighboring selector and Home states.
2. Responsive sources: RED URL transformation expectations for normal/versioned/transformed URLs and safe pass-through. GREEN pure image helper with width candidates and layout-matched sizes. VERIFY helper and selectors.
3. Project media: RED card errors, absent source, source replacement and image attributes. GREEN isolated image state, reserved 16:9 frame, contain and no hover zoom. VERIFY card, Home and media regressions.
4. Verify/review: run client suite, lint and production build; inspect actual pages, screenshots, responsive sources, keyboard links and console/network behavior. Record baseline failures separately; do not silently waive them.
5. Delivery: update scoped current-state/decisions/lessons from evidence, record checks in `docs/verification/038-project-showcase.md`, commit and open a draft PR with evidence. Keep issue #38 open until remaining acceptance criteria are satisfied.

Install only existing lockfile dependencies for checks; do not change package manifests/lockfiles. Documentation is reviewed directly rather than covered by mirror tests.
