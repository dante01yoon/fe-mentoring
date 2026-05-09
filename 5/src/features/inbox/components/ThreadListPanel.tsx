import { Panel } from '../../../shared/components/Panel';
import { EmptyState } from '../../../shared/components/EmptyState';

/**
 * TODO(student):
 * - REST thread 목록을 연결하세요.
 * - URL query state와 필터를 동기화하세요.
 * - 실시간 thread.updated 이벤트를 목록에 반영하세요.
 * - unread count가 일관되게 보이도록 처리하세요.
 * - 큰 dataset(scenario: large-dataset)에서 렌더 비용을 어떻게 줄일지 결정하세요.
 */
export function ThreadListPanel() {
  return (
    <Panel title="Threads" className="panel--threads">
      <EmptyState
        title="스레드 목록 placeholder"
        description="useThreads()를 연결하고 ThreadListItem을 렌더링하세요."
      />
    </Panel>
  );
}
