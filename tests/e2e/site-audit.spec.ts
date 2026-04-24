import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/** Öffentliche Routen inkl. Danke, Brand, Hub-Detail (je ein fester Slug), 404. */
const AUDIT_ROUTES = [
  '/',
  '/en',
  '/brand',
  '/en/brand',
  '/thanks',
  '/en/thanks',
  '/configurator',
  '/en/configurator',
  '/about',
  '/en/about',
  '/projects',
  '/en/projects',
  '/maker-lab',
  '/en/maker-lab',
  '/contact',
  '/en/contact',
  '/hiring',
  '/en/hiring',
  '/resume',
  '/en/resume',
  '/case-studies',
  '/en/case-studies',
  '/insights',
  '/en/insights',
  '/insights/ai-assisted-pr-review-loop',
  '/en/insights/ai-assisted-pr-review-loop',
  '/playbooks',
  '/en/playbooks',
  '/playbooks/handover-production-readiness-playbook',
  '/en/playbooks/handover-production-readiness-playbook',
  '/leistungen',
  '/en/services',
  '/leistungen/web-engineering-delivery',
  '/en/services/web-engineering-delivery',
  '/impressum',
  '/datenschutz',
  '/en/legal',
  '/en/privacy',
  '/not-a-real-page-ivo-audit-404'
] as const;

const AXE_SAMPLE_ROUTES = [
  '/',
  '/en',
  '/contact',
  '/leistungen',
  '/case-studies',
  '/en/case-studies',
  '/insights',
  '/impressum',
  '/datenschutz',
  '/en/privacy'
] as const;

const REQUIRED_DE_NAV_PATHS = ['/leistungen', '/playbooks', '/resume'] as const;
const REQUIRED_EN_NAV_PATHS = ['/en/services', '/en/playbooks', '/en/resume'] as const;

test.describe('site-wide audit', () => {
  test('all audit routes return expected HTTP status', async ({ request }) => {
    for (const route of AUDIT_ROUTES) {
      const response = await request.get(route);
      if (route === '/not-a-real-page-ivo-audit-404') {
        expect(response.status(), `${route} should be 404`).toBe(404);
      } else {
        expect(response.ok(), `${route} should be reachable`).toBeTruthy();
      }
    }
  });

  test('homepages DE/EN load without page-level JS errors', async ({ page }) => {
    for (const path of ['/', '/en'] as const) {
      const pageErrors: string[] = [];
      const onErr = (err: Error) => pageErrors.push(err.message);
      page.on('pageerror', onErr);
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);
      page.off('pageerror', onErr);
      expect(pageErrors, `${path}: ${pageErrors.join(' | ')}`).toEqual([]);
    }
  });

  test('axe critical violations on representative pages', async ({ page }) => {
    for (const path of AXE_SAMPLE_ROUTES) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const analysis = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      const critical = analysis.violations.filter((v) => v.impact === 'critical');
      expect(critical, `${path} critical axe`).toEqual([]);
    }
  });

  test('internal links from DE and EN home resolve (sample crawl)', async ({ page, request }) => {
    for (const start of ['/', '/en'] as const) {
      await page.goto(start);
      await page.waitForLoadState('domcontentloaded');
      const hrefs = await page.$$eval('a[href^="/"]', (anchors) =>
        [...new Set(anchors.map((a) => a.getAttribute('href')).filter(Boolean))].slice(0, 48)
      );
      for (const href of hrefs) {
        if (!href) continue;
        const pathOnly = href.split('#')[0]?.split('?')[0] ?? '';
        if (!pathOnly.startsWith('/')) continue;
        const res = await request.get(pathOnly);
        expect(res.ok(), `from ${start} link ${pathOnly}`).toBeTruthy();
      }
    }
  });

  test('primary navigation includes expanded key pages (DE/EN)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const deHrefs = await page.$$eval('header nav a[href^="/"]', (anchors) =>
      [...new Set(anchors.map((a) => a.getAttribute('href')).filter(Boolean))]
    );
    for (const required of REQUIRED_DE_NAV_PATHS) {
      expect(deHrefs).toContain(required);
    }

    await page.goto('/en');
    await page.waitForLoadState('domcontentloaded');
    const enHrefs = await page.$$eval('header nav a[href^="/"]', (anchors) =>
      [...new Set(anchors.map((a) => a.getAttribute('href')).filter(Boolean))]
    );
    for (const required of REQUIRED_EN_NAV_PATHS) {
      expect(enHrefs).toContain(required);
    }
  });

  test('hub pages avoid broken #contact footer anchors', async ({ page }) => {
    await page.goto('/playbooks');
    await page.waitForLoadState('domcontentloaded');
    const footerContact = page.locator('footer a', { hasText: /Kontaktformular|Contact form/i }).first();
    await expect(footerContact).toHaveAttribute('href', /\/contact\?source=footer-contact/);
  });

  test('sitemap endpoint is reachable and contains key routes', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.ok()).toBeTruthy();
    const xml = await response.text();
    expect(xml).toContain('/playbooks');
    expect(xml).toContain('/resume');
    expect(xml).toContain('/leistungen');
  });
});
