#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();
const roadmapPath = path.join(repoRoot, 'docs', 'roadmap-live.md');
const checklistPath = path.join(repoRoot, 'docs', 'masterplan-closeout-checklist.md');

const syncStart = '<!-- ROADMAP_SYNC_START -->';
const syncEnd = '<!-- ROADMAP_SYNC_END -->';

function parseChecklist(content) {
  const lines = content.split('\n');
  const sectionRows = [];
  const openItems = [];

  let currentSection = 'Global';
  let total = 0;
  let done = 0;
  const sections = new Map();

  for (const line of lines) {
    const sectionMatch = line.match(/^##\s+\d+\)\s+(.+)$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
      if (!sections.has(currentSection)) {
        sections.set(currentSection, { done: 0, total: 0 });
      }
      continue;
    }

    const itemMatch = line.match(/^- \[(x| )\]\s+(.+)$/i);
    if (!itemMatch) continue;

    const checked = itemMatch[1].toLowerCase() === 'x';
    const text = itemMatch[2].trim();

    total += 1;
    const section = sections.get(currentSection) ?? { done: 0, total: 0 };
    section.total += 1;
    if (checked) {
      done += 1;
      section.done += 1;
    } else {
      openItems.push({ section: currentSection, text });
    }
    sections.set(currentSection, section);
  }

  for (const [name, stats] of sections.entries()) {
    const percent = stats.total ? ((stats.done / stats.total) * 100).toFixed(1) : '0.0';
    sectionRows.push(`| ${name} | ${stats.done}/${stats.total} | ${percent}% |`);
  }

  const overallPercent = total ? ((done / total) * 100).toFixed(1) : '0.0';
  return { done, total, overallPercent, openItems, sectionRows };
}

function buildSnapshot() {
  const checklist = readFileSync(checklistPath, 'utf8');
  const parsed = parseChecklist(checklist);
  const now = new Date().toISOString();
  const openTop = parsed.openItems.slice(0, 8);

  return [
    syncStart,
    '## Auto-Sync Snapshot',
    `Generiert: ${now}`,
    '',
    `- Masterplan-Checklist: **${parsed.done}/${parsed.total}** erledigt (**${parsed.overallPercent}%**).`,
    `- Offene Punkte: **${Math.max(parsed.total - parsed.done, 0)}**.`,
    '',
    '### Fortschritt je Bereich',
    '| Bereich | Erledigt | Fortschritt |',
    '| --- | --- | --- |',
    ...parsed.sectionRows,
    '',
    '### Top offene Punkte',
    ...(openTop.length
      ? openTop.map((item) => `- [ ] ${item.section}: ${item.text}`)
      : ['- [x] Keine offenen Punkte im Checklist-Scope.']),
    syncEnd
  ].join('\n');
}

function applySnapshot(roadmap, snapshot) {
  const start = roadmap.indexOf(syncStart);
  const end = roadmap.indexOf(syncEnd);

  if (start === -1 || end === -1 || end < start) {
    throw new Error(`Missing sync markers in ${roadmapPath}`);
  }

  const before = roadmap.slice(0, start).trimEnd();
  const after = roadmap.slice(end + syncEnd.length).trimStart();
  return `${before}\n\n${snapshot}\n\n${after}\n`;
}

try {
  const roadmap = readFileSync(roadmapPath, 'utf8');
  const snapshot = buildSnapshot();
  const updated = applySnapshot(roadmap, snapshot);
  writeFileSync(roadmapPath, updated, 'utf8');
  console.log(`[roadmap-sync] Updated ${path.relative(repoRoot, roadmapPath)}`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[roadmap-sync] Failed: ${message}`);
  process.exit(1);
}
