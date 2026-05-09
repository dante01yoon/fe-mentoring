// scenario flag.
// VITE_INBOX_SCENARIO 환경변수로 선택합니다.
// 예: VITE_INBOX_SCENARIO=send-failure pnpm dev

export type InboxScenario =
  | 'default'
  | 'slow'
  | 'empty'
  | 'threads-error'
  | 'messages-error'
  | 'customer-error'
  | 'send-failure'
  | 'connection-lost'
  | 'reconnect-backfill'
  | 'duplicate-events'
  | 'out-of-order-events'
  | 'large-dataset';

const SCENARIOS: ReadonlySet<string> = new Set<InboxScenario>([
  'default',
  'slow',
  'empty',
  'threads-error',
  'messages-error',
  'customer-error',
  'send-failure',
  'connection-lost',
  'reconnect-backfill',
  'duplicate-events',
  'out-of-order-events',
  'large-dataset',
]);

export function isInboxScenario(value: unknown): value is InboxScenario {
  return typeof value === 'string' && SCENARIOS.has(value);
}

const RAW = (import.meta.env?.VITE_INBOX_SCENARIO ?? 'default') as string;

export const INBOX_SCENARIO: InboxScenario = isInboxScenario(RAW) ? RAW : 'default';

export function getScenario(): InboxScenario {
  // URL ?scenario=... 로 런타임 오버라이드 가능 (devtool용).
  if (typeof window !== 'undefined') {
    const fromUrl = new URLSearchParams(window.location.search).get('scenario');
    if (isInboxScenario(fromUrl)) return fromUrl;
  }
  return INBOX_SCENARIO;
}
