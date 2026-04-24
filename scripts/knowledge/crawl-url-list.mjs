#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, v] = arg.includes('=') ? arg.split('=') : [arg, 'true'];
    return [k.replace(/^--/, ''), v];
  })
);

const input = args.input || 'knowledge/research/benchmark_urls.json';
const date = args.date || new Date().toISOString().slice(0, 10);
const outDir = args.outDir || path.join('knowledge', 'inspiration', 'benchmarks', date);
const timeoutMs = Number(args.timeoutMs || '25000');

const USER_AGENT = 'Mozilla/5.0 (compatible; ivo-tech-benchmark-crawler/1.0)';

function slugify(urlStr) {
  try {
    const u = new URL(urlStr);
    return `${u.hostname}${u.pathname}`
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toLowerCase()
      .slice(0, 120);
  } catch {
    return createHash('sha1').update(urlStr).digest('hex').slice(0, 16);
  }
}

function flattenCollections(json) {
  const collections = json.collections || {};
  const pairs = [];
  for (const [collectionId, urls] of Object.entries(collections)) {
    for (const url of urls || []) pairs.push({ collectionId, url });
  }
  return pairs;
}

const urlSpec = JSON.parse(await readFile(input, 'utf8'));
const targets = flattenCollections(urlSpec);
await mkdir(outDir, { recursive: true });

const manifest = {
  crawl_date: date,
  input,
  total_targets: targets.length,
  pages: []
};

for (const target of targets) {
  const { collectionId, url } = target;
  const id = slugify(url);
  const pageDir = path.join(outDir, id);
  await mkdir(pageDir, { recursive: true });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      headers: { 'user-agent': USER_AGENT },
      redirect: 'follow',
      signal: controller.signal
    });
    clearTimeout(timer);

    const html = await res.text();
    const sha256 = createHash('sha256').update(html).digest('hex');
    const htmlPath = path.join(pageDir, 'index.html');

    await writeFile(htmlPath, html, 'utf8');

    manifest.pages.push({
      collection_id: collectionId,
      url,
      source_id: `src_benchmark__${id}`,
      status: res.status,
      fetched_at: new Date().toISOString(),
      sha256,
      path: htmlPath
    });
  } catch (error) {
    clearTimeout(timer);
    manifest.pages.push({
      collection_id: collectionId,
      url,
      source_id: `src_benchmark__${id}`,
      status: 'error',
      error: String(error)
    });
  }
}

await writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log(`Targets: ${manifest.total_targets}`);
console.log(`Results: ${manifest.pages.length}`);
console.log(`Manifest: ${path.join(outDir, 'manifest.json')}`);
