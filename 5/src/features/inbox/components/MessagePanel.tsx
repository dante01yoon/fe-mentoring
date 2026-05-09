import { Panel } from '../../../shared/components/Panel';
import { EmptyState } from '../../../shared/components/EmptyState';
import { MessageComposer } from './MessageComposer';

/**
 * TODO(student):
 * - threadId가 있을 때 메시지를 조회하세요. (useThreadMessages)
 * - message.created 이벤트를 현재 thread 메시지 목록에 병합하세요.
 * - 메시지 전송 optimistic update를 구현하세요.
 *   (sending → sent / failed 상태 전환을 시각적으로 보여주세요.)
 * - 실패 메시지 retry를 구현하세요.
 * - thread를 바꾸는 도중 sending 메시지가 있을 때의 UX를 결정하세요.
 */
export function MessagePanel() {
  return (
    <Panel title="Messages" className="panel--messages">
      <EmptyState
        title="스레드를 선택하세요"
        description="좌측 목록에서 스레드를 클릭하면 대화가 표시됩니다."
      />
      <div className="panel__footer">
        <MessageComposer />
      </div>
    </Panel>
  );
}
