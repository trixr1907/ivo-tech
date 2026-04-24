#!/usr/bin/env node
import { readFile } from 'node:fs/promises';

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, v] = arg.includes('=') ? arg.split('=') : [arg, 'true'];
    return [k.replace(/^--/, ''), v];
  })
);

const query = (args.query || '').trim();
const vectorsFile = args.vectorsFile || '';
const top = Number(args.top || '8');
const sourcePrefix = args.sourcePrefix || '';

if (!query || !vectorsFile) {
  console.error('Usage: node scripts/knowledge/retrieve-vector.mjs --query="..." --vectorsFile=knowledge/embeddings/vectors_<run>.jsonl [--top=8] [--sourcePrefix=src_ivo_live]');
  process.exit(1);
}

const apiKey = process.env.OPENAI_API_KEY;

function cosine(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function hash32(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function l2Normalize(vec) {
  let n = 0;
  for (let i = 0; i < vec.length; i += 1) n += vec[i] * vec[i];
  const d = Math.sqrt(n) || 1;
  for (let i = 0; i < vec.length; i += 1) vec[i] /= d;
  return vec;
}

function embedLocal(text, dim) {
  const tokens = String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9äöüß]+/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const vec = Array.from({ length: dim }, () => 0);
  for (const token of tokens) {
    const h = hash32(token);
    const idx = h % dim;
    const sign = (h & 1) === 0 ? 1 : -1;
    vec[idx] += sign;
  }
  return l2Normalize(vec);
}

const raw = await readFile(vectorsFile, 'utf8');
const rows = raw
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => JSON.parse(line));

if (!rows.length) {
  console.error('No vectors found');
  process.exit(1);
}

const model = rows[0].model || 'text-embedding-3-large';
const provider = rows[0].provider || (String(model).startsWith('local-hash') ? 'local-hash' : 'openai');

let queryVec;
if (provider === 'local-hash') {
  const dim = Array.isArray(rows[0].embedding) ? rows[0].embedding.length : 512;
  queryVec = embedLocal(query, dim);
} else {
  if (!apiKey) {
    console.error('OPENAI_API_KEY is not set.');
    process.exit(1);
  }
  const embRes = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model, input: query })
  });

  if (!embRes.ok) {
    const errText = await embRes.text();
    throw new Error(`Embedding API error: ${embRes.status} ${errText}`);
  }

  const embData = await embRes.json();
  queryVec = embData.data?.[0]?.embedding;
}
if (!queryVec) throw new Error('No query embedding returned');

const scored = rows
  .filter((r) => (sourcePrefix ? String(r.source_id || '').startsWith(sourcePrefix) : true))
  .map((r) => ({
    chunk_id: r.chunk_id,
    source_id: r.source_id,
    semantic_type: r.semantic_type,
    score: cosine(queryVec, r.embedding)
  }))
  .sort((a, b) => b.score - a.score)
  .slice(0, top);

console.log(JSON.stringify({ query, provider, model, vectorsFile, results: scored }, null, 2));
