/**
 * Canonical origin for local dev and Playwright when `E2E_BASE_URL` is unset.
 * Use `http://localhost:3000` (not `127.0.0.1`) so tooling on Windows (e.g. Cursor
 * Simple Browser) can reach a Next server running in WSL via port forwarding.
 */
export const LOCAL_DEV_SITE_ORIGIN = 'http://localhost:3000';
