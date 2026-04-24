#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, v] = arg.includes('=') ? arg.split('=') : [arg, 'true'];
    return [k.replace(/^--/, ''), v];
  })
);

if (!args.manifest) {
  console.error('Usage: node scripts/knowledge/extract-benchmark-signals.mjs --manifest=<manifest.json> [--out=<json>] [--scorecard=<md>]');
  process.exit(1);
}

const manifestPath = args.manifest;
const outPath = args.out || 'knowledge/research/benchmark_signals_2026-04-10.json';
const scorecardPath = args.scorecard || 'knowledge/research/benchmark_scorecard_2026-04-10.md';

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function getTitle(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  return m ? decodeEntities(m[1].trim()) : '';
}

function getH1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? decodeEntities(stripHtml(m[1])) : '';
}

function getAnchors(html) {
  return [...html.matchAll(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map((m) => ({ href: m[1], label: decodeEntities(stripHtml(m[2])) }))
    .filter((a) => a.label.length >= 3 && a.label.length <= 80);
}

function scoreSignal({ title, h1, ctas, text }) {
  let score = 0;
  if (h1 && h1.length >= 20) score += 2;
  if (title && title.length >= 10) score += 1;
  if (ctas.length >= 2) score += 2;
  if (ctas.length >= 4) score += 1;

  const lower = text.toLowerCase();
  if (/(case study|customer|testimonial|proof|trusted|clients)/i.test(lower)) score += 2;
  if (/(enterprise|platform|api|developer|engineering)/i.test(lower)) score += 1;
  if (/(book demo|contact sales|get started|start free trial|talk to)/i.test(lower)) score += 1;

  return Math.min(score, 10);
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const results = [];

for (const page of manifest.pages || []) {
  if (page.status !== 200 || !page.path) {
    results.push({
      source_id: page.source_id,
      url: page.url,
      collection_id: page.collection_id,
      status: page.status,
      score: 0,
      notes: 'Not processable'
    });
    continue;
  }

  const html = await readFile(page.path, 'utf8');
  const text = stripHtml(html).slice(0, 20000);
  const title = getTitle(html);
  const h1 = getH1(html);
  const ctas = getAnchors(html)
    .filter((a) => /(start|get|book|contact|demo|trial|learn|see|view|pricing|talk)/i.test(a.label))
    .slice(0, 12);

  const score = scoreSignal({ title, h1, ctas, text });

  results.push({
    source_id: page.source_id,
    url: page.url,
    collection_id: page.collection_id,
    status: page.status,
    title,
    h1,
    ctas,
    score
  });
}

results.sort((a, b) => b.score - a.score);

await writeFile(
  outPath,
  JSON.stringify(
    {
      date: new Date().toISOString().slice(0, 10),
      manifest: manifestPath,
      total: results.length,
      results
    },
    null,
    2
  )
);

const lines = [];
lines.push('# Benchmark Scorecard - 2026-04-10');
lines.push('');
lines.push(`Manifest: ${manifestPath}`);
lines.push('');
lines.push('| Rank | Score | Collection | URL | H1 (short) |');
lines.push('|---:|---:|---|---|---|');

results.forEach((r, i) => {
  const h1 = (r.h1 || '').replace(/\|/g, '/').slice(0, 80);
  lines.push(`| ${i + 1} | ${r.score} | ${r.collection_id || '-'} | ${r.url} | ${h1 || '-'} |`);
});

await writeFile(scorecardPath, lines.join('\n'));

console.log(`Signals:   ${outPath}`);
console.log(`Scorecard: ${scorecardPath}`);
