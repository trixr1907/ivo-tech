import { classifyCspNoise, normalizeCspReport } from '@/server/security/cspReport';
import { describe, expect, it } from 'vitest';

describe('normalizeCspReport', () => {
  it('normalizes legacy csp-report payloads', () => {
    const report = normalizeCspReport({
      'csp-report': {
        disposition: 'report',
        'document-uri': 'https://ivo-tech.com/',
        'effective-directive': 'script-src-elem',
        'violated-directive': 'script-src-elem',
        'blocked-uri': 'inline',
        'original-policy': "default-src 'self'",
        'source-file': 'https://ivo-tech.com/_next/static/chunk.js',
        'line-number': 21,
        'column-number': 12,
        'script-sample': 'self.__next_f.push',
        referrer: ''
      }
    });

    expect(report).toMatchObject({
      disposition: 'report',
      documentUri: 'https://ivo-tech.com/',
      effectiveDirective: 'script-src-elem',
      violatedDirective: 'script-src-elem',
      blockedUri: 'inline',
      lineNumber: 21,
      columnNumber: 12
    });
  });

  it('normalizes reporting api payloads', () => {
    const report = normalizeCspReport([
      {
        type: 'csp-violation',
        body: {
          disposition: 'report',
          documentURL: 'https://ivo-tech.com/',
          effectiveDirective: 'style-src-elem',
          violatedDirective: 'style-src-elem',
          blockedURL: 'inline',
          originalPolicy: "default-src 'self'",
          sourceFile: 'https://ivo-tech.com/_next/static/chunk.css',
          lineNumber: 4,
          columnNumber: 9,
          sample: '.example { color:red }',
          referrer: ''
        }
      }
    ]);

    expect(report).toMatchObject({
      disposition: 'report',
      effectiveDirective: 'style-src-elem',
      violatedDirective: 'style-src-elem',
      blockedUri: 'inline',
      lineNumber: 4,
      columnNumber: 9
    });
  });

  it('returns null for unsupported payloads', () => {
    expect(normalizeCspReport({ foo: 'bar' })).toBeNull();
    expect(normalizeCspReport('invalid')).toBeNull();
    expect(normalizeCspReport(null)).toBeNull();
  });
});

describe('classifyCspNoise', () => {
  it('flags extension based violations as browser extension noise', () => {
    const report = normalizeCspReport({
      'csp-report': {
        disposition: 'report',
        'document-uri': 'https://ivo-tech.com/',
        'effective-directive': 'script-src-elem',
        'violated-directive': 'script-src-elem',
        'blocked-uri': 'chrome-extension://abc/script.js',
        'original-policy': "default-src 'self'",
        'source-file': '',
        'line-number': 1,
        'column-number': 1,
        'script-sample': '',
        referrer: ''
      }
    });

    expect(report).not.toBeNull();
    expect(classifyCspNoise(report!)).toBe('browser_extension');
  });

  it('flags known next runtime inline reports as noise', () => {
    const report = normalizeCspReport({
      'csp-report': {
        disposition: 'report',
        'document-uri': 'https://ivo-tech.com/',
        'effective-directive': 'script-src-elem',
        'violated-directive': 'script-src-elem',
        'blocked-uri': 'inline',
        'original-policy': "default-src 'self'",
        'source-file': 'https://ivo-tech.com/_next/static/chunks/main.js',
        'line-number': 12,
        'column-number': 1,
        'script-sample': 'self.__next_f.push([1,"abc"])',
        referrer: ''
      }
    });

    expect(report).not.toBeNull();
    expect(classifyCspNoise(report!)).toBe('next_runtime_inline');
  });

  it('keeps actionable violations as non-noise', () => {
    const report = normalizeCspReport({
      'csp-report': {
        disposition: 'report',
        'document-uri': 'https://ivo-tech.com/leistungen',
        'effective-directive': 'connect-src',
        'violated-directive': 'connect-src',
        'blocked-uri': 'https://untrusted.example',
        'original-policy': "default-src 'self'",
        'source-file': 'https://ivo-tech.com/leistungen',
        'line-number': 0,
        'column-number': 0,
        'script-sample': '',
        referrer: ''
      }
    });

    expect(report).not.toBeNull();
    expect(classifyCspNoise(report!)).toBe('none');
  });

  it('flags local development documents as local noise', () => {
    const report = normalizeCspReport({
      'csp-report': {
        disposition: 'report',
        'document-uri': 'http://localhost:3000/leistungen',
        'effective-directive': 'script-src-elem',
        'violated-directive': 'script-src-elem',
        'blocked-uri': 'http://localhost:3000/_next/static/chunk.js',
        'original-policy': "default-src 'self'",
        'source-file': '',
        'line-number': 1,
        'column-number': 1,
        'script-sample': '',
        referrer: ''
      }
    });

    expect(report).not.toBeNull();
    expect(classifyCspNoise(report!)).toBe('local_development');
  });
});
