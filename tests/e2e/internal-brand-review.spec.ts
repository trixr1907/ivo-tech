import { expect, test } from '@playwright/test';

test.describe('internal brand review route', () => {
  test('renders asset table and motion preview without missing files', async ({ page, request }) => {
    await page.goto('/internal/brand-review');

    await expect(page.getByRole('heading', { level: 1, name: /Internal Brand Review/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /Asset Manifest/i })).toBeVisible();
    await expect(page.locator('video.brand-preview-video')).toBeVisible();

    const missingCells = page.getByRole('cell', { name: /^missing$/i });
    await expect(missingCells).toHaveCount(0);

    const caption = await request.get('/assets/video/logo-sting-captions.vtt');
    expect(caption.ok()).toBeTruthy();
  });
});
