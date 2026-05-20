import { useMutation, useQueryClient } from '@tanstack/react-query';
import { kanbanApi } from '../api/kanbanApi';
import { kanbanQueryKeys } from '../api/queryKeys';
import type { BoardFilters, MoveCardRequest } from '../model/types';

export function useMoveCardMutation(filters: BoardFilters) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: MoveCardRequest) => kanbanApi.moveCard(request),
    // TODO(student):
    // onMutate에서 board query를 cancel하고 previous snapshot을 저장합니다.
    // 그 다음 active card를 target column/order로 즉시 이동시키세요.
    // onError에서는 snapshot으로 rollback하고, stale-version 409를 별도 안내합니다.
    // onSuccess에서는 서버가 반환한 card.version / boardRevision으로 cache를 정규화합니다.
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: kanbanQueryKeys.board(filters),
      });
    },
  });
}
