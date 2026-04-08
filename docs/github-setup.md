# GitHub Governance Setup

## Preconditions
- `gh` CLI installed and authenticated.
- `origin` remote configured for this repo.
- Admin permissions on the target GitHub repository.

## Apply baseline governance

```bash
npm run governance:apply
```

This applies:
- Branch protection on default branch (if available on your plan).
- Required status checks: `ci`, `unit-integration`, `e2e`, `security`.
- Minimum 1 approving review.
- Dismiss stale reviews on push.
- Enforce rules for admins.
- Merge strategy policy (squash/rebase enabled, merge-commit disabled).
- Auto-delete merged branches.
- Environment: `production`.

## Manual follow-up in GitHub UI
1. Repository Settings -> Environments -> `production`.
2. Add required reviewers for deployment approvals.
3. Optionally set wait timer (for controlled rollout windows).
4. Add environment secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

## Private repo without paid plan
If the script prints a warning about branch protection (HTTP 403), this is expected.

Recommended fallback:
1. Keep repo private.
2. Enable local pre-push hook:
   - `npm run setup:githooks`
3. Use PR workflow by convention.
4. Keep deploy guardrails enabled (`cd-production` and `live-guardrails` validate checks before deploy).
