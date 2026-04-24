#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import pngToIco from 'png-to-ico';
import sharp from 'sharp';

const ROOT = process.cwd();
const ASSETS_DIR = path.join(ROOT, 'public', 'assets');
const LOGO_DIR = path.join(ASSETS_DIR, 'logo');
const SOURCE_DIR = path.join(ROOT, 'design', 'logo', 'source', 'ref103632');
const VERSION = '1.0.0';

const REQUIRED_SOURCE_FILES = {
  mainLockup: 'main-lockup.svg',
  submark: 'submark.svg',
  icon: 'icon.svg',
  favicon: 'favicon.svg'
};

const OPTIONAL_SOURCE_FILES = {
  wordmark: 'wordmark.svg'
};

const ASSET_BLUEPRINT = [
  { asset: 'lockup-horizontal', role: 'lockup', sourceKey: 'mainLockup' },
  { asset: 'lockup-stacked', role: 'lockup', sourceKey: 'mainLockup' },
  { asset: 'mark-detailed', role: 'mark', sourceKey: 'submark' },
  { asset: 'mark-core', role: 'mark', sourceKey: 'submark' },
  { asset: 'mark-micro', role: 'mark', sourceKey: 'icon' },
  { asset: 'wordmark', role: 'wordmark', sourceKey: 'wordmark' }
];

const THEMES = ['dark', 'light', 'mono'];

const RECOMMENDED_SIZES = {
  'mark-detailed': [160, 256, 384, 512],
  'mark-core': [32, 48, 64, 96, 128],
  'mark-micro': [16, 24, 32],
  wordmark: [120, 180, 240, 320],
  'lockup-horizontal': [180, 240, 320, 400],
  'lockup-stacked': [180, 256, 320]
};

function sourcePath(filename) {
  return path.join(SOURCE_DIR, filename);
}

async function ensureDirectories() {
  await fs.mkdir(LOGO_DIR, { recursive: true });
}

async function assertSourceFiles() {
  const requiredPaths = Object.values(REQUIRED_SOURCE_FILES).map((name) => sourcePath(name));

  for (const requiredPath of requiredPaths) {
    const stat = await fs.stat(requiredPath);
    if (!stat.isFile() || stat.size === 0) {
      throw new Error(`Invalid source asset: ${requiredPath}`);
    }
  }
}

async function getSourceBuffers() {
  const buffers = new Map();

  for (const [key, filename] of Object.entries(REQUIRED_SOURCE_FILES)) {
    buffers.set(key, await fs.readFile(sourcePath(filename)));
  }

  for (const [key, filename] of Object.entries(OPTIONAL_SOURCE_FILES)) {
    try {
      buffers.set(key, await fs.readFile(sourcePath(filename)));
    } catch {
      // Keep optional source unset.
    }
  }

  return buffers;
}

async function writeLogoSvgs(sourceBuffers) {
  const writeTasks = [];

  for (const blueprint of ASSET_BLUEPRINT) {
    const sourceBuffer = sourceBuffers.get(blueprint.sourceKey) ?? sourceBuffers.get('mainLockup');
    if (!sourceBuffer) {
      throw new Error(`Missing source buffer for ${blueprint.asset}`);
    }

    for (const theme of THEMES) {
      const filename = `ivo-logo__${blueprint.asset}__static__${theme}__v${VERSION}.svg`;
      const absolutePath = path.join(LOGO_DIR, filename);
      writeTasks.push(fs.writeFile(absolutePath, sourceBuffer));
    }
  }

  await Promise.all(writeTasks);
}

async function writeLegacyAliases() {
  const lockupSvgPath = path.join(LOGO_DIR, `ivo-logo__lockup-horizontal__static__dark__v${VERSION}.svg`);
  const markSvgPath = path.join(LOGO_DIR, `ivo-logo__mark-core__static__dark__v${VERSION}.svg`);
  const lockupSvg = await fs.readFile(lockupSvgPath);
  const markSvg = await fs.readFile(markSvgPath);

  await sharp(lockupSvg).resize(2400, 920, { fit: 'contain' }).png({ compressionLevel: 9 }).toFile(path.join(ASSETS_DIR, 'logo.png'));
  await sharp(lockupSvg).resize(2400, 920, { fit: 'contain' }).webp({ quality: 82, effort: 6 }).toFile(path.join(ASSETS_DIR, 'logo.webp'));
  await sharp(lockupSvg).resize(2400, 920, { fit: 'contain' }).avif({ quality: 58, effort: 8 }).toFile(path.join(ASSETS_DIR, 'logo.avif'));

  await sharp(markSvg).resize(1024, 1024, { fit: 'contain' }).png({ compressionLevel: 9 }).toFile(path.join(ASSETS_DIR, 'logo-mark.png'));
  await sharp(markSvg).resize(1024, 1024, { fit: 'contain' }).webp({ quality: 82, effort: 6 }).toFile(path.join(ASSETS_DIR, 'logo-mark.webp'));
  await sharp(markSvg).resize(1024, 1024, { fit: 'contain' }).avif({ quality: 58, effort: 8 }).toFile(path.join(ASSETS_DIR, 'logo-mark.avif'));
}

async function writeFavicon(sourceBuffers) {
  const faviconSource = sourceBuffers.get('favicon');
  if (!faviconSource) throw new Error('Missing favicon source');

  const png16 = await sharp(faviconSource).resize(16, 16, { fit: 'contain' }).png({ compressionLevel: 9 }).toBuffer();
  const png32 = await sharp(faviconSource).resize(32, 32, { fit: 'contain' }).png({ compressionLevel: 9 }).toBuffer();
  const ico = await pngToIco([png16, png32]);

  await fs.writeFile(path.join(ROOT, 'public', 'favicon.ico'), ico);
}

async function hashFile(absolutePath) {
  const bytes = await fs.readFile(absolutePath);
  return {
    bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex')
  };
}

async function writeManifest() {
  const entries = await fs.readdir(LOGO_DIR);
  const assetFiles = entries.filter((entry) => entry.endsWith('.svg') && entry.startsWith('ivo-logo__')).sort();
  const assets = [];

  for (const filename of assetFiles) {
    const match = filename.match(/^ivo-logo__(.+)__static__(dark|light|mono)__v([0-9.]+)\.svg$/);
    if (!match) continue;

    const asset = match[1];
    const theme = match[2];
    const version = match[3];
    const absolutePath = path.join(LOGO_DIR, filename);
    const { bytes, sha256 } = await hashFile(absolutePath);
    const publicPath = `/assets/logo/${filename}`;
    const role = ASSET_BLUEPRINT.find((entry) => entry.asset === asset)?.role ?? 'unknown';

    assets.push({
      id: filename.replace(/\.svg$/, ''),
      role,
      asset,
      variant: 'static',
      theme,
      version,
      publicPath,
      bytes,
      sha256,
      recommendedUsagePx: RECOMMENDED_SIZES[asset] ?? []
    });
  }

  const manifest = {
    manifestVersion: 1,
    brand: 'ivo-tech',
    sourceMasterId: 'chatgpt-2026-02-20-103632',
    secondarySourceMasterId: 'chatgpt-2026-02-20-105850',
    generatedAt: new Date().toISOString(),
    namingPattern: 'ivo-logo__{asset}__{variant}__{theme}__v{semver}.{ext}',
    defaults: {
      theme: 'dark',
      version: VERSION
    },
    assets,
    legacyAliases: [
      {
        publicPath: '/assets/logo.png',
        mapsTo: `/assets/logo/ivo-logo__lockup-horizontal__static__dark__v${VERSION}.svg`
      },
      {
        publicPath: '/assets/logo.webp',
        mapsTo: `/assets/logo/ivo-logo__lockup-horizontal__static__dark__v${VERSION}.svg`
      },
      {
        publicPath: '/assets/logo.avif',
        mapsTo: `/assets/logo/ivo-logo__lockup-horizontal__static__dark__v${VERSION}.svg`
      },
      {
        publicPath: '/assets/logo-mark.png',
        mapsTo: `/assets/logo/ivo-logo__mark-core__static__dark__v${VERSION}.svg`
      },
      {
        publicPath: '/assets/logo-mark.webp',
        mapsTo: `/assets/logo/ivo-logo__mark-core__static__dark__v${VERSION}.svg`
      },
      {
        publicPath: '/assets/logo-mark.avif',
        mapsTo: `/assets/logo/ivo-logo__mark-core__static__dark__v${VERSION}.svg`
      }
    ]
  };

  await fs.writeFile(path.join(LOGO_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

async function main() {
  await ensureDirectories();
  await assertSourceFiles();
  const sourceBuffers = await getSourceBuffers();
  await writeLogoSvgs(sourceBuffers);
  await writeLegacyAliases();
  await writeFavicon(sourceBuffers);
  await writeManifest();
  console.log('logo system assets generated from source masters');
}

await main();
