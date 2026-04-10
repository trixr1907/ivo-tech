#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();
const docsPath = path.join(repoRoot, 'docs', 'analytics-event-map.md');
const srcRoot = path.join(repoRoot, 'src');
const analyticsTypePath = path.join(repoRoot, 'src', 'lib', 'analytics.ts');

function walkFiles(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, out);
      continue;
    }
    if (!/\.(ts|tsx|js|jsx)$/.test(entry.name)) continue;
    out.push(fullPath);
  }
  return out;
}

function readDocumentedEvents(markdown) {
  const events = new Set();
  const rowRegex = /^\|\s*`([a-z0-9_:-]+)`\s*\|/gim;
  for (const match of markdown.matchAll(rowRegex)) {
    events.add(match[1]);
  }
  return events;
}

function readEmittedEvents(fileContent) {
  const events = [];
  const regex = /trackEvent\(\s*'([a-z0-9_:-]+)'/gim;
  for (const match of fileContent.matchAll(regex)) {
    events.push(match[1]);
  }
  return events;
}

function readTypedEvents(fileContent) {
  const events = new Set();
  const typeBlockMatch = fileContent.match(
    /export type AnalyticsEventName\s*=\s*([\s\S]*?)\|\s*\(string\s*&\s*\{\}\s*\);/m
  );
  if (!typeBlockMatch?.[1]) return events;

  const typeBlock = typeBlockMatch[1];
  const literalRegex = /'([a-z0-9_:-]+)'/gim;
  for (const match of typeBlock.matchAll(literalRegex)) {
    events.add(match[1]);
  }
  return events;
}

function sortAlpha(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function printList(title, values) {
  console.log(`\n${title}`);
  if (values.length === 0) {
    console.log('- none');
    return;
  }
  for (const value of values) {
    console.log(`- ${value}`);
  }
}

function readFlag(name) {
  return process.argv.includes(`--${name}`);
}

if (!fs.existsSync(docsPath)) {
  console.error(`[analytics-verify] Missing file: ${docsPath}`);
  process.exit(1);
}
if (!fs.existsSync(analyticsTypePath)) {
  console.error(`[analytics-verify] Missing analytics type file: ${analyticsTypePath}`);
  process.exit(1);
}

const docsContent = fs.readFileSync(docsPath, 'utf8');
const documentedEvents = readDocumentedEvents(docsContent);
if (documentedEvents.size === 0) {
  console.error('[analytics-verify] No documented events found in docs/analytics-event-map.md');
  process.exit(1);
}

const sourceFiles = walkFiles(srcRoot);
const emittedEvents = new Set();
const typedEvents = readTypedEvents(fs.readFileSync(analyticsTypePath, 'utf8'));

if (typedEvents.size === 0) {
  console.error('[analytics-verify] No typed events found in src/lib/analytics.ts');
  process.exit(1);
}

for (const filePath of sourceFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const events = readEmittedEvents(content);
  for (const eventName of events) {
    emittedEvents.add(eventName);
  }
}

const missingEmitter = sortAlpha([...documentedEvents].filter((eventName) => !emittedEvents.has(eventName)));
const undocumentedEmitter = sortAlpha([...emittedEvents].filter((eventName) => !documentedEvents.has(eventName)));
const undocumentedType = sortAlpha([...documentedEvents].filter((eventName) => !typedEvents.has(eventName)));
const untypedEmitter = sortAlpha([...emittedEvents].filter((eventName) => !typedEvents.has(eventName)));
const staleTyped = sortAlpha([...typedEvents].filter((eventName) => !documentedEvents.has(eventName) && !emittedEvents.has(eventName)));
const strictUndocumented = readFlag('strict-undocumented');

console.log('[analytics-verify] Event map consistency check');
console.log(`- documented events: ${documentedEvents.size}`);
console.log(`- emitted events: ${emittedEvents.size}`);
console.log(`- typed events: ${typedEvents.size}`);

printList('Documented but not emitted (must fix)', missingEmitter);
printList('Emitted but undocumented (review)', undocumentedEmitter);
printList('Documented but missing in AnalyticsEventName (must fix)', undocumentedType);
printList('Emitted but missing in AnalyticsEventName (must fix)', untypedEmitter);
printList('Typed but neither documented nor emitted (review)', staleTyped);

if (missingEmitter.length > 0) {
  console.error('\n[analytics-verify] FAILED: at least one documented event has no emitter.');
  process.exit(1);
}
if (undocumentedType.length > 0 || untypedEmitter.length > 0) {
  console.error('\n[analytics-verify] FAILED: event mismatch with AnalyticsEventName type.');
  process.exit(1);
}

if (strictUndocumented && undocumentedEmitter.length > 0) {
  console.error('\n[analytics-verify] FAILED: strict mode requires all emitted events to be documented.');
  process.exit(1);
}

console.log('\n[analytics-verify] OK');
