/**
 * 위젯 내부에서 쓸 가벼운 event bus skeleton.
 *
 * 멘티 가이드:
 * - 이건 host 페이지에 노출되는 API 가 아닙니다. 위젯 internal 입니다.
 * - 완전한 event bus 를 만들지 마세요. SDK 의 boot/shutdown/show/hide/track 와 직결되는 곳에서만 활용하세요.
 * - DOM CustomEvent 와 같은 native 메커니즘을 쓸지, in-memory pub/sub 으로 갈지 멘티가 선택합니다.
 */

import type { TrackEventPayload } from '../sdk/public-api';
import type { WidgetRoute } from '../widget/router';

export type WidgetEventMap = {
  'widget:booted': { appId: string };
  'widget:shown': undefined;
  'widget:hidden': undefined;
  'widget:shutdown': undefined;
  'widget:route-changed': { route: WidgetRoute };
  'widget:track': TrackEventPayload;
};

export type WidgetEventName = keyof WidgetEventMap;

export type WidgetEventListener<E extends WidgetEventName> = (payload: WidgetEventMap[E]) => void;

export type WidgetEventBus = {
  on<E extends WidgetEventName>(event: E, listener: WidgetEventListener<E>): () => void;
  emit<E extends WidgetEventName>(event: E, payload: WidgetEventMap[E]): void;
  clear(): void;
};

/**
 * TODO(student):
 *   - 단순 Map<string, Set<listener>> 형태 구현이면 충분합니다.
 *   - shutdown 시 모든 listener 가 제거되도록 clear() 가 호출되어야 합니다.
 *   - 같은 listener 가 중복 등록되었을 때의 정책을 정하세요.
 */
export function createEventBus(): WidgetEventBus {
  // TODO(student): 실제 pub/sub 구현
  return {
    on: () => () => {
      /* TODO(student) */
    },
    emit: () => {
      /* TODO(student) */
    },
    clear: () => {
      /* TODO(student) */
    },
  };
}
