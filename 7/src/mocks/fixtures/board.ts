import type {
  Board,
  KanbanCard,
  KanbanColumn,
} from '../../features/kanban/model/types';

export const COLUMNS: KanbanColumn[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    description: '아직 우선순위가 확정되지 않은 작업',
  },
  {
    id: 'todo',
    title: 'Todo',
    description: '이번 스프린트에 시작할 수 있는 작업',
    wipLimit: 6,
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    description: '현재 구현 중인 작업',
    wipLimit: 3,
  },
  {
    id: 'review',
    title: 'Review',
    description: '코드 리뷰 또는 QA 대기',
    wipLimit: 4,
  },
  {
    id: 'done',
    title: 'Done',
    description: '릴리즈 가능한 완료 작업',
  },
];

export const BOARD: Board = {
  id: 'board_growth',
  name: 'Growth Product Board',
  description: '드래그앤드롭, optimistic update, 서버 충돌 복구를 연습하는 보드',
  columns: COLUMNS,
  revision: 'rev_001',
  updatedAt: '2026-05-20T09:00:00.000Z',
};

export const BASE_CARDS: KanbanCard[] = [
  {
    id: 'card_001',
    title: '가격표 AB 테스트 카드 설계',
    description: '실험 가설, 성공 지표, QA 체크리스트를 카드 상세에서 관리합니다.',
    type: 'feature',
    columnId: 'backlog',
    assigneeId: 'mem_002',
    labelIds: ['lbl_growth', 'lbl_ux'],
    priority: 'high',
    dueDate: '2026-05-27',
    position: 1000,
    version: 1,
    createdAt: '2026-05-18T02:00:00.000Z',
    updatedAt: '2026-05-18T02:00:00.000Z',
  },
  {
    id: 'card_002',
    title: '보드 필터 URL 동기화',
    description: '검색어, 담당자, 라벨 필터가 공유 링크와 뒤로가기에 안전해야 합니다.',
    type: 'feature',
    columnId: 'todo',
    assigneeId: 'mem_001',
    labelIds: ['lbl_frontend'],
    priority: 'medium',
    dueDate: '2026-05-24',
    position: 1000,
    version: 3,
    createdAt: '2026-05-17T07:00:00.000Z',
    updatedAt: '2026-05-19T11:30:00.000Z',
  },
  {
    id: 'card_003',
    title: '드래그 중 카드 ghost 스타일',
    description: 'active 카드와 overlay가 겹치지 않고 시각적으로 구분되어야 합니다.',
    type: 'chore',
    columnId: 'todo',
    assigneeId: 'mem_003',
    labelIds: ['lbl_frontend', 'lbl_ux'],
    priority: 'low',
    position: 2000,
    version: 1,
    createdAt: '2026-05-16T08:00:00.000Z',
    updatedAt: '2026-05-16T08:00:00.000Z',
  },
  {
    id: 'card_004',
    title: '이동 실패 rollback UX',
    description: 'move-failure scenario에서 카드가 원래 자리로 돌아오고 배너가 떠야 합니다.',
    type: 'bug',
    columnId: 'in_progress',
    assigneeId: 'mem_001',
    labelIds: ['lbl_bug', 'lbl_frontend'],
    priority: 'urgent',
    dueDate: '2026-05-21',
    position: 1000,
    version: 2,
    createdAt: '2026-05-15T05:00:00.000Z',
    updatedAt: '2026-05-19T01:20:00.000Z',
  },
  {
    id: 'card_005',
    title: '카드 상세 drawer 접근성 점검',
    description: 'URL cardId, focus trap, Escape 닫기, aria-label을 함께 검증합니다.',
    type: 'research',
    columnId: 'review',
    assigneeId: 'mem_005',
    labelIds: ['lbl_ux'],
    priority: 'medium',
    dueDate: '2026-05-25',
    position: 1000,
    version: 4,
    createdAt: '2026-05-12T09:00:00.000Z',
    updatedAt: '2026-05-18T09:45:00.000Z',
  },
  {
    id: 'card_006',
    title: 'MSW move endpoint 계약 정리',
    description: 'beforeCardId, afterCardId, expectedVersion의 의미를 문서화합니다.',
    type: 'chore',
    columnId: 'done',
    assigneeId: 'mem_004',
    labelIds: ['lbl_api'],
    priority: 'medium',
    position: 1000,
    version: 1,
    createdAt: '2026-05-10T04:00:00.000Z',
    updatedAt: '2026-05-17T10:00:00.000Z',
  },
];

export function generateLargeCards(): KanbanCard[] {
  const columns = COLUMNS.map((column) => column.id);
  return Array.from({ length: 240 }, (_, index) => {
    const columnId = columns[index % columns.length];
    return {
      id: `card_large_${String(index + 1).padStart(3, '0')}`,
      title: `Large board task ${index + 1}`,
      description: '대량 카드 렌더링과 drag 성능을 확인하기 위한 fixture입니다.',
      type: index % 5 === 0 ? 'bug' : 'feature',
      columnId,
      assigneeId: `mem_00${(index % 5) + 1}`,
      labelIds: index % 2 === 0 ? ['lbl_frontend'] : ['lbl_growth'],
      priority: index % 7 === 0 ? 'high' : 'medium',
      position: (Math.floor(index / columns.length) + 1) * 1000,
      version: 1,
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-20T00:00:00.000Z',
    } satisfies KanbanCard;
  });
}
