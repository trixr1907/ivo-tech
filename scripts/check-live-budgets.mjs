#!/usr/bin/env node

import https from 'node:https';

const baseUrl = (process.env.LIVE_BUDGET_BASE_URL?.trim() || 'https://ivo-tech.com').replace(/\/+$/, '');
// Budgets updated 2026-04 to reflect actual baseline after SOTA redesign.
// Baseline live-site measurement: JS ~1.57 MB, Total ~1.85 MB.
// Limits set to baseline + 10 % headroom to catch regressions without false-positives.
const budgets = {
  js: Number(process.env.LIVE_BUDGET_JS_BYTES || 1_750_000),
  css: Number(process.env.LIVE_BUDGET_CSS_BYTES || 220_000),
  font: Number(process.env.LIVE_BUDGET_FONT_BYTES || 140_000),
  total: Number(process.env.LIVE_BUDGET_TOTAL_BYTES || 2_100_000)
};

function request(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method,
        timeout: 12_000
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const body = Buffer.concat(chunks);
          resolve({
            statusCode: res.statusCode ?? 0,
            headers: res.headers,
            body
          });
        });
      }
    );

    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error(`Timeout for ${method} ${url}`)));
    req.end();
  });
}

function readContentLength(headers) {
  const value = headers['content-length'];
  if (Array.isArray(value)) return Number.parseInt(value[0] ?? '0', 10) || 0;
  return Number.parseInt(value ?? '0', 10) || 0;
}

function collectAssets(html) {
  const assets = new Set();
  for (const match of html.matchAll(/\/_next\/static\/chunks\/[^" ]+\.js/g)) assets.add(match[0]);
  for (const match of html.matchAll(/\/_next\/static\/chunks\/[^" ]+\.css/g)) assets.add(match[0]);
  for (const match of html.matchAll(/\/_next\/static\/media\/[^" ]+\.woff2/g)) assets.add(match[0]);
  return [...assets];
}

async function getAssetSize(path) {
  const url = `${baseUrl}${path}`;
  const head = await request(url, 'HEAD');
  if (head.statusCode >= 200 && head.statusCode < 400) {
    const contentLength = readContentLength(head.headers);
    if (contentLength > 0) return contentLength;
  }

  const get = await request(url, 'GET');
  if (get.statusCode < 200 || get.statusCode >= 400) {
    throw new Error(`Asset fetch failed (${get.statusCode}) for ${url}`);
  }

  return get.body.length;
}

async function run() {
  const homepage = await request(`${baseUrl}/`, 'GET');
  if (homepage.statusCode !== 200) {
    throw new Error(`Expected ${baseUrl}/ to be 200, got ${homepage.statusCode}`);
  }

  const homepageHtml = homepage.body.toString('utf8');
  const assets = collectAssets(homepageHtml);
  if (assets.length === 0) {
    throw new Error('No Next.js static assets detected on live homepage.');
  }

  const rows = [];
  for (const path of assets) {
    const size = await getAssetSize(path);
    rows.push({ path, size });
  }

  const js = rows.filter((row) => row.path.endsWith('.js')).reduce((sum, row) => sum + row.size, 0);
  const css = rows.filter((row) => row.path.endsWith('.css')).reduce((sum, row) => sum + row.size, 0);
  const font = rows.filter((row) => row.path.endsWith('.woff2')).reduce((sum, row) => sum + row.size, 0);
  const total = js + css + font;

  console.log(`== Live budget check for ${baseUrl} ==`);
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
    console.error('\nLive budget check failed:');
    for (const entry of failures) console.error(`- ${entry}`);
    console.error('\nLargest assets (top 10):');
    rows
      .sort((a, b) => b.size - a.size)
      .slice(0, 10)
      .forEach((row) => console.error(`${row.size}\t${row.path}`));
    process.exit(1);
  }

  console.log('PASS: all live budgets are within limits');
}

run().catch((error) => {
  console.error(`[live-budgets] ${error.message}`);
  process.exit(1);
});
