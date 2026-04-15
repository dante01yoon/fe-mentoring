const PREFIX = 'checkout:funnel:v1';

const KEYS = {
  draft: `${PREFIX}:draft`,
  lastValidStep: `${PREFIX}:last-valid-step`,
  scenario: `${PREFIX}:scenario`,
} as const;

/** draft 전체를 읽어온다 */
export function loadDraft<T = Record<string, unknown>>(): T | null {
  try {
    const raw = localStorage.getItem(KEYS.draft);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/** draft 전체를 저장한다 */
export function saveDraft(data: unknown): void {
  localStorage.setItem(KEYS.draft, JSON.stringify(data));
}

/** draft를 삭제한다 */
export function clearDraft(): void {
  localStorage.removeItem(KEYS.draft);
}

/** 마지막으로 유효하게 완료한 step index */
export function loadLastValidStep(): number {
  const raw = localStorage.getItem(KEYS.lastValidStep);
  const n = Number(raw);
  return Number.isNaN(n) ? -1 : n;
}

export function saveLastValidStep(index: number): void {
  localStorage.setItem(KEYS.lastValidStep, String(index));
}

/** 모든 checkout 관련 storage를 정리한다 */
export function clearAll(): void {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}
