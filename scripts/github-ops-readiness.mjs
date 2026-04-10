#!/usr/bin/env node

import { execSync } from 'node:child_process';
import process from 'node:process';

function run(command) {
  return execSync(command, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  }).trim();
}

function getRepoSlug() {
  const remoteUrl = run('git remote get-url origin');

  const sshMatch = remoteUrl.match(/github\.com:([^/]+\/[^/.]+)(?:\.git)?$/);
  if (sshMatch) return sshMatch[1];

  const httpsMatch = remoteUrl.match(/github\.com\/([^/]+\/[^/.]+)(?:\.git)?$/);
  if (httpsMatch) return httpsMatch[1];

  throw new Error(`Could not parse GitHub repository slug from origin URL: ${remoteUrl}`);
}

function parseSecretNames(raw) {
  return new Set(
    raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.split('\t')[0])
      .filter(Boolean)
  );
}

function parseWorkflowNames(raw) {
  return new Set(
    raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.split('\t')[0])
      .filter(Boolean)
  );
}

function hasUnpushedLocalWorkflow() {
  try {
    const output = run('git status --porcelain .github/workflows/analytics-ops-daily.yml');
    return output.length > 0;
  } catch {
    return false;
  }
}

function main() {
  const args = new Set(process.argv.slice(2));
  const strict = args.has('--strict');

  let repoSlug = '';
  try {
    repoSlug = getRepoSlug();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[github-ops-readiness] ${message}`);
    process.exit(1);
  }

  const requiredSecrets = ['VERCEL_TOKEN', 'VERCEL_ORG_ID', 'VERCEL_PROJECT_ID', 'PLAUSIBLE_STATS_API_KEY'];
  const requiredWorkflows = ['cd-production', 'analytics-ops-daily'];

  let secretNames = new Set();
  let workflowNames = new Set();
  const issues = [];

  try {
    secretNames = parseSecretNames(run(`gh secret list --repo ${repoSlug}`));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    issues.push(`Failed to query GitHub secrets: ${message}`);
  }

  try {
    workflowNames = parseWorkflowNames(run(`gh workflow list --repo ${repoSlug}`));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    issues.push(`Failed to query GitHub workflows: ${message}`);
  }

  const missingSecrets = requiredSecrets.filter((name) => !secretNames.has(name));
  const missingWorkflows = requiredWorkflows.filter((name) => !workflowNames.has(name));

  console.log('[github-ops-readiness]');
  console.log(`Repository: ${repoSlug}`);
  console.log(`Secrets found: ${secretNames.size}`);
  console.log(`Workflows found: ${workflowNames.size}`);
  console.log(`Unpushed local analytics workflow changes: ${hasUnpushedLocalWorkflow() ? 'yes' : 'no'}`);

  if (missingSecrets.length > 0) {
    console.log('\nMissing GitHub secrets:');
    for (const name of missingSecrets) {
      console.log(`- ${name}`);
    }
  }

  if (missingWorkflows.length > 0) {
    console.log('\nMissing remote workflows:');
    for (const name of missingWorkflows) {
      console.log(`- ${name}`);
    }
  }

  if (issues.length > 0) {
    console.log('\nQuery issues:');
    for (const issue of issues) {
      console.log(`- ${issue}`);
    }
  }

  const hasBlockingIssues = missingSecrets.length > 0 || missingWorkflows.length > 0 || issues.length > 0;
  if (strict && hasBlockingIssues) {
    process.exit(1);
  }
}

main();
