# Security Hardening Notes

## CSP hardening path
Current state:
- Enforce-CSP is generated per request in `src/proxy.ts` with nonce-based `script-src` and `'strict-dynamic'`.
- Report-Only-CSP is generated per request in `src/proxy.ts` with the same nonce model plus `report-uri /api/security/csp-report`.
- `/pizza` and `/en/pizza` keep scoped third-party sources (Google Fonts + Maps frame) in both enforce/report-only policies.
- Enforce-CSP `script-src` excludes `'unsafe-inline'` in production.

Recommended rollout:
1. Keep nonce-based report-only active while collecting violations for at least 14 days.
2. Track remaining high-confidence `script-src` violations and ensure they carry valid nonces (framework/runtime outliers first).
3. Keep the nonce-based enforce policy stable and tighten route-level exceptions only where necessary.
4. Keep scoped third-party allowances route-local (`/pizza` only), never globalize them.

Observed telemetry (2026-04-09):
- `npm run security:csp:summary -- --since=7d` analyzed 100 production rows.
- All sampled violations were `script-src-elem` on `https://ivo-tech.com/`.
- Samples point to Next.js streaming/runtime inline payloads (`self.__next_f.push(...)`) plus baseline inline blocks.

Practical implication:
- Enforce policy now allows only nonce-authorized scripts (plus scoped third-party sources).
- Report-only telemetry remains the early-warning channel for nonce regressions and extension/dev noise.

Noise reduction (2026-04-09):
- CSP ingestion now classifies low-signal noise buckets:
  - `next_runtime_inline` (typical `self.__next_f.push(...)` inline runtime reports)
  - `browser_extension` (`chrome-extension://`, `moz-extension://`, etc.)
  - `local_development` (`localhost` / `127.0.0.1` reports during local QA)
- Noise buckets are throttled with high thresholds (first logs skipped, log on larger count milestones only).
- Actionable violations (`noiseClass=none`) keep the original low-threshold logging behavior.

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
