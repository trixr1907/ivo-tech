#!/usr/bin/env node

import { execFileSync } from 'node:child_process';

function parseCliArgs(argv) {
  const parsed = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;

    const body = token.slice(2);
    if (!body) continue;

    const equalsIndex = body.indexOf('=');
    if (equalsIndex >= 0) {
      const key = body.slice(0, equalsIndex);
      const value = body.slice(equalsIndex + 1);
      parsed.set(key, value);
      continue;
    }

    const key = body;
    const nextToken = argv[index + 1];
    if (nextToken && !nextToken.startsWith('--')) {
      parsed.set(key, nextToken);
      index += 1;
    } else {
      parsed.set(key, 'true');
    }
  }

  return parsed;
}

function readArg(cliArgs, name, fallback) {
  const value = cliArgs.get(name);
  if (value === undefined || value === '') return fallback;
  return value;
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

const cliArgs = parseCliArgs(process.argv.slice(2));
const project = readArg(cliArgs, 'project', process.env.CSP_LOG_PROJECT?.trim() || 'ivo-tech');
const since = readArg(cliArgs, 'since', process.env.CSP_LOG_SINCE?.trim() || '24h');
const environment = readArg(cliArgs, 'environment', process.env.CSP_LOG_ENVIRONMENT?.trim() || 'production');
const maxRows = Number.parseInt(readArg(cliArgs, 'limit', process.env.CSP_LOG_LIMIT?.trim() || '300'), 10);

let output = '';
try {
  output = execFileSync(
    'npx',
    [
      'vercel',
      'logs',
      '--project',
      project,
      '--environment',
      environment,
      '--since',
      since,
      '--query',
      '[csp-report]',
      '--json',
      '--no-branch'
    ],
    { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
  );
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
