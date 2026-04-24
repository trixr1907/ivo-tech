import { describe, expect, it } from 'vitest';

import { copy } from '@/content/copy';

describe('home copy parity', () => {
  it('keeps DE and EN home section schema aligned', () => {
    const deHomeKeys = Object.keys(copy.de.home).sort();
    const enHomeKeys = Object.keys(copy.en.home).sort();
    expect(enHomeKeys).toEqual(deHomeKeys);
    expect(deHomeKeys).toEqual(['about', 'case', 'contact', 'faq', 'hero', 'insights', 'method', 'projects', 'proof', 'services']);
  });

  it('defines advanced contact labels in both locales', () => {
    expect(copy.de.home.contact.advanced.toggle.length).toBeGreaterThan(0);
    expect(copy.de.home.contact.advanced.hint.length).toBeGreaterThan(0);
    expect(copy.en.home.contact.advanced.toggle.length).toBeGreaterThan(0);
    expect(copy.en.home.contact.advanced.hint.length).toBeGreaterThan(0);
  });
});
