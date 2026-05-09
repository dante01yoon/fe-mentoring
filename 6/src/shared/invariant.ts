/**
 * 가벼운 invariant helper. 가독성을 위해 throw 패턴을 한 곳에 모아둡니다.
 *
 * 멘티 가이드:
 * - 사용자 환경에서 throw 가 host 페이지를 깨뜨릴 수 있습니다.
 *   "치명적 에러" 와 "조용히 무시" 의 경계를 잘 잡으세요.
 */

export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Invariant violation: ${message}`);
  }
}
