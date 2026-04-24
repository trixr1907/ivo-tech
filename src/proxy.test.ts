// @vitest-environment node
// happy-dom: Request/NextRequest liefert kein explizites `host`-Header-Override — Proxy-Logik braucht Node-Headers.
import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { proxy } from '@/proxy';

describe('proxy', () => {
  it('redirects when host header contains www and port', () => {
    const request = new NextRequest('https://ivo-tech.com/path?x=1', {
      headers: { host: 'www.ivo-tech.com:443' }
    });
    const response = proxy(request);

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://ivo-tech.com/path?x=1');
  });

  it('redirects www host to apex host', () => {
    const request = new NextRequest('https://www.ivo-tech.com/en/configurator?from=test');
    const response = proxy(request);

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://ivo-tech.com/en/configurator?from=test');
  });

  it('keeps apex host unchanged', () => {
    const request = new NextRequest('https://ivo-tech.com/en/configurator?from=test');
    const response = proxy(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
  });

  it('adds locale and nonce-based enforce/report-only csp on normal requests', () => {
    const request = new NextRequest('https://ivo-tech.com/');
    const response = proxy(request);

    const enforce = response.headers.get('content-security-policy') ?? '';
    const reportOnly = response.headers.get('content-security-policy-report-only') ?? '';

    expect(response.status).toBe(200);
    expect(response.headers.get('content-language')).toBe('de');
    expect(enforce).toContain("script-src 'self' 'nonce-");
    expect(enforce).toContain("'strict-dynamic'");
    expect(enforce).toContain("script-src-attr 'none'");
    expect(/script-src[^;]*'unsafe-inline'/.test(enforce)).toBe(false);
    expect(enforce).not.toContain('report-uri ');
    expect(enforce).not.toContain('fonts.googleapis.com');
    expect(enforce).not.toContain('www.google.com');
    expect(reportOnly).toContain("script-src 'self' 'nonce-");
    expect(reportOnly).toContain("script-src-attr 'none'");
    expect(reportOnly).toContain('report-uri /api/security/csp-report');
    expect(reportOnly).not.toContain('fonts.googleapis.com');
    expect(reportOnly).not.toContain('www.google.com');
  });

  it('keeps pizza third-party allowlist scoped to pizza paths in report-only csp', () => {
    const request = new NextRequest('https://ivo-tech.com/pizza/index.html');
    const response = proxy(request);
    const enforce = response.headers.get('content-security-policy') ?? '';
    const reportOnly = response.headers.get('content-security-policy-report-only') ?? '';

    expect(enforce).toContain('fonts.googleapis.com');
    expect(enforce).toContain('www.google.com');
    expect(reportOnly).toContain('fonts.googleapis.com');
    expect(reportOnly).toContain('www.google.com');
  });

  it('does not redirect unrelated hosts', () => {
    const request = new NextRequest('https://preview.ivo-tech.test/en/configurator?from=test');
    const response = proxy(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
  });
});
