import { formatDueDate } from '../../../shared/lib/date';
import type { CSSProperties } from 'react';
import type { BoardLabel, KanbanCard, Member } from '../model/types';

type KanbanCardViewProps = {
  card: KanbanCard;
  labels: BoardLabel[];
  members: Member[];
  onOpen: (cardId: string) => void;
};

export function KanbanCardView({
  card,
  labels,
  members,
  onOpen,
}: KanbanCardViewProps) {
  const assignee = members.find((member) => member.id === card.assigneeId);
  const cardLabels = labels.filter((label) => card.labelIds.includes(label.id));

  return (
    <article className="kanban-card" data-card-id={card.id}>
      <button
        className="kanban-card__open"
        type="button"
        onClick={() => onOpen(card.id)}
      >
        <span className="kanban-card__title">{card.title}</span>
        <span className={`kanban-card__priority kanban-card__priority--${card.priority}`}>
          {card.priority}
        </span>
      </button>
      <p className="kanban-card__description">{card.description}</p>
      <div className="kanban-card__labels">
        {cardLabels.map((label) => (
          <span
            className="kanban-card__label"
            key={label.id}
            style={{ '--label-color': label.color } as CSSProperties}
          >
            {label.name}
          </span>
        ))}
      </div>
      <footer className="kanban-card__meta">
        <span>{assignee?.name ?? 'Unassigned'}</span>
        <span>{formatDueDate(card.dueDate)}</span>
      </footer>
    </article>
  );
}
