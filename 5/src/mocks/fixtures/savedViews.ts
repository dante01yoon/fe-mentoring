import type { SavedView } from '../../features/inbox/model/types';

// Saved views는 mock REST에서 in-memory store로 다룹니다.
// 멘티가 localStorage 기반으로 갈아끼워도 무방합니다.
export const SAVED_VIEW_STORE: SavedView[] = [
  {
    id: 'view_001',
    name: '내 미답변',
    state: { assignee: 'me', status: 'open', unreadOnly: true, sort: 'latest' },
    createdAt: new Date(Date.UTC(2026, 4, 1, 9, 0, 0)).toISOString(),
  },
  {
    id: 'view_002',
    name: 'VIP 환불',
    state: { query: 'refund', sort: 'latest' },
    createdAt: new Date(Date.UTC(2026, 4, 2, 9, 0, 0)).toISOString(),
  },
];

let _seq = SAVED_VIEW_STORE.length;
export function nextSavedViewId(): string {
  _seq += 1;
  return `view_${String(_seq).padStart(3, '0')}`;
}
