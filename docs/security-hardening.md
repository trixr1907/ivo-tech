# Security Hardening Notes

## CSP hardening path
Current state:
- Enforce-CSP is static in `next.config.mjs`.
- Report-Only-CSP is generated per request in `src/proxy.ts` with a nonce-based `script-src` and `report-uri /api/security/csp-report`.
- `/pizza` and `/en/pizza` keep scoped third-party sources (Google Fonts + Maps frame) in both enforce/report-only policies.

Recommended rollout:
1. Keep nonce-based report-only active while collecting violations for at least 14 days.
2. Remove/nonce remaining inline scripts (JSON-LD + framework/runtime outliers) until no high-confidence `script-src` violations remain.
3. Move nonce-based `script-src` from report-only into enforce and remove `unsafe-inline` for scripts.
4. Keep scoped third-party allowances route-local (`/pizza` only), never globalize them.

## Contact API rate-limit store
`/api/contact` supports persistent rate limiting via Redis REST (with memory fallback).

Supported env vars:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

Alternative aliases (Upstash compatible):
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## Secret hygiene
- Never commit `.env.local`.
- Rotate local OIDC/API tokens if exposed in logs, shell history, or screenshots.
- Use short-lived tokens whenever possible.
- Keep secret scanning enabled in CI (`gitleaks`).

## Dependency risk policy
`npm audit` is enforced for runtime dependencies (`--omit=dev`) at `high` severity and above.
Development-only findings are tracked separately and reviewed periodically without blocking release by default.
