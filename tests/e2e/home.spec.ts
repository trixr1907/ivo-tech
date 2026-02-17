import { expect, test } from '@playwright/test';

test.describe('homepage critical journeys', () => {
  test('opens and closes project modal via query-state routing', async ({ page }) => {
    await page.goto('/');

    const heroCommand = page.locator('.hero-cmd').first();
    await heroCommand.click();

    await expect(page).toHaveURL(/\?project=/);
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByRole('button', { name: 'Close dialog' }).click();
    await expect(page).not.toHaveURL(/\?project=/);
  });

  test('keeps hash when toggling language', async ({ page }) => {
    await page.goto('/#featured');
    await page.locator('.locale-toggle').getByRole('link', { name: /^EN$/ }).click();

    await expect(page).toHaveURL(/\/en#featured$/);
  });

  test('serves configurator page and pizza static route', async ({ page }) => {
    await page.goto('/configurator');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/3D/i);

    await page.goto('/pizza/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Amore/i);
    await expect(page.getByRole('link', { name: /^Jetzt Bestellen$/ }).first()).toBeVisible();
  });
});
