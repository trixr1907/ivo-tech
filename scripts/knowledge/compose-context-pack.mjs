#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, v] = arg.includes('=') ? arg.split('=') : [arg, 'true'];
    return [k.replace(/^--/, ''), v];
  })
);

const query = (args.query || '').trim();
const goal = (args.goal || '').trim();
const mode = args.mode || 'analysis';
const top = Number(args.top || '12');
const chunksFile = args.chunksFile || 'knowledge/chunks/2026-04-10_combined_plus_benchmarks_semantic_chunks_auto.jsonl';
const out = args.out || 'knowledge/context_packs/generated/auto-pack.yaml';

if (!query || !goal) {
  console.error('Usage: node scripts/knowledge/compose-context-pack.mjs --query="..." --goal="..." --mode=analysis --out=...');
  process.exit(1);
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9äöüß]+/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function score(queryTokens, row) {
  const tokens = new Set(tokenize(`${row.semantic_type} ${row.text}`));
  const overlap = queryTokens.filter((t) => tokens.has(t)).length;
  const overlapScore = queryTokens.length ? overlap / queryTokens.length : 0;
  return overlapScore * 3 + (row.confidence || 0.6);
}

const rows = (await readFile(chunksFile, 'utf8'))
  .split('\n')
  .map((l) => l.trim())
  .filter(Boolean)
  .map((l) => JSON.parse(l));

const qTokens = tokenize(query);
const selected = rows
  .map((r) => ({ ...r, _score: score(qTokens, r) }))
  .sort((a, b) => b._score - a._score)
  .slice(0, top);

const sources = [...new Set(selected.map((s) => s.source_id))];
const coreFacts = selected.slice(0, Math.min(6, selected.length)).map((s) => {
  const txt = s.text.replace(/\s+/g, ' ').trim();
  return `${txt.slice(0, 180)}${txt.length > 180 ? '...' : ''}`;
});

const weak = selected.filter((s) => (s.evidence_strength || 'medium') === 'weak').length;
const openQuestions = [];
if (weak > 0) openQuestions.push(`At least ${weak} selected chunks are weak evidence and need validation.`);
openQuestions.push('Which assumptions should be validated with stakeholder input before final implementation?');
openQuestions.push('Which findings are specific to live vs preview and need convergence?');

const lines = [];
const packId = args.packId || `cp_generated_${Date.now()}`;
lines.push(`pack_id: ${packId}`);
lines.push(`goal: ${goal}`);
lines.push(`mode: ${mode}`);
lines.push('sources:');
for (const s of sources) lines.push(`  - ${s}`);
lines.push('core_facts:');
for (const f of coreFacts) lines.push(`  - ${f.replace(/:/g, ' -')}`);
lines.push('open_questions:');
for (const q of openQuestions) lines.push(`  - ${q.replace(/:/g, ' -')}`);
lines.push('next_steps:');
lines.push('  - Validate assumptions with explicit evidence links.');
lines.push('  - Freeze priorities and update decision log.');
lines.push('  - Use this pack as implementation context in the next coding turn.');
lines.push('evidence_chunks:');
for (const e of selected.slice(0, Math.min(12, selected.length))) lines.push(`  - ${e.chunk_id}`);

await writeFile(out, lines.join('\n') + '\n');
console.log(`Composed pack: ${out}`);
console.log(`Using chunks:  ${selected.length}`);
