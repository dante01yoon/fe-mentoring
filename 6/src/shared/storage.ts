/**
 * Storage adapter interface.
 *
 * 멘티 가이드:
 * - localStorage / sessionStorage / in-memory 중 어떤 backend 를 쓸지 결정하세요.
 * - shutdown 시 어떤 키를 지우고 어떤 키를 남길지 정책을 README 에 적으세요.
 *
 * 후보 키:
 *   widget:visibility
 *   widget:last-route
 *   widget:draft-message
 *   widget:user
 */

export type StorageAdapter = {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clearByPrefix(prefix: string): void;
};

/**
 * In-memory fallback. 테스트용이거나 storage 가 disable 된 환경(SSR, private mode)에서 fallback 으로 씁니다.
 */
export function createMemoryStorageAdapter(): StorageAdapter {
  const store = new Map<string, string>();
  return {
    get<T>(key: string): T | null {
      const raw = store.get(key);
      if (raw == null) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    },
    set<T>(key: string, value: T): void {
      store.set(key, JSON.stringify(value));
    },
    remove(key: string): void {
      store.delete(key);
    },
    clearByPrefix(prefix: string): void {
      for (const key of Array.from(store.keys())) {
        if (key.startsWith(prefix)) store.delete(key);
      }
    },
  };
}

/**
 * 실제 localStorage 어댑터. JSON serialize 정책은 멘티가 결정합니다.
 *
 * TODO(student):
 *   - quota 초과, JSON parse 실패 등 예외를 어떻게 다룰지 결정하세요.
 *   - 같은 host 페이지에 다른 SDK 가 있을 때 키 prefix 가 충돌하지 않게 설계하세요.
 */
export function createLocalStorageAdapter(_namespace = 'widget'): StorageAdapter {
  // TODO(student): localStorage 기반 구현. 아래는 타입만 만족시키는 placeholder.
  return createMemoryStorageAdapter();
}
