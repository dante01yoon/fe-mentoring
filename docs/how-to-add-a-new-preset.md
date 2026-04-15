# How to add a new preset

1. Add a directory under `templates/`.
2. Put scaffold files in that directory and use placeholder tokens when needed:
   - `__ASSIGNMENT_NAME__`
   - `__FRAMEWORK__`
   - `__PRESET__`
3. Update preset mapping and validation in `packages/create-assignment/src/index.mjs`.
4. Add at least one sample case in `scripts/verify-scaffold.mjs`.
5. Run `pnpm verify:scaffold`.
