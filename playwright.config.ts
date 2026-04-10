import { defineConfig, devices } from '@playwright/test';

// Keep Playwright logs deterministic and avoid Node warnings when both env flags are set.
delete process.env.NO_COLOR;
process.env.FORCE_COLOR = '0';

const externalBaseUrl = process.env.E2E_BASE_URL?.trim();
const baseURL = externalBaseUrl || 'http://127.0.0.1:3000';

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
        command: 'npm run build && npm run start -- --hostname 127.0.0.1 --port 3000',
        env: {
          ...process.env,
          FORCE_COLOR: '0'
        },
        url: baseURL,
        timeout: 240_000,
        reuseExistingServer: !process.env.CI
      },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
