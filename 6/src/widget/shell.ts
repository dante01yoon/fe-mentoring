/**
 * 위젯 shell skeleton.
 *
 * shell 은 panel / launcher / badge / notification 을 한꺼번에 묶는 컨테이너 컴포넌트입니다.
 * mount.ts 에서 createWidgetShell 을 호출해 root 안에 붙입니다.
 */

import type { SupportWidgetBootConfig } from '../sdk/public-api';

export type WidgetShell = {
  root: HTMLElement;
  setVisible(visible: boolean): void;
  destroy(): void;
};

/**
 * TODO(student):
 *   - panel(메인 영역), launcher(기본 floating button), badge(unread count), notification 영역을
 *     각각 생성하고 root 안에 합치세요.
 *   - widget.css / tokens.css 를 어떻게 inject 할지 결정하세요. (Shadow DOM 안 vs 외부 link)
 *   - panel 가시성을 setVisible 로 토글하세요. visibility:hidden / display:none / aria-hidden 중 선택.
 *   - destroy() 시 모든 sub-component 의 cleanup 을 호출하세요.
 */
export function createWidgetShell(_config: SupportWidgetBootConfig): WidgetShell {
  // TODO(student): 실제 shell 구성. 아래는 타입만 만족하는 placeholder.
  throw new Error('TODO(student): implement createWidgetShell()');
}
