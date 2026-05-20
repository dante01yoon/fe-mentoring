import { useQuery } from '@tanstack/react-query';
import { kanbanApi } from '../api/kanbanApi';
import { kanbanQueryKeys } from '../api/queryKeys';
import type { BoardFilters } from '../model/types';

export function useBoard(filters: BoardFilters) {
  return useQuery({
    queryKey: kanbanQueryKeys.board(filters),
    queryFn: () => kanbanApi.getBoard(filters),
  });
}
