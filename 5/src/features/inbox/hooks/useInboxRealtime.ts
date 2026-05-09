import { useEffect } from 'react';
import { getRealtimeClient } from '../realtime/inboxEventBus';

/**
 * TODO(student):
 * - realtime event를 구독하세요.
 * - message.created 이벤트를 thread list와 message list에 병합하세요.
 *   (queryClient.setQueryData 활용 권장)
 * - thread.updated / thread.assigned 이벤트로 thread 목록을 갱신하세요.
 * - duplicate eventId를 제거하세요. (utils/eventDedupe.ts 활용)
 * - connection.lost / connection.restored 이벤트로 connection status를 노출하세요.
 * - connection.restored 이후 lastEventId 기준으로 backfill API를 호출하세요.
 *
 * 반환값 형태도 직접 정의하세요. 예시:
 *   { connectionStatus, lastEventId, isBackfilling }
 */
export function useInboxRealtime(): null {
  useEffect(() => {
    const client = getRealtimeClient();
    client.connect();
    const unsubscribe = client.subscribe((_event) => {
      // TODO(student): 여기서 _event를 query cache에 머지합니다.
    });
    return () => {
      unsubscribe();
      client.disconnect();
    };
  }, []);

  // TODO(student): 의미 있는 값을 반환하도록 수정하세요.
  return null;
}
