import type { InboxEvent, Message } from '../../features/inbox/model/types';
import { THREADS } from './threads';

// scaffold용 이벤트 fixture.
// scenario에 따라 mock realtime client가 골라서 emit합니다.

function makeMessage(threadId: string, idx: number, body: string): Message {
  return {
    id: `evt_msg_${threadId}_${idx}`,
    threadId,
    sender: idx % 2 === 0 ? 'customer' : 'agent',
    body,
    createdAt: new Date(Date.UTC(2026, 4, 7, 11, idx, 0)).toISOString(),
    status: 'sent',
  };
}

const t1 = THREADS[0]?.id ?? 't_001';
const t2 = THREADS[1]?.id ?? 't_002';
const t3 = THREADS[2]?.id ?? 't_003';

export const NORMAL_EVENTS: InboxEvent[] = [
  {
    type: 'message.created',
    eventId: 'evt_001',
    threadId: t1,
    message: makeMessage(t1, 1, '추가로 문의 드릴게요.'),
    createdAt: new Date(Date.UTC(2026, 4, 7, 11, 1, 0)).toISOString(),
  },
  {
    type: 'thread.updated',
    eventId: 'evt_002',
    threadId: t2,
    patch: { status: 'pending' },
    createdAt: new Date(Date.UTC(2026, 4, 7, 11, 2, 0)).toISOString(),
  },
  {
    type: 'thread.assigned',
    eventId: 'evt_003',
    threadId: t3,
    assigneeId: 'agent_001',
    createdAt: new Date(Date.UTC(2026, 4, 7, 11, 3, 0)).toISOString(),
  },
];

// duplicate-events scenario용. 동일 eventId가 두 번.
export const DUPLICATE_EVENTS: InboxEvent[] = [
  NORMAL_EVENTS[0],
  NORMAL_EVENTS[0],
  NORMAL_EVENTS[1],
  NORMAL_EVENTS[1],
];

// out-of-order-events scenario용. 새 이벤트가 더 먼저 emit되고, 더 오래된 이벤트가 뒤에 emit.
export const OUT_OF_ORDER_EVENTS: InboxEvent[] = [
  {
    type: 'message.created',
    eventId: 'evt_010',
    threadId: t1,
    message: {
      ...makeMessage(t1, 5, '나중 시각의 메시지가 먼저 도착합니다.'),
      createdAt: new Date(Date.UTC(2026, 4, 7, 12, 5, 0)).toISOString(),
    },
    createdAt: new Date(Date.UTC(2026, 4, 7, 12, 5, 0)).toISOString(),
  },
  {
    type: 'message.created',
    eventId: 'evt_011',
    threadId: t1,
    message: {
      ...makeMessage(t1, 4, '실제로는 더 빨리 발생한 메시지'),
      createdAt: new Date(Date.UTC(2026, 4, 7, 12, 0, 0)).toISOString(),
    },
    createdAt: new Date(Date.UTC(2026, 4, 7, 12, 0, 0)).toISOString(),
  },
];

// reconnect-backfill scenario에서 GET /events?after=... 로 반환할 backfill 이벤트.
export const BACKFILL_EVENTS: InboxEvent[] = [
  {
    type: 'message.created',
    eventId: 'evt_b_001',
    threadId: t1,
    message: makeMessage(t1, 7, '연결이 끊긴 동안 도착한 메시지입니다.'),
    createdAt: new Date(Date.UTC(2026, 4, 7, 12, 30, 0)).toISOString(),
  },
  {
    type: 'thread.updated',
    eventId: 'evt_b_002',
    threadId: t2,
    patch: { unreadCount: 9 },
    createdAt: new Date(Date.UTC(2026, 4, 7, 12, 31, 0)).toISOString(),
  },
];

export const LATEST_EVENT_ID = 'evt_b_002';
