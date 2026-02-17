# Release Runbook

## Branching policy
- Trunk-based development.
- `main` is always releasable.
- No direct commits to `main`.

## Release checklist
1. Ensure all required checks are green on merge commit.
2. Verify `cd-staging` deployment succeeded.
3. Execute staging smoke test:
   - Homepage loads in `de` and `en`.
   - Modal open/close query-state works.
   - `/configurator` and `/pizza/` reachable.
   - Contact CTA and canonical tags are valid.
4. Trigger `cd-production` (`ref=main` by default).
5. Approve `production` environment in GitHub.
6. Verify production smoke test.
7. Log release notes in PR or changelog.
