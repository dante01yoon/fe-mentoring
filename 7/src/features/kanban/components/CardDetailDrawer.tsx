import { useSearchParams } from 'react-router-dom';

export function CardDetailDrawer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const cardId = searchParams.get('cardId');

  if (!cardId) return null;

  function closeCard() {
    const next = new URLSearchParams(searchParams);
    next.delete('cardId');
    setSearchParams(next);
  }

  return (
    <aside className="card-drawer" aria-label="Card detail">
      <div className="card-drawer__panel">
        <header className="card-drawer__header">
          <h2>Card detail scaffold</h2>
          <button className="button" type="button" onClick={closeCard}>
            Close
          </button>
        </header>
        <div className="card-drawer__body">
          <p>Selected card id: {cardId}</p>
          <p className="todo-note">
            TODO(student): find the selected card from board data, render details,
            manage focus, close on Escape, and handle missing cards after filtering.
          </p>
        </div>
      </div>
    </aside>
  );
}
