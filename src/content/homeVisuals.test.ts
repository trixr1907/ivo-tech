import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { HOME_SECTION_VISUALS } from '@/content/homeVisuals';

const VISUAL_BASE = '/assets/home/visuals';

describe('HOME_SECTION_VISUALS', () => {
  it('references local homepage visuals under the shared base path and ships files on disk', () => {
    for (const asset of Object.values(HOME_SECTION_VISUALS)) {
      for (const url of [asset.sources.avif, asset.sources.webp, asset.sources.fallback]) {
        expect(url.startsWith(`${VISUAL_BASE}/`)).toBe(true);
        expect(url).toMatch(/^\/assets\/home\/visuals\/[-a-z0-9.]+\.(avif|webp|png|svg)$/);
        expect(existsSync(join(process.cwd(), 'public', url))).toBe(true);
      }
      expect(asset.width).toBeGreaterThan(0);
      expect(asset.height).toBeGreaterThan(0);
      expect(asset.alt.de.length).toBeGreaterThan(24);
      expect(asset.alt.en.length).toBeGreaterThan(24);
    }
  });
});
