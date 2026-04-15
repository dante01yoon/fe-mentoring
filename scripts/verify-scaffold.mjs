#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CREATE_SCRIPT = path.join(ROOT_DIR, 'scripts', 'create-assignment.mjs');

function findPlaceholders(dir, hitList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findPlaceholders(fullPath, hitList);
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('__ASSIGNMENT_NAME__') || content.includes('__FRAMEWORK__') || content.includes('__PRESET__')) {
      hitList.push(fullPath);
    }
  }
  return hitList;
}

function smokeCheck(dir) {
  const packageJsonPath = path.join(dir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`Missing package.json in ${dir}`);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (!packageJson.name || packageJson.name.includes('__')) {
    throw new Error(`Invalid package.json name in ${dir}`);
  }

  const readmePath = path.join(dir, 'README.md');
  if (!fs.existsSync(readmePath)) {
    throw new Error(`Missing README.md in ${dir}`);
  }
}

function createSample(tmpDir, name, framework, preset) {
  execFileSync('node', [CREATE_SCRIPT, '--name', name, '--framework', framework, '--preset', preset, '--output', tmpDir], {
    cwd: ROOT_DIR,
    stdio: 'inherit',
  });

  const assignmentPath = path.join(tmpDir, name);
  const placeholders = findPlaceholders(assignmentPath);
  if (placeholders.length > 0) {
    throw new Error(`Placeholder leftovers found:\n${placeholders.join('\n')}`);
  }

  smokeCheck(assignmentPath);
}

function main() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fe-mentoring-scaffold-'));
  console.log(`ℹ️  Scaffold verification temp dir: ${tmpDir}`);

  createSample(tmpDir, 'react-funnel-sample', 'react', 'funnel');
  createSample(tmpDir, 'vanilla-widget-sdk-sample', 'vanilla', 'widget-sdk');

  console.log('✅ verify:scaffold completed successfully');
}

main();
