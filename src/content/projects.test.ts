import { describe, expect, it } from 'vitest';

import { getProjectById, getProjectStatusLabel, getProjectsByTier } from '@/content/projects';

describe('projects content API', () => {
  it('finds known project ids and returns null for unknown', () => {
    expect(getProjectById('configurator_3d')?.id).toBe('configurator_3d');
    expect(getProjectById('unknown')).toBeNull();
    expect(getProjectById(null)).toBeNull();
  });

  it('returns non-empty project groups for each tier', () => {
    expect(getProjectsByTier('hero').length).toBeGreaterThan(0);
    expect(getProjectsByTier('featured').length).toBeGreaterThan(0);
    expect(getProjectsByTier('labs').length).toBeGreaterThan(0);
  });

  it('maps status labels by locale', () => {
    expect(getProjectStatusLabel('live', 'de')).toBe('Live');
    expect(getProjectStatusLabel('beta', 'en')).toBe('Private beta');
  });

  it('exposes hero-specific attribution and engineering highlights for configurator project', () => {
    const hero = getProjectById('configurator_3d');
    expect(hero?.attribution_note?.de).toContain('Technische Umsetzung');
    expect(hero?.attribution_note?.en).toContain('Technical implementation');
    expect(hero?.engineering_highlights?.de.length).toBeGreaterThanOrEqual(4);
    expect(hero?.engineering_highlights?.en.length).toBeGreaterThanOrEqual(4);
  });
});
