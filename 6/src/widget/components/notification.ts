/**
 * Popup notification skeleton.
 *
 * 멘티 가이드:
 * - inbound 메시지 도착 / boot 직후 환영 메시지 등을 띄울 수 있는 toast-style 컴포넌트.
 * - 사용자가 dismiss 하면 storage 에 저장해서 같은 알림이 반복 노출되지 않게 막을지 결정하세요.
 */

export type NotificationComponent = {
  root: HTMLElement;
  show(text: string): void;
  hide(): void;
  destroy(): void;
};

export function createNotification(): NotificationComponent {
  // TODO(student): notification toast DOM + show/hide 애니메이션 없는 단순 토글
  throw new Error('TODO(student): implement createNotification()');
}
