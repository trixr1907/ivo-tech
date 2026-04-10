# Release Candidate Note (2026-04-10)

Status: candidate verified and production-promoted.

## Verification summary

Executed locally on 2026-04-10:

1. `npm run verify:homepage:full`
   - Result: PASS
   - Includes lint, i18n consistency, typecheck, analytics strict map check, unit tests, e2e tests.
2. `npm run verify:live:full`
   - Result: PASS
   - `verify:live`: PASS (TLS + domain checks for `ivo-tech.com` and `www.ivo-tech.com`)
   - `budget:live`: PASS (`https://ivo-tech.com` within JS/CSS/font/total budgets)

## Scope covered in this candidate

1. Hero experiment infrastructure (optional weighted assignment + funnel propagation).
2. Trust evidence pipeline for homepage with asset interaction tracking.
3. Analytics operational runbooks and closeout checklist documents.
4. Dev preview origin hardening (`allowedDevOrigins`) and env documentation updates.

## Production promotion log

1. 2026-04-10 deployment promoted and aliased:
   - `dpl_FEJfsdegX5v7xsr5S9sTe9yaDXAM`
   - `dpl_68rhS4vfY4qyrHhmyJuaLaoQTzq9`
2. Custom domain alias confirmed: `https://ivo-tech.com`.
3. Post-deploy checks:
   - Home renders without console errors.
   - `POST /api/analytics` returns `{\"ok\":true,\"status\":\"accepted\",\"provider\":\"plausible\"}`.

## Pending decision before go-live

1. External testimonial/proof asset approvals.
2. Dashboard pack + alerts activation confirmation.
