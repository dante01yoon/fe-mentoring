import type { Scenario } from './types';

const STORAGE_KEY = 'checkout:funnel:v1:scenario';

/**
 * 시나리오 우선순위:
 * 1. URL query string  ?scenario=payment-fail
 * 2. localStorage       checkout:funnel:v1:scenario
 * 3. fallback           'default'
 */
export function getScenario(): Scenario {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('scenario');
  if (isScenario(fromUrl)) return fromUrl;

  const fromStorage = localStorage.getItem(STORAGE_KEY);
  if (isScenario(fromStorage)) return fromStorage;

  return 'default';
}

export function setScenario(scenario: Scenario): void {
  localStorage.setItem(STORAGE_KEY, scenario);
}

const SCENARIOS: Set<string> = new Set([
  'default',
  'bootstrap-fail',
  'slow-quote',
  'quote-fail',
  'payment-fail',
  'payment-cancel',
]);

function isScenario(value: string | null): value is Scenario {
  return value !== null && SCENARIOS.has(value);
}
