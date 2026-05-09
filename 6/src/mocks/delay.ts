/**
 * fake API 가 사용할 delay helper.
 * scenario 에 따라 0ms / 200ms / 1500ms 등 다양한 latency 를 시뮬레이션할 수 있습니다.
 */

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
