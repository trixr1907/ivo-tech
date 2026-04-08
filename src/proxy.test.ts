import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';

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

  it('does not redirect unrelated hosts', () => {
    const request = new NextRequest('https://preview.ivo-tech.test/en/configurator?from=test');
    const response = proxy(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
  });
});
