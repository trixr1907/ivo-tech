# Quality Gates (Definition of Done)

A change is releasable only if:
- Lint, typecheck, build are green.
- Unit/integration tests are green.
- E2E tests are green.
- Security workflow is green (audit + secret scan).
- Lighthouse report reviewed (performance/accessibility/SEO thresholds).
- Staging smoke test documented.
