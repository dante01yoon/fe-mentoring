import type { BoardLabel, KanbanCard, Member } from '../model/types';
import { KanbanCardView } from '../components/KanbanCardView';

type SortableCardProps = {
  card: KanbanCard;
  labels: BoardLabel[];
  members: Member[];
  onOpen: (cardId: string) => void;
};

export function SortableCard({
  card,
  labels,
  members,
  onOpen,
}: SortableCardProps) {
  return (
    <div className="sortable-card">
      <p className="todo-note">
        TODO(student): replace this wrapper with useSortable({`{ id: card.id }`}).
      </p>
      <KanbanCardView
        card={card}
        labels={labels}
        members={members}
        onOpen={onOpen}
      />
    </div>
  );
}
