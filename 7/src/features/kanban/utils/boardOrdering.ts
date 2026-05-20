import type { ColumnId, KanbanCard } from '../model/types';

export function sortCardsByPosition(cards: KanbanCard[]): KanbanCard[] {
  return [...cards].sort((a, b) => {
    if (a.position !== b.position) return a.position - b.position;
    return a.updatedAt.localeCompare(b.updatedAt);
  });
}

export function groupCardsByColumn(cards: KanbanCard[]): Record<ColumnId, KanbanCard[]> {
  const grouped: Record<ColumnId, KanbanCard[]> = {
    backlog: [],
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  };

  for (const card of cards) {
    grouped[card.columnId].push(card);
  }

  return {
    backlog: sortCardsByPosition(grouped.backlog),
    todo: sortCardsByPosition(grouped.todo),
    in_progress: sortCardsByPosition(grouped.in_progress),
    review: sortCardsByPosition(grouped.review),
    done: sortCardsByPosition(grouped.done),
  };
}

export function createClientMutationId(): string {
  return `move_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// TODO(student):
// implement calculateMoveTarget(activeCard, overTarget, groupedCards).
// 이 함수는 drag 결과를 서버 API request로 바꾸는 핵심 경계입니다.
