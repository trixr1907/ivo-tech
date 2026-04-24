import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { HOME_SECTION_VISUALS } from '@/content/homeVisuals';

describe('HOME_SECTION_VISUALS', () => {
  it('uses finished local SVG graphics for every homepage visual slot', () => {
    for (const asset of Object.values(HOME_SECTION_VISUALS)) {
      expect(asset.sources.fallback).toMatch(/^\/assets\/home\/visuals\/[-a-z0-9]+\.svg$/);
      expect(asset.sources.avif).toBe(asset.sources.fallback);
      expect(asset.sources.webp).toBe(asset.sources.fallback);
      expect(existsSync(join(process.cwd(), 'public', asset.sources.fallback))).toBe(true);
      expect(asset.width).toBe(1600);
      expect(asset.height).toBe(960);
      expect(asset.alt.de.length).toBeGreaterThan(24);
      expect(asset.alt.en.length).toBeGreaterThan(24);
    }
  });
});
