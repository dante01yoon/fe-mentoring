# Maintainer guide

## Ownership

- `packages/create-assignment`: scaffold CLI implementation
- `scripts/verify-scaffold.mjs`: smoke and placeholder checks
- `templates/*`: source templates for generated assignments
- `.github/workflows/*`: automated verification pipelines

## Routine maintenance

1. Reproduce scaffold bug reports with the exact command.
2. Add regression checks to `verify:scaffold` for fixed bugs.
3. Keep docs in sync when changing CLI options or preset rules.

## When PR has conflicts with main

1. Sync local branch with latest `main`.
2. Re-run `pnpm verify:scaffold` after merge/rebase.
3. If conflict risk remains high, open a fresh PR from the rebased branch and close the conflicted one.
