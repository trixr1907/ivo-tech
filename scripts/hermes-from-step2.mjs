#!/usr/bin/env node
/**
 * Ab „Schritt 2“ der Hermes-Anleitung: alles, was ohne TTY geht + klare nächste Schritte.
 * Aufruf: npm run hermes:from-step2
 */
import { execSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const envWithHermes = {
  ...process.env,
  PATH: `${join(homedir(), '.local', 'bin')}${process.env.PATH ? `:${process.env.PATH}` : ''}`
};

function run(cmd, opts = {}) {
  execSync(cmd, { stdio: 'inherit', cwd: root, env: envWithHermes, ...opts });
}

function hasAnyInferenceKey() {
  const p = join(homedir(), '.hermes', '.env');
  if (!existsSync(p)) return false;
  const t = readFileSync(p, 'utf8');
  return /^(OPENROUTER_API_KEY|OPENAI_API_KEY|ANTHROPIC_API_KEY|NOUS_API_KEY|GEMINI_API_KEY|GOOGLE_API_KEY)\s*=\s*\S+/m.test(
    t
  );
}

console.log(`
══════════════════════════════════════════════════════════════
 Hermes — ab Schritt 2 (Wizard & Gateway)
══════════════════════════════════════════════════════════════
`);

const keyOk = hasAnyInferenceKey();
if (!keyOk) {
  console.log(`Schritt 2a — API-Zugang (ohne interaktives setup möglich)
  Datei bearbeiten: ${join(homedir(), '.hermes', '.env')}
  Mindestens eine Zeile setzen, z. B.:
    OPENROUTER_API_KEY=sk-or-v1-...

  Oder im echten Terminal (mit TTY) nur den Modell-Teil des Wizards:
    hermes setup model

`);
} else {
  console.log('Schritt 2a — Inference-Key in ~/.hermes/.env: erkannt (Variable gesetzt).\n');
}

console.log(`Schritt 2b — vollständiger Wizard (nur interaktiv, empfohlen einmal)
  hermes setup

  Hinweis: hermes setup --non-interactive setzt keine Keys — nur Hinweise.
`);

console.log('Schritt 3 — Messaging-Gateway (optional, interaktiv)\n  hermes gateway setup\n  hermes gateway run   # Vordergrund unter WSL\n');

console.log('Schritt 4 — Repo-Pfad für MCP (automatisch jetzt) …\n');
run('node scripts/hermes-sync-mcp-config.mjs');
run('node scripts/hermes-validate.mjs');

const ni = spawnSync('hermes', ['setup', '--non-interactive'], {
  cwd: root,
  encoding: 'utf8',
  env: envWithHermes
});
if (ni.stdout) console.log(ni.stdout);

console.log(`
Schritt 5 — Optional: Hermes in Cursor als MCP (Messaging)
  Siehe config/cursor-mcp.hermes.snippet.json

Fertig (automatischer Teil). Was nur in deinem Terminal geht: 2b und ggf. 3.
`);
