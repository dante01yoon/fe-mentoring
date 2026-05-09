import { ConnectionStatusBanner } from '../features/inbox/components/ConnectionStatusBanner';
import { CustomerInfoPanel } from '../features/inbox/components/CustomerInfoPanel';
import { InboxToolbar } from '../features/inbox/components/InboxToolbar';
import { MessagePanel } from '../features/inbox/components/MessagePanel';
import { SavedViewBar } from '../features/inbox/components/SavedViewBar';
import { ThreadListPanel } from '../features/inbox/components/ThreadListPanel';

/**
 * /inbox — 운영 콘솔 메인 화면
 *
 * 3-column layout shell만 잡혀 있습니다.
 * 멘티가 다음 흐름을 직접 설계해야 합니다.
 *
 * ─ 데이터 흐름 ──────────────────────────────────────────────
 * 1) URL ↔ State
 *    - useSearchParams를 SSOT로 사용
 *    - utils/urlState.ts의 parse / serialize를 채워 넣고 컴포넌트와 연결
 *    - threadId, query, status, channel, assignee, unreadOnly, sort 모두 동기화
 *
 * 2) Server state (TanStack Query)
 *    - useThreads(filters, page, pageSize)
 *    - useThreadMessages(threadId)  — threadId 없을 때 비활성화
 *    - useQuery로 customer 정보 조회
 *    - useSavedViews
 *
 * 3) Realtime 병합
 *    - useInboxRealtime()
 *    - message.created → 현재 thread의 messages cache에 머지
 *    - thread.updated → threads 목록 cache에 머지 (정렬 유지!)
 *    - duplicate eventId 무시
 *    - reconnect 후 lastEventId 기준 backfill API 호출
 *
 * 4) Optimistic update
 *    - composer 전송 시 sending 상태 placeholder 메시지를 미리 추가
 *    - 응답 성공 시 server message로 교체 (clientId 매칭)
 *    - 실패 시 failed 상태로 표시 + retry 버튼
 *
 * 5) Partial failure
 *    - customer-error scenario에서 customer panel만 에러 UI를 보여줘야 함
 *    - threads 실패는 thread list panel 안에서만 에러 UI를 보여줘야 함
 *    - 메시지 전송 실패는 composer 영역에서만 처리
 */
export default function InboxPage() {
  return (
    <div className="inbox-page">
      <header className="inbox-page__header">
        <InboxToolbar />
        <SavedViewBar />
        <ConnectionStatusBanner />
      </header>
      <div className="inbox-page__columns">
        <div className="inbox-page__col inbox-page__col--threads">
          <ThreadListPanel />
        </div>
        <div className="inbox-page__col inbox-page__col--messages">
          <MessagePanel />
        </div>
        <div className="inbox-page__col inbox-page__col--customer">
          <CustomerInfoPanel />
        </div>
      </div>
    </div>
  );
}
