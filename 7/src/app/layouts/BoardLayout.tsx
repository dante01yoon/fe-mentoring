import { NavLink, Outlet } from 'react-router-dom';
import { getScenario } from '../../mocks/scenarios';

export function BoardLayout() {
  return (
    <div className="workspace-shell">
      <aside className="workspace-shell__nav">
        <div className="workspace-shell__brand">Assignment 07</div>
        <nav aria-label="Main">
          <NavLink
            className={({ isActive }) =>
              isActive
                ? 'workspace-shell__link workspace-shell__link--active'
                : 'workspace-shell__link'
            }
            to="/board"
          >
            Kanban Board
          </NavLink>
        </nav>
        <div className="workspace-shell__scenario">
          scenario: <code>{getScenario()}</code>
        </div>
      </aside>
      <main className="workspace-shell__main">
        <Outlet />
      </main>
    </div>
  );
}
