import { useBoard } from '../hooks/useBoard';
import { useBoardFilters } from '../hooks/useBoardFilters';

export function BoardStatusBar() {
  const { filters } = useBoardFilters();
  const boardQuery = useBoard(filters);
  const totalCards = boardQuery.data?.cards.length ?? 0;
  const revision = boardQuery.data?.board.revision ?? 'pending';

  return (
    <div className="board-status" aria-live="polite">
      <span>Cards: {totalCards}</span>
      <span>Revision: {revision}</span>
      <span>Status: {boardQuery.isFetching ? 'Syncing' : 'Idle'}</span>
    </div>
  );
}
