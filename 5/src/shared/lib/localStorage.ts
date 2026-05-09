// localStorage 안전 wrapper. SSR/테스트 환경에서도 fallback 동작합니다.

export function readJson<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function removeKey(key: string): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
