import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../..');
const TEMPLATE_ROOT = path.join(REPO_ROOT, 'templates');

const PRESETS = {
  funnel: { framework: 'react', templateDir: 'react-funnel' },
  'widget-sdk': { framework: 'vanilla', templateDir: 'vanilla-widget-sdk' },
};

function printHelp() {
  console.log(`create-assignment\n\nUsage\n  create-assignment [options]\n\nOptions\n  --name <assignment-name>           Assignment directory name\n  --framework <react|vanilla>        Target framework\n  --preset <funnel|widget-sdk>       Scaffold preset\n  --output <path>                    Parent output directory (default: current directory)\n  -y, --yes                          Skip interactive confirmation\n  -h, --help                         Print help\n`);
}

function parseArgs(argv) {
  const parsed = {
    output: process.cwd(),
    yes: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === '-h' || token === '--help') {
      parsed.help = true;
      continue;
    }

    if (token === '-y' || token === '--yes') {
      parsed.yes = true;
      continue;
    }

    if (!token.startsWith('--')) {
      throw new Error(`Unknown argument: ${token}`);
    }

    const key = token.slice(2);
    const value = argv[i + 1];

    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for ${token}`);
    }

    if (key === 'name') parsed.name = value;
    else if (key === 'framework') parsed.framework = value;
    else if (key === 'preset') parsed.preset = value;
    else if (key === 'output') parsed.output = path.resolve(value);
    else throw new Error(`Unknown option: ${token}`);

    i += 1;
  }

  return parsed;
}

function validateOptions(options) {
  if (!options.name) {
    throw new Error('`--name` is required.');
  }

  if (!options.preset || !PRESETS[options.preset]) {
    throw new Error('`--preset` must be one of: funnel, widget-sdk');
  }

  const expectedFramework = PRESETS[options.preset].framework;
  if (!options.framework) {
    throw new Error('`--framework` is required.');
  }

  if (options.framework !== expectedFramework) {
    throw new Error(`Preset \"${options.preset}\" only supports framework \"${expectedFramework}\".`);
  }

  if (!/^[a-z0-9][a-z0-9-]*$/.test(options.name)) {
    throw new Error('`--name` must match /^[a-z0-9][a-z0-9-]*$/');
  }
}

async function promptForMissing(options) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    if (!options.name) {
      options.name = (await rl.question('Assignment name (kebab-case): ')).trim();
    }

    if (!options.framework) {
      options.framework = (await rl.question('Framework (react/vanilla): ')).trim();
    }

    if (!options.preset) {
      options.preset = (await rl.question('Preset (funnel/widget-sdk): ')).trim();
    }

    if (!options.yes) {
      const answer = (await rl.question(`Create scaffold \"${options.name}\" in ${options.output}? (y/N): `)).trim().toLowerCase();
      if (!['y', 'yes'].includes(answer)) {
        throw new Error('Cancelled by user.');
      }
    }
  } finally {
    rl.close();
  }

  return options;
}

function renderDirectory(dirPath, replacements) {
  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      renderDirectory(fullPath, replacements);
      continue;
    }

    const original = readFileSync(fullPath, 'utf8');
    const rendered = Object.entries(replacements).reduce(
      (acc, [from, to]) => acc.replaceAll(from, to),
      original,
    );

    writeFileSync(fullPath, rendered, 'utf8');
  }
}

export function createAssignment(options) {
  validateOptions(options);

  const presetConfig = PRESETS[options.preset];
  const sourceDir = path.join(TEMPLATE_ROOT, presetConfig.templateDir);
  const targetDir = path.join(options.output, options.name);

  if (!existsSync(sourceDir)) {
    throw new Error(`Template not found: ${sourceDir}`);
  }

  if (existsSync(targetDir)) {
    throw new Error(`Target already exists: ${targetDir}`);
  }

  mkdirSync(options.output, { recursive: true });
  cpSync(sourceDir, targetDir, { recursive: true });

  renderDirectory(targetDir, {
    '__ASSIGNMENT_NAME__': options.name,
    '__FRAMEWORK__': options.framework,
    '__PRESET__': options.preset,
  });

  console.log(`✅ Assignment created: ${targetDir}`);
  return targetDir;
}

export async function run(argv = process.argv.slice(2)) {
  const parsed = parseArgs(argv);

  if (parsed.help) {
    printHelp();
    return;
  }

  const shouldPrompt = !parsed.name || !parsed.framework || !parsed.preset;
  const options = shouldPrompt ? await promptForMissing(parsed) : parsed;

  createAssignment(options);
}
