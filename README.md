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
npm run perf:lighthouse
npm run security:scan
npm run verify:live
```

## Environment variables
Copy `.env.example` to `.env.local`.

```bash
cp .env.example .env.local
```

Variables:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_APP_ENV` (`development` | `staging` | `production`)
- `NEXT_PUBLIC_SENTRY_DSN` (optional)
- `NEXT_PUBLIC_CSP_REPORT_URI` (optional)
- `CONTACT_WEBHOOK_URL` (optional, receives `POST /api/contact` submissions)
- `CONTACT_RATE_LIMIT_PER_IP` (optional)
- `CONTACT_RATE_LIMIT_WINDOW_MINUTES` (optional)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (optional, enables Turnstile on contact form)
- `TURNSTILE_SECRET_KEY` (optional, validates Turnstile token server-side)

## CI/CD
- PR quality gates: `.github/workflows/ci.yml`, `unit-integration.yml`, `e2e.yml`, `security.yml`
- Security analysis: `.github/workflows/codeql.yml`
- Staging deploy from `main`: `.github/workflows/cd-staging.yml`
- Production deploy (manual approval): `.github/workflows/cd-production.yml`

Runbooks:
- `docs/deploy.md`
- `docs/release.md`
- `docs/rollback.md`
- `docs/branching.md`
- `docs/quality-gates.md`
- `docs/github-setup.md`
- `docs/cloudflare-cli.md`
- `docs/styleframes.md`
