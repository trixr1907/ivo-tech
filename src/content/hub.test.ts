import { describe, expect, it } from 'vitest';

import { getFeaturedInsights, getHubEntries, getHubEntry, getHubRouteGroups, getHubSlugs } from '@/content/hub';

describe('hub content loader', () => {
  it('loads DE insights from MDX and exposes stable slugs', () => {
    const insights = getHubEntries('insights', 'de');
    expect(insights.length).toBeGreaterThanOrEqual(5);
    expect(getHubSlugs('insights', 'de')).toEqual(insights.map((entry) => entry.slug));
  });

  it('returns null when EN translation is missing', () => {
    expect(getHubEntry('insights', 'en', 'architecture-decisions-under-pressure')).toBeNull();
  });

  it('returns featured insights with requested limit', () => {
    expect(getFeaturedInsights('de', 3)).toHaveLength(3);
  });

  it('builds route groups only for available locale files', () => {
    const routeGroups = getHubRouteGroups();
    expect(routeGroups.some((group) => group.locale === 'de')).toBe(true);
    expect(routeGroups.some((group) => group.locale === 'en')).toBe(false);
  });
});
