import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { inboxApi } from '../api/inboxApi';
import { inboxKeys } from '../api/queryKeys';
import type { ListSavedViewsResponse } from '../model/types';

/**
 * TODO(student):
 * - saved view를 localStorage로 둘지 mock API로 둘지 선택하세요.
 *   (선택 이유를 challenge/state-model-guide.md를 참고해서 정하세요.)
 * - saved view 클릭 시 URL state를 복원하세요.
 * - saved view 추가/삭제에 대한 mutation을 만드세요.
 * - 실패 시에도 화면 전체가 깨지지 않도록 부분 실패 처리하세요.
 */
export function useSavedViews(): UseQueryResult<ListSavedViewsResponse> {
  return useQuery({
    queryKey: inboxKeys.savedViews(),
    queryFn: () => inboxApi.listSavedViews(),
  });
}
