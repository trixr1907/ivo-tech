import fs from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

type LogoManifest = {
  manifestVersion: number;
  brand: string;
  publicAssets: string[];
  designSources: string[];
  qaSurfaces: string[];
  generator: string;
  testGuard: string;
};

const REQUIRED_PUBLIC_ASSETS = [
  '/assets/logo.png',
  '/assets/logo.webp',
  '/assets/logo.avif',
  '/assets/logo-mark.png',
  '/assets/logo-mark.webp',
  '/assets/logo-mark.avif',
  '/assets/video/logo-sting.mp4',
  '/assets/video/logo-sting.webm',
  '/assets/video/logo-sting-poster.avif',
  '/assets/video/logo-sting-captions.vtt',
  '/assets/brand/ivo-tech-logo.glb',
  '/assets/demo-brand-base.stl',
  '/assets/demo-brand-hybrid-v2.stl',
  '/favicon.ico'
] as const;

const REQUIRED_DESIGN_SOURCES = [
  'design/logo/ivo-tech-logo-master.ai',
  'design/logo/ivo-tech-logo-master.svg',
  'design/logo/routes/ivo-tech-logo-route-a.svg',
  'design/logo/routes/ivo-tech-logo-route-b.svg',
  'design/logo/route-scorecard.md',
  'design/logo/usage-rules.md'
] as const;

const REQUIRED_QA_SURFACES = ['/internal/brand-review', '/brand', '/en/brand'] as const;

function toRepoPath(root: string, filePath: string) {
  if (filePath.startsWith('/')) {
    return path.join(root, 'public', filePath.slice(1));
  }
  return path.join(root, filePath);
}

describe('logo asset manifest integrity', () => {
  it('contains all required entries and files with non-zero size', async () => {
    const root = process.cwd();
    const manifestPath = path.join(root, 'design/logo/asset-manifest.json');
    const manifestRaw = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestRaw) as LogoManifest;

    expect(manifest.manifestVersion).toBeGreaterThanOrEqual(2);
    expect(manifest.brand).toBe('ivo-tech');
    expect(manifest.testGuard).toBe('tests/unit/logo-assets.test.ts');

    for (const publicPath of manifest.publicAssets) {
      expect(publicPath.startsWith('/'), publicPath).toBe(true);
    }
    for (const surfacePath of manifest.qaSurfaces) {
      expect(surfacePath.startsWith('/'), surfacePath).toBe(true);
    }

    for (const required of REQUIRED_PUBLIC_ASSETS) {
      expect(manifest.publicAssets).toContain(required);
    }
    for (const required of REQUIRED_DESIGN_SOURCES) {
      expect(manifest.designSources).toContain(required);
    }
    for (const required of REQUIRED_QA_SURFACES) {
      expect(manifest.qaSurfaces).toContain(required);
    }

    const fileCandidates = [
      ...manifest.publicAssets,
      ...manifest.designSources,
      manifest.generator,
      manifest.testGuard
    ];
    const uniqueFiles = [...new Set(fileCandidates)];
    expect(uniqueFiles.length).toBe(fileCandidates.length);

    for (const filePath of uniqueFiles) {
      const absPath = toRepoPath(root, filePath);
      const stat = await fs.stat(absPath);
      expect(stat.isFile(), filePath).toBe(true);
      expect(stat.size, filePath).toBeGreaterThan(0);
    }
  });
});
