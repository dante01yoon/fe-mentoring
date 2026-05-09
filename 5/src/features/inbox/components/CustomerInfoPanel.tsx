import { Panel } from '../../../shared/components/Panel';
import { EmptyState } from '../../../shared/components/EmptyState';

/**
 * TODO(student):
 * - 선택된 thread의 customerId로 고객 정보를 조회하세요.
 * - customer 조회 실패가 전체 화면을 깨뜨리지 않게 하세요.
 *   (panel-level error UI / fallback)
 * - 고객 메모, 태그, 최근 주문 등을 어떻게 보여줄지 결정하세요.
 */
export function CustomerInfoPanel() {
  return (
    <Panel title="Customer" className="panel--customer">
      <EmptyState
        title="고객 정보 placeholder"
        description="선택된 thread의 customerId를 useQuery로 조회하세요."
      />
    </Panel>
  );
}
