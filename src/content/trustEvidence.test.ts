import { describe, expect, it } from 'vitest';

import { getPublishedTrustEvidence } from '@/content/trustEvidence';

describe('trust evidence content', () => {
  it('provides published DE and EN trust evidence entries', () => {
    const deEvidence = getPublishedTrustEvidence('de');
    const enEvidence = getPublishedTrustEvidence('en');

    expect(deEvidence.length).toBeGreaterThanOrEqual(2);
    expect(enEvidence.length).toBe(deEvidence.length);
  });

  it('keeps at least two external proof assets published', () => {
    const evidence = getPublishedTrustEvidence('de');
    const externalAssets = evidence.filter((entry) => entry.external);
    expect(externalAssets.length).toBeGreaterThanOrEqual(2);
  });
});
