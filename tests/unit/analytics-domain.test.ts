import { describe, expect, it } from 'vitest';

import { isAnalyticsHostAllowed, shouldTrackAnalyticsUrl } from '@/lib/analytics';

describe('analytics host guard', () => {
  it('allows only ivo-tech hosts by default', () => {
    expect(isAnalyticsHostAllowed('ivo-tech.com')).toBe(true);
    expect(isAnalyticsHostAllowed('www.ivo-tech.com')).toBe(true);
    expect(isAnalyticsHostAllowed('preview-foo.vercel.app')).toBe(false);
  });

  it('tracks only URLs on allowed hosts', () => {
    expect(shouldTrackAnalyticsUrl('https://ivo-tech.com/')).toBe(true);
    expect(shouldTrackAnalyticsUrl('https://www.ivo-tech.com/en/insights')).toBe(true);
    expect(shouldTrackAnalyticsUrl('https://preview-foo.vercel.app/')).toBe(false);
  });
});
