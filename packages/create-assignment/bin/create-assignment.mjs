#!/usr/bin/env node
import { run } from '../src/index.mjs';

run().catch((error) => {
  console.error(`❌ ${error.message}`);
  process.exitCode = 1;
});
