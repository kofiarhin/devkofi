# Release Notes

- Request: Upgrade `devkofi-api` from Heroku-22 to Heroku-24.
- User-facing changes: None; existing API remains available.
- Developer changes: Heroku stack changed to Heroku-24; empty deployment commit
  `ee6093b` created on main.
- New routes/APIs: none
- New env vars: none
- Database/schema changes: none
- Dependencies added/removed: none
- Test commands run: Heroku stack/release/ps/log/runtime checks, HTTP smoke
  request, Git ancestry/status/diff checks.
- Known limitations: Node 20.20.2 is EOL; npm audit reports 8 vulnerabilities.
- Follow-up work: Upgrade Node to a supported LTS and review dependency
  vulnerabilities in a separate change.
- Suggested commit message: Already created as
  `chore: upgrade Heroku stack to heroku-24`.
