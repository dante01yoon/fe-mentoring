import type { RealtimeClient } from './RealtimeClient';
import { MockRealtimeClient } from './MockRealtimeClient';

// 앱 전역에서 단 하나의 RealtimeClient instance만 사용합니다.
// 멘티가 실제 WebSocket으로 교체할 경우 이 모듈만 갈아끼우면 됩니다.

let _client: RealtimeClient | null = null;

export function getRealtimeClient(): RealtimeClient {
  if (!_client) {
    _client = new MockRealtimeClient();
  }
  return _client;
}

// 테스트에서 새 instance를 강제할 때 사용.
export function resetRealtimeClientForTest(): void {
  _client = null;
}
