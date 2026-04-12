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

if (!args.input) {
  console.error('Usage: node scripts/knowledge/build-semantic-chunks.mjs --input=<extracted.json> [--date=YYYY-MM-DD]');
  process.exit(1);
}

const inputPath = args.input;
const date = args.date || new Date().toISOString().slice(0, 10);

const normalizedPath = path.join('knowledge', 'normalized_content', `${date}_semantic_units_auto.json`);
const chunksPath = path.join('knowledge', 'chunks', `${date}_semantic_chunks_auto.jsonl`);

function hashId(prefix, value) {
  return `${prefix}_${createHash('sha1').update(value).digest('hex').slice(0, 12)}`;
}

function sectionToSemanticType(sectionType, headline = '') {
  const h = headline.toLowerCase();
  if (sectionType === 'hero') return 'hero_value_prop';
  if (sectionType === 'proof_bar' || sectionType === 'trust') return 'trust_signal';
  if (sectionType === 'services') return 'service_offer';
  if (sectionType === 'faq') return 'faq';
  if (sectionType === 'process') return 'process_step';
  if (h.includes('design') || h.includes('visual')) return 'design_direction';
  return 'other';
}

function estimateConfidence(semanticType) {
  switch (semanticType) {
    case 'hero_value_prop':
      return 0.97;
    case 'trust_signal':
      return 0.94;
    case 'service_offer':
      return 0.93;
    case 'cta':
      return 0.92;
    case 'faq':
      return 0.9;
    default:
      return 0.82;
  }
}

const input = JSON.parse(await readFile(inputPath, 'utf8'));
const units = [];
const chunks = [];
const chunkMap = new Map();

for (const doc of input.documents || []) {
  for (const section of doc.sections || []) {
    if (!section.text || section.text.length < 30) continue;

    const semanticType = sectionToSemanticType(section.section_type, section.headline || '');
    const unitId = hashId('unit', `${doc.source_id}|${section.section_id}|${section.text}`);
    const chunkId = hashId('ch', `${doc.source_id}|${section.section_id}|${section.text}`);

    units.push({
      unit_id: unitId,
      document_id: doc.document_id,
      source_id: doc.source_id,
      semantic_type: semanticType,
      language: doc.language || 'de',
      section_id: section.section_id,
      headline: section.headline || '',
      text: section.text,
      version: date
    });

    chunks.push({
      chunk_id: chunkId,
      document_id: doc.document_id,
      source_id: doc.source_id,
      version: date,
      language: doc.language || 'de',
      semantic_type: semanticType,
      text: section.text,
      source_excerpt: section.headline || section.text.slice(0, 160),
      source_anchor: section.section_id,
      token_estimate: Math.ceil(section.text.split(/\s+/).length * 1.3),
      confidence: estimateConfidence(semanticType),
      evidence_strength: semanticType === 'other' ? 'medium' : 'strong',
      tags: [section.section_type, semanticType].filter(Boolean),
      entities: []
    });
  }

  for (const cta of doc.ctas || []) {
    if (!cta.label) continue;
    const text = `${cta.label}${cta.href ? ` (${cta.href})` : ''}`;
    const chunkId = hashId('ch', `${doc.source_id}|cta|${text}`);
    chunks.push({
      chunk_id: chunkId,
      document_id: doc.document_id,
      source_id: doc.source_id,
      version: date,
      language: doc.language || 'de',
      semantic_type: 'cta',
      text,
      source_excerpt: cta.label,
      source_anchor: cta.href || '',
      token_estimate: Math.ceil(text.split(/\s+/).length * 1.3),
      confidence: estimateConfidence('cta'),
      evidence_strength: 'strong',
      tags: ['cta'],
      entities: []
    });
  }

  for (const question of doc.faq_questions || []) {
    const chunkId = hashId('ch', `${doc.source_id}|faq|${question}`);
    chunks.push({
      chunk_id: chunkId,
      document_id: doc.document_id,
      source_id: doc.source_id,
      version: date,
      language: doc.language || 'de',
      semantic_type: 'faq',
      text: question,
      source_excerpt: question,
      source_anchor: 'faq',
      token_estimate: Math.ceil(question.split(/\s+/).length * 1.3),
      confidence: estimateConfidence('faq'),
      evidence_strength: 'medium',
      tags: ['faq', 'objection'],
      entities: []
    });
  }
}

for (const chunk of chunks) {
  const existing = chunkMap.get(chunk.chunk_id);
  if (!existing || (chunk.confidence || 0) > (existing.confidence || 0)) {
    chunkMap.set(chunk.chunk_id, chunk);
  }
}
const dedupedChunks = [...chunkMap.values()];

await mkdir(path.dirname(normalizedPath), { recursive: true });
await mkdir(path.dirname(chunksPath), { recursive: true });
await writeFile(
  normalizedPath,
  JSON.stringify(
    {
      version: date,
      source: inputPath,
      units
    },
    null,
    2
  )
);
await writeFile(chunksPath, dedupedChunks.map((c) => JSON.stringify(c)).join('\n') + '\n');

console.log(`Units:  ${units.length}`);
console.log(`Chunks: ${dedupedChunks.length}`);
console.log(`Wrote:  ${normalizedPath}`);
console.log(`Wrote:  ${chunksPath}`);
