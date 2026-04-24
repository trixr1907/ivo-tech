#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const filePath = path.resolve(process.cwd(), 'docs/analytics-live-status.md');
const args = new Set(process.argv.slice(2));
const strict = args.has('--strict');

function findCheckboxes(lines) {
  return lines
    .filter((line) => line.trim().startsWith('- ['))
    .map((line) => ({
      line,
      checked: /^-\s+\[x\]/i.test(line.trim())
    }));
}

try {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const checkboxes = findCheckboxes(lines);
  const unchecked = checkboxes.filter((entry) => !entry.checked);
  const pendingTokens = lines.filter((line) => /\bpending\b/i.test(line));

  console.log('[analytics-live-readiness]');
  console.log(`Source: ${filePath}`);
  console.log(`Checkboxes: ${checkboxes.length}`);
  console.log(`Unchecked: ${unchecked.length}`);
  console.log(`Pending markers: ${pendingTokens.length}`);

  if (unchecked.length > 0) {
    console.log('\nOpen checkboxes:');
    for (const item of unchecked) {
      console.log(`- ${item.line.trim()}`);
    }
  }

  if (pendingTokens.length > 0) {
    console.log('\nPending markers:');
    for (const line of pendingTokens) {
      console.log(`- ${line.trim()}`);
    }
  }

  if (strict && (unchecked.length > 0 || pendingTokens.length > 0)) {
    process.exit(1);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[analytics-live-readiness] Failed: ${message}`);
  process.exit(1);
}
