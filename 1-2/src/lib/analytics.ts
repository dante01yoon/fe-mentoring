import type { AnalyticsEvent, AnalyticsEventName } from '../mocks/types';
import {
  loadAnalyticsQueue,
  saveAnalyticsQueue,
  clearAnalyticsQueue,
} from './storage';

/**
 * analytics event queue — UI 코드에 추적 로직을 흩뿌리지 않기 위한 얇은 추상화.
 *
 * - track(eventName, payload) 하나로 모든 호출 지점을 통합합니다.
 * - 이벤트는 localStorage queue에 순차 적재됩니다.
 * - flush는 선택 구현입니다 (이번 회차에서는 쌓는 것 자체가 목표).
 */

export function track(
  eventName: AnalyticsEventName,
  payload: Omit<AnalyticsEvent, 'eventName' | 'timestamp'> = {},
): void {
  const event: AnalyticsEvent = {
    eventName,
    timestamp: new Date().toISOString(),
    ...payload,
  };
  const queue = loadAnalyticsQueue<AnalyticsEvent>();
  queue.push(event);
  saveAnalyticsQueue(queue);
}

export function getQueuedEvents(): AnalyticsEvent[] {
  return loadAnalyticsQueue<AnalyticsEvent>();
}

/**
 * flush는 이번 회차에서 필수가 아닙니다. 호출 시 queue를 비우고 수집된 이벤트를 반환합니다.
 * 실제 서비스에서는 여기서 /api/analytics/collect 같은 엔드포인트에 전송합니다.
 */
export function flush(): AnalyticsEvent[] {
  const events = loadAnalyticsQueue<AnalyticsEvent>();
  clearAnalyticsQueue();
  return events;
}
