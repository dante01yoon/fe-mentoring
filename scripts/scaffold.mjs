#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const PRESETS = {
  react: path.join(rootDir, 'templates', 'react-assignment'),
  vanilla: path.join(rootDir, 'templates', 'vanilla-assignment')
};

function parseArgs(argv) {
  const args = new Set(argv);
  const force = args.has('--force');

  const presetArg = argv.find((arg) => arg.startsWith('--preset='));
  const rawPreset = presetArg ? presetArg.split('=')[1] : 'all';
  const selectedPresets = rawPreset === 'all' ? Object.keys(PRESETS) : rawPreset.split(',').map((item) => item.trim());

  const outputArg = argv.find((arg) => arg.startsWith('--output='));
  const outputRoot = outputArg ? outputArg.split('=')[1] : 'generated';

  return { force, selectedPresets, outputRoot };
}

function validatePresets(selectedPresets) {
  const invalid = selectedPresets.filter((preset) => !PRESETS[preset]);
  if (invalid.length > 0) {
    throw new Error(`Unsupported preset: ${invalid.join(', ')}. Available presets: ${Object.keys(PRESETS).join(', ')}`);
  }
}

function copyPreset(preset, outputRoot, force) {
  const sourceDir = PRESETS[preset];
  const targetDir = path.resolve(rootDir, outputRoot, preset);

  if (existsSync(targetDir) && !force) {
    throw new Error(`Target directory already exists: ${targetDir}. Re-run with --force to overwrite.`);
  }

  mkdirSync(path.dirname(targetDir), { recursive: true });
  cpSync(sourceDir, targetDir, { recursive: true, force });

  return targetDir;
}

function main() {
  const { force, outputRoot, selectedPresets } = parseArgs(process.argv.slice(2));

  validatePresets(selectedPresets);

  const results = selectedPresets.map((preset) => ({
    preset,
    outputPath: copyPreset(preset, outputRoot, force)
  }));

  for (const { preset, outputPath } of results) {
    console.log(`[scaffold] ${preset} -> ${outputPath}`);
  }

  console.log(`[scaffold] completed ${results.length} preset(s)`);
}

try {
  main();
} catch (error) {
  console.error(`[scaffold] failed: ${error.message}`);
  process.exit(1);
}
