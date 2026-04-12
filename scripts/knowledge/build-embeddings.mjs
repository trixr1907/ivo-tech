#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, v] = arg.includes('=') ? arg.split('=') : [arg, 'true'];
    return [k.replace(/^--/, ''), v];
  })
);

const inputFile = args.file || 'knowledge/chunks/2026-04-10_combined_semantic_chunks_auto.jsonl';
const provider = args.provider || 'openai';
const model = args.model || (provider === 'openai' ? 'text-embedding-3-large' : 'local-hash-512-v1');
const batchSize = Number(args.batchSize || '32');
const runId = args.runId || `${new Date().toISOString().slice(0, 10)}_${Date.now()}`;
const outDir = args.outDir || 'knowledge/embeddings';
const localDim = Number(args.localDim || '512');

const apiKey = process.env.OPENAI_API_KEY;
if (provider === 'openai' && !apiKey) {
  console.error('OPENAI_API_KEY is not set.');
  console.error(
    'Set API key and re-run: node scripts/knowledge/build-embeddings.mjs --file=<chunks.jsonl> --provider=openai'
  );
  console.error('Or run local fallback: node scripts/knowledge/build-embeddings.mjs --provider=local-hash');
  process.exit(1);
}

if (!['openai', 'local-hash'].includes(provider)) {
  console.error(`Unsupported provider: ${provider}. Use one of: openai, local-hash`);
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

const raw = await readFile(inputFile, 'utf8');
const chunks = raw
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => JSON.parse(line));

if (!chunks.length) {
  console.error(`No chunks found in ${inputFile}`);
  process.exit(1);
}

const items = chunks.map((c) => ({
  chunk_id: c.chunk_id,
  source_id: c.source_id,
  semantic_type: c.semantic_type,
  text: c.text
}));

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

const vectors = [];
for (let i = 0; i < items.length; i += batchSize) {
  const batch = items.slice(i, i + batchSize);
  if (provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        input: batch.map((b) => b.text)
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Embedding API error: ${res.status} ${errText}`);
    }

    const data = await res.json();
    const out = data.data || [];
    for (let j = 0; j < out.length; j += 1) {
      vectors.push({
        chunk_id: batch[j].chunk_id,
        source_id: batch[j].source_id,
        semantic_type: batch[j].semantic_type,
        provider,
        model,
        embedding: out[j].embedding
      });
    }
  } else {
    for (let j = 0; j < batch.length; j += 1) {
      vectors.push({
        chunk_id: batch[j].chunk_id,
        source_id: batch[j].source_id,
        semantic_type: batch[j].semantic_type,
        provider,
        model,
        embedding: embedLocal(batch[j].text, localDim)
      });
    }
  }
  console.log(`Embedded ${Math.min(i + batch.length, items.length)}/${items.length}`);
}

const vectorsFile = path.join(outDir, `vectors_${runId}.jsonl`);
await writeFile(vectorsFile, vectors.map((v) => JSON.stringify(v)).join('\n') + '\n');

const manifestFile = path.join(outDir, 'index-manifest.json');
let manifest = {
  version: 1,
  updated_at: new Date().toISOString(),
  embedding_provider: provider,
  embedding_model: model,
  indexes: []
};

try {
  manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
} catch {
  // keep default
}

manifest.updated_at = new Date().toISOString();
manifest.embedding_provider = provider;
manifest.embedding_model = model;
manifest.indexes = manifest.indexes || [];
manifest.indexes.push({
  run_id: runId,
  source_chunks: inputFile,
  vectors_file: vectorsFile,
  item_count: vectors.length,
  provider,
  model,
  created_at: new Date().toISOString()
});

await writeFile(manifestFile, JSON.stringify(manifest, null, 2));

console.log(`Vectors written: ${vectorsFile}`);
console.log(`Manifest updated: ${manifestFile}`);
