import { BoardStatusBar } from '../features/kanban/components/BoardStatusBar';
import { BoardToolbar } from '../features/kanban/components/BoardToolbar';
import { CardDetailDrawer } from '../features/kanban/components/CardDetailDrawer';
import { KanbanBoard } from '../features/kanban/components/KanbanBoard';
import { MoveRollbackBanner } from '../features/kanban/components/MoveRollbackBanner';

/**
 * /board — Kanban 과제의 메인 화면입니다.
 *
 * 현재 파일은 shell만 제공합니다.
 * 멘티는 아래 흐름을 직접 연결해야 합니다.
 *
 * 1) board query
 *    - GET /api/kanban/board 로 column/card/member 데이터를 조회합니다.
 *    - query/search/assignee/label/due 상태는 URL과 동기화합니다.
 *
 * 2) drag-and-drop
 *    - @dnd-kit sensor, collision strategy, keyboard 이동을 설계합니다.
 *    - 같은 column reorder와 다른 column 이동을 모두 처리합니다.
 *
 * 3) optimistic move
 *    - drag end 직후 query cache를 먼저 바꿉니다.
 *    - PATCH /api/kanban/cards/:cardId/move 실패 시 이전 snapshot으로 rollback합니다.
 *
 * 4) server conflict
 *    - request의 expectedVersion과 서버 card version이 다르면 409가 납니다.
 *    - stale-version scenario에서 사용자에게 충돌 복구 경로를 보여줘야 합니다.
 *
 * 5) detail drawer
 *    - ?cardId=... 를 SSOT로 사용합니다.
 *    - 새로고침/공유 링크에서도 같은 카드를 열 수 있어야 합니다.
 */
export default function BoardPage() {
  return (
    <div className="board-page">
      <header className="board-page__header">
        <BoardToolbar />
        <BoardStatusBar />
        <MoveRollbackBanner />
      </header>
      <div className="board-page__body">
        <KanbanBoard />
      </div>
      <CardDetailDrawer />
    </div>
  );
}
