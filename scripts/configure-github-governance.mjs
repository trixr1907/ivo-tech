#!/usr/bin/env node
import { execSync } from 'node:child_process';

function run(command) {
  return execSync(command, { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' }).trim();
}

function runJson(command) {
  return JSON.parse(run(command));
}

function hasOriginRemote() {
  try {
    run('git remote get-url origin');
    return true;
  } catch {
    return false;
  }
}

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function getErrorText(error) {
  if (!(error instanceof Error)) return String(error);
  const withStreams = error;
  const extra = [
    typeof withStreams.stdout === 'string' ? withStreams.stdout : '',
    typeof withStreams.stderr === 'string' ? withStreams.stderr : '',
    error.message
  ]
    .filter(Boolean)
    .join('\n');
  return extra;
}

function isPlanRestrictedProtectionError(error) {
  const text = getErrorText(error);
  return /Upgrade to GitHub Pro/i.test(text) && /HTTP 403/i.test(text);
}

if (!hasOriginRemote()) {
  fail('No origin remote configured. Run `git remote add origin <repo-url>` first.');
}

const repo = runJson('gh repo view --json nameWithOwner,defaultBranchRef');
const repoName = repo.nameWithOwner;
const defaultBranch = repo.defaultBranchRef?.name || 'main';

const checks = ['ci', 'unit-integration', 'security'];

console.log(`Configuring governance for ${repoName} (branch: ${defaultBranch})`);

// Branch protection (v3 endpoint)
let branchProtectionApplied = false;
try {
  run(
    `gh api --method PUT repos/${repoName}/branches/${defaultBranch}/protection ` +
      `-H "Accept: application/vnd.github+json" ` +
      `-f required_status_checks[strict]=true ` +
      `-f required_pull_request_reviews[dismiss_stale_reviews]=true ` +
      `-f required_pull_request_reviews[required_approving_review_count]=1 ` +
      `-f enforce_admins=true ` +
      `-f restrictions= ` +
      checks
        .map((context, i) => `-f required_status_checks[contexts][${i}]=${context}`)
        .join(' ')
  );
  branchProtectionApplied = true;
} catch (error) {
  if (isPlanRestrictedProtectionError(error)) {
    console.warn('WARN: Branch protection skipped (private repo on current GitHub plan).');
    console.warn('      Option: make repo public or upgrade to GitHub Pro, then rerun this script.');
  } else {
    fail(`Failed to apply branch protection.\n${getErrorText(error)}`);
  }
}

// Repository-level merge settings
run(
  `gh api --method PATCH repos/${repoName} ` +
    `-H "Accept: application/vnd.github+json" ` +
    `-f allow_merge_commit=false ` +
    `-f allow_rebase_merge=true ` +
    `-f allow_squash_merge=true ` +
    `-f delete_branch_on_merge=true`
);

// Create/update deployment environment
for (const envName of ['production']) {
  run(`gh api --method PUT repos/${repoName}/environments/${envName}`);
}

console.log(
  `Done. Applied: ${branchProtectionApplied ? 'branch protection + ' : ''}merge policy, environments.`
);
console.log('Next: add reviewer protection manually for production environment in GitHub UI.');
