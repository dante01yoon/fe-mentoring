#!/usr/bin/env node
import { run } from '../packages/create-assignment/src/index.mjs';

run().catch((error) => {
  console.error(`❌ ${error.message}`);
  process.exitCode = 1;
});
