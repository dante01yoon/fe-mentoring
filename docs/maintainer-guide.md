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
