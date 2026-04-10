# ivo-tech

Next.js 16 portfolio homepage with bilingual routes (`de`/`en`), project modals, and static showcase subpaths.

## Requirements
- Node.js `>=20.9.0`
- npm

## Local development
```bash
npm ci
npm run dev
npm run setup:githooks
```

## Quality checks
```bash
npm run lint
npm run lint:i18n
npm run typecheck
npm run test:unit
npm run test:e2e
npm run build
npm run security:scan
npm run verify:homepage:full
npm run verify:live
npm run roadmap:sync
npm run masterplan:progress
npm run analytics:readiness
npm run analytics:readiness:strict
npm run analytics:plausible:ops
npm run analytics:plausible:ops:strict
npm run proof:readiness
npm run proof:readiness:strict
npm run analytics:live:readiness
npm run analytics:live:readiness:strict
npm run hero:experiment:plan -- --start=YYYY-MM-DD
npm run hero:log:readiness
npm run hero:log:readiness:strict
npm run hero:log:sync:plausible -- --day=YYYY-MM-DD
npm run ops:readiness
npm run ops:readiness:strict
npm run github:ops:readiness
npm run github:ops:readiness:strict
```

## Brand system workflow
Regenerate the full `ivo-tech` logo system (detailed/core/micro marks, wordmark, lockups, motion aliases):

```bash
npm run logo:build
npm run brand:generate
```

Key source files:
- Manifest: `design/logo/asset-manifest.json`
- Runtime manifest: `public/assets/logo/manifest.json`
- Handoff: `design/logo/ADOBE_HANDOFF.md`
- Master script: `scripts/build-logo-system.mjs`

## Environment variables
Copy `.env.example` to `.env.local`.

```bash
cp .env.example .env.local
```

Variables:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_APP_ENV` (`development` | `production`)
- `NEXT_PUBLIC_ANALYTICS_ALLOWED_HOSTS` (optional, comma-separated host allow-list; defaults to `ivo-tech.com` + `www.ivo-tech.com`)
- `NEXT_ALLOWED_DEV_ORIGINS` (optional, comma-separated local-only origins for Next.js dev cross-origin requests)
- Runtime telemetry: Vercel Analytics + Vercel Speed Insights are enabled and use the same host allow-list (`NEXT_PUBLIC_ANALYTICS_ALLOWED_HOSTS`).
- Optional analytics relay to product analytics sinks:
  - `NEXT_PUBLIC_ANALYTICS_SINK_ENABLED`
  - `ANALYTICS_SINK_PROVIDER` (`posthog` | `plausible`)
  - `ANALYTICS_SINK_POSTHOG_PROJECT_KEY`
  - `ANALYTICS_SINK_POSTHOG_HOST`
  - `ANALYTICS_SINK_PLAUSIBLE_DOMAIN`
  - `ANALYTICS_SINK_PLAUSIBLE_HOST`
  - `PLAUSIBLE_STATS_API_KEY` (optional, required for live Plausible stats queries used by `analytics:plausible:ops*` and `hero:log:sync:plausible`)
- `NEXT_PUBLIC_SCHEDULER_URL` (optional, scheduler link override for contact/thank-you CTAs; defaults to `https://cal.com/ivo-tech/intro-call`)
- `NEXT_PUBLIC_HERO_EXPERIMENT_ENABLED` (optional, `true/false` toggle for persistent hero variant assignment)
- `NEXT_PUBLIC_HERO_EXPERIMENT_WEIGHTS` (optional, CSV `default,outcome,speed`, e.g. `50,25,25`)
- `NEXT_PUBLIC_SENTRY_DSN` (optional)
- `NEXT_PUBLIC_CSP_REPORT_URI` (optional)
- `RESEND_API_KEY` (optional, enables direct email delivery for contact form submissions)
- `CONTACT_FROM_EMAIL` (optional, sender address for Resend; defaults to `contact@ivo-tech.com`)
- `CONTACT_TO_EMAILS` (optional, comma-separated recipient list; defaults to `contact@ivo-tech.com,ivo@ivo-tech.com`)
- `CONTACT_WEBHOOK_URL` (optional fallback sink for `POST /api/contact` submissions)
- `CONTACT_RATE_LIMIT_PER_IP` (optional)
- `CONTACT_RATE_LIMIT_WINDOW_MINUTES` (optional)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (optional, enables Turnstile on contact form)
- `TURNSTILE_SECRET_KEY` (optional, validates Turnstile token server-side)
- `.env.ops` contains non-secret defaults for `ops:readiness*` strict checks.

## CI/CD
- PR quality gates: `.github/workflows/ci.yml`, `unit-integration.yml`, `e2e.yml`, `security.yml`
- Security analysis: `.github/workflows/codeql.yml`
- Live guardrails on `main`: `.github/workflows/live-guardrails.yml`
- Production deploy (manual approval): `.github/workflows/cd-production.yml`

Runbooks:
- `docs/deploy.md`
- `docs/release.md`
- `docs/changelog.md`
- `docs/rollback.md`
- `docs/branching.md`
- `docs/quality-gates.md`
- `docs/security-hardening.md`
- `docs/github-setup.md`
- `docs/cloudflare-cli.md`
- `docs/styleframes.md`
- `docs/analytics-activation-runbook.md`
- `docs/analytics-dashboards/`
- `docs/proof-asset-collection.md`
- `docs/hero-experiment-log.md`
- `docs/masterplan-closeout-checklist.md`
- `docs/roadmap-live.md`
- `docs/release-candidate-2026-04-10.md`
