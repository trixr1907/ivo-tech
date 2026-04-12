#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const buildDir = process.env.BUDGET_BUILD_DIR || '.next';

function readBudget(name, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid numeric value for ${name}: ${raw}`);
  }
  return Math.floor(parsed);
}

// Defaults: Summe aller Ausgabe-Chunks unter `.next/static` (App Router + Turbopack), nicht „einzelner First-Load“.
// Anhebung 2026-04: vorherige Werte trafen Full-Site-Output nicht; CI soll Regressionen vs. Baseline erkennen.
// Baseline Apr-2026 (Enterprise Consolidation): 2.69MB + 5% headroom = 2.82MB
const budgets = {
  js: readBudget('BUDGET_JS_BYTES', 2_820_000),
  css: readBudget('BUDGET_CSS_BYTES', 190_000),
  font: readBudget('BUDGET_FONT_BYTES', 360_000),
  total: readBudget('BUDGET_TOTAL_BYTES', 3_400_000)
};

async function listFiles(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await listFiles(absolute)));
      } else if (entry.isFile()) {
        files.push(absolute);
      }
    }

    return files;
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function totalSize(files, matcher) {
  let sum = 0;
  for (const file of files) {
    if (!matcher(file)) continue;
    const stat = await fs.stat(file);
    sum += stat.size;
  }
  return sum;
}

function toRelative(filePath) {
  return filePath.split(path.sep).join('/');
}

async function main() {
  const staticDir = path.join(process.cwd(), buildDir, 'static');
  const chunksDir = path.join(staticDir, 'chunks');
  const mediaDir = path.join(staticDir, 'media');

  const chunkFiles = await listFiles(chunksDir);
  const mediaFiles = await listFiles(mediaDir);
  const allFiles = [...chunkFiles, ...mediaFiles];

  if (allFiles.length === 0) {
    throw new Error(
      `No static assets found under ${buildDir}/static. Run "npm run build" before checking budgets.`
    );
  }

  const js = await totalSize(chunkFiles, (file) => file.endsWith('.js'));
  const css = await totalSize(chunkFiles, (file) => file.endsWith('.css'));
  const font = await totalSize(mediaFiles, (file) => file.endsWith('.woff2'));
  const total = js + css + font;

  console.log('== Bundle budgets ==');
  console.log(`JS:    ${js} / ${budgets.js}`);
  console.log(`CSS:   ${css} / ${budgets.css}`);
  console.log(`Fonts: ${font} / ${budgets.font}`);
  console.log(`Total: ${total} / ${budgets.total}`);

  const failures = [];
  if (js > budgets.js) failures.push(`JS budget exceeded (${js} > ${budgets.js})`);
  if (css > budgets.css) failures.push(`CSS budget exceeded (${css} > ${budgets.css})`);
  if (font > budgets.font) failures.push(`Font budget exceeded (${font} > ${budgets.font})`);
  if (total > budgets.total) failures.push(`Total budget exceeded (${total} > ${budgets.total})`);

  if (failures.length > 0) {
    console.error('\nBudget check failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }

    const largest = await Promise.all(
      allFiles.map(async (file) => {
        const stat = await fs.stat(file);
        return { file: toRelative(path.relative(process.cwd(), file)), size: stat.size };
      })
    );

    largest.sort((a, b) => b.size - a.size);
    console.error('\nLargest assets:');
    for (const item of largest.slice(0, 10)) {
      console.error(`${item.size.toString().padStart(8, ' ')} ${item.file}`);
    }

    process.exit(1);
  }

  console.log('PASS: all bundle budgets are within limits');
}

main().catch((error) => {
  console.error(`[bundle-budgets] ${error.message}`);
  process.exit(1);
});
