import { describe, expect, it } from 'vitest';

import {
  buildProjectHref,
  createCloseProjectRoute,
  createOpenProjectRoute,
  parseProjectParam
} from '@/features/home/projectState';

describe('project modal route state helpers', () => {
  it('builds project hrefs with featured hash', () => {
    expect(buildProjectHref('voicebot')).toBe('?project=voicebot#featured');
  });

  it('parses project query values safely', () => {
    expect(parseProjectParam('sorare')).toBe('sorare');
    expect(parseProjectParam(['sorare'])).toBeNull();
    expect(parseProjectParam(undefined)).toBeNull();
  });

  it('creates open route while preserving existing query params', () => {
    const next = createOpenProjectRoute('/', { locale: 'de', utm_source: 'newsletter' }, 'sorare');

    expect(next).toEqual({
      pathname: '/',
      query: { locale: 'de', utm_source: 'newsletter', project: 'sorare' },
      hash: 'featured'
    });
  });

  it('creates close route by removing only project query key', () => {
    const next = createCloseProjectRoute('/', { locale: 'de', utm_source: 'newsletter', project: 'voicebot' });

    expect(next).toEqual({
      pathname: '/',
      query: { locale: 'de', utm_source: 'newsletter' },
      hash: 'featured'
    });
  });
});
