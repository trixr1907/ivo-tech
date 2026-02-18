import { spawn } from 'node:child_process';
import fs from 'node:fs';

import { chromium } from '@playwright/test';

const chromePath = process.env.CHROME_PATH || chromium.executablePath();
const configPath = process.argv[2] || process.env.LHCI_CONFIG_PATH || './lighthouserc.json';

if (!chromePath || !fs.existsSync(chromePath)) {
  console.error('LHCI: Chromium executable not found.');
  console.error('Run: npx playwright install chromium');
  process.exit(1);
}

const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const child = spawn(npxCommand, ['lhci', 'autorun', `--config=${configPath}`], {
  stdio: 'inherit',
  env: {
    ...process.env,
    CHROME_PATH: chromePath
  }
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
