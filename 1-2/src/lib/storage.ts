const PREFIX = 'checkout:funnel:v1';

/**
 * 1회차 키는 유지하고, 2회차 2개를 추가합니다.
 *   payment-result    : hosted redirect 후 복구용
 *   analytics-queue   : analytics 이벤트 queue
 */
const KEYS = {
  draft: `${PREFIX}:draft`,
  lastValidStep: `${PREFIX}:last-valid-step`,
  scenario: `${PREFIX}:scenario`,
  paymentResult: `${PREFIX}:payment-result`,
  analyticsQueue: `${PREFIX}:analytics-queue`,
} as const;

// ─── draft ────────────────────────────────────────────────────────

export function loadDraft<T = Record<string, unknown>>(): T | null {
  try {
    const raw = localStorage.getItem(KEYS.draft);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveDraft(data: unknown): void {
  localStorage.setItem(KEYS.draft, JSON.stringify(data));
}

export function clearDraft(): void {
  localStorage.removeItem(KEYS.draft);
}

// ─── last valid step ──────────────────────────────────────────────

export function loadLastValidStep(): number {
  const raw = localStorage.getItem(KEYS.lastValidStep);
  const n = Number(raw);
  return Number.isNaN(n) ? -1 : n;
}

export function saveLastValidStep(index: number): void {
  localStorage.setItem(KEYS.lastValidStep, String(index));
}

// ─── payment result (hosted redirect 복구용) ───────────────────────

export function loadPaymentResult<T = unknown>(): T | null {
  try {
    const raw = localStorage.getItem(KEYS.paymentResult);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function savePaymentResult(data: unknown): void {
  localStorage.setItem(KEYS.paymentResult, JSON.stringify(data));
}

export function clearPaymentResult(): void {
  localStorage.removeItem(KEYS.paymentResult);
}

// ─── analytics queue ──────────────────────────────────────────────

export function loadAnalyticsQueue<T = unknown>(): T[] {
  try {
    const raw = localStorage.getItem(KEYS.analyticsQueue);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function saveAnalyticsQueue(events: unknown[]): void {
  localStorage.setItem(KEYS.analyticsQueue, JSON.stringify(events));
}

export function clearAnalyticsQueue(): void {
  localStorage.removeItem(KEYS.analyticsQueue);
}

// ─── cleanup ──────────────────────────────────────────────────────

/**
 * 결제 성공 후 호출. analytics queue는 관측 목적이므로 기본적으로 보존합니다.
 */
export function clearCheckoutArtifacts(): void {
  localStorage.removeItem(KEYS.draft);
  localStorage.removeItem(KEYS.lastValidStep);
  localStorage.removeItem(KEYS.paymentResult);
}

/** 모든 checkout 관련 storage를 정리한다 (테스트/리셋 용) */
export function clearAll(): void {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}
