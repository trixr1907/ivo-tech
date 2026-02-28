import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'public/assets/logo/manifest.json');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const missing = [];

for (const asset of manifest.assets ?? []) {
  const relative = String(asset.publicPath ?? '').replace(/^\//, '');
  const absolute = path.join(root, 'public', relative.replace(/^assets\//, 'assets/'));
  if (!fs.existsSync(absolute)) {
    missing.push(asset.publicPath);
  }
}

const extras = [
  '/assets/logo.png',
  '/assets/logo.avif',
  '/assets/logo-mark.png',
  '/assets/logo-mark.avif',
  '/favicon.ico',
  '/assets/video/logo-sting.mp4',
  '/assets/video/logo-sting.webm',
  '/assets/video/logo-sting-poster.avif'
];

for (const assetPath of extras) {
  const absolute = path.join(root, 'public', assetPath.replace(/^\//, ''));
  if (!fs.existsSync(absolute)) {
    missing.push(assetPath);
  }
}

if (missing.length > 0) {
  console.error('Missing brand assets:');
  for (const entry of missing) console.error(`- ${entry}`);
  process.exit(1);
}

console.log(`Verified ${manifest.assets.length} manifest logo assets + ${extras.length} supporting assets.`);
