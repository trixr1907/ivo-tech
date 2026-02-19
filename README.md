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
npm run typecheck
npm run test:unit
npm run test:e2e
npm run brand:verify
npm run perf:lighthouse
npm run perf:lighthouse:demo
npm run security:scan
npm run verify:live
```

## Brand system workflow
Regenerate and validate the full `ivo-tech` logo system (wordmark, submark, motion, 3D, docs):

```bash
npm run brand:generate
npm run brand:verify
```

Key routes:
- Public showcase: `/brand`, `/en/brand`
- Internal QA review: `/internal/brand-review`

Key source files:
- Manifest: `design/logo/asset-manifest.json`
- Handoff: `design/logo/ADOBE_HANDOFF.md`
- Master script: `scripts/generate_logo_system.py`
- Guard test: `tests/unit/logo-assets.test.ts`

## Environment variables
Copy `.env.example` to `.env.local`.

```bash
cp .env.example .env.local
```

Variables:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_APP_ENV` (`development` | `staging` | `production`)
- `NEXT_PUBLIC_ANALYTICS_ALLOWED_HOSTS` (optional, comma-separated host allow-list; defaults to `ivo-tech.com` + `www.ivo-tech.com`)
- Runtime telemetry: Vercel Analytics + Vercel Speed Insights are enabled and use the same host allow-list (`NEXT_PUBLIC_ANALYTICS_ALLOWED_HOSTS`).
- `NEXT_PUBLIC_SENTRY_DSN` (optional)
- `NEXT_PUBLIC_CSP_REPORT_URI` (optional)
- `RESEND_API_KEY` (optional, enables direct email delivery for contact form submissions)
- `CONTACT_FROM_EMAIL` (optional, sender address for Resend; defaults to `contact@ivo-tech.com`)
- `CONTACT_TO_EMAILS` (optional, comma-separated recipient list; defaults to `contact@ivo-tech.com,ivo@ivo-tech.com`)
- `CONTACT_WEBHOOK_URL` (optional fallback sink for `POST /api/contact` submissions)
- `CONTACT_RATE_LIMIT_PER_IP` (optional)
- `CONTACT_RATE_LIMIT_WINDOW_MINUTES` (optional)
- `AB_EVENT_RATE_LIMIT_PER_IP` (optional, server-side A/B event ingest throttle)
- `AB_EVENT_RATE_LIMIT_WINDOW_MINUTES` (optional)
- `AB_EVENT_ALLOWED_HOSTS` (optional, comma-separated host allow-list override for A/B ingest API)
- `AB_REPORT_MIN_EXPOSURE_PER_VARIANT` (optional global decision gate; env-based fallback defaults, see `docs/deploy.md`)
- `AB_REPORT_MIN_SUBMIT_EVENTS_TOTAL` (optional global decision gate; env-based fallback defaults)
- `AB_REPORT_MIN_DELTA_PERCENTAGE_POINTS` (optional global business relevance gate in pp; env-based fallback defaults)
- `AB_REPORT_SOURCE_MIN_EXPOSURE_PER_VARIANT` (optional source-level decision gate; env-based fallback defaults)
- `AB_REPORT_SOURCE_MIN_SUBMIT_EVENTS_TOTAL` (optional source-level decision gate; env-based fallback defaults)
- `AB_REPORT_SOURCE_MIN_DELTA_PERCENTAGE_POINTS` (optional source-level business relevance gate in pp; env-based fallback defaults)
- `INTERNAL_REPORT_TOKEN` (optional, protects `/internal/ab-report` via `?key=...`)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (optional, enables Turnstile on contact form)
- `TURNSTILE_SECRET_KEY` (optional, validates Turnstile token server-side)

Internal analytics/reporting routes:
- `POST /api/analytics/ab-event` (server-side ingest for A/B events)
- `GET /api/internal/ab-report?days=14&key=...` (JSON report; token optional but recommended)
- `GET /api/internal/ab-report?days=14&format=csv&key=...` (daily CSV export)
- `GET /api/internal/ab-report?days=14&format=csv&breakdown=source&key=...` (source-attribution CSV export)
- `GET /api/internal/ab-report?days=14&format=csv&breakdown=actions&key=...` (Top-3 action CSV export)
- `GET /internal/ab-report?days=14&key=...` (human-readable report page incl. global decision + source recommendations)

## CI/CD
- PR quality gates: `.github/workflows/ci.yml`, `unit-integration.yml`, `e2e.yml`, `security.yml`
- Security analysis: `.github/workflows/codeql.yml`
- Staging deploy from `main`: `.github/workflows/cd-staging.yml`
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
