#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const args = new Set(process.argv.slice(2));
const strict = args.has('--strict');

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {};
  const raw = readFileSync(filePath, 'utf8');
  const lines = raw.split('\n');
  const env = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    value = value.replace(/\\n/g, '').trim();
    env[key] = value;
  }

  return env;
}

const envCandidates = [
  path.resolve(process.cwd(), '.env.ops'),
  path.resolve(process.cwd(), '.env.vercel.production'),
  path.resolve(process.cwd(), '.env.local')
];
const mergedEnv = { ...process.env };
for (const candidate of envCandidates) {
  Object.assign(mergedEnv, parseEnvFile(candidate));
}

const checks = [
  { name: 'analytics:readiness', cmd: ['npm', 'run', '-s', strict ? 'analytics:readiness:strict' : 'analytics:readiness'] },
  { name: 'analytics:live:readiness', cmd: ['npm', 'run', '-s', strict ? 'analytics:live:readiness:strict' : 'analytics:live:readiness'] },
  { name: 'proof:readiness', cmd: ['npm', 'run', '-s', strict ? 'proof:readiness:strict' : 'proof:readiness'] },
  { name: 'hero:log:readiness', cmd: ['npm', 'run', '-s', strict ? 'hero:log:readiness:strict' : 'hero:log:readiness'] }
];

let failed = 0;

console.log(`[ops-readiness] mode=${strict ? 'strict' : 'report'}`);

for (const check of checks) {
  const [command, ...rest] = check.cmd;
  const result = spawnSync(command, rest, { stdio: 'inherit', shell: false, env: mergedEnv });
  const ok = result.status === 0;
  if (!ok) failed += 1;
  console.log(`[ops-readiness] ${ok ? 'PASS' : 'FAIL'} ${check.name}`);
}

console.log(`[ops-readiness] summary: ${checks.length - failed}/${checks.length} checks passed`);

if (strict && failed > 0) {
  process.exit(1);
}
