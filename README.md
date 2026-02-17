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
