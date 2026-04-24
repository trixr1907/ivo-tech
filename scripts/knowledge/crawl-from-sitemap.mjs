#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, v] = arg.includes('=') ? arg.split('=') : [arg, 'true'];
    return [k.replace(/^--/, ''), v];
  })
);

const baseUrl = args.baseUrl || 'https://ivo-tech.com';
const sourcePrefix = args.sourcePrefix || 'src_ivo_live';
const limit = Number(args.limit || '80');
const date = args.date || new Date().toISOString().slice(0, 10);
const fallbackPaths = (args.fallbackPaths || '/,/en,/contact,/services,/case-studies,/insights,/playbooks')
  .split(',')
  .map((p) => p.trim())
  .filter(Boolean);

const crawlRoot = path.join('knowledge', 'crawled_pages', date);

const USER_AGENT = 'Mozilla/5.0 (compatible; ivo-tech-knowledge-crawler/1.0)';

function extractLocs(xml) {
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/gsi)];
  return matches.map((m) => m[1].trim());
}

function slugifyUrl(urlStr, fallback = 'home') {
  try {
    const u = new URL(urlStr);
    const raw = `${u.pathname}${u.search}`.replace(/^\/+/, '');
    if (!raw) return fallback;
    return raw
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toLowerCase()
      .slice(0, 80) || fallback;
  } catch {
    return fallback;
  }
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'user-agent': USER_AGENT },
    redirect: 'follow'
  });
  const text = await res.text();
  return { res, text };
}

async function collectSitemapUrls(startSitemapUrl, maxNested = 20) {
  const queue = [startSitemapUrl];
  const visited = new Set();
  const pageUrls = new Set();

  while (queue.length && visited.size < maxNested) {
    const sitemapUrl = queue.shift();
    if (!sitemapUrl || visited.has(sitemapUrl)) continue;
    visited.add(sitemapUrl);

    const { text } = await fetchText(sitemapUrl);
    const locs = extractLocs(text);

    for (const loc of locs) {
      if (/sitemap/i.test(loc) && /\.xml($|\?)/i.test(loc)) {
        if (!visited.has(loc)) queue.push(loc);
      } else {
        pageUrls.add(loc);
      }
    }
  }

  return [...pageUrls];
}

const sitemapUrl = `${baseUrl.replace(/\/$/, '')}/sitemap.xml`;
const allUrls = await collectSitemapUrls(sitemapUrl);
const sameOriginUrls = allUrls.filter((u) => {
  try {
    return new URL(u).origin === new URL(baseUrl).origin;
  } catch {
    return false;
  }
});

const fallbackUrls = fallbackPaths.map((p) => new URL(p, baseUrl).toString());
const seedUrls = sameOriginUrls.length > 0 ? sameOriginUrls : fallbackUrls;
const urls = [...new Set(seedUrls)].slice(0, limit);
await mkdir(crawlRoot, { recursive: true });

const manifest = {
  crawl_date: date,
  base_url: baseUrl,
  sitemap_url: sitemapUrl,
  total_discovered: sameOriginUrls.length,
  used_fallback_urls: sameOriginUrls.length === 0,
  total_crawled: 0,
  pages: []
};

for (const url of urls) {
  const slug = slugifyUrl(url, 'home');
  const sourceId = `${sourcePrefix}__${slug}`;
  const pageDir = path.join(crawlRoot, sourceId);
  await mkdir(pageDir, { recursive: true });

  try {
    const { res, text } = await fetchText(url);
    const htmlPath = path.join(pageDir, 'index.html');
    const headersPath = path.join(pageDir, 'headers.json');
    const metaPath = path.join(pageDir, 'meta.json');

    const headers = {};
    for (const [k, v] of res.headers.entries()) headers[k] = v;

    const sha256 = createHash('sha256').update(text).digest('hex');
    const fetchedAt = new Date().toISOString();

    await writeFile(htmlPath, text, 'utf8');
    await writeFile(headersPath, JSON.stringify(headers, null, 2));
    await writeFile(
      metaPath,
      JSON.stringify(
        {
          source_id: sourceId,
          url,
          status: res.status,
          fetched_at: fetchedAt,
          sha256,
          path: htmlPath
        },
        null,
        2
      )
    );

    manifest.pages.push({
      source_id: sourceId,
      url,
      status: res.status,
      sha256,
      path: htmlPath
    });
  } catch (error) {
    manifest.pages.push({
      source_id: sourceId,
      url,
      status: 'error',
      error: String(error)
    });
  }
}

manifest.total_crawled = manifest.pages.length;
await writeFile(path.join(crawlRoot, 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log(`Discovered: ${manifest.total_discovered}`);
console.log(`Crawled:    ${manifest.total_crawled}`);
console.log(`Manifest:   ${path.join(crawlRoot, 'manifest.json')}`);
