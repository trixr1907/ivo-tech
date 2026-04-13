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

test.describe('homepage redesign critical journeys', () => {
  test('meets performance budget smoke targets on homepage', async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __perfMetrics?: { fcp?: number; lcp?: number } }).__perfMetrics = {};

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            (window as unknown as { __perfMetrics: { fcp?: number } }).__perfMetrics.fcp = entry.startTime;
          }
        }
      }).observe({ type: 'paint', buffered: true });

      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (!last) return;
        (window as unknown as { __perfMetrics: { lcp?: number } }).__perfMetrics.lcp = last.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(400);

    const metrics = await page.evaluate(() => (window as unknown as { __perfMetrics?: { fcp?: number; lcp?: number } }).__perfMetrics ?? {});
    const resourcesCount = await page.evaluate(() => performance.getEntriesByType('resource').length);

    expect(metrics.fcp ?? Number.POSITIVE_INFINITY).toBeLessThan(2500);
    expect(metrics.lcp ?? Number.POSITIVE_INFINITY).toBeLessThan(4500);
    expect(resourcesCount).toBeLessThan(140);
  });

  test('has no critical accessibility violations on DE and EN homepages', async ({ page }) => {
    for (const path of ['/', '/en']) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const analysis = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      const criticalViolations = analysis.violations.filter((violation) => violation.impact === 'critical');
      expect(criticalViolations, `${path} has critical axe violations`).toEqual([]);
    }
  });

  test('renders required homepage sections on DE route', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(/B2B-System läuft/i);
    await expect(page.getByRole('link', { name: /Interview\s*\/\s*Hiring/i }).first()).toHaveAttribute('href', '/hiring');
    await expect(page.getByRole('link', { name: 'CV & Verfügbarkeit' }).first()).toHaveAttribute('href', '/resume');
    await expect(page.getByText('Beweis')).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'Ausgewählte Projekte' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'Engineering Insights' })).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('keeps homepage layout stable without horizontal overflow across breakpoints', async ({ page }) => {
    const breakpoints = [
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1280, height: 900 },
      { width: 1536, height: 960 }
    ] as const;

    for (const viewport of breakpoints) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const hasOverflow = await page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth - root.clientWidth > 1;
      });
      expect(hasOverflow, `overflow on ${viewport.width}x${viewport.height}`).toBeFalsy();
    }
  });

  test('renders section visuals with localized alt text on DE and EN routes', async ({ page }) => {
    for (const route of ['/', '/en'] as const) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      const visualCards = page.locator('.home-section-visual-card');
      await expect(visualCards).toHaveCount(7);
      const visualImages = page.locator('.home-section-visual-card img');
      const imageCount = await visualImages.count();
      expect(imageCount).toBe(7);
      for (let index = 0; index < imageCount; index += 1) {
        const img = visualImages.nth(index);
        await expect(img).toHaveAttribute('alt', /.+/);
      }
    }
  });

  test('keeps homepage stable with query params on DE and EN routes', async ({ page }) => {
    await page.goto('/?exp_hero=outcome#contact');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/B2B-System läuft/i);
    await expect(page.getByRole('link', { name: /Interview\s*\/\s*Hiring/i }).first()).toHaveAttribute('href', '/hiring');
    await expect(page.locator('a[data-contact-cta="scheduler"]')).toHaveAttribute('href', /exp_hero=outcome/);

    await page.goto('/en?exp_hero=speed#contact');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/B2B system runs/i);
    await expect(page.getByRole('link', { name: /Interview\s*\/\s*Hiring/i }).first()).toHaveAttribute('href', '/en/hiring');
    await expect(page.locator('a[data-contact-cta="scheduler"]')).toHaveAttribute('href', /exp_hero=speed/);
  });

  test('renders DE and EN services pages with contact attribution links', async ({ page }) => {
    await page.goto('/leistungen');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Leistungen: Technical Delivery/i);
    await expect(page.getByRole('link', { name: 'Scope-Call anfragen' }).first()).toHaveAttribute(
      'href',
      '/contact?source=services-scope-call'
    );
    await expect(page.locator('a[data-service-cta="hero-secondary-case"]')).toHaveAttribute('href', '/case-studies?source=services-case');
    await expect(page.getByRole('heading', { level: 3, name: 'Build' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'Stabilize' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'Accelerate' })).toBeVisible();
    await expect(page.locator('a[data-service-cta="package-build"]')).toHaveAttribute('href', '/contact?source=services-build');
    await expect(page.locator('a[data-service-cta="package-detail-build"]')).toHaveAttribute(
      'href',
      '/leistungen/web-engineering-delivery?source=services-detail'
    );

    await page.goto('/en/services');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Services: Technical delivery/i);
    await expect(page.getByRole('link', { name: 'Request scope call' }).first()).toHaveAttribute(
      'href',
      '/en/contact?source=services-scope-call'
    );
    await expect(page.locator('a[data-service-cta="hero-secondary-case"]')).toHaveAttribute('href', '/en/case-studies?source=services-case');
    await expect(page.locator('a[data-service-cta="package-accelerate"]')).toHaveAttribute(
      'href',
      '/en/contact?source=services-accelerate'
    );
    await expect(page.locator('a[data-service-cta="package-detail-accelerate"]')).toHaveAttribute(
      'href',
      '/en/services/3d-visualization-systems?source=services-detail'
    );
  });

  test('renders service detail pages with deep links and FAQ', async ({ page }) => {
    await page.goto('/leistungen/web-engineering-delivery?source=services-detail');
    await expect(page.getByRole('heading', { level: 1, name: 'Web Engineering Delivery' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Outcome-Komparator' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Risk Matrix' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Architecture Snapshot' })).toBeVisible();
    await expect(page.locator('a[data-service-detail-cta="related-case"]')).toHaveAttribute(
      'href',
      '/case-studies/portfolio-authority-relaunch?source=service-detail-web-engineering-delivery-case'
    );
    await expect(page.locator('a[data-service-detail-cta="related-insight"]')).toHaveAttribute(
      'href',
      '/insights/architecture-decisions-under-pressure?source=service-detail-web-engineering-delivery-insight'
    );
    await expect(page.getByRole('heading', { level: 2, name: 'FAQ' })).toBeVisible();

    await page.goto('/en/services/ai-automation-workflows?source=services-detail');
    await expect(page.getByRole('heading', { level: 1, name: 'AI Automation Workflows' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Outcome Comparator' })).toBeVisible();
    await expect(page.locator('a[data-service-detail-cta="related-playbook"]')).toHaveAttribute(
      'href',
      '/en/playbooks/api-integration-readiness-playbook?source=service-detail-ai-automation-workflows-playbook'
    );
  });

  test('uses unified global nav links on hub pages', async ({ page }) => {
    await page.goto('/insights');
    await expect(page.getByRole('link', { name: 'Maker Lab' }).first()).toHaveAttribute('href', '/maker-lab');
    await expect(page.getByRole('link', { name: 'Kontakt' }).first()).toHaveAttribute('href', '/contact?source=primary-nav');
    await expect(page.locator('a[data-hub-cta="header-primary"]').first()).toBeVisible();
    await expect(page.locator('a[data-hub-cta="list-item-open"]').first()).toBeVisible();

    await page.goto('/case-studies/configurator-live');
    const hubHeaderBooking = page.locator('a[data-hub-cta="header-primary"]').first();
    await expect(hubHeaderBooking).toBeVisible();
    await expect(hubHeaderBooking).toHaveAttribute('href', /cal\.com/);
    await expect(
      page.locator('header a[href*="contact?source=hub-case-studies-detail"]').first()
    ).toBeVisible();
    await expect(page.locator('a[data-hub-cta="case-structure-primary"]')).toBeVisible();
    await expect(page.locator('a[data-hub-cta="case-structure-secondary"]')).toBeVisible();
  });

  test('supports mobile navigation drawer', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.getByRole('button', { name: 'Navigation öffnen' }).click();
    await expect(page.getByRole('navigation', { name: 'Mobile Navigation' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('navigation', { name: 'Mobile Navigation' })).toBeHidden();
  });

  test('renders trust project signals with status badges', async ({ page }) => {
    await page.goto('/');
    const proofSection = page.locator('#home-proof');
    await expect(proofSection.getByRole('heading', { level: 3, name: 'Öffentliche Belege' })).toBeVisible();
    const proofCards = proofSection.locator(
      'a[href*="deinlieblingsdruck.de"], a[href*="github.com"], a[href*="/case-studies/portfolio-authority-relaunch"]'
    );
    await expect(proofCards).toHaveCount(3);
    await expect(proofSection.getByText('Nur verifizierte Artefakte in der zentralen Vertrauensebene.')).toBeVisible();
  });

  test('renders case-study outcome snapshot block for configured entries', async ({ page }) => {
    await page.goto('/case-studies/configurator-live');
    await expect(page.getByRole('heading', { level: 2, name: /Outcome snapshot|Ergebnis-Snapshot/i })).toBeVisible();
    await expect(page.getByText('Betriebsstatus')).toBeVisible();
  });

  test('submits the new contact lead form successfully', async ({ page }) => {
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, requestId: 'contact_test_123' })
      });
    });

    await page.goto('/?exp_hero=outcome#contact');

    const contactLeadForm = page.locator('#contact form').filter({
      has: page.getByRole('button', { name: 'Anfrage senden' })
    });
    await contactLeadForm.getByLabel('Intent').selectOption('client');
    await contactLeadForm.getByRole('textbox', { name: 'Name', exact: true }).fill('Test User');
    await contactLeadForm.getByLabel('Business-E-Mail').fill('test@example.com');
    await contactLeadForm.getByLabel('Kontext').fill('Wir wollen qualifizierte Leads und klarere Positionierung.');
    await contactLeadForm.locator('input[name="gdpr-consent"]').check();
    await contactLeadForm.getByRole('button', { name: 'Anfrage senden' }).click();

    await expect(page).toHaveURL(/\/thanks\?source=home&exp_hero=outcome/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Anfrage erfolgreich gesendet');
    await expect(page.locator('a[data-thanks-cta="primary"]')).toHaveAttribute('href', '/case-studies/configurator-live');
    await expect(page.locator('a[data-thanks-cta="scheduler"]')).toHaveAttribute('href', /source=home/);
    await expect(page.locator('a[data-thanks-cta="scheduler"]')).toHaveAttribute('href', /exp_hero=outcome/);
    await expect(page.locator('a[data-thanks-cta="scheduler"]')).toHaveAttribute('href', /utm_campaign=scheduler-thank-you/);
    await expect(page.locator('a[data-thanks-cta="scheduler"]')).toHaveAttribute('href', /utm_content=hero-outcome/);
  });

  test('personalizes thank-you primary CTA by source', async ({ page }) => {
    await page.goto('/thanks?source=services');
    await expect(page.locator('a[data-thanks-cta="primary"]')).toHaveAttribute('href', '/leistungen');
    await expect(page.locator('a[data-thanks-cta="scheduler"]')).toHaveAttribute('href', /source=services/);

    await page.goto('/en/thanks?source=hub-case-studies-detail');
    await expect(page.locator('a[data-thanks-cta="primary"]')).toHaveAttribute('href', '/en/case-studies');
    await expect(page.locator('a[data-thanks-cta="scheduler"]')).toHaveAttribute('href', /source=hub-case-studies-detail/);
  });

  test('shows scheduler CTA in contact section with attribution', async ({ page }) => {
    await page.goto('/?source=services-build#contact');
    await expect(page.locator('a[data-contact-cta="scheduler"]')).toBeVisible();
    await expect(page.locator('a[data-contact-cta="scheduler"]')).toHaveAttribute('href', /source=services-build/);
    await expect(page.locator('a[data-contact-cta="scheduler"]')).toHaveAttribute('href', /exp_hero=default/);
    await expect(page.locator('a[data-contact-cta="scheduler"]')).toHaveAttribute('href', /utm_campaign=scheduler-contact-form/);
  });

  test('keeps homepage JSON-LD and FAQ schema in HTML output', async ({ request }) => {
    const homeResponse = await requestGetWithRetry(request, '/');
    expect(homeResponse.ok()).toBeTruthy();
    const homeHtml = await homeResponse.text();
    expect(homeHtml).toContain('"@type":"WebSite"');
    expect(homeHtml).toContain('"@type":"FAQPage"');
  });

  test('serves dynamic sitemap with x-default hreflang', async ({ request }) => {
    const sitemapResponse = await request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    expect(sitemapResponse.headers()['content-type']).toContain('application/xml');

    const sitemapXml = await sitemapResponse.text();
    expect(sitemapXml).toContain('<loc>https://ivo-tech.com/</loc>');
    expect(sitemapXml).toContain('<loc>https://ivo-tech.com/en</loc>');
    expect(sitemapXml).toContain('hreflang="x-default"');
  });

  test('core strategic pages are reachable', async ({ request }) => {
    const routes = [
      '/configurator',
      '/about',
      '/projects',
      '/maker-lab',
      '/contact',
      '/hiring',
      '/resume',
      '/case-studies',
      '/insights',
      '/playbooks',
      '/leistungen',
      '/leistungen/web-engineering-delivery',
      '/leistungen/ai-automation-workflows',
      '/leistungen/3d-visualization-systems',
      '/impressum',
      '/datenschutz',
      '/en/configurator',
      '/en/about',
      '/en/projects',
      '/en/maker-lab',
      '/en/contact',
      '/en/hiring',
      '/en/resume',
      '/en/case-studies',
      '/en/insights',
      '/en/playbooks',
      '/en/services',
      '/en/services/web-engineering-delivery',
      '/en/services/ai-automation-workflows',
      '/en/services/3d-visualization-systems',
      '/en/legal',
      '/en/privacy'
    ];
    for (const route of routes) {
      const response = await request.get(route);
      expect(response.ok(), `${route} should be reachable`).toBeTruthy();
    }
  });
});
