import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { inboxApi } from '../api/inboxApi';
import { inboxKeys } from '../api/queryKeys';
import type { ListMessagesResponse } from '../model/types';

/**
 * TODO(student):
 * - threadId가 없을 때 query를 비활성화하세요. (enabled 옵션)
 * - 메시지를 시간순으로 안정적으로 정렬하세요. (createdAt 기준 + tie-breaker)
 * - optimistic message와 서버 message를 어떻게 병합할지 설계하세요.
 *   (clientId 매칭, 중복 제거, sending → sent 전환)
 * - 새 메시지 이벤트(message.created)가 도착했을 때 어떻게 cache에 머지할지 정의하세요.
 */
export function useThreadMessages(
  threadId: string | null,
): UseQueryResult<ListMessagesResponse> {
  return useQuery({
    queryKey: inboxKeys.messages(threadId),
    queryFn: () => {
      if (!threadId) {
        // TODO(student): threadId가 없을 때 호출되지 않도록 enabled로 막고,
        // 임시 placeholder를 return하지 않도록 정리하세요.
        return Promise.resolve<ListMessagesResponse>({
          threadId: '',
          items: [],
          cursor: null,
        });
      }
      return inboxApi.listMessages(threadId);
    },
    enabled: !!threadId,
  });
}
