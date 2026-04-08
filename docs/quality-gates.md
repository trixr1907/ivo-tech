# Quality Gates (Definition of Done)

A change is releasable only if:
- Lint, typecheck, build are green.
- Unit/integration tests are green.
- E2E functional tests are green.
- E2E accessibility smoke (`axe-core`, critical violations) is green.
- Security workflow is green (audit + secret scan).
- Live guardrails are green (`verify:live` + `budget:live`).

Recommended local release gate:
- `npm run verify:homepage:full`
- `npm run verify:live:full`
