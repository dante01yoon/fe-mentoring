import type {
  BackfillEventsResponse,
  BootstrapResponse,
  CreateSavedViewRequest,
  Customer,
  InboxFilters,
  ListMessagesResponse,
  ListSavedViewsResponse,
  ListThreadsResponse,
  SavedView,
  SendMessageRequest,
  SendMessageResponse,
} from '../model/types';

// REST API 호출 wrapper.
// 멘티는 fetch 옵션, 에러 처리, AbortController를 어떻게 다룰지 본인이 결정합니다.

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const message = await safeMessage(res);
    throw new Error(message ?? `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

async function safeMessage(res: Response): Promise<string | undefined> {
  try {
    const data = (await res.clone().json()) as { message?: string };
    return data?.message;
  } catch {
    return undefined;
  }
}

function buildThreadsQuery(filters: InboxFilters, page: number, pageSize: number): string {
  const sp = new URLSearchParams();
  if (filters.query) sp.set('query', filters.query);
  if (filters.status) sp.set('status', filters.status);
  if (filters.channel) sp.set('channel', filters.channel);
  if (filters.assignee) sp.set('assignee', filters.assignee);
  if (filters.unreadOnly) sp.set('unreadOnly', 'true');
  if (filters.sort) sp.set('sort', filters.sort);
  sp.set('page', String(page));
  sp.set('pageSize', String(pageSize));
  return sp.toString();
}

export const inboxApi = {
  bootstrap(): Promise<BootstrapResponse> {
    return getJson<BootstrapResponse>('/api/inbox/bootstrap');
  },

  listThreads(
    filters: InboxFilters,
    page = 1,
    pageSize = 30,
  ): Promise<ListThreadsResponse> {
    const qs = buildThreadsQuery(filters, page, pageSize);
    return getJson<ListThreadsResponse>(`/api/inbox/threads?${qs}`);
  },

  listMessages(threadId: string): Promise<ListMessagesResponse> {
    return getJson<ListMessagesResponse>(
      `/api/inbox/threads/${encodeURIComponent(threadId)}/messages`,
    );
  },

  sendMessage(threadId: string, body: SendMessageRequest): Promise<SendMessageResponse> {
    return getJson<SendMessageResponse>(
      `/api/inbox/threads/${encodeURIComponent(threadId)}/messages`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );
  },

  getCustomer(customerId: string): Promise<Customer> {
    return getJson<Customer>(`/api/inbox/customers/${encodeURIComponent(customerId)}`);
  },

  backfillEvents(after?: string): Promise<BackfillEventsResponse> {
    const sp = new URLSearchParams();
    if (after) sp.set('after', after);
    const qs = sp.toString();
    return getJson<BackfillEventsResponse>(
      `/api/inbox/events${qs ? `?${qs}` : ''}`,
    );
  },

  listSavedViews(): Promise<ListSavedViewsResponse> {
    return getJson<ListSavedViewsResponse>('/api/inbox/saved-views');
  },

  createSavedView(req: CreateSavedViewRequest): Promise<SavedView> {
    return getJson<SavedView>('/api/inbox/saved-views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
  },

  deleteSavedView(id: string): Promise<{ ok: boolean }> {
    return getJson<{ ok: boolean }>(`/api/inbox/saved-views/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};
