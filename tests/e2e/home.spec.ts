import { expect, test } from '@playwright/test';

test.describe('homepage critical journeys', () => {
  test('opens and closes project modal via query-state routing', async ({ page }) => {
    await page.goto('/');

    const heroCommand = page.locator('.hero-cmd').first();
    const brandModelRequest = page.waitForRequest((req) => req.url().includes('/assets/demo-brand-hybrid-v2.stl'));
    const brandLogoRequest = page.waitForRequest((req) => req.url().includes('/assets/brand/ivo-tech-logo.glb'));
    await heroCommand.click();

    await expect(page).toHaveURL(/\?project=/);
    await expect(page.getByRole('dialog')).toBeVisible();
    await brandModelRequest;
    await brandLogoRequest;

    await page.locator('.dialog-close').click();
    await expect(page).not.toHaveURL(/\?project=/);
  });

  test('renders hero-case attribution and engineering snapshot', async ({ page }) => {
    await page.goto('/#hero-case');
    await expect(page.locator('.hero-case-attribution')).toBeVisible();
    await expect(page.locator('.hero-case-engineering h4')).toContainText(/engineering/i);
    await expect(page.locator('.hero-case-engineering li').first()).toBeVisible();
  });

  test('keeps hash when toggling language', async ({ page }) => {
    await page.goto('/#featured');
    await page.locator('.locale-toggle').getByRole('link', { name: /^EN$/ }).click();

    await expect(page).toHaveURL(/\/en#featured$/);
  });

  test('serves configurator page and pizza static route', async ({ page }) => {
    await page.goto('/configurator');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/3D.*Tech/i);

    await page.goto('/en/configurator');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/3D.*tech/i);

    await page.goto('/pizza/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Amore/i);
    await expect(page.getByRole('link', { name: /^Jetzt Bestellen$/ }).first()).toBeVisible();
  });

  test('submits contact form successfully on homepage', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /(Architekturgespraech|Kontaktgespraech)/i }).first().click();

    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('E-Mail').fill('test@example.com');
    await page.getByLabel('Kontext in 2-5 Saetzen').fill('Ich moechte ein kurzes Kennenlernen zum Team-Setup einplanen.');
    await page.getByRole('button', { name: 'Anfrage senden' }).click();

    await expect(page.getByRole('status')).toContainText('Danke.');
  });

  test('renders FAQ content and FAQPage schema', async ({ page, request }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 2, name: 'FAQ' })).toBeVisible();

    const firstFaq = page.locator('.faq-item').first();
    await firstFaq.locator('summary').click();
    await expect(firstFaq).toHaveAttribute('open', '');

    const homeResponse = await request.get('/');
    expect(homeResponse.ok()).toBeTruthy();
    const homeHtml = await homeResponse.text();
    expect(homeHtml).toContain('"@type":"FAQPage"');
  });

  test('serves SEO alternates on configurator routes', async ({ request }) => {
    const deResponse = await request.get('/configurator');
    expect(deResponse.ok()).toBeTruthy();
    const deHtml = await deResponse.text();
    expect(deHtml).toContain('hrefLang="de"');
    expect(deHtml).toContain('hrefLang="en"');
    expect(deHtml).toContain('hrefLang="x-default"');

    const enResponse = await request.get('/en/configurator');
    expect(enResponse.ok()).toBeTruthy();
    const enHtml = await enResponse.text();
    expect(enHtml).toContain('hrefLang="de"');
    expect(enHtml).toContain('hrefLang="en"');
    expect(enHtml).toContain('hrefLang="x-default"');
  });

  test('serves dynamic sitemap and noindex header for pizza demo', async ({ request }) => {
    const sitemapResponse = await request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    expect(sitemapResponse.headers()['content-type']).toContain('application/xml');
    const sitemapXml = await sitemapResponse.text();
    expect(sitemapXml).toContain('<loc>https://ivo-tech.com/</loc>');
    expect(sitemapXml).toContain('<loc>https://ivo-tech.com/en</loc>');
    expect(sitemapXml).toContain('<loc>https://ivo-tech.com/insights</loc>');
    expect(sitemapXml).toContain('<loc>https://ivo-tech.com/en/insights</loc>');
    expect(sitemapXml).toContain('<loc>https://ivo-tech.com/playbooks</loc>');
    expect(sitemapXml).toContain('<loc>https://ivo-tech.com/case-studies</loc>');
    expect(sitemapXml).toContain('<loc>https://ivo-tech.com/insights/architecture-decisions-under-pressure</loc>');
    expect(sitemapXml).not.toContain('<loc>https://ivo-tech.com/en/insights/architecture-decisions-under-pressure</loc>');
    expect(sitemapXml).toContain('<lastmod>');
    expect(sitemapXml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    expect(sitemapXml).toContain('hreflang="x-default"');

    const pizzaResponse = await request.get('/pizza/index.html');
    expect(pizzaResponse.ok()).toBeTruthy();
    expect(pizzaResponse.headers()['x-robots-tag']).toContain('noindex');
  });

  test('serves insights index and article schema', async ({ page, request }) => {
    await page.goto('/insights');
    await expect(page.getByRole('heading', { level: 1, name: /Engineering/i })).toBeVisible();
    await expect(page.locator('.insight-card').first()).toBeVisible();

    const articleResponse = await request.get('/insights/architecture-decisions-under-pressure');
    expect(articleResponse.ok()).toBeTruthy();
    const articleHtml = await articleResponse.text();
    expect(articleHtml).toContain('\"@type\":\"Article\"');
  });

  test('serves playbooks and case-studies hubs and returns 404 for missing EN detail translation', async ({ request }) => {
    const playbooksIndex = await request.get('/playbooks');
    expect(playbooksIndex.ok()).toBeTruthy();
    const playbooksHtml = await playbooksIndex.text();
    expect(playbooksHtml).toContain('Engineering Playbooks');

    const caseStudiesIndex = await request.get('/case-studies');
    expect(caseStudiesIndex.ok()).toBeTruthy();
    const caseStudiesHtml = await caseStudiesIndex.text();
    expect(caseStudiesHtml).toContain('Case Studies');

    const deDetail = await request.get('/playbooks/performance-budget-guardrails');
    expect(deDetail.ok()).toBeTruthy();

    const enMissingDetail = await request.get('/en/playbooks/performance-budget-guardrails');
    expect(enMissingDetail.status()).toBe(404);
  });
});
