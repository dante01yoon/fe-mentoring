# Maintainer guide

## Key commands
- `pnpm create-assignment` for scaffold generation
- `pnpm verify:scaffold` for smoke and placeholder checks

## Ownership areas
- `scripts/create-assignment.mjs`: CLI behavior (interactive + flags)
- `templates/`: scaffold source files
- `.github/workflows/`: CI and smoke automation
- `docs/`: contributor and maintainer operating docs

## Maintenance routine
1. Review scaffold bug reports weekly.
2. Keep presets minimal and focused.
3. Ensure placeholder replacement never regresses by running `pnpm verify:scaffold`.
