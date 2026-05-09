import type { Message, MessageSender } from '../../features/inbox/model/types';
import { THREADS } from './threads';

const CUSTOMER_BODIES = [
  '안녕하세요. 환불 가능한가요?',
  '주문 상태가 보이지 않아요.',
  '결제가 두 번 빠진 것 같아요.',
  '쿠폰 코드가 적용이 안 됩니다.',
  '배송이 지연되고 있어요.',
  '제품에 흠집이 있습니다.',
  '예약 시간을 바꾸고 싶어요.',
];

const AGENT_BODIES = [
  '문의주셔서 감사합니다. 확인 후 안내드리겠습니다.',
  '주문번호를 알려주시겠어요?',
  '결제 내역을 다시 확인해드릴게요.',
  '쿠폰 정책상 적용이 어려운 상품일 수 있습니다.',
  '배송 추적 정보를 다시 보내드리겠습니다.',
  '교환 절차로 진행 도와드릴게요.',
];

const SYSTEM_BODIES = [
  '담당자가 배정되었습니다.',
  '스레드가 자동 종료되었습니다.',
  '고객이 채팅에 다시 입장했습니다.',
];

function pickBody(sender: MessageSender, seed: number): string {
  if (sender === 'customer') return CUSTOMER_BODIES[seed % CUSTOMER_BODIES.length];
  if (sender === 'agent') return AGENT_BODIES[seed % AGENT_BODIES.length];
  return SYSTEM_BODIES[seed % SYSTEM_BODIES.length];
}

const MESSAGES_BY_THREAD: Record<string, Message[]> = {};

for (let i = 0; i < THREADS.length; i++) {
  const thread = THREADS[i];
  const count = 3 + (i % 13); // 3 ~ 15
  const base = new Date(thread.lastMessageAt).getTime();
  const list: Message[] = [];
  for (let j = 0; j < count; j++) {
    // 마지막 메시지가 가장 최신이 되도록 시간 분배
    const offsetMs = (count - 1 - j) * 60_000;
    const senderRoll = (i + j) % 5;
    const sender: MessageSender =
      senderRoll === 0 ? 'system' : senderRoll % 2 === 0 ? 'agent' : 'customer';
    list.push({
      id: `${thread.id}_m_${String(j + 1).padStart(3, '0')}`,
      threadId: thread.id,
      sender,
      body: pickBody(sender, i + j),
      createdAt: new Date(base - offsetMs).toISOString(),
      status: 'sent',
    });
  }
  MESSAGES_BY_THREAD[thread.id] = list;
}

export function getMessages(threadId: string): Message[] {
  return MESSAGES_BY_THREAD[threadId] ?? [];
}

export function appendMessage(threadId: string, message: Message): void {
  const list = MESSAGES_BY_THREAD[threadId] ?? [];
  list.push(message);
  MESSAGES_BY_THREAD[threadId] = list;
}
