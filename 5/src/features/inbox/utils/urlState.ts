import type { InboxFilters } from '../model/types';

/**
 * TODO(student):
 * - URLSearchParams를 InboxFilters로 파싱하세요.
 * - InboxFilters를 URLSearchParams로 직렬화하세요.
 * - 유효하지 않은 query 값이 들어왔을 때 fallback을 정의하세요.
 *   (예: status가 알 수 없는 값이면 무시)
 * - threadId, page 같은 비-filter URL state도 같이 다룰지 결정하세요.
 *
 * 아래는 멘티가 손쉽게 시작할 수 있도록 둔 placeholder입니다.
 * 안전한 fallback과 강한 타입 검증은 멘티가 직접 구현해야 합니다.
 */
export function parseInboxFilters(_params: URLSearchParams): InboxFilters {
  // TODO(student): 실제 파싱 로직을 구현하세요.
  return {};
}

export function serializeInboxFilters(_filters: InboxFilters): URLSearchParams {
  // TODO(student): 실제 직렬화 로직을 구현하세요.
  return new URLSearchParams();
}
