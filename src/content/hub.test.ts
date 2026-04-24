import { describe, expect, it } from 'vitest';

import { getFeaturedInsights, getHubEntries, getHubEntry, getHubRouteGroups, getHubSlugs } from '@/content/hub';

describe('hub content loader', () => {
  it('loads DE insights from MDX and exposes stable slugs', () => {
    const insights = getHubEntries('insights', 'de');
    expect(insights.length).toBeGreaterThanOrEqual(5);
    expect(getHubSlugs('insights', 'de')).toEqual(insights.map((entry) => entry.slug));
  });

  it('loads EN translations for hub detail pages', () => {
    expect(getHubEntry('insights', 'en', 'architecture-decisions-under-pressure')?.slug).toBe(
      'architecture-decisions-under-pressure'
    );
    expect(getHubEntry('playbooks', 'en', 'performance-budget-guardrails')?.slug).toBe('performance-budget-guardrails');
    expect(getHubEntry('case-studies', 'en', 'configurator-live')?.slug).toBe('configurator-live');
  });

  it('returns featured insights with requested limit', () => {
    expect(getFeaturedInsights('de', 3)).toHaveLength(3);
  });

  it('builds route groups for DE and EN locale files', () => {
    const routeGroups = getHubRouteGroups();
    expect(routeGroups.some((group) => group.locale === 'de')).toBe(true);
    expect(routeGroups.some((group) => group.locale === 'en')).toBe(true);
  });
});
