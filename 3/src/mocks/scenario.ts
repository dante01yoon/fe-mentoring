import type { ProductSearchScenario } from './types';

const STORAGE_KEY = 'product-search:scenario';

const SCENARIOS: ReadonlySet<string> = new Set<ProductSearchScenario>([
  'default',
  'slow',
  'empty',
  'search-error',
  'facets-error',
  'detail-error',
  'saved-view-error',
  'out-of-order',
  'large-dataset',
]);

/**
 * 시나리오 우선순위:
 *   1. URL query string (?scenario=facets-error)
 *   2. localStorage      (product-search:scenario)
 *   3. fallback          'default'
 *
 * 멘티 안내:
 *   화면 우상단 ScenarioSwitcher 컴포넌트(미구현)에서 사용자가 시나리오를 바꿀 수 있도록
 *   setScenario를 호출하면 됩니다. 또는 직접 ?scenario=...로 접근해도 동일합니다.
 */
export function getScenario(): ProductSearchScenario {
  if (typeof window === 'undefined') return 'default';

  const fromUrl = new URLSearchParams(window.location.search).get('scenario');
  if (isScenario(fromUrl)) return fromUrl;

  const fromStorage = window.localStorage.getItem(STORAGE_KEY);
  if (isScenario(fromStorage)) return fromStorage;

  return 'default';
}

export function setScenario(scenario: ProductSearchScenario): void {
  window.localStorage.setItem(STORAGE_KEY, scenario);
}

export function clearScenario(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

function isScenario(value: string | null): value is ProductSearchScenario {
  return value !== null && SCENARIOS.has(value);
}
