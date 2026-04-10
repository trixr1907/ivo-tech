#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const filePath = path.resolve(process.cwd(), 'docs/hero-experiment-log.md');
const args = new Set(process.argv.slice(2));
const strict = args.has('--strict');

function parseDataRows(lines) {
  return lines
    .filter((line) => /^\|\s*\d{4}-\d{2}-\d{2}\s*\|/.test(line.trim()))
    .map((line) => {
      const values = line
        .split('|')
        .map((part) => part.trim())
        .filter(Boolean);
      return {
        raw: line.trim(),
        date: values[0] ?? '',
        distribution: values[1] ?? '',
        ctaCtr: values[2] ?? '',
        startRate: values[3] ?? '',
        submitRate: values[4] ?? '',
        notes: values[5] ?? ''
      };
    });
}

function isFilled(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

try {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const rows = parseDataRows(lines);
  const completeRows = rows.filter(
    (row) => isFilled(row.distribution) && isFilled(row.ctaCtr) && isFilled(row.startRate) && isFilled(row.submitRate)
  );

  const decisionDateLine = lines.find((line) => line.includes('Decision date:')) ?? '';
  const decisionHasPlaceholder = /____-__-__/.test(decisionDateLine);
  const decisionLine = lines.find((line) => line.trim().startsWith('2. Decision:')) ?? '';
  const decisionUnset = /keep\|revert\|iterate/.test(decisionLine);

  console.log('[hero-log-readiness]');
  console.log(`Source: ${filePath}`);
  console.log(`Rows found: ${rows.length}`);
  console.log(`Rows complete: ${completeRows.length}/${rows.length}`);
  console.log(`Decision date set: ${decisionHasPlaceholder ? 'no' : 'yes'}`);
  console.log(`Decision set: ${decisionUnset ? 'no' : 'yes'}`);

  const issues = [];
  if (rows.length !== 14) issues.push(`Expected 14 dated rows, found ${rows.length}.`);
  if (completeRows.length < rows.length) issues.push(`${rows.length - completeRows.length} day rows are still incomplete.`);
  if (decisionHasPlaceholder) issues.push('Decision date is still placeholder.');
  if (decisionUnset) issues.push('Decision outcome is still placeholder.');

  if (issues.length > 0) {
    console.log('\nOpen issues:');
    for (const issue of issues) {
      console.log(`- ${issue}`);
    }
  }

  if (strict && issues.length > 0) {
    process.exit(1);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[hero-log-readiness] Failed: ${message}`);
  process.exit(1);
}
