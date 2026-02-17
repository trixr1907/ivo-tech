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

## Safe mode (default)
- `cd-production` runs in safe mode by default:
  - deployment is built and published to Vercel
  - custom domains are not promoted (`--skip-domain`)
- This keeps `ivo-tech.com` unchanged until explicit go-live.

## Go-live switch to ivo-tech.com
Run production workflow with explicit domain promotion:

```bash
gh workflow run cd-production.yml -f ref=main -f promote_to_custom_domains=true
```

Then verify:
1. GitHub run `cd-production` is green.
2. `https://ivo-tech.com` serves the expected release.
3. Optional rollback stays available by running `cd-production` with `ref=<good_sha>`.
