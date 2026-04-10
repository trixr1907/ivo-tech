#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const logPath = path.resolve(process.cwd(), 'docs/hero-experiment-log.md');

function parseStartDate() {
  const arg = process.argv.slice(2).find((entry) => entry.startsWith('--start='));
  if (!arg) {
    const today = new Date();
    return new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  }

  const value = arg.slice('--start='.length);
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid --start date: ${value}. Use YYYY-MM-DD.`);
  }
  return parsed;
}

function formatDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildRows(startDate) {
  const rows = [];
  for (let i = 0; i < 14; i += 1) {
    const date = new Date(startDate);
    date.setUTCDate(startDate.getUTCDate() + i);
    rows.push(`| ${formatDate(date)} |  |  |  |  |  |`);
  }
  return rows.join('\n');
}

function updateDateRangeMeta(content, startDate) {
  const endDate = new Date(startDate);
  endDate.setUTCDate(startDate.getUTCDate() + 13);
  const rangeLine = `Experiment-Fenster: ${formatDate(startDate)} bis ${formatDate(endDate)}`;
  const scopeLine = 'Scope: Variant test `default` vs `outcome` vs `speed`';

  if (content.includes('Experiment-Fenster:')) {
    return content.replace(/Experiment-Fenster:\s+\d{4}-\d{2}-\d{2}\s+bis\s+\d{4}-\d{2}-\d{2}/, rangeLine);
  }

  return content.replace(scopeLine, `${scopeLine}\n${rangeLine}`);
}

function updateTable(content, rows) {
  const tablePattern =
    /\| Datum \| Variant-Verteilung \(default\/outcome\/speed\) \| CTA Primary CTR \| Contact Start Rate \| Submit Success Rate \| Notes \|\n\| --- \| --- \| --- \| --- \| --- \| --- \|\n(?:\|.*\|\n){14}/;

  const replacement =
    '| Datum | Variant-Verteilung (default/outcome/speed) | CTA Primary CTR | Contact Start Rate | Submit Success Rate | Notes |\n' +
    '| --- | --- | --- | --- | --- | --- |\n' +
    `${rows}\n`;

  if (!tablePattern.test(content)) {
    throw new Error('Could not locate 14-row experiment table in docs/hero-experiment-log.md');
  }

  return content.replace(tablePattern, replacement);
}

try {
  const startDate = parseStartDate();
  const source = readFileSync(logPath, 'utf8');
  const withRange = updateDateRangeMeta(source, startDate);
  const withTable = updateTable(withRange, buildRows(startDate));
  writeFileSync(logPath, withTable, 'utf8');
  console.log(`[hero-experiment-plan] Updated ${logPath} from ${formatDate(startDate)}.`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[hero-experiment-plan] ${message}`);
  process.exit(1);
}
