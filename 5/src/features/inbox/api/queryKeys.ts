import type { InboxFilters } from '../model/types';

// TanStack Query queryKey factory.
// 멘티는 filters/page 등을 어떻게 normalize해서 key에 넣을지 직접 결정해야 합니다.

export const inboxKeys = {
  all: ['inbox'] as const,
  bootstrap: () => [...inboxKeys.all, 'bootstrap'] as const,
  threads: (filters: InboxFilters, page = 1, pageSize = 30) =>
    [...inboxKeys.all, 'threads', { filters, page, pageSize }] as const,
  messages: (threadId: string | null) =>
    [...inboxKeys.all, 'messages', threadId] as const,
  customer: (customerId: string | null) =>
    [...inboxKeys.all, 'customer', customerId] as const,
  savedViews: () => [...inboxKeys.all, 'saved-views'] as const,
};
