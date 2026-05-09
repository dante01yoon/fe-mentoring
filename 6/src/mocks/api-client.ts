/**
 * fake API client.
 *
 * 실제 백엔드는 없습니다. 이 파일은 멘티가 호출할 수 있는 가짜 API 표면만 제공합니다.
 * scenarios.ts 의 현재 시나리오에 따라 success / failure / slow 등 응답을 분기시키세요.
 *
 * 정답 수준의 상태 동기화(예: sendMessage 후 fetchMessages 결과에 자동 반영) 는
 * 의도적으로 구현하지 않았습니다. 멘티가 필요하다면 자체 in-memory store 를 추가하세요.
 */

import type {
  SupportWidgetBootConfig,
  TrackEventPayload,
} from '../sdk/public-api';
import type {
  FaqItem,
  Message,
  SendMessageResult,
  WidgetBootstrapResponse,
} from '../shared/types';
import { FAQ_ITEMS, SAMPLE_MESSAGES } from './fixtures';
import { delay } from './delay';
import { getWidgetScenario } from './scenarios';

/**
 * boot 직후 호출. 사용자 식별, unread count, FAQ 미리보기 등 초기 데이터를 받아옵니다.
 *
 * TODO(student):
 *   - getWidgetScenario() 로 현재 시나리오 분기
 *     - 'slow-boot':       delay(1500) 후 응답
 *     - 'boot-failure':    throw 또는 reject
 *     - 'anonymous'/'member': config.user 와 결합해 unread / 환영 문구를 다르게 반환
 */
export async function fetchWidgetBootstrap(
  _config: SupportWidgetBootConfig,
): Promise<WidgetBootstrapResponse> {
  // TODO(student): scenario 분기 + delay + fixture 조합
  await delay(0);
  void getWidgetScenario();
  throw new Error('TODO(student): implement fetchWidgetBootstrap()');
}

/**
 * 미확인 메시지 수.
 *
 * TODO(student):
 *   - 'unread-failure' 시나리오에서는 throw 하세요.
 *   - userId 가 없으면 anonymous 로 간주하고 0 을 반환할지 결정하세요.
 */
export async function fetchUnreadCount(_userId?: string): Promise<number> {
  await delay(0);
  throw new Error('TODO(student): implement fetchUnreadCount()');
}

/**
 * FAQ 목록.
 *
 * TODO(student):
 *   - fixture 를 그대로 반환하거나, scenario 에 따라 빈 배열 / 에러로 분기하세요.
 */
export async function fetchFaqItems(): Promise<FaqItem[]> {
  await delay(0);
  // 현재는 placeholder 로 fixture 를 그대로 반환합니다. 멘티가 시나리오 분기를 추가하세요.
  return FAQ_ITEMS;
}

/**
 * 사용자별 메시지 목록.
 *
 * TODO(student):
 *   - userId 가 없으면 빈 배열을 반환할지, throw 할지 결정하세요.
 *   - host-route-change 시나리오에서는 어떤 동작이 적절한지 README 에 기록하세요.
 */
export async function fetchMessages(_userId?: string): Promise<Message[]> {
  await delay(0);
  // 현재는 placeholder 로 fixture 를 그대로 반환합니다. 멘티가 시나리오 분기를 추가하세요.
  return SAMPLE_MESSAGES;
}

/**
 * 메시지 전송.
 *
 * TODO(student):
 *   - 'message-send-failure' 시나리오에서는 status: 'failed' 로 반환하거나 throw 하세요.
 *   - 결과 ID 생성 정책(crypto.randomUUID 등)을 정하세요.
 */
export async function sendMessage(_input: {
  body: string;
  userId?: string;
}): Promise<SendMessageResult> {
  await delay(0);
  throw new Error('TODO(student): implement sendMessage()');
}

/**
 * track event.
 *
 * TODO(student):
 *   - track 은 host 페이지에 영향을 주지 않아야 합니다.
 *   - 실패해도 절대 throw 하지 마세요. 내부적으로 console.warn 정도가 적절합니다.
 */
export async function trackEvent(_input: TrackEventPayload): Promise<void> {
  await delay(0);
  // TODO(student): no-op 또는 console.log 등 멘티가 결정.
}
