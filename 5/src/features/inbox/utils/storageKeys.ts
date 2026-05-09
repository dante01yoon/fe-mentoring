// localStorage / sessionStorage에서 사용할 key 모음.
// 키 충돌을 막기 위해 prefix를 통일합니다.

const PREFIX = 'inbox';

export const storageKeys = {
  messageDraft: (threadId: string): string => `${PREFIX}:draft:${threadId}`,
  savedViews: (): string => `${PREFIX}:saved-views`,
  lastSelectedThreadId: (): string => `${PREFIX}:last-thread`,
  lastEventId: (): string => `${PREFIX}:last-event-id`,
};
