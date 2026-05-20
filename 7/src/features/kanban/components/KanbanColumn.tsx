import type {
  BoardLabel,
  KanbanCard,
  KanbanColumn as KanbanColumnModel,
  Member,
} from '../model/types';
import { EmptyState } from '../../../shared/components/EmptyState';
import { KanbanCardView } from './KanbanCardView';

type KanbanColumnProps = {
  column: KanbanColumnModel;
  cards: KanbanCard[];
  labels: BoardLabel[];
  members: Member[];
  onOpenCard: (cardId: string) => void;
};

export function KanbanColumn({
  column,
  cards,
  labels,
  members,
  onOpenCard,
}: KanbanColumnProps) {
  const overLimit =
    typeof column.wipLimit === 'number' && cards.length > column.wipLimit;

  return (
    <section
      className="kanban-column"
      aria-label={column.title}
    >
      <header className="kanban-column__header">
        <div>
          <h2>{column.title}</h2>
          <p>{column.description}</p>
        </div>
        <span
          className={
            overLimit
              ? 'kanban-column__count kanban-column__count--over'
              : 'kanban-column__count'
          }
        >
          {cards.length}
          {column.wipLimit ? `/${column.wipLimit}` : ''}
        </span>
      </header>
      <div className="kanban-column__cards">
        {cards.length === 0 ? (
          <EmptyState
            title="No cards"
            description="TODO(student): make this column a droppable target."
          />
        ) : (
          cards.map((card) => (
            <KanbanCardView
              card={card}
              key={card.id}
              labels={labels}
              members={members}
              onOpen={onOpenCard}
            />
          ))
        )}
      </div>
    </section>
  );
}
