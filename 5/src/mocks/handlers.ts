import { http, HttpResponse, delay } from 'msw';
import type {
  BackfillEventsResponse,
  BootstrapResponse,
  Channel,
  CreateSavedViewRequest,
  ListMessagesResponse,
  ListSavedViewsResponse,
  ListThreadsResponse,
  Message,
  SendMessageRequest,
  SendMessageResponse,
  Thread,
  ThreadStatus,
} from '../features/inbox/model/types';
import { ME } from './fixtures/agents';
import { CUSTOMERS, findCustomer } from './fixtures/customers';
import { BACKFILL_EVENTS, LATEST_EVENT_ID } from './fixtures/events';
import { appendMessage, getMessages } from './fixtures/messages';
import {
  SAVED_VIEW_STORE,
  nextSavedViewId,
} from './fixtures/savedViews';
import { THREADS, generateLargeThreads } from './fixtures/threads';
import { CHANNEL_VALUES, THREAD_STATUS_VALUES, SORT_VALUES } from '../features/inbox/model/constants';
import { getScenario } from './scenarios';

// ─── helpers ───────────────────────────────────────────────────────

function delayForScenario(): Promise<void> {
  const s = getScenario();
  if (s === 'slow') return delay(1_500);
  return delay(150);
}

function isChannel(v: string | null): v is Channel {
  return !!v && (CHANNEL_VALUES as readonly string[]).includes(v);
}

function isStatus(v: string | null): v is ThreadStatus {
  return !!v && (THREAD_STATUS_VALUES as readonly string[]).includes(v);
}

function applyThreadFilters(items: Thread[], url: URL): Thread[] {
  const sp = url.searchParams;
  const query = sp.get('query')?.trim() || undefined;
  const status = sp.get('status');
  const channel = sp.get('channel');
  const assignee = sp.get('assignee');
  const unreadOnly = sp.get('unreadOnly') === 'true';

  return items.filter((t) => {
    if (query) {
      const q = query.toLowerCase();
      if (
        !t.lastMessage.toLowerCase().includes(q) &&
        !t.customerName.toLowerCase().includes(q) &&
        !t.tags.some((tag) => tag.toLowerCase().includes(q))
      ) {
        return false;
      }
    }
    if (isStatus(status) && t.status !== status) return false;
    if (isChannel(channel) && t.channel !== channel) return false;
    if (assignee === 'me') {
      if (t.assigneeId !== ME.id) return false;
    } else if (assignee === 'unassigned') {
      if (t.assigneeId) return false;
    } else if (assignee && assignee !== '') {
      if (t.assigneeId !== assignee) return false;
    }
    if (unreadOnly && t.unreadCount <= 0) return false;
    return true;
  });
}

function sortThreads(items: Thread[], sort: string | null): Thread[] {
  const arr = [...items];
  switch (sort) {
    case 'oldest':
      return arr.sort(
        (a, b) => new Date(a.lastMessageAt).getTime() - new Date(b.lastMessageAt).getTime(),
      );
    case 'unread':
      return arr.sort((a, b) => {
        if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount;
        return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
      });
    case 'latest':
    default:
      return arr.sort(
        (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
      );
  }
}

// ─── handlers ─────────────────────────────────────────────────────

export const handlers = [
  // GET /api/inbox/bootstrap
  http.get('/api/inbox/bootstrap', async () => {
    await delayForScenario();
    const res: BootstrapResponse = {
      me: ME,
      channels: [...CHANNEL_VALUES],
      statuses: [...THREAD_STATUS_VALUES],
      sortOptions: [...SORT_VALUES],
    };
    return HttpResponse.json(res);
  }),

  // GET /api/inbox/threads
  http.get('/api/inbox/threads', async ({ request }) => {
    const scenario = getScenario();
    await delayForScenario();

    if (scenario === 'threads-error') {
      return HttpResponse.json(
        { message: '스레드 목록을 불러오지 못했습니다.' },
        { status: 500 },
      );
    }

    const url = new URL(request.url);
    const dataset = scenario === 'large-dataset' ? generateLargeThreads() : THREADS;
    const filtered = scenario === 'empty' ? [] : applyThreadFilters(dataset, url);
    const sorted = sortThreads(filtered, url.searchParams.get('sort'));

    const pageRaw = Number(url.searchParams.get('page') ?? '1');
    const pageSizeRaw = Number(url.searchParams.get('pageSize') ?? '30');
    const pageSize = Number.isFinite(pageSizeRaw) && pageSizeRaw > 0 ? pageSizeRaw : 30;
    const totalCount = sorted.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.min(pageRaw, totalPages) : 1;
    const offset = (page - 1) * pageSize;

    const res: ListThreadsResponse = {
      items: sorted.slice(offset, offset + pageSize),
      page,
      pageSize,
      totalCount,
      totalPages,
      serverTime: new Date().toISOString(),
    };
    return HttpResponse.json(res);
  }),

  // GET /api/inbox/threads/:threadId/messages
  http.get('/api/inbox/threads/:threadId/messages', async ({ params }) => {
    const scenario = getScenario();
    await delayForScenario();

    if (scenario === 'messages-error') {
      return HttpResponse.json(
        { message: '메시지를 불러오지 못했습니다.' },
        { status: 500 },
      );
    }

    const threadId = params.threadId as string;
    const items = scenario === 'empty' ? [] : getMessages(threadId);
    const res: ListMessagesResponse = {
      threadId,
      items,
      cursor: null,
    };
    return HttpResponse.json(res);
  }),

  // POST /api/inbox/threads/:threadId/messages
  http.post('/api/inbox/threads/:threadId/messages', async ({ params, request }) => {
    const scenario = getScenario();
    await delayForScenario();

    if (scenario === 'send-failure') {
      return HttpResponse.json(
        { message: '메시지 전송에 실패했습니다.' },
        { status: 500 },
      );
    }

    const threadId = params.threadId as string;
    const body = (await request.json()) as SendMessageRequest;
    const message: Message = {
      id: `m_${Date.now().toString(36)}`,
      clientId: body.clientId,
      threadId,
      sender: 'agent',
      body: body.body,
      createdAt: new Date().toISOString(),
      status: 'sent',
    };
    appendMessage(threadId, message);
    const res: SendMessageResponse = { message };
    return HttpResponse.json(res);
  }),

  // GET /api/inbox/customers/:customerId
  http.get('/api/inbox/customers/:customerId', async ({ params }) => {
    const scenario = getScenario();
    await delayForScenario();

    if (scenario === 'customer-error') {
      return HttpResponse.json(
        { message: '고객 정보를 불러오지 못했습니다.' },
        { status: 500 },
      );
    }

    const customerId = params.customerId as string;
    const customer = findCustomer(customerId) ?? CUSTOMERS[0];
    if (!customer) {
      return HttpResponse.json({ message: 'not found' }, { status: 404 });
    }
    return HttpResponse.json(customer);
  }),

  // GET /api/inbox/events?after=evt_001
  http.get('/api/inbox/events', async ({ request }) => {
    const scenario = getScenario();
    await delayForScenario();
    const url = new URL(request.url);
    const _after = url.searchParams.get('after');

    const events = scenario === 'reconnect-backfill' ? BACKFILL_EVENTS : [];
    const res: BackfillEventsResponse = {
      events,
      latestEventId: events.length > 0 ? events[events.length - 1].eventId : (_after ?? LATEST_EVENT_ID),
    };
    return HttpResponse.json(res);
  }),

  // GET /api/inbox/saved-views
  http.get('/api/inbox/saved-views', async () => {
    await delayForScenario();
    const res: ListSavedViewsResponse = { items: SAVED_VIEW_STORE };
    return HttpResponse.json(res);
  }),

  // POST /api/inbox/saved-views
  http.post('/api/inbox/saved-views', async ({ request }) => {
    await delayForScenario();
    const body = (await request.json()) as CreateSavedViewRequest;
    const view = {
      id: nextSavedViewId(),
      name: body.name,
      state: body.state,
      createdAt: new Date().toISOString(),
    };
    SAVED_VIEW_STORE.push(view);
    return HttpResponse.json(view);
  }),

  // DELETE /api/inbox/saved-views/:id
  http.delete('/api/inbox/saved-views/:id', async ({ params }) => {
    await delayForScenario();
    const id = params.id as string;
    const idx = SAVED_VIEW_STORE.findIndex((v) => v.id === id);
    if (idx >= 0) SAVED_VIEW_STORE.splice(idx, 1);
    return HttpResponse.json({ ok: true });
  }),
];
