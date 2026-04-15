#!/usr/bin/env node

import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const requiredPaths = [
  'README.md',
  'package.json',
  '.github/workflows/ci.yml',
  '.github/ISSUE_TEMPLATE/bug_report.yml',
  '.github/ISSUE_TEMPLATE/feature_request.yml',
  '.github/PULL_REQUEST_TEMPLATE/pull_request_template.md',
  'docs/CONTRIBUTING.md',
  'templates/react-assignment/README.md',
  'templates/vanilla-assignment/README.md'
];

const missing = requiredPaths.filter((relativePath) => !existsSync(path.join(rootDir, relativePath)));

if (missing.length > 0) {
  console.error('[verify:scaffold] missing required files:');
  for (const filePath of missing) {
    console.error(`- ${filePath}`);
  }
  process.exit(1);
}

console.log(`[verify:scaffold] ${requiredPaths.length} required paths verified`);
