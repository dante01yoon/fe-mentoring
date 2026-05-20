import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { KanbanCard } from '../model/types';

export function useSelectedCard(cards: KanbanCard[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const cardId = searchParams.get('cardId');

  const selectedCard = useMemo(
    () => cards.find((card) => card.id === cardId) ?? null,
    [cardId, cards],
  );

  function openCard(nextCardId: string) {
    const next = new URLSearchParams(searchParams);
    next.set('cardId', nextCardId);
    setSearchParams(next);
  }

  function closeCard() {
    const next = new URLSearchParams(searchParams);
    next.delete('cardId');
    setSearchParams(next);
  }

  return {
    cardId,
    selectedCard,
    openCard,
    closeCard,
  };
}
