import { useMemo } from 'react';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { useBoard } from '../hooks/useBoard';
import { useBoardFilters } from '../hooks/useBoardFilters';
import { KanbanColumn } from './KanbanColumn';
import { groupCardsByColumn } from '../utils/boardOrdering';
import type { KanbanCard } from '../model/types';

const EMPTY_CARDS: KanbanCard[] = [];

export function KanbanBoard() {
  const { filters } = useBoardFilters();
  const boardQuery = useBoard(filters);
  const cards = boardQuery.data?.cards ?? EMPTY_CARDS;
  const groupedCards = useMemo(() => groupCardsByColumn(cards), [cards]);

  if (boardQuery.isLoading) {
    return <LoadingState label="Loading board..." />;
  }

  if (boardQuery.isError) {
    return (
      <ErrorState
        title="보드를 불러오지 못했습니다"
        description={boardQuery.error.message}
        onRetry={() => void boardQuery.refetch()}
      />
    );
  }

  if (!boardQuery.data) return null;

  return (
    <>
      <div className="implementation-note">
        TODO(student): wrap this board with @dnd-kit DndContext, configure sensors,
        calculate move targets, and call the move mutation.
      </div>
      <div className="kanban-board" data-testid="kanban-board">
        {boardQuery.data.board.columns.map((column) => (
          <KanbanColumn
            cards={groupedCards[column.id]}
            column={column}
            key={column.id}
            labels={boardQuery.data.labels}
            members={boardQuery.data.members}
            onOpenCard={() => {
              // TODO(student): set cardId in URL and open CardDetailDrawer.
            }}
          />
        ))}
      </div>
    </>
  );
}
