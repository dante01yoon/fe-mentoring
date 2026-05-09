/**
 * Messages view skeleton.
 *
 * 멘티 가이드:
 * - anonymous user 일 때 메시지 화면 진입을 막거나 명시적으로 안내해야 합니다.
 * - sendMessage 는 mocks/api-client.ts 를 통해 호출하세요.
 *   - 실패 시 어떤 UX 를 노출할지 결정하세요. (optimistic update 는 정답이 아니라 멘티의 선택)
 * - 입력값을 storage 'widget:draft-message' 에 저장할지 여부도 멘티가 결정하세요.
 */

export type MessagesView = {
  root: HTMLElement;
  destroy(): void;
};

export function createMessagesView(): MessagesView {
  // TODO(student): 메시지 목록 + 입력창 + 전송 흐름
  throw new Error('TODO(student): implement createMessagesView()');
}
