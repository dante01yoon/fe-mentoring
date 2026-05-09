/**
 * Unread badge skeleton.
 *
 * 멘티 가이드:
 * - 0 일 때 뱃지를 노출할지/숨길지는 멘티가 결정.
 * - 100+ 같은 표기 정책도 멘티가 결정.
 * - polling / event 기반 업데이트 중 어떤 방식으로 동기화할지 README 에 명시.
 */

export type UnreadBadgeComponent = {
  root: HTMLElement;
  set(count: number): void;
  destroy(): void;
};

export function createUnreadBadge(): UnreadBadgeComponent {
  // TODO(student): badge DOM 생성 + count 변경 시 textContent / aria-label 업데이트
  throw new Error('TODO(student): implement createUnreadBadge()');
}
