import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { inboxApi } from '../api/inboxApi';
import { inboxKeys } from '../api/queryKeys';
import type { InboxFilters, ListThreadsResponse } from '../model/types';

/**
 * TODO(student):
 * - filters를 queryKey에 포함하세요. (지금은 placeholder로 단순 통과만 시킵니다.)
 * - 검색/필터/정렬 변경 시 기존 결과의 loading UX를 어떻게 처리할지 결정하세요.
 *   (placeholderData / keepPreviousData / suspense 등)
 * - page/pageSize를 추가할지 선택하세요.
 * - thread.updated 이벤트가 도착했을 때 cache를 어떻게 업데이트할지 설계하세요.
 *   (useInboxRealtime과 함께 봅니다.)
 */
export function useThreads(
  filters: InboxFilters,
  page = 1,
  pageSize = 30,
): UseQueryResult<ListThreadsResponse> {
  return useQuery({
    queryKey: inboxKeys.threads(filters, page, pageSize),
    queryFn: () => inboxApi.listThreads(filters, page, pageSize),
  });
}
