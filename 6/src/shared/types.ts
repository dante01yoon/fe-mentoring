/**
 * 공용 도메인 타입 모음.
 *
 * 위젯 내부 화면(home/faq/messages)에서 공통으로 쓸 작은 타입들을 모아두는 자리입니다.
 * 외부에 노출되는 SDK public API 타입은 `src/sdk/public-api.ts` 를 참고하세요.
 */

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type MessageDirection = 'inbound' | 'outbound';

export type Message = {
  id: string;
  direction: MessageDirection;
  body: string;
  createdAt: string; // ISO string
  status?: 'sending' | 'sent' | 'failed';
};

export type WidgetBootstrapResponse = {
  appId: string;
  unreadCount: number;
  faqHighlights: FaqItem[];
  // TODO(student): 멘티가 필요한 다른 필드를 추가/제거하세요.
};

export type SendMessageResult = {
  id: string;
  status: 'sent' | 'failed';
};
