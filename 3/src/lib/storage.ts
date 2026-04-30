import type { SavedView } from '../mocks/types';

const PREFIX = 'product-search:v1';

const KEYS = {
  savedViews: `${PREFIX}:saved-views`,
  visibleColumns: `${PREFIX}:visible-columns`,
  recentQueries: `${PREFIX}:recent-queries`,
} as const;

/**
 * Saved View 저장 위치에 대한 가이드.
 *
 * 스펙 §7.7에 따르면 두 가지 선택지가 있습니다:
 *   A) localStorage    : 구현이 단순. mock 서버 없이도 동작.
 *   B) mock API        : TanStack Query mutation/invalidation 연습 가능.
 *
 * 이 파일은 (A)를 빠르게 시작할 수 있도록 한 묶음의 헬퍼만 제공합니다.
 * (B)를 선택하면 이 파일을 무시하고 src/lib/api.ts의 listSavedViews / createSavedView를 사용하세요.
 *
 * 어느 쪽을 택했든 README에 이유를 적어야 합니다.
 */

// ─── Saved Views (localStorage 방식) ──────────────────────────────

export function loadSavedViewsFromLocal(): SavedView[] {
  try {
    const raw = localStorage.getItem(KEYS.savedViews);
    return raw ? (JSON.parse(raw) as SavedView[]) : [];
  } catch {
    return [];
  }
}

export function saveSavedViewsToLocal(views: SavedView[]): void {
  localStorage.setItem(KEYS.savedViews, JSON.stringify(views));
}

// ─── Visible Columns (선택 구현) ──────────────────────────────────

export function loadVisibleColumns(): string[] | null {
  try {
    const raw = localStorage.getItem(KEYS.visibleColumns);
    return raw ? (JSON.parse(raw) as string[]) : null;
  } catch {
    return null;
  }
}

export function saveVisibleColumns(columns: string[]): void {
  localStorage.setItem(KEYS.visibleColumns, JSON.stringify(columns));
}

// ─── Recent Queries (선택 구현) ───────────────────────────────────

export function loadRecentQueries(): string[] {
  try {
    const raw = localStorage.getItem(KEYS.recentQueries);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function pushRecentQuery(query: string, max = 10): void {
  const trimmed = query.trim();
  if (!trimmed) return;
  const prev = loadRecentQueries().filter((q) => q !== trimmed);
  const next = [trimmed, ...prev].slice(0, max);
  localStorage.setItem(KEYS.recentQueries, JSON.stringify(next));
}

export function clearAll(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}
