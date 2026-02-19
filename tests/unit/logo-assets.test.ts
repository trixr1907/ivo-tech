import fs from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const REQUIRED_FILES = [
  'public/assets/logo.png',
  'public/assets/logo.webp',
  'public/assets/logo.avif',
  'public/assets/logo-mark.png',
  'public/assets/logo-mark.webp',
  'public/assets/logo-mark.avif',
  'public/assets/video/logo-sting.mp4',
  'public/assets/video/logo-sting.webm',
  'public/assets/video/logo-sting-poster.avif',
  'public/assets/video/logo-sting-captions.vtt',
  'public/assets/brand/ivo-tech-logo.glb',
  'public/assets/demo-brand-base.stl',
  'public/assets/demo-brand-hybrid-v2.stl',
  'public/favicon.ico',
  'design/logo/ivo-tech-logo-master.ai',
  'design/logo/ivo-tech-logo-master.svg',
  'design/logo/route-scorecard.md',
  'design/logo/usage-rules.md'
] as const;

describe('logo asset manifest integrity', () => {
  it('contains all required logo files with non-zero size', async () => {
    const root = process.cwd();

    for (const relPath of REQUIRED_FILES) {
      const absPath = path.join(root, relPath);
      const stat = await fs.stat(absPath);
      expect(stat.isFile(), relPath).toBe(true);
      expect(stat.size, relPath).toBeGreaterThan(0);
    }
  });
});
