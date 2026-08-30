# DevKofi Lessons

Use this file for concise repository-specific lessons learned from observed implementation, tests, debugging, or review. Do not store generic advice or predictions from tickets/specs/plans.

## Project showcase verification

- Context API was explicitly in both curated catalogs; runtime deduplication alone would not fix the duplicate Home/Work placement. Change the curated membership and keep regression tests for disjoint stable keys.
- Cloudinary returning an original successfully does not guarantee derived transformations work: the existing Hibachi cover returned HTTP 200 at its original URL but HTTP 400 with `X-Cld-Error: Invalid image file` for a width variant. Keep a bounded original-source fallback and report the provider issue separately from CSS correctness.
- Full-client validation currently contains unrelated baseline failures. For issue #38, compare against the untouched baseline commit before attributing failures to the new gallery/media code; focused checks do not replace the remaining browser acceptance checks.
