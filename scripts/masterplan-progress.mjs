#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const checklistPath = path.resolve(process.cwd(), 'docs/masterplan-closeout-checklist.md');

function parseChecklist(content) {
  const lines = content.split('\n');
  const sectionStats = new Map();
  let currentSection = 'Global';
  let total = 0;
  let done = 0;

  for (const line of lines) {
    const sectionMatch = line.match(/^##\s+\d+\)\s+(.+)$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
      if (!sectionStats.has(currentSection)) {
        sectionStats.set(currentSection, { total: 0, done: 0 });
      }
      continue;
    }

    const checkboxMatch = line.match(/^- \[(x| )\]\s+/i);
    if (!checkboxMatch) continue;

    total += 1;
    const section = sectionStats.get(currentSection) ?? { total: 0, done: 0 };
    section.total += 1;

    if (checkboxMatch[1].toLowerCase() === 'x') {
      done += 1;
      section.done += 1;
    }

    sectionStats.set(currentSection, section);
  }

  return { total, done, sectionStats };
}

function formatPercent(numerator, denominator) {
  if (!denominator) return '0.0%';
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

try {
  const content = readFileSync(checklistPath, 'utf8');
  const { total, done, sectionStats } = parseChecklist(content);
  const open = Math.max(total - done, 0);

  console.log('[masterplan-progress]');
  console.log(`Checklist: ${checklistPath}`);
  console.log(`Done: ${done}/${total} (${formatPercent(done, total)})`);
  console.log(`Open: ${open}/${total}`);
  console.log('');
  console.log('Sections:');

  for (const [section, stats] of sectionStats.entries()) {
    console.log(`- ${section}: ${stats.done}/${stats.total} (${formatPercent(stats.done, stats.total)})`);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[masterplan-progress] Failed to read checklist: ${message}`);
  process.exit(1);
}
