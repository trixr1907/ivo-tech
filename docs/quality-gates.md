# Quality Gates (Definition of Done)

A change is releasable only if:
- Lint, typecheck, build are green.
- Unit/integration tests are green.
- E2E functional tests are green.
- E2E accessibility smoke (`axe-core`, critical violations) is green.
- Analytics map strict check is green (`npm run analytics:verify:map:strict`).
- Security workflow is green (audit + secret scan).
- Live guardrails are green (`verify:live` + `budget:live`).
- For custom-domain promotion, ops strict readiness is green (`npm run ops:readiness:strict`).

Recommended local release gate:
- `npm run verify:homepage:full`
- `npm run verify:live:full`

Schnellerer lokaler Smoke (ohne Lint/Typecheck/volle E2E-Suite): `npm run verify:site` — Production-Build, Unit-Tests, `tests/e2e/site-audit.spec.ts`, `analytics:verify:map:strict`.

CI (GitHub Actions): `.github/workflows/ci.yml` (Lint, i18n, Typecheck, Analytics-Map strict, Build, Bundle-Budgets), `unit-integration.yml` (Unit), `e2e.yml` (Playwright). In CI startet Playwright zuerst das Projekt **site-audit** (Fail-Fast), danach die übrigen Specs — siehe `playwright.config.ts` (`e2eFailFastAudit`). Bei `workflow_dispatch` mit gesetztem `E2E_BASE_URL` (Preview) läuft die Suite wie lokal in einem Chromium-Projekt ohne diese Aufteilung.

`npm run lint` prüft auch `tests/e2e/**` und `playwright.config.ts` (Vitest-Globals gelten nur noch für `**/*.test.*`, nicht für Playwright-`*.spec.ts`).
