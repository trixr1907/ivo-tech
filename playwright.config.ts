import { defineConfig, devices } from '@playwright/test';

import { LOCAL_DEV_SITE_ORIGIN } from './local-dev-origin';

// Keep Playwright logs deterministic and avoid Node warnings when both env flags are set.
delete process.env.NO_COLOR;
process.env.FORCE_COLOR = '0';

const externalBaseUrl = process.env.E2E_BASE_URL?.trim();
const baseURL = externalBaseUrl || LOCAL_DEV_SITE_ORIGIN;
const localDevUrl = new URL(LOCAL_DEV_SITE_ORIGIN);

/** In CI, run site-audit first (fail fast on HTTP/axe/links) before the heavier functional suite. */
const e2eFailFastAudit = process.env.CI === 'true' && !externalBaseUrl;

const chromiumDesktop = { ...devices['Desktop Chrome'] };

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: process.env.CI ? 2 : 1,
  retries: process.env.CI ? 2 : 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: externalBaseUrl
    ? undefined
    : {
        command: `npm run build && npm run start -- --hostname ${localDevUrl.hostname} --port ${localDevUrl.port || '3000'}`,
        env: {
          ...process.env,
          FORCE_COLOR: '0',
          // next build runs as production; src/env.ts requires these for production builds.
          NEXT_PUBLIC_SITE_URL:
            process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://ivo-tech.com',
          NEXT_PUBLIC_APP_ENV:
            process.env.NEXT_PUBLIC_APP_ENV?.trim() || 'production'
        },
        url: baseURL,
        timeout: 240_000,
        reuseExistingServer: !process.env.CI
      },
  projects: e2eFailFastAudit
    ? [
        {
          name: 'site-audit',
          testMatch: /site-audit\.spec\.ts$/,
          use: chromiumDesktop
        },
        {
          name: 'chromium',
          testIgnore: /site-audit\.spec\.ts$/,
          dependencies: ['site-audit'],
          use: chromiumDesktop
        }
      ]
    : [
        {
          name: 'chromium',
          use: chromiumDesktop
        }
      ]
});
