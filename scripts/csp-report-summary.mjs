#!/usr/bin/env node

import { execSync } from 'node:child_process';

function parseArg(name, fallback) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((entry) => entry.startsWith(prefix));
  if (!arg) return fallback;
  return arg.slice(prefix.length);
}

function normalizeSample(sample) {
  return sample.replace(/\s+/g, ' ').trim().slice(0, 100);
}

function extractField(message, field) {
  const pattern = new RegExp(`${field}: '([^']*)'`);
  const match = message.match(pattern);
  return (match?.[1] ?? '').trim();
}

function increment(map, key) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

const project = parseArg('project', process.env.CSP_LOG_PROJECT?.trim() || 'ivo-tech');
const since = parseArg('since', process.env.CSP_LOG_SINCE?.trim() || '24h');
const environment = parseArg('environment', process.env.CSP_LOG_ENVIRONMENT?.trim() || 'production');
const maxRows = Number.parseInt(parseArg('limit', process.env.CSP_LOG_LIMIT?.trim() || '300'), 10);

const command = [
  'npx vercel logs',
  `--project ${project}`,
  `--environment ${environment}`,
  `--since ${since}`,
  '--query "[csp-report]"',
  '--json',
  '--no-branch'
].join(' ');

let output = '';
try {
  output = execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
} catch (error) {
  const stderr = error instanceof Error && 'stderr' in error ? String(error.stderr || '') : '';
  const stdout = error instanceof Error && 'stdout' in error ? String(error.stdout || '') : '';
  process.stderr.write(stderr || stdout || String(error));
  process.exit(1);
}

const lines = output
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line.startsWith('{'));

const directiveCounts = new Map();
const sampleCounts = new Map();
const documentCounts = new Map();

let parsedRows = 0;
for (const line of lines) {
  if (parsedRows >= maxRows) break;
  let row = null;
  try {
    row = JSON.parse(line);
  } catch {
    continue;
  }

  const message = typeof row?.message === 'string' ? row.message : '';
  if (!message.includes('[csp-report]')) continue;

  const effectiveDirective = extractField(message, 'effectiveDirective') || 'unknown';
  const documentUri = extractField(message, 'documentUri') || 'unknown';
  const sample = normalizeSample(extractField(message, 'sample') || '(empty)');

  increment(directiveCounts, effectiveDirective);
  increment(documentCounts, documentUri);
  increment(sampleCounts, sample);
  parsedRows += 1;
}

function printTop(title, map, top = 10) {
  const entries = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, top);
  console.log(`\n${title}`);
  if (entries.length === 0) {
    console.log('- none');
    return;
  }
  for (const [key, count] of entries) {
    console.log(`- ${count}x ${key}`);
  }
}

console.log(`CSP Report Summary (${project}, ${environment}, since ${since})`);
console.log(`Rows analyzed: ${parsedRows}`);
printTop('Top effectiveDirective', directiveCounts, 8);
printTop('Top documentUri', documentCounts, 5);
printTop('Top script/style sample', sampleCounts, 8);
