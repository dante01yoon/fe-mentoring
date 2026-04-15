# How to add a new preset

1. Add a new template directory under `templates/`.
2. Include placeholder tokens supported by the CLI when needed:
   - `__ASSIGNMENT_NAME__`
   - `__FRAMEWORK__`
   - `__PRESET__`
3. Update `scripts/create-assignment.mjs`:
   - extend preset validation
   - map preset to template directory
   - add framework/preset compatibility rules
4. Add a sample generation path in `scripts/verify-scaffold.mjs`.
5. Run `pnpm verify:scaffold`.
