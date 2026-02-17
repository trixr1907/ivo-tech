# Deploy Runbook

## Environment model
- `development`: local machine + PR preview URLs.
- `staging`: shared pre-production domain (`https://staging.ivo-tech.com`).
- `production`: manual release workflow; by default deploys with `--skip-domain` (custom domains are not updated).

## CI/CD flow
1. Open PR from short-lived branch (`feat/*`, `fix/*`, `chore/*`).
2. Required checks must pass: `ci`, `unit-integration`, `e2e`, `security`.
3. Merge PR into `main`.
4. `cd-staging` deploys current `main` to `staging.ivo-tech.com` only if required checks for that commit are green.
5. Validate staging smoke test.
6. Trigger `cd-production` manually with protected `production` environment approval. The workflow re-validates required checks for the target SHA before deploy.
7. Keep `promote_to_custom_domains=false` while the site is not release-ready.
8. Only when ready, run `cd-production` with `promote_to_custom_domains=true` to promote to `ivo-tech.com`.

## Required GitHub secrets
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Required GitHub environment protections
- `staging`: optional reviewers, optional wait timer.
- `production`: mandatory reviewer approval and branch restriction to `main`.

## No-cost private repo mode
- If branch protection is unavailable on your GitHub plan:
  - keep repository private
  - enforce `main` push policy via `.githooks/pre-push`
  - rely on deployment check-gates in `cd-staging` and `cd-production`

## Required Vercel setup
- Connect repo to Vercel project.
- Configure custom domains:
  - `ivo-tech.com` for production
  - `staging.ivo-tech.com` for staging alias
- Configure env vars by environment (Preview, Production):
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_APP_ENV`
  - optional: `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_CSP_REPORT_URI`
