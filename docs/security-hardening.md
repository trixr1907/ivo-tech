# Security Hardening Notes

## CSP hardening path
Current state uses `Content-Security-Policy-Report-Only` in `next.config.mjs`.

Recommended rollout:
1. Keep report-only while collecting violations for at least 14 days.
2. Remove unsafe sources incrementally (start with `unsafe-eval`, then `unsafe-inline` for scripts).
3. Move critical inline logic to external scripts and use nonce/hash strategy.
4. Switch to enforcing `Content-Security-Policy` only after zero high-confidence breakage.

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
