#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import process from 'node:process';

const args = new Set(process.argv.slice(2));
const strict = args.has('--strict');

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
  const result = spawnSync(command, rest, { stdio: 'inherit', shell: false });
  const ok = result.status === 0;
  if (!ok) failed += 1;
  console.log(`[ops-readiness] ${ok ? 'PASS' : 'FAIL'} ${check.name}`);
}

console.log(`[ops-readiness] summary: ${checks.length - failed}/${checks.length} checks passed`);

if (strict && failed > 0) {
  process.exit(1);
}
