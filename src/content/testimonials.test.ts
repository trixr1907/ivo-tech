import { describe, expect, it } from 'vitest';

import { getPrimaryHomepageTestimonial, getPublishedTestimonials } from '@/content/testimonials';

describe('testimonials content model', () => {
  it('provides a published testimonial fallback', () => {
    const published = getPublishedTestimonials();
    expect(published.length).toBeGreaterThanOrEqual(1);
  });

  it('returns a localized primary testimonial for DE and EN', () => {
    const de = getPrimaryHomepageTestimonial('de');
    const en = getPrimaryHomepageTestimonial('en');

    expect(de.quote.length).toBeGreaterThan(0);
    expect(en.quote.length).toBeGreaterThan(0);
    expect(de.id).toBe(en.id);
  });
});
