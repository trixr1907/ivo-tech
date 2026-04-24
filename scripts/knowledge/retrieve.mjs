#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, v] = arg.includes('=') ? arg.split('=') : [arg, 'true'];
    return [k.replace(/^--/, ''), v];
  })
);

const query = (args.query || '').trim();
if (!query) {
  console.error(
    'Usage: node scripts/knowledge/retrieve.mjs --query="..." [--top=8] [--semantic=cta] [--maxPerSemantic=2]'
  );
  process.exit(1);
}

const top = Number(args.top || '8');
const semantic = args.semantic || '';
const sourcePrefix = args.sourcePrefix || '';
const maxPerSemantic = Number(args.maxPerSemantic || '2');

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9äöüß]+/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function keywordBoost(queryTokens, chunk) {
  const text = `${chunk.semantic_type} ${chunk.text}`.toLowerCase();
  let boost = 0;
  if (queryTokens.includes('cta') && chunk.semantic_type === 'cta') boost += 1.4;
  if (queryTokens.includes('trust') && chunk.semantic_type === 'trust_signal') boost += 1.2;
  if (queryTokens.includes('hero') && chunk.semantic_type === 'hero_value_prop') boost += 1.2;
  if (text.includes('case study') && queryTokens.includes('case')) boost += 0.7;
  return boost;
}

function detectIntentWeights(queryTokens) {
  const hasAny = (set) => set.some((t) => queryTokens.includes(t));
  const weights = Object.create(null);

  if (hasAny(['audit', 'analyse', 'analysis', 'schwächen', 'klarheit', 'struktur', 'ux'])) {
    weights.hero_value_prop = 1.25;
    weights.trust_signal = 1.25;
    weights.section_overview = 1.2;
    weights.service_offer = 1.2;
    weights.faq_item = 1.1;
    weights.problem = 1.2;
    weights.value_claim = 1.2;
    weights.differentiation_claim = 1.2;
    weights.cta = 1.0;
  }

  if (hasAny(['hero', 'headline', 'value', 'proposition', 'premium', 'conversion'])) {
    weights.hero_value_prop = Math.max(weights.hero_value_prop || 1, 1.8);
    weights.value_claim = Math.max(weights.value_claim || 1, 1.6);
    weights.differentiation_claim = Math.max(weights.differentiation_claim || 1, 1.5);
    weights.cta = Math.max(weights.cta || 1, 1.1);
  }

  if (hasAny(['trust', 'social', 'proof', 'testimonial', 'credibility'])) {
    weights.trust_signal = Math.max(weights.trust_signal || 1, 2.0);
    weights.case = Math.max(weights.case || 1, 1.4);
    weights.case_study = Math.max(weights.case_study || 1, 1.4);
  }

  if (hasAny(['copy', 'messaging', 'positioning'])) {
    weights.value_claim = Math.max(weights.value_claim || 1, 1.6);
    weights.differentiation_claim = Math.max(weights.differentiation_claim || 1, 1.5);
    weights.hero_value_prop = Math.max(weights.hero_value_prop || 1, 1.3);
  }

  return weights;
}

function diversifyBySemantic(rows, limit, perTypeLimit) {
  const selected = [];
  const selectedIds = new Set();
  const counts = new Map();

  for (const row of rows) {
    if (selected.length >= limit) break;
    const type = row.semantic_type || 'unknown';
    if ((counts.get(type) || 0) >= perTypeLimit) continue;
    selected.push(row);
    selectedIds.add(row.chunk_id);
    counts.set(type, (counts.get(type) || 0) + 1);
  }

  if (selected.length < limit) {
    for (const row of rows) {
      if (selected.length >= limit) break;
      if (selectedIds.has(row.chunk_id)) continue;
      selected.push(row);
    }
  }

  return selected;
}

async function getLatestChunkFile() {
  const dir = path.join('knowledge', 'chunks');
  const files = (await readdir(dir)).filter((f) => f.endsWith('.jsonl')).sort();
  if (!files.length) throw new Error('No chunk file found in knowledge/chunks');
  return path.join(dir, files[files.length - 1]);
}

const latestChunks = args.file || (await getLatestChunkFile());
const raw = await readFile(latestChunks, 'utf8');
const rows = raw
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const qTokens = tokenize(query);
const intentWeights = detectIntentWeights(qTokens);

const scored = rows
  .filter((r) => (sourcePrefix ? String(r.source_id || '').startsWith(sourcePrefix) : true))
  .filter((r) => (semantic ? r.semantic_type === semantic : true))
  .map((r) => {
    const tokens = new Set(tokenize(`${r.semantic_type} ${r.text}`));
    const overlap = qTokens.filter((t) => tokens.has(t)).length;
    const overlapScore = qTokens.length ? overlap / qTokens.length : 0;
    const rerank = keywordBoost(qTokens, r);
    const semanticWeight = intentWeights[r.semantic_type] || 1;
    const score = (overlapScore * 3 + (r.confidence || 0.5) + rerank) * semanticWeight;
    return { ...r, score: Number(score.toFixed(4)) };
  })
  .sort((a, b) => b.score - a.score);

const results = semantic ? scored.slice(0, top) : diversifyBySemantic(scored, top, maxPerSemantic);

console.log(JSON.stringify({ query, file: latestChunks, maxPerSemantic, results }, null, 2));
