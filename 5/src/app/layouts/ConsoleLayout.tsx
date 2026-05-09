import { NavLink, Outlet } from 'react-router-dom';
import { INBOX_SCENARIO } from '../../mocks/scenarios';

/**
 * ConsoleLayout
 *
 * 운영 콘솔의 외곽 shell.
 * 좌측 navigation, 상단 글로벌 배너, 본문 outlet 구조입니다.
 *
 * TODO(student):
 * - me/agent 정보 표시 위치를 직접 정해도 됩니다.
 * - global notification / banner 영역을 추가할지 결정하세요.
 */
export function ConsoleLayout() {
  return (
    <div className="console">
      <aside className="console__nav">
        <div className="console__brand">Inbox Console</div>
        <nav>
          <NavLink
            to="/inbox"
            className={({ isActive }) =>
              isActive ? 'console__link console__link--active' : 'console__link'
            }
          >
            Inbox
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? 'console__link console__link--active' : 'console__link'
            }
          >
            Settings
          </NavLink>
        </nav>
        <div className="console__scenario" aria-label="active scenario">
          scenario: <strong>{INBOX_SCENARIO}</strong>
        </div>
      </aside>
      <main className="console__main">
        <Outlet />
      </main>
    </div>
  );
}
