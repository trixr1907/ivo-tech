#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, v] = arg.includes('=') ? arg.split('=') : [arg, 'true'];
    return [k.replace(/^--/, ''), v];
  })
);

if (!args.manifest) {
  console.error('Usage: node scripts/knowledge/extract-sections.mjs --manifest=<path> [--out=<path>]');
  process.exit(1);
}

const manifestPath = args.manifest;
const outPath = args.out || `knowledge/extracted_content/${new Date().toISOString().slice(0, 10)}_auto_extracted.json`;

const CTA_KEYWORDS = [
  'kontakt',
  'erstgespraech',
  'erstgespräch',
  'anfragen',
  'buchen',
  'starten',
  'case study',
  'angebot',
  'demo'
];

const TRUST_KEYWORDS = [
  'trust',
  'proof',
  'referenz',
  'testimonial',
  'kundenstimme',
  'live-system',
  'qa-gates',
  'delivery-qualitaet'
];

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
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

function getLanguage(html, url = '') {
  if (/\/en(\/|$)/i.test(url)) return 'en';
  const htmlLang = html.match(/<html[^>]*lang="([^"]+)"/i);
  if (htmlLang?.[1]) return htmlLang[1].toLowerCase().startsWith('en') ? 'en' : 'de';
  return 'de';
}

function getHeadings(html) {
  return [...html.matchAll(/<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => ({
    level: m[1].toLowerCase(),
    text: decodeEntities(stripHtml(m[2]))
  }));
}

function getAnchors(html) {
  return [...html.matchAll(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)].map((m) => ({
    href: m[1],
    label: decodeEntities(stripHtml(m[2]))
  }));
}

function getSections(html) {
  const matches = [...html.matchAll(/<section([^>]*)>([\s\S]*?)<\/section>/gi)];
  return matches.map((m, idx) => {
    const attrs = m[1] || '';
    const body = m[2] || '';
    const idMatch = attrs.match(/id="([^"]+)"/i);
    const ariaMatch = attrs.match(/aria-label="([^"]+)"/i);
    const headingMatch = body.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
    return {
      section_id: idMatch ? idMatch[1] : `section_${idx + 1}`,
      section_type: 'other',
      headline: headingMatch ? decodeEntities(stripHtml(headingMatch[1])) : '',
      aria_label: ariaMatch ? ariaMatch[1] : '',
      text: decodeEntities(stripHtml(body)).slice(0, 900)
    };
  });
}

function getFaqQuestions(html) {
  const questions = [...html.matchAll(/"@type"\s*:\s*"Question"[^}]*"name"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
  return [...new Set(questions)];
}

function classifySection(section) {
  const source = `${section.section_id} ${section.headline} ${section.aria_label}`.toLowerCase();
  if (source.includes('hero')) return 'hero';
  if (source.includes('proof')) return 'proof_bar';
  if (source.includes('service')) return 'services';
  if (source.includes('trust') || source.includes('referenz')) return 'trust';
  if (source.includes('insight')) return 'insights';
  if (source.includes('faq')) return 'faq';
  if (source.includes('contact') || source.includes('kontakt')) return 'contact';
  if (source.includes('process') || source.includes('prozess')) return 'process';
  return 'other';
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const docs = [];

for (const page of manifest.pages || []) {
  if (!page.path || page.status === 'error') continue;
  const html = await readFile(page.path, 'utf8');
  const title = getTitle(html);
  const headings = getHeadings(html);
  const anchors = getAnchors(html);
  const sections = getSections(html).map((s) => ({ ...s, section_type: classifySection(s) }));
  const ctas = anchors.filter((a) => {
    const text = `${a.label} ${a.href}`.toLowerCase();
    return CTA_KEYWORDS.some((k) => text.includes(k));
  });
  const trustSignals = headings
    .map((h) => h.text)
    .filter((h) => TRUST_KEYWORDS.some((k) => h.toLowerCase().includes(k)));
  const faqQuestions = getFaqQuestions(html);

  docs.push({
    document_id: `doc_${page.source_id}`,
    source_id: page.source_id,
    url: page.url,
    title,
    language: getLanguage(html, page.url),
    headings,
    sections,
    ctas,
    trust_signals: [...new Set(trustSignals)],
    faq_questions: faqQuestions
  });
}

const output = {
  extraction_date: new Date().toISOString().slice(0, 10),
  manifest_path: manifestPath,
  documents: docs
};

await writeFile(outPath, JSON.stringify(output, null, 2));
console.log(`Extracted documents: ${docs.length}`);
console.log(`Output: ${outPath}`);
