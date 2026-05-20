export function BoardToolbar() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form className="board-toolbar" onSubmit={handleSubmit}>
      <div>
        <h1 className="board-toolbar__title">Kanban Board</h1>
        <p className="board-toolbar__subtitle">
          Drag-and-drop workflow scaffold with MSW-backed APIs
        </p>
      </div>
      <div className="board-toolbar__controls">
        <input
          aria-label="Search cards"
          className="board-toolbar__search"
          name="query"
          placeholder="Search cards"
        />
        <button className="button" type="submit">
          Search
        </button>
        <button className="button button--primary" type="button">
          New card
        </button>
      </div>
      <p className="todo-note board-toolbar__todo">
        TODO(student): wire query, assignee, label, priority filters to URL state.
      </p>
    </form>
  );
}
