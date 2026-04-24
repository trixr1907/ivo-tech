#!/usr/bin/env node
/**
 * Schreibt den MCP-Filesystem-Server für dieses Repo in ~/.hermes/config.yaml
 * (Block zwischen HERMES_IVO_TECH_MCP_BEGIN / END). Idempotent.
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = execSync('git rev-parse --show-toplevel', {
  cwd: join(__dirname, '..'),
  encoding: 'utf8'
}).trim();

const configPath = join(homedir(), '.hermes', 'config.yaml');
const begin = '# HERMES_IVO_TECH_MCP_BEGIN';
const end = '# HERMES_IVO_TECH_MCP_END';

const block = `${begin} (npm run hermes:sync-mcp im Repo ivo-tech)
mcp_servers:
  ivo_tech_fs:
    command: "npx"
    args:
      - "-y"
      - "@modelcontextprotocol/server-filesystem"
      - ${JSON.stringify(repoRoot)}
${end}
`;

if (!existsSync(configPath)) {
  console.error(`Fehlt: ${configPath} — zuerst Hermes installieren (install.sh).`);
  process.exit(1);
}

let text = readFileSync(configPath, 'utf8');

/** Entfernt einen älteren `mcp_servers`/`ivo_tech_fs`-Block ohne BEGIN/END-Marker direkt vor dem Marker-Block (verhindert doppeltes `mcp_servers:`). */
function stripOrphanIvoTechMcpBlock(s) {
  const re = /\n+mcp_servers:\s*\n\s+ivo_tech_fs:[\s\S]*?(?=\n#\s*HERMES_IVO_TECH_MCP_BEGIN)/m;
  return s.replace(re, '\n');
}

text = stripOrphanIvoTechMcpBlock(text);

const re = new RegExp(`${begin}[\\s\\S]*?${end}\\n?`, 'm');

if (re.test(text)) {
  text = text.replace(re, block);
} else {
  text = `${text.trimEnd()}\n\n${block}`;
}

writeFileSync(configPath, text.endsWith('\n') ? text : `${text}\n`, 'utf8');
console.log(`OK: MCP-Filesystem für Hermes → ${repoRoot}`);
console.log(`     ${configPath}`);
