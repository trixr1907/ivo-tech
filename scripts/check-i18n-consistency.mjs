import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const COPY_FILE = path.join(ROOT, 'src/content/copy.ts');
const CONTENT_ROOT = path.join(ROOT, 'content');
const CONTENT_GROUPS = ['insights', 'playbooks', 'case-studies'];

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function readCopyObject() {
  const source = fs.readFileSync(COPY_FILE, 'utf-8');
  const startToken = 'export const copy =';
  const endToken = 'as const;';
  const start = source.indexOf(startToken);
  const end = source.indexOf(endToken, start);
  if (start < 0 || end < 0) {
    throw new Error('Unable to parse copy object from src/content/copy.ts');
  }

  const literal = source.slice(start + startToken.length, end).trim();
  return Function(`"use strict"; return (${literal});`)();
}

function compareShape(left, right, scope, issues) {
  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length > 0 && right.length > 0) {
      compareShape(left[0], right[0], `${scope}[]`, issues);
    }
    return;
  }

  if (isObject(left) && isObject(right)) {
    const leftKeys = new Set(Object.keys(left));
    const rightKeys = new Set(Object.keys(right));

    for (const key of leftKeys) {
      if (!rightKeys.has(key)) issues.push(`Missing in EN: ${scope}.${key}`);
    }

    for (const key of rightKeys) {
      if (!leftKeys.has(key)) issues.push(`Missing in DE: ${scope}.${key}`);
    }

    for (const key of leftKeys) {
      if (!rightKeys.has(key)) continue;
      compareShape(left[key], right[key], `${scope}.${key}`, issues);
    }

    return;
  }

  const leftType = Array.isArray(left) ? 'array' : typeof left;
  const rightType = Array.isArray(right) ? 'array' : typeof right;
  if (leftType !== rightType) {
    issues.push(`Type mismatch at ${scope}: de=${leftType}, en=${rightType}`);
  }
}

function readLocaleSlugs(group, locale) {
  const localeDir = path.join(CONTENT_ROOT, group, locale);
  if (!fs.existsSync(localeDir)) return [];

  return fs
    .readdirSync(localeDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => entry.name.replace(/\.mdx$/, ''))
    .sort();
}

function compareContentParity(issues) {
  for (const group of CONTENT_GROUPS) {
    const deSlugs = new Set(readLocaleSlugs(group, 'de'));
    const enSlugs = new Set(readLocaleSlugs(group, 'en'));

    for (const slug of deSlugs) {
      if (!enSlugs.has(slug)) issues.push(`Missing EN content: content/${group}/en/${slug}.mdx`);
    }

    for (const slug of enSlugs) {
      if (!deSlugs.has(slug)) issues.push(`Missing DE content: content/${group}/de/${slug}.mdx`);
    }
  }
}

const issues = [];

try {
  const copy = readCopyObject();
  compareShape(copy.de, copy.en, 'copy', issues);
} catch (error) {
  issues.push(error instanceof Error ? error.message : 'Unknown i18n consistency error');
}

compareContentParity(issues);

if (issues.length > 0) {
  console.error('i18n consistency check failed:');
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log('i18n consistency check passed.');
