import type { InboxEvent } from '../model/types';

/**
 * TODO(student):
 * - 동일한 eventId가 두 번 들어왔을 때 무시하세요.
 * - 동일 eventId지만 payload가 다른 경우 정책을 결정하세요.
 *   (예: 더 최신 createdAt 기준으로 덮어쓰기)
 * - 메모리 사용량 한계를 어떻게 둘지 결정하세요. (LRU? 최대 N개?)
 *
 * 아래 시그니처는 멘티가 자유롭게 바꿔도 됩니다.
 */
export function createEventDeduper(): {
  shouldAccept(event: InboxEvent): boolean;
  reset(): void;
} {
  // TODO(student): 실제 dedupe 로직을 구현하세요.
  return {
    shouldAccept(_event) {
      // placeholder: scaffold가 깨지지 않도록 항상 true를 반환합니다.
      return true;
    },
    reset() {
      // no-op
    },
  };
}
