import { describe, expect, it } from 'vitest';

import { getFeaturedInsights, getHubEntries, getHubEntry, getHubSlugs } from '@/content/hub';

describe('insights content API', () => {
  it('returns non-empty DE insights with stable slugs', () => {
    const insights = getHubEntries('insights', 'de');
    expect(insights.length).toBeGreaterThan(0);
    expect(getHubSlugs('insights', 'de')).toEqual(insights.map((insight) => insight.slug));
  });

  it('finds a known DE insight and returns null for unknown', () => {
    expect(getHubEntry('insights', 'de', 'architecture-decisions-under-pressure')?.slug).toBe(
      'architecture-decisions-under-pressure'
    );
    expect(getHubEntry('insights', 'de', 'unknown')).toBeNull();
  });

  it('returns featured DE insights with requested limit', () => {
    expect(getFeaturedInsights('de', 2)).toHaveLength(2);
    expect(getFeaturedInsights('de', 99).length).toBe(getHubEntries('insights', 'de').length);
  });
});
