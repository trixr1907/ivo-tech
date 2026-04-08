# Release Runbook

## Branching policy
- Trunk-based development.
- `main` is always releasable.
- No direct commits to `main`.

## Release log

### 2026-02-17 - App Router + MDX Authority Hub migration
- Status: released to `main`.
- Merged PRs:
  - `#15` - `feat(content): MDX foundation + neue Hub-Routen`
  - `#16` - `feat(app): Vollmigration der Kernseiten auf App Router`
  - `#17` - `feat(platform): API/Sitemap/Pizza-Cutover + Cleanup`
- Merge commits on `main`:
  - `34e66e5` (`#15`)
  - `dc1e526` (`#16`)
  - `312ea7f` (`#17`)
- Post-release smoke checks (2026-02-17):
  - `npm run verify:live` passed (`ivo-tech.com`, `www.ivo-tech.com`, TLS samples `12/12`).
  - Production smoke (`https://ivo-tech.com`): `7/7` critical non-mutating e2e checks passed.

## Release checklist
1. Ensure all required checks are green on merge commit.
2. Run local full gate before release decision:
   - `npm run verify:homepage:full`
3. Verify `live-guardrails` status on `main` is green.
4. Trigger `cd-production` (`ref=main` by default).
5. Approve `production` environment in GitHub.
6. Verify production smoke test.
7. Log release notes in PR or changelog.

## Weekly release cadence (CDD default)
- Monday: choose max three homepage priorities for the week.
- Tuesday-Thursday: ship small PRs, each with full local gate before review.
- Friday: merge, validate live guardrails, then make production decision.

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
