# Deploy Runbook

## Operational entrypoint
- Zentrale Steuerdatei fuer Betrieb, Release und Incident: `docs/ops-control-center.md`

## Environment model
- `development`: local machine + PR preview URLs.
- `production`: manual release workflow; by default deploys with `--skip-domain` (custom domains are not updated).

## CI/CD flow
1. Open PR from short-lived branch (`feat/*`, `fix/*`, `chore/*`).
2. Required checks must pass: `ci`, `unit-integration`, `e2e`, `security`.
3. Merge PR into `main`.
4. `live-guardrails` verifies the current live site (`ivo-tech.com`) after each `main` push and daily.
5. Trigger `cd-production` manually with protected `production` environment approval. The workflow re-validates required checks for the target SHA before deploy.
6. Keep `promote_to_custom_domains=false` while the site is not release-ready (workflow runs `npm run ops:readiness` in report mode).
7. Only when ready, run `cd-production` with `promote_to_custom_domains=true` to promote to `ivo-tech.com` (workflow enforces `npm run ops:readiness:strict`).

## Required GitHub secrets
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `PLAUSIBLE_STATS_API_KEY` (required for daily analytics ops workflow + strict alert checks)

Preflight helper:
```bash
npm run github:ops:readiness
npm run github:ops:readiness:strict
```

## Required GitHub environment protections
- `production`: mandatory reviewer approval and branch restriction to `main`.

## No-cost private repo mode
- If branch protection is unavailable on your GitHub plan:
  - keep repository private
  - enforce `main` push policy via `.githooks/pre-push`
  - rely on deployment check-gates in `cd-production` and `live-guardrails`

## Required Vercel setup
- Connect repo to Vercel project.
- Configure custom domains:
  - `ivo-tech.com` for production
  - `www.ivo-tech.com` as alias redirected to `ivo-tech.com`
- Configure env vars by environment (Preview, Production):
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_APP_ENV`
  - optional: `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_CSP_REPORT_URI`
  - optional analytics guard override: `NEXT_PUBLIC_ANALYTICS_ALLOWED_HOSTS`
  - optional analytics sink relay:
    - `NEXT_PUBLIC_ANALYTICS_SINK_ENABLED`
    - `ANALYTICS_SINK_PROVIDER` (`posthog` or `plausible`)
    - `ANALYTICS_SINK_POSTHOG_PROJECT_KEY`, `ANALYTICS_SINK_POSTHOG_HOST`
    - `ANALYTICS_SINK_PLAUSIBLE_DOMAIN`, `ANALYTICS_SINK_PLAUSIBLE_HOST`
  - optional scheduler override: `NEXT_PUBLIC_SCHEDULER_URL`
  - optional hero experiment toggle: `NEXT_PUBLIC_HERO_EXPERIMENT_ENABLED`
  - optional hero variant weights: `NEXT_PUBLIC_HERO_EXPERIMENT_WEIGHTS` (CSV `default,outcome,speed`)
  - optional direct contact mail delivery: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAILS`
  - optional contact webhook fallback: `CONTACT_WEBHOOK_URL`
  - optional contact rate limits: `CONTACT_RATE_LIMIT_PER_IP`, `CONTACT_RATE_LIMIT_WINDOW_MINUTES`
  - optional persistent contact rate store: `KV_REST_API_URL`, `KV_REST_API_TOKEN` (or Upstash aliases)
  - optional bot protection: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`

Local development only:
- optional `NEXT_ALLOWED_DEV_ORIGINS` (comma-separated) to allow additional non-default local origins in Next.js dev mode.

## Cloudflare DNS setup (current)
Domain ownership stays in Cloudflare. Keep Cloudflare nameservers and set these DNS records:
- `A` record: `ivo-tech.com` -> `76.76.21.21` (Proxy status: DNS only)
- `A` record: `www.ivo-tech.com` -> `76.76.21.21` (Proxy status: DNS only)

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
```

Expected: no domain configuration warning.

Post-change live check:
```bash
npm run verify:live
npm run analytics:readiness:strict
```
