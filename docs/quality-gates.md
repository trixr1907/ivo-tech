# Quality Gates (Definition of Done)

A change is releasable only if:
- Lint, typecheck, build are green.
- Unit/integration tests are green.
- E2E functional tests are green.
- Security workflow is green (audit + secret scan).
- Staging smoke test documented.

Recommended local release gate:
- `npm run verify:homepage:full`
