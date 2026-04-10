import { describe, expect, it } from 'vitest';

import { assignHeroVariant, normalizeHeroVariant, parseHeroVariantWeights } from '@/lib/heroExperiment';

describe('hero experiment utilities', () => {
  it('normalizes invalid and empty variants to default', () => {
    expect(normalizeHeroVariant(null)).toBe('default');
    expect(normalizeHeroVariant('')).toBe('default');
    expect(normalizeHeroVariant('invalid')).toBe('default');
  });

  it('parses variant weights from CSV', () => {
    const weights = parseHeroVariantWeights('60,25,15');
    expect(weights).toEqual({ default: 60, outcome: 25, speed: 15 });
  });

  it('falls back to defaults for invalid weight strings', () => {
    const weights = parseHeroVariantWeights('foo');
    expect(weights).toEqual({ default: 50, outcome: 25, speed: 25 });
  });

  it('assigns variants based on weighted random value', () => {
    const weights = { default: 50, outcome: 25, speed: 25 };
    expect(assignHeroVariant(() => 0.1, weights)).toBe('default');
    expect(assignHeroVariant(() => 0.6, weights)).toBe('outcome');
    expect(assignHeroVariant(() => 0.95, weights)).toBe('speed');
  });
});
