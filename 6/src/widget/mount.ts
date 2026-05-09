/**
 * 위젯을 DOM 에 부착하는 mount 함수 skeleton.
 *
 * 이 파일이 만드는 것은 SDK runtime 이 호출하는 "위젯 인스턴스" 입니다.
 *   - root 컨테이너 생성 (host 또는 isolated root 안)
 *   - launcher / panel / badge / notification 구성
 *   - cleanup 가능한 destroy() 반환
 *
 * 멘티 가이드:
 * - createIsolatedRoot() 를 호출해 host CSS 충돌을 줄이세요.
 * - mountWidget 은 "한 번 부르면 한 번 정리" 라는 계약을 지키세요. (idempotent destroy)
 */

import type { SupportWidgetBootConfig } from '../sdk/public-api';

export type MountWidgetOptions = {
  container: HTMLElement;
  config: SupportWidgetBootConfig;
};

export type MountedWidget = {
  root: HTMLElement;
  show(): void;
  hide(): void;
  destroy(): void;
};

/**
 * TODO(student):
 *   1. createIsolatedRoot 로 isolation root 를 만들고 root element 를 그 안에 붙이세요.
 *   2. shell.ts 의 createWidgetShell() 을 호출해 launcher / panel / badge 를 구성하세요.
 *   3. config.launcher.mode === 'custom' 인 경우 host 의 selector 를 launcher 로 binding 하세요.
 *   4. show / hide 는 panel 가시성 + storage 'widget:visibility' 동기화를 담당하세요.
 *   5. destroy() 는 listener / DOM / storage subscription 을 모두 정리해야 합니다.
 *      destroy() 를 두 번 호출해도 안전해야 합니다.
 */
export function mountWidget(_options: MountWidgetOptions): MountedWidget {
  // TODO(student): 실제 mount 로직 구현. 아래는 타입만 만족시키는 placeholder.
  throw new Error('TODO(student): implement mountWidget()');
}
