#!/usr/bin/env node
import { mkdtempSync, readdirSync, readFileSync, existsSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const createScript = path.join(repoRoot, 'scripts/create-assignment.mjs');

function collectFiles(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(fullPath, acc);
    else acc.push(fullPath);
  }
  return acc;
}

function assertNoPlaceholder(dir) {
  const tokenPattern = /__([A-Z0-9_]+)__/g;
  const hits = [];

  for (const file of collectFiles(dir)) {
    const content = readFileSync(file, 'utf8');
    if (tokenPattern.test(content)) hits.push(file);
  }

  if (hits.length > 0) {
    throw new Error(`Placeholder residue found:\n${hits.join('\n')}`);
  }
}

function assertSmoke(dir, { entryFile = 'main.js' } = {}) {
  const pkgPath = path.join(dir, 'package.json');
  const readmePath = path.join(dir, 'README.md');
  const srcPath = path.join(dir, 'src', entryFile);

  if (!existsSync(pkgPath)) throw new Error(`Missing package.json in ${dir}`);
  if (!existsSync(readmePath)) throw new Error(`Missing README.md in ${dir}`);
  if (!existsSync(srcPath)) throw new Error(`Missing src/${entryFile} in ${dir}`);

  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  if (!pkg.name || pkg.name.startsWith('__')) {
    throw new Error(`Invalid package name in ${pkgPath}`);
  }
}

function scaffold(tmpRoot, args) {
  execFileSync('node', [createScript, ...args], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
}

function main() {
  const tempRoot = mkdtempSync(path.join(os.tmpdir(), 'fe-mentoring-scaffold-'));
  console.log(`ℹ️ temp directory: ${tempRoot}`);

  try {
    scaffold(tempRoot, ['--name', 'sample-react-funnel', '--framework', 'react', '--preset', 'funnel', '--output', tempRoot]);
    scaffold(tempRoot, ['--name', 'sample-vanilla-widget-sdk', '--framework', 'vanilla', '--preset', 'widget-sdk', '--output', tempRoot]);

    assertNoPlaceholder(path.join(tempRoot, 'sample-react-funnel'));
    assertNoPlaceholder(path.join(tempRoot, 'sample-vanilla-widget-sdk'));

    assertSmoke(path.join(tempRoot, 'sample-react-funnel'), { entryFile: 'main.tsx' });
    assertSmoke(path.join(tempRoot, 'sample-vanilla-widget-sdk'));

    console.log('✅ verify:scaffold passed');
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

main();
