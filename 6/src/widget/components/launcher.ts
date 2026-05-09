/**
 * Default launcher component skeleton.
 *
 * 멘티 가이드:
 * - launcher.mode === 'default' 일 때 위젯 우측 하단에 떠 있는 floating button 을 만듭니다.
 * - launcher 클릭 시 panel 을 toggle 하세요.
 * - launcher.mode === 'custom' 일 때는 default launcher 를 mount 하지 않습니다.
 *   대신 host/custom-launcher.ts 의 selector 와 binding 합니다.
 */

export type LauncherComponent = {
  root: HTMLElement;
  setUnreadCount(count: number): void;
  destroy(): void;
};

export type LauncherOptions = {
  onClick: () => void;
};

export function createLauncher(_options: LauncherOptions): LauncherComponent {
  // TODO(student): 기본 floating button DOM 생성 + 클릭 이벤트 + unread badge 통합
  throw new Error('TODO(student): implement createLauncher()');
}
