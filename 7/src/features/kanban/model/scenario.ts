import type { KanbanScenario } from '../../../mocks/scenarios';

export type ScenarioDescription = {
  label: string;
  purpose: string;
};

export const SCENARIO_DESCRIPTIONS: Record<KanbanScenario, ScenarioDescription> = {
  default: {
    label: 'Default',
    purpose: '기본 보드 조회와 이동 happy path를 검증합니다.',
  },
  slow: {
    label: 'Slow network',
    purpose: 'drag 중/저장 중 지연 상태와 stale UI 전략을 검증합니다.',
  },
  empty: {
    label: 'Empty board',
    purpose: '카드가 하나도 없을 때 empty state와 새 카드 진입점을 검증합니다.',
  },
  'board-error': {
    label: 'Board error',
    purpose: '보드 조회 실패가 전체 화면에서 어떻게 복구되는지 검증합니다.',
  },
  'move-failure': {
    label: 'Move failure',
    purpose: 'optimistic move 실패 후 rollback과 사용자 안내를 검증합니다.',
  },
  'stale-version': {
    label: 'Stale version',
    purpose: '다른 사용자가 먼저 이동한 카드의 409 conflict 복구를 검증합니다.',
  },
  'large-board': {
    label: 'Large board',
    purpose: '카드 수가 많을 때 렌더링과 drag 성능을 검증합니다.',
  },
};
