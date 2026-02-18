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
  - `www.ivo-tech.com` as alias redirected to `ivo-tech.com`
  - `staging.ivo-tech.com` for staging alias
- Configure env vars by environment (Preview, Production):
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_APP_ENV`
  - optional: `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_CSP_REPORT_URI`
  - optional analytics guard override: `NEXT_PUBLIC_ANALYTICS_ALLOWED_HOSTS`
  - optional direct contact mail delivery: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAILS`
  - optional contact webhook fallback: `CONTACT_WEBHOOK_URL`
  - optional contact rate limits: `CONTACT_RATE_LIMIT_PER_IP`, `CONTACT_RATE_LIMIT_WINDOW_MINUTES`
  - optional persistent contact rate store: `KV_REST_API_URL`, `KV_REST_API_TOKEN` (or Upstash aliases)
  - optional bot protection: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`

## Cloudflare DNS setup (current)
Domain ownership stays in Cloudflare. Keep Cloudflare nameservers and set these DNS records:
- `A` record: `ivo-tech.com` -> `76.76.21.21` (Proxy status: DNS only)
- `A` record: `www.ivo-tech.com` -> `76.76.21.21` (Proxy status: DNS only)
- `A` record: `staging.ivo-tech.com` -> `76.76.21.21` (Proxy status: DNS only)

Optional helper from this repo:
```bash
npm run cf:ensure:vercel -- ivo-tech.com
```
See `docs/cloudflare-cli.md` for token setup and DNS operations.

In Vercel, enforce a permanent redirect from `www.ivo-tech.com` to `https://ivo-tech.com` to prevent split indexing.
This repo also contains an app-level redirect guard in `next.config.mjs` plus a fallback at `src/proxy.ts`.

After adding records, verify in Vercel:
```bash
npx vercel domains inspect ivo-tech.com --scope "$VERCEL_ORG_ID"
npx vercel domains inspect staging.ivo-tech.com --scope "$VERCEL_ORG_ID"
```

Expected: no domain configuration warning.

Post-change live check:
```bash
npm run verify:live
```
