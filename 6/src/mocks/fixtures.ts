/**
 * fake API 가 반환할 더미 데이터.
 *
 * 멘티 가이드:
 * - 본인이 만든 시나리오에 필요한 fixture 를 자유롭게 추가하세요.
 * - 실제 API 모양에 가깝도록 필드 이름을 잡아두면 향후 진짜 API 로 swap 하기 쉽습니다.
 */

import type { FaqItem, Message } from '../shared/types';

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-001',
    question: '결제 영수증을 다시 받을 수 있나요?',
    answer: '계정 > 영수증 메뉴에서 다시 다운로드하실 수 있습니다.',
  },
  {
    id: 'faq-002',
    question: '비밀번호를 잊어버렸어요.',
    answer: '로그인 화면 하단의 "비밀번호 재설정" 을 눌러주세요.',
  },
  {
    id: 'faq-003',
    question: '환불은 어떻게 신청하나요?',
    answer: '구매 후 7일 이내에 메시지로 문의 주시면 됩니다.',
  },
];

export const SAMPLE_MESSAGES: Message[] = [
  {
    id: 'msg-001',
    direction: 'inbound',
    body: '안녕하세요! 무엇을 도와드릴까요?',
    createdAt: '2025-01-01T09:00:00.000Z',
    status: 'sent',
  },
  {
    id: 'msg-002',
    direction: 'outbound',
    body: '환불 관련 문의드립니다.',
    createdAt: '2025-01-01T09:01:00.000Z',
    status: 'sent',
  },
];

export const ANONYMOUS_UNREAD = 0;
export const MEMBER_UNREAD = 3;
