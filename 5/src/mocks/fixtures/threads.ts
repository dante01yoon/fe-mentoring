import type { Channel, Thread, ThreadStatus } from '../../features/inbox/model/types';

const CHANNELS: Channel[] = ['web', 'kakao', 'email', 'app'];
const STATUSES: ThreadStatus[] = ['open', 'pending', 'closed'];
const TAG_POOL = ['refund', 'vip', 'urgent', 'payment', 'delivery', 'inquiry', 'bug'];

const SAMPLE_LAST_MESSAGES = [
  '환불 절차가 어떻게 되나요?',
  '아직도 배송 출발 안 했어요.',
  '결제 오류가 났는데 다시 시도해도 안 됩니다.',
  '주문번호를 알려주세요.',
  '확인 후 다시 연락드리겠습니다.',
  '쿠폰이 적용 안 돼요.',
  '예약 일정 변경 가능할까요?',
  '문의하신 내용 확인되었습니다.',
];

function pickTags(seed: number): string[] {
  if (seed % 7 === 0) return [];
  const a = TAG_POOL[seed % TAG_POOL.length];
  if (seed % 3 === 0) return [a, TAG_POOL[(seed + 2) % TAG_POOL.length]];
  return [a];
}

export const THREADS: Thread[] = Array.from({ length: 30 }, (_, idx) => {
  const id = `t_${String(idx + 1).padStart(3, '0')}`;
  const customerId = `c_${String((idx % 30) + 1).padStart(3, '0')}`;
  const channel = CHANNELS[idx % CHANNELS.length];
  const status = STATUSES[idx % STATUSES.length];
  const assigneeId =
    idx % 4 === 0 ? undefined : idx % 3 === 0 ? 'agent_001' : `agent_00${(idx % 3) + 1}`;
  const unreadCount = idx % 6 === 0 ? 0 : idx % 5 === 0 ? 5 + (idx % 4) : (idx % 3) + 1;
  const lastMessage = SAMPLE_LAST_MESSAGES[idx % SAMPLE_LAST_MESSAGES.length];
  const lastMessageAt = new Date(Date.UTC(2026, 4, 7, 10, 0, 0) - idx * 60_000).toISOString();
  return {
    id,
    customerId,
    customerName: `Customer ${idx + 1}`,
    channel,
    status,
    assigneeId,
    lastMessage,
    lastMessageAt,
    unreadCount,
    tags: pickTags(idx),
  } satisfies Thread;
});

// large-dataset scenario에서 사용. 정적 JSON을 커밋하지 않고 함수로 생성합니다.
let _largeCache: Thread[] | null = null;
export function generateLargeThreads(count = 5_000): Thread[] {
  if (_largeCache && _largeCache.length === count) return _largeCache;
  const base = new Date(Date.UTC(2026, 4, 7, 10, 0, 0)).getTime();
  const result: Thread[] = [];
  for (let i = 0; i < count; i++) {
    const id = `tL_${String(i + 1).padStart(5, '0')}`;
    const customerId = `c_${String((i % 30) + 1).padStart(3, '0')}`;
    result.push({
      id,
      customerId,
      customerName: `Customer ${(i % 30) + 1}`,
      channel: CHANNELS[i % CHANNELS.length],
      status: STATUSES[i % STATUSES.length],
      assigneeId: i % 4 === 0 ? undefined : `agent_00${(i % 3) + 1}`,
      lastMessage: SAMPLE_LAST_MESSAGES[i % SAMPLE_LAST_MESSAGES.length],
      lastMessageAt: new Date(base - i * 30_000).toISOString(),
      unreadCount: i % 7,
      tags: pickTags(i),
    });
  }
  _largeCache = result;
  return result;
}

export function findThread(threadId: string): Thread | undefined {
  return THREADS.find((t) => t.id === threadId);
}
