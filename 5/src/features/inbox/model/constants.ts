import type { Channel, ThreadStatus, InboxFilters } from './types';

export const CHANNEL_VALUES: readonly Channel[] = ['web', 'kakao', 'email', 'app'] as const;
export const THREAD_STATUS_VALUES: readonly ThreadStatus[] = [
  'open',
  'pending',
  'closed',
] as const;
export const SORT_VALUES: readonly NonNullable<InboxFilters['sort']>[] = [
  'latest',
  'unread',
  'oldest',
] as const;

export const CHANNEL_LABEL: Record<Channel, string> = {
  web: '웹',
  kakao: '카카오',
  email: '이메일',
  app: '앱',
};

export const STATUS_LABEL: Record<ThreadStatus, string> = {
  open: '진행중',
  pending: '대기',
  closed: '종료',
};

export const SORT_LABEL: Record<NonNullable<InboxFilters['sort']>, string> = {
  latest: '최신 메시지순',
  unread: '읽지 않음 우선',
  oldest: '오래된 순',
};

export const DEFAULT_PAGE_SIZE = 30;
