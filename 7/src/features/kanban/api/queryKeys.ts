import type { BoardFilters } from '../model/types';

export const kanbanQueryKeys = {
  all: ['kanban'] as const,
  bootstrap: () => [...kanbanQueryKeys.all, 'bootstrap'] as const,
  board: (filters: BoardFilters) =>
    [...kanbanQueryKeys.all, 'board', filters] as const,
  card: (cardId: string) => [...kanbanQueryKeys.all, 'card', cardId] as const,
};
