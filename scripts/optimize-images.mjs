import fs from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const ROOT = process.cwd();
const TARGET_DIRS = ['public/pizza', 'public/assets'];
const INPUT_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (INPUT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

async function optimizeFile(inputPath) {
  const ext = path.extname(inputPath);
  const basePath = inputPath.slice(0, -ext.length);
  const webpPath = `${basePath}.webp`;
  const avifPath = `${basePath}.avif`;

  const inputStat = await fs.stat(inputPath);
  const webpNeedsUpdate =
    !(await fileExists(webpPath)) || (await fs.stat(webpPath)).mtimeMs < inputStat.mtimeMs;
  const avifNeedsUpdate =
    !(await fileExists(avifPath)) || (await fs.stat(avifPath)).mtimeMs < inputStat.mtimeMs;

  if (!webpNeedsUpdate && !avifNeedsUpdate) return { created: false };

  const image = sharp(inputPath);

  if (webpNeedsUpdate) {
    await image.webp({ quality: 82, effort: 6 }).toFile(webpPath);
  }

  if (avifNeedsUpdate) {
    await sharp(inputPath).avif({ quality: 58, effort: 8 }).toFile(avifPath);
  }

  return { created: true };
}

async function main() {
  const absoluteDirs = TARGET_DIRS.map((relativePath) => path.resolve(ROOT, relativePath));
  const files = [];

  for (const dir of absoluteDirs) {
    files.push(...(await walk(dir)));
  }

  let created = 0;
  for (const file of files) {
    const result = await optimizeFile(file);
    if (result.created) {
      created += 1;
      console.log(`optimized ${path.relative(ROOT, file)}`);
    }
  }

  console.log(`done. optimized ${created} file(s).`);
}

await main();
