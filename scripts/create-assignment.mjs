#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const PRESET_TO_TEMPLATE = {
  funnel: 'react-funnel',
  'widget-sdk': 'vanilla-widget-sdk',
};

function printHelp() {
  console.log(`create-assignment

Usage:
  node scripts/create-assignment.mjs [options]

Options:
  --name <name>             Assignment folder name
  --framework <react|vanilla>
  --preset <funnel|widget-sdk>
  --output <dir>            Parent output directory (default: .)
  --yes                     Skip confirmation in interactive mode
  --help                    Show help
`);
}

function parseArgs(argv) {
  const args = { outputDir: process.cwd(), yes: false };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === '--help' || token === '-h') {
      args.help = true;
      continue;
    }

    if (token === '--yes' || token === '-y') {
      args.yes = true;
      continue;
    }

    if (token.startsWith('--')) {
      const key = token.slice(2);
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${token}`);
      }

      if (key === 'name') args.name = value;
      else if (key === 'framework') args.framework = value;
      else if (key === 'preset') args.preset = value;
      else if (key === 'output') args.outputDir = path.resolve(value);
      else throw new Error(`Unknown option: ${token}`);

      i += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  return args;
}

async function promptMissing(args) {
  const rl = readline.createInterface({ input, output });

  try {
    if (!args.name) {
      args.name = (await rl.question('Assignment name: ')).trim();
    }

    if (!args.framework) {
      args.framework = (await rl.question('Framework (react/vanilla): ')).trim();
    }

    if (!args.preset) {
      args.preset = (await rl.question('Preset (funnel/widget-sdk): ')).trim();
    }

    if (!args.yes) {
      const confirmed = (await rl.question(`Create assignment \"${args.name}\"? (y/N): `)).trim().toLowerCase();
      if (confirmed !== 'y' && confirmed !== 'yes') {
        throw new Error('Cancelled by user');
      }
    }
  } finally {
    rl.close();
  }

  return args;
}

function validateArgs(args) {
  if (!args.name) {
    throw new Error('name is required');
  }

  if (!['react', 'vanilla'].includes(args.framework)) {
    throw new Error('framework must be one of: react, vanilla');
  }

  if (!['funnel', 'widget-sdk'].includes(args.preset)) {
    throw new Error('preset must be one of: funnel, widget-sdk');
  }

  if (args.framework === 'react' && args.preset !== 'funnel') {
    throw new Error('react framework currently supports only funnel preset');
  }

  if (args.framework === 'vanilla' && args.preset !== 'widget-sdk') {
    throw new Error('vanilla framework currently supports only widget-sdk preset');
  }
}

function copyTemplate(templateDir, outDir, replacements) {
  const entries = fs.readdirSync(templateDir, { withFileTypes: true });
  fs.mkdirSync(outDir, { recursive: true });

  for (const entry of entries) {
    const src = path.join(templateDir, entry.name);
    const dst = path.join(outDir, entry.name);

    if (entry.isDirectory()) {
      copyTemplate(src, dst, replacements);
      continue;
    }

    const raw = fs.readFileSync(src, 'utf8');
    const rendered = Object.entries(replacements).reduce(
      (acc, [key, value]) => acc.replaceAll(key, value),
      raw,
    );

    fs.writeFileSync(dst, rendered);
  }
}

export async function runCreateAssignment(rawArgv = process.argv.slice(2)) {
  const parsed = parseArgs(rawArgv);
  if (parsed.help) {
    printHelp();
    return;
  }

  const interactive = !(parsed.name && parsed.framework && parsed.preset);
  const args = interactive ? await promptMissing(parsed) : parsed;

  validateArgs(args);

  const templateKey = PRESET_TO_TEMPLATE[args.preset];
  const templateDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'templates', templateKey);
  const assignmentDir = path.resolve(args.outputDir, args.name);

  if (fs.existsSync(assignmentDir)) {
    throw new Error(`Target directory already exists: ${assignmentDir}`);
  }

  copyTemplate(templateDir, assignmentDir, {
    __ASSIGNMENT_NAME__: args.name,
    __FRAMEWORK__: args.framework,
    __PRESET__: args.preset,
  });

  console.log(`✅ Created assignment at ${assignmentDir}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runCreateAssignment().catch((error) => {
    console.error(`❌ ${error.message}`);
    process.exitCode = 1;
  });
}
