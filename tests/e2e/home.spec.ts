import { expect, test, type APIRequestContext, type APIResponse } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function requestGetWithRetry(request: APIRequestContext, path: string, attempts = 3): Promise<APIResponse> {
  let lastError: unknown;
  for (let index = 0; index < attempts; index += 1) {
    try {
      return await request.get(path);
    } catch (error) {
      lastError = error;
      if (index < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }
  }
  throw lastError;
}

test.describe('homepage critical journeys', () => {
  test('has no critical accessibility violations on DE and EN homepages', async ({ page }) => {
    for (const path of ['/', '/en']) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const analysis = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      const criticalViolations = analysis.violations.filter((violation) => violation.impact === 'critical');

      expect(criticalViolations, `${path} has critical axe violations`).toEqual([]);
    }
  });

  test('opens and closes project modal via query-state routing', async ({ page }) => {
    await page.goto('/');

    const technicalDetailsLink = page.getByRole('link', { name: /Technische Details|Technical details/i });
    const brandModelRequest = page.waitForRequest((req) => req.url().includes('/assets/demo-brand-hybrid-v2.stl'));
    const brandLogoRequest = page.waitForRequest((req) => req.url().includes('/assets/brand/ivo-tech-logo.glb'));
    await technicalDetailsLink.click();

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

  test('renders proof bar and hero teaser media', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.proof-bar-item')).toHaveCount(3);
    await expect(page.locator('.hero-teaser-video, .hero-teaser-poster')).toBeVisible();
  });

  test('keeps hash when toggling language', async ({ page }) => {
    await page.goto('/#featured');
    await page.locator('.locale-toggle').getByRole('link', { name: /switch language to english/i }).click();

    await expect(page).toHaveURL(/\/en#featured$/);
  });

  test('delivers locale-specific html lang on DE and EN routes', async ({ request }) => {
    const deResponse = await requestGetWithRetry(request, '/');
    expect(deResponse.ok()).toBeTruthy();
    const deHtml = await deResponse.text();
    expect(deHtml).toContain('<html lang="de"');

    const enResponse = await requestGetWithRetry(request, '/en');
    expect(enResponse.ok()).toBeTruthy();
    const enHtml = await enResponse.text();
    expect(enHtml).toContain('<html lang="en"');
  });

  test('does not emit hydration mismatch errors on DE and EN homepages', async ({ page }) => {
    const hydrationSignals: string[] = [];
    const hydrationPattern = /(hydration|did not match|server-rendered html)/i;

    page.on('console', (message) => {
      if (message.type() !== 'error') return;
      const text = message.text();
      if (hydrationPattern.test(text)) hydrationSignals.push(text);
    });

    page.on('pageerror', (error) => {
      if (hydrationPattern.test(error.message)) hydrationSignals.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    expect(hydrationSignals).toEqual([]);
  });

  test('keeps one consistent primary CTA across core sections', async ({ page }) => {
    await page.goto('/');
    const primaryCaseCtas = page.getByRole('link', { name: /case study/i });
    await expect(primaryCaseCtas.first()).toBeVisible();
    expect(await primaryCaseCtas.count()).toBeGreaterThanOrEqual(3);
  });

  test('shows sticky primary CTA on mobile viewport only', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.global-contact-cta')).toBeHidden();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expect(page.locator('.global-contact-cta')).toBeVisible();
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
    await page.goto('/#contact');

    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('E-Mail').fill('test@example.com');
    await page.getByLabel('Kontext in 2-5 Saetzen').fill('Ich moechte ein kurzes Kennenlernen zum Team-Setup einplanen.');
    await page.getByRole('button', { name: 'Anfrage senden' }).click();

    await expect(page.getByRole('status')).toContainText('Danke.');
  });

  test('renders FAQ content and FAQPage schema', async ({ page, request }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 2, name: 'FAQ' })).toBeVisible();

    const firstFaqTrigger = page.locator('.faq-list .ui-accordion-trigger').first();
    await firstFaqTrigger.click();
    await expect(firstFaqTrigger).toHaveAttribute('aria-expanded', 'true');

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
    expect(sitemapXml).toContain('<loc>https://ivo-tech.com/en/insights/architecture-decisions-under-pressure</loc>');
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

  test('serves playbooks and case-studies hubs including EN detail translations', async ({ request }) => {
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

    const enPlaybookDetail = await request.get('/en/playbooks/performance-budget-guardrails');
    expect(enPlaybookDetail.ok()).toBeTruthy();

    const enInsightDetail = await request.get('/en/insights/architecture-decisions-under-pressure');
    expect(enInsightDetail.ok()).toBeTruthy();

    const enCaseStudyDetail = await request.get('/en/case-studies/configurator-live');
    expect(enCaseStudyDetail.ok()).toBeTruthy();
  });

  test('brand routes are available and internal ab-report routes return not found', async ({ request }) => {
    const brandDe = await request.get('/brand');
    expect(brandDe.status()).toBe(200);

    const brandEn = await request.get('/en/brand');
    expect(brandEn.status()).toBe(200);

    const brandReview = await request.get('/internal/brand-review');
    expect(brandReview.status()).toBe(404);

    const abReportPage = await request.get('/internal/ab-report');
    expect(abReportPage.status()).toBe(404);

    const abReportApi = await request.get('/api/internal/ab-report');
    expect(abReportApi.status()).toBe(404);
  });
});
