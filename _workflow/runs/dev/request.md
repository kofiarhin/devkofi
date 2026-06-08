# Active Request

Merge the `dev` branch into `main`, upgrade the Heroku application `devkofi-api`
from `heroku-22` to `heroku-24`, deploy `main`, and verify that the application
is healthy.

## Source

- Original request: Upgrade the Heroku app from Heroku-22 to Heroku-24 and
  verify the deployment.
- Clarification: Merge the `dev` branch with `main` and push to Heroku.
- Execution mode: `complete-workflow`

## Constraints

- Show every command before executing it.
- Do not modify application code unless a verified Heroku-24 compatibility
  failure requires the smallest safe fix.
- Stop deployment verification immediately if a deployment fails, diagnose
  the exact failure, and resume only after applying an in-scope fix.
- Capture command output in run-scoped workflow evidence.
- Continue until the app runs successfully on Heroku-24 or a blocking issue is
  fully diagnosed and documented.

## Shared Understanding Handoff

- Current branch/worktree: `dev` at
  `C:/Users/laura.bolas/projects/devkofi/dev`.
- `main` is checked out in `C:/Users/laura.bolas/projects/devkofi/main`.
- Current `main` commit: `b9081af`.
- Current `dev` commit: `c731f58`.
- Git history shows `main` already contains `dev`; merging `dev` into `main`
  should currently be a no-op.
- Heroku app currently uses `heroku-22`.
- Heroku buildpack is `heroku/nodejs`.
- The app declares Node `20.x` and npm `10.x`.
- The current worktree was clean at intake.

## In Scope

- Confirm and, if necessary, merge `dev` into `main`.
- Set the Heroku stack to `heroku-24`.
- Create the requested empty deployment commit on `main`.
- Push `main` to the `heroku` remote.
- Verify release, dyno, logs, runtime compatibility, configuration errors, and
  deployed HTTP health.
- Apply only a minimal compatibility fix if the deployment proves one is
  required.

## Out Of Scope

- Feature work, UI changes, refactoring, dependency upgrades without evidence,
  and unrelated cleanup.
