import { describe, expect, it } from 'vitest';

import { resolveLogoAssetPath } from '@/components/brand/logoAssets';

describe('logoAssets', () => {
  it('resolves premium variants when available', () => {
    const path = resolveLogoAssetPath('lockup-horizontal', 'dark', 'premium');
    expect(path).toContain('__lockup-horizontal__premium__dark__v1.1.0.svg');
  });

  it('falls back to static variant when premium does not exist', () => {
    const path = resolveLogoAssetPath('mark-micro', 'dark', 'premium');
    expect(path).toContain('__mark-micro__static__dark__v1.0.0.svg');
  });
});
