#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, v] = arg.includes('=') ? arg.split('=') : [arg, 'true'];
    return [k.replace(/^--/, ''), v];
  })
);

const liveExtract = args.liveExtract || 'knowledge/extracted_content/2026-04-10_auto_extracted_live.json';
const previewExtract = args.previewExtract || 'knowledge/extracted_content/2026-04-10_auto_extracted_preview.json';
const benchmarkSignals = args.benchmarkSignals || 'knowledge/research/benchmark_signals_2026-04-10.json';
const out = args.out || 'knowledge/knowledge_graph/graph_2026-04-10_enriched.json';
const summary = args.summary || 'knowledge/knowledge_graph/graph_2026-04-10_summary.md';

function hashId(prefix, value) {
  return `${prefix}_${createHash('sha1').update(value).digest('hex').slice(0, 12)}`;
}

const nodeMap = new Map();
const edgeMap = new Map();

function addNode(node) {
  const key = `${node.type}:${node.id}`;
  const existing = nodeMap.get(key);
  if (!existing) {
    nodeMap.set(key, node);
    return;
  }
  const mergedSources = [...new Set([...(existing.source_ids || []), ...(node.source_ids || [])])];
  nodeMap.set(key, { ...existing, source_ids: mergedSources });
}

function addEdge(edge) {
  const key = `${edge.from}|${edge.relation}|${edge.to}`;
  const existing = edgeMap.get(key);
  if (!existing) {
    edgeMap.set(key, edge);
    return;
  }
  const mergedSources = [...new Set([...(existing.source_ids || []), ...(edge.source_ids || [])])];
  edgeMap.set(key, {
    ...existing,
    source_ids: mergedSources,
    confidence: Math.max(existing.confidence || 0, edge.confidence || 0)
  });
}

function processExtract(file, envTag) {
  const data = JSON.parse(readFileSync(file, 'utf8'));

  for (const doc of data.documents || []) {
    const pageId = hashId('page', doc.url || doc.source_id);
    addNode({
      id: pageId,
      type: 'Page',
      label: doc.title || doc.url || doc.source_id,
      source_ids: [doc.source_id],
      env: envTag,
      url: doc.url
    });

    addEdge({
      from: 'brand_ivo_tech',
      relation: 'BELONGS_TO',
      to: pageId,
      source_ids: [doc.source_id],
      confidence: 0.95
    });

    for (const section of doc.sections || []) {
      const sectionId = hashId('section', `${doc.source_id}|${section.section_id}|${section.headline || ''}`);
      addNode({
        id: sectionId,
        type: 'Section',
        label: section.headline || section.section_id,
        section_type: section.section_type,
        source_ids: [doc.source_id],
        env: envTag
      });
      addEdge({
        from: sectionId,
        relation: 'BELONGS_TO',
        to: pageId,
        source_ids: [doc.source_id],
        confidence: 0.98
      });

      if (section.section_type === 'services' && section.headline) {
        const serviceId = hashId('service', section.headline.toLowerCase());
        addNode({
          id: serviceId,
          type: 'Service',
          label: section.headline,
          source_ids: [doc.source_id]
        });
        addEdge({
          from: serviceId,
          relation: 'SHOULD_APPEAR_IN',
          to: sectionId,
          source_ids: [doc.source_id],
          confidence: 0.9
        });
      }

      if (section.section_type === 'trust' || section.section_type === 'proof_bar') {
        const trustId = hashId('trust', `${doc.source_id}|${section.section_id}`);
        addNode({
          id: trustId,
          type: 'TrustElement',
          label: section.headline || 'Trust block',
          source_ids: [doc.source_id]
        });
        addEdge({
          from: trustId,
          relation: 'STRENGTHENS_TRUST_FOR',
          to: 'service_web_engineering',
          source_ids: [doc.source_id],
          confidence: 0.9
        });
        addEdge({
          from: trustId,
          relation: 'SHOULD_APPEAR_IN',
          to: sectionId,
          source_ids: [doc.source_id],
          confidence: 0.95
        });
      }
    }

    for (const cta of doc.ctas || []) {
      if (!cta.label) continue;
      const ctaId = hashId('cta', cta.label.toLowerCase());
      addNode({
        id: ctaId,
        type: 'CTA',
        label: cta.label,
        href: cta.href,
        source_ids: [doc.source_id]
      });
      addEdge({
        from: ctaId,
        relation: 'SHOULD_APPEAR_IN',
        to: pageId,
        source_ids: [doc.source_id],
        confidence: 0.85
      });
    }

    for (const q of doc.faq_questions || []) {
      const faqId = hashId('faq', q.toLowerCase());
      addNode({
        id: faqId,
        type: 'FAQ',
        label: q,
        source_ids: [doc.source_id]
      });
      addEdge({
        from: faqId,
        relation: 'SHOULD_APPEAR_IN',
        to: pageId,
        source_ids: [doc.source_id],
        confidence: 0.8
      });
    }
  }
}

global.require = (await import('node:module')).createRequire(import.meta.url);

addNode({
  id: 'brand_ivo_tech',
  type: 'Brand',
  label: 'ivo-tech',
  source_ids: ['src_ivo_live_home', 'src_ivo_vercel_preview_home']
});

addNode({
  id: 'service_web_engineering',
  type: 'Service',
  label: 'Web Engineering and Delivery',
  source_ids: ['src_ivo_live_home', 'src_ivo_vercel_preview_home']
});

processExtract(liveExtract, 'live');
processExtract(previewExtract, 'preview');

const benchmark = JSON.parse(await readFile(benchmarkSignals, 'utf8'));
for (const row of benchmark.results || []) {
  if (row.status !== 200) continue;
  const refId = hashId('ref', row.url);
  addNode({
    id: refId,
    type: 'Reference',
    label: row.title || row.url,
    source_ids: [row.source_id],
    collection_id: row.collection_id,
    score: row.score,
    url: row.url
  });

  if ((row.score || 0) >= 8) {
    addEdge({
      from: refId,
      relation: 'INSPIRES',
      to: 'service_web_engineering',
      source_ids: [row.source_id],
      confidence: 0.75
    });
  }
}

const graph = {
  version: 1,
  generated_at: new Date().toISOString(),
  inputs: [liveExtract, previewExtract, benchmarkSignals],
  nodes: [...nodeMap.values()],
  edges: [...edgeMap.values()]
};

await writeFile(out, JSON.stringify(graph, null, 2));

const byType = graph.nodes.reduce((m, n) => {
  m[n.type] = (m[n.type] || 0) + 1;
  return m;
}, {});

const lines = [];
lines.push('# Graph Summary - 2026-04-10');
lines.push('');
lines.push(`Nodes: ${graph.nodes.length}`);
lines.push(`Edges: ${graph.edges.length}`);
lines.push('');
lines.push('## Node distribution');
for (const [k, v] of Object.entries(byType).sort((a, b) => a[0].localeCompare(b[0]))) {
  lines.push(`- ${k}: ${v}`);
}
lines.push('');
lines.push('## Output files');
lines.push(`- ${out}`);
lines.push(`- ${summary}`);

await writeFile(summary, lines.join('\n'));
console.log(`Graph nodes: ${graph.nodes.length}`);
console.log(`Graph edges: ${graph.edges.length}`);
console.log(`Wrote: ${out}`);
console.log(`Wrote: ${summary}`);
