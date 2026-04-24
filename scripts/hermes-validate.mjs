#!/usr/bin/env node
/**
 * Prüft Hermes-Installation, Doctor, MCP-Block und Repo-Pfad.
 */
import { execSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = execSync('git rev-parse --show-toplevel', {
  cwd: join(__dirname, '..'),
  encoding: 'utf8'
}).trim();

const errors = [];
const warns = [];

function sh(cmd, opts = {}) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...opts });
  } catch {
    return null;
  }
}

const hermes = sh('command -v hermes')?.trim();
if (!hermes) {
  errors.push('hermes nicht im PATH (nach Installation: source ~/.bashrc)');
} else {
  const doctor = spawnSync('hermes', ['doctor'], { encoding: 'utf8' });
  if (doctor.status !== 0) {
    errors.push(`hermes doctor exit ${doctor.status}`);
  } else {
    const out = `${doctor.stdout}\n${doctor.stderr}`;
    if (out.includes('✗') || out.includes('✖')) {
      warns.push('hermes doctor meldet mindestens ein ✗/✖ — Ausgabe prüfen.');
    }
    if (out.includes('OpenRouter API (not configured)')) {
      warns.push('OPENROUTER_API_KEY (oder anderen Provider) in ~/.hermes/.env setzen — sonst kein Chat.');
    }
  }
}

const configPath = join(homedir(), '.hermes', 'config.yaml');
if (!existsSync(configPath)) {
  errors.push(`Fehlt ${configPath}`);
} else {
  const cfg = readFileSync(configPath, 'utf8');
  if (!cfg.includes('ivo_tech_fs:')) {
    errors.push('config.yaml: kein ivo_tech_fs — npm run hermes:sync-mcp ausführen');
  } else if (!cfg.includes(repoRoot)) {
    warns.push(`config.yaml: Pfad weicht von git root ab.\n  erwartet: ${repoRoot}\n  → npm run hermes:sync-mcp`);
  }
}

const agentDir = join(homedir(), '.hermes', 'hermes-agent');
if (!existsSync(join(agentDir, 'venv', 'bin', 'hermes'))) {
  warns.push(`Unerwartet: ${join(agentDir, 'venv', 'bin', 'hermes')} fehlt`);
}

if (!existsSync(join(repoRoot, 'AGENTS.md'))) {
  errors.push('AGENTS.md fehlt im Repo-Root');
}

for (const w of warns) console.warn(`WARN: ${w}`);
for (const e of errors) console.error(`FEHLER: ${e}`);

if (errors.length) {
  console.error(`\n${errors.length} harte Fehler — bitte beheben.`);
  process.exit(1);
}
console.log('hermes:validate — OK (Warnungen sind optional).');
