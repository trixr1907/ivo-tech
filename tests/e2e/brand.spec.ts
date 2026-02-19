import { expect, test } from '@playwright/test';

test.describe('brand showcase routes', () => {
  test('renders DE showcase with system, motion, and downloads', async ({ page }) => {
    await page.goto('/brand');

    await expect(page.getByRole('heading', { level: 1, name: /Brand Showcase/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /Logo-System|Logo system/i })).toBeVisible();
    await expect(page.getByRole('img', { name: /ivo-tech wordmark/i })).toBeVisible();
    await expect(page.locator('video.brand-preview-video')).toBeVisible();
    await expect(page.getByRole('link', { name: /Logo PNG/i })).toBeVisible();
  });

  test('renders EN showcase and serves key logo assets', async ({ page, request }) => {
    await page.goto('/en/brand');

    await expect(page.getByRole('heading', { level: 1, name: /Brand Showcase/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Home/i })).toBeVisible();

    const logo = await request.get('/assets/logo.avif');
    expect(logo.ok()).toBeTruthy();
    const mark = await request.get('/assets/logo-mark.avif');
    expect(mark.ok()).toBeTruthy();
    const sting = await request.get('/assets/video/logo-sting.mp4');
    expect(sting.ok()).toBeTruthy();
  });
});
