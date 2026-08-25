# DevKofi Implementation Plans

Plans define **how to execute an approved specification in order**.

Reference the source ticket and spec, then break implementation into the smallest useful vertical slices. Testable slices use:

```text
RED → GREEN → REFACTOR → VERIFY
```

For each slice define the observable outcome, affected repository areas, the failing RED test, minimum GREEN change, allowed refactor boundary, and targeted verification.

Include relevant client/server tests plus lint/build/browser checks required by the approved outcome. If planning discovers a material conflict with the approved spec, return to `/spec` instead of redesigning silently.

Prefer the same basename as the source spec.
