#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, v] = arg.includes('=') ? arg.split('=') : [arg, 'true'];
    return [k.replace(/^--/, ''), v];
  })
);

const input = args.input || 'knowledge/research/benchmark_signals_2026-04-10.json';
const date = args.date || '2026-04-10';

const outUnits = args.outUnits || `knowledge/normalized_content/${date}_benchmark_units_auto.json`;
const outChunks = args.outChunks || `knowledge/chunks/${date}_benchmark_chunks_auto.jsonl`;

function hashId(prefix, value) {
  return `${prefix}_${createHash('sha1').update(value).digest('hex').slice(0, 12)}`;
}

const data = JSON.parse(await readFile(input, 'utf8'));
const units = [];
const chunks = [];

for (const row of data.results || []) {
  if (row.status !== 200) continue;

  const sourceId = row.source_id;
  const collection = row.collection_id || 'unknown';

  if (row.h1) {
    const text = row.h1;
    const id = hashId('unit', `${sourceId}|h1|${text}`);
    units.push({
      unit_id: id,
      source_id: sourceId,
      semantic_type: 'design_direction',
      language: 'mixed',
      text,
      collection,
      version: date
    });
    chunks.push({
      chunk_id: hashId('ch', `${sourceId}|h1|${text}`),
      document_id: `doc_${sourceId}`,
      source_id: sourceId,
      version: date,
      language: 'mixed',
      semantic_type: 'design_direction',
      text,
      source_excerpt: text,
      source_anchor: row.url,
      token_estimate: Math.ceil(text.split(/\s+/).length * 1.3),
      confidence: 0.86,
      evidence_strength: 'medium',
      tags: ['benchmark', collection, 'h1'],
      entities: []
    });
  }

  for (const cta of row.ctas || []) {
    const text = `${cta.label}${cta.href ? ` (${cta.href})` : ''}`;
    chunks.push({
      chunk_id: hashId('ch', `${sourceId}|cta|${text}`),
      document_id: `doc_${sourceId}`,
      source_id: sourceId,
      version: date,
      language: 'mixed',
      semantic_type: 'component_pattern',
      text,
      source_excerpt: cta.label,
      source_anchor: row.url,
      token_estimate: Math.ceil(text.split(/\s+/).length * 1.3),
      confidence: 0.8,
      evidence_strength: 'medium',
      tags: ['benchmark', collection, 'cta_pattern'],
      entities: []
    });
  }

  chunks.push({
    chunk_id: hashId('ch', `${sourceId}|score|${row.score}`),
    document_id: `doc_${sourceId}`,
    source_id: sourceId,
    version: date,
    language: 'mixed',
    semantic_type: 'benchmark_note',
    text: `Benchmark score ${row.score}/10 for ${row.url}`,
    source_excerpt: row.title || row.url,
    source_anchor: row.url,
    token_estimate: 12,
    confidence: 0.78,
    evidence_strength: 'medium',
    tags: ['benchmark', collection, 'score'],
    entities: []
  });
}

const dedup = new Map();
for (const c of chunks) {
  if (!dedup.has(c.chunk_id)) dedup.set(c.chunk_id, c);
}
const outChunkRows = [...dedup.values()];

await writeFile(
  outUnits,
  JSON.stringify(
    {
      version: date,
      source: input,
      units
    },
    null,
    2
  )
);
await writeFile(outChunks, outChunkRows.map((x) => JSON.stringify(x)).join('\n') + '\n');

console.log(`Units:  ${units.length}`);
console.log(`Chunks: ${outChunkRows.length}`);
console.log(`Wrote:  ${outUnits}`);
console.log(`Wrote:  ${outChunks}`);
