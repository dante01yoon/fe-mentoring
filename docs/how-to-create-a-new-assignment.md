# How to create a new assignment

## 1. Run scaffold CLI

Interactive mode:

```bash
pnpm create-assignment
```

Flag mode:

```bash
pnpm create-assignment --name embeddable-widget --framework vanilla --preset widget-sdk
```

## 2. Implement assignment-specific requirements

- Update README and task instructions.
- Add tests, fixtures, or evaluation scripts as needed.

## 3. Validate

```bash
pnpm verify:scaffold
```
