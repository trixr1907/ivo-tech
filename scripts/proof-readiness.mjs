#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const filePath = path.resolve(process.cwd(), 'docs/proof-asset-collection.md');
const args = new Set(process.argv.slice(2));
const strict = args.has('--strict');

function parseRows(content) {
  const lines = content.split('\n');
  const rows = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;
    if (trimmed.includes('Asset-ID') || trimmed.includes('---')) continue;

    const parts = trimmed
      .split('|')
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length < 9) continue;
    rows.push({
      id: parts[0],
      type: parts[1],
      language: parts[2],
      claim: parts[3],
      personRole: parts[4],
      company: parts[5],
      sourceUrl: parts[6],
      approval: parts[7],
      lastCheck: parts[8]
    });
  }

  return rows;
}

function hasPlaceholder(value) {
  return /\b(pending|offen)\b/i.test(value);
}

try {
  const content = readFileSync(filePath, 'utf8');
  const rows = parseRows(content);
  const incompleteRows = rows.filter((row) =>
    Object.values(row).some((value) => hasPlaceholder(String(value)))
  );

  console.log('[proof-readiness]');
  console.log(`Source: ${filePath}`);
  console.log(`Rows parsed: ${rows.length}`);
  console.log(`Rows with placeholders: ${incompleteRows.length}`);

  if (incompleteRows.length > 0) {
    console.log('\nOpen entries:');
    for (const row of incompleteRows) {
      console.log(`- ${row.id} (${row.type}) -> approval=${row.approval}`);
    }
  }

  if (strict && incompleteRows.length > 0) {
    process.exit(1);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[proof-readiness] Failed: ${message}`);
  process.exit(1);
}
