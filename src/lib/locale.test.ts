import { describe, expect, it } from 'vitest';

import { resolveLocale } from '@/lib/locale';

describe('resolveLocale', () => {
  it('returns en when locale is en', () => {
    expect(resolveLocale('en')).toBe('en');
  });

  it('falls back to de for unknown locale values', () => {
    expect(resolveLocale('fr')).toBe('de');
    expect(resolveLocale(undefined)).toBe('de');
  });
});
