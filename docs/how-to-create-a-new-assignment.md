# How to create a new assignment

## 1) Generate scaffold
Use either mode:

- Interactive: `pnpm create-assignment`
- Flags:
  - `pnpm create-assignment --name checkout-funnel --framework react --preset funnel`
  - `pnpm create-assignment --name embeddable-widget --framework vanilla --preset widget-sdk`

## 2) Implement assignment specifics
- Replace generated placeholder content with assignment requirements.
- Add tests or checks required by your curriculum.

## 3) Run verification
- Run `pnpm verify:scaffold` before opening a PR.
