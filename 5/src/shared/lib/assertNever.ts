// exhaustive switch에서 사용하는 helper.

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}
