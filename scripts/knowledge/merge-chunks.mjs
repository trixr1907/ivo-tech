#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, v] = arg.includes('=') ? arg.split('=') : [arg, 'true'];
    return [k.replace(/^--/, ''), v];
  })
);

const inputs = (args.inputs || '').split(',').map((s) => s.trim()).filter(Boolean);
const out = args.out || 'knowledge/chunks/combined_semantic_chunks_auto.jsonl';

if (!inputs.length) {
  console.error('Usage: node scripts/knowledge/merge-chunks.mjs --inputs=file1,file2 --out=output.jsonl');
  process.exit(1);
}

const merged = new Map();

for (const file of inputs) {
  const raw = await readFile(file, 'utf8');
  const rows = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  for (const row of rows) {
    const key = row.chunk_id;
    const existing = merged.get(key);
    if (!existing || (row.confidence || 0) > (existing.confidence || 0)) {
      merged.set(key, row);
    }
  }
}

const outRows = [...merged.values()];
await writeFile(out, outRows.map((r) => JSON.stringify(r)).join('\n') + '\n');

console.log(`Input files: ${inputs.length}`);
console.log(`Merged rows: ${outRows.length}`);
console.log(`Output: ${out}`);
