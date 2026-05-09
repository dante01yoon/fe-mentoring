# 요구사항

## 화면

- `/inbox` 진입 시 3-column layout이 보여야 한다.
- URL query를 SSOT로 사용한다.
  - `threadId`, `query`, `status`, `channel`, `assignee`, `unreadOnly`, `sort`
- `/inbox?threadId=t_001&query=refund&status=open&...`로 직접 진입해도 화면이 그대로 복원되어야 한다.

## 데이터

- bootstrap, threads, messages, customer, saved-views를 TanStack Query로 관리한다.
- thread를 선택하면 messages와 customer query를 병행으로 시작한다.
- saved view는 localStorage 또는 mock API 중 하나로 구현하고, 그 이유를 코드 주석/PR 본문에 적는다.

## 실시간

- `MockRealtimeClient.connect()` 후 emit되는 이벤트를 구독한다.
- `message.created`는 현재 thread의 messages 목록과 thread list의 lastMessage / unreadCount에 반영한다.
- `thread.updated`, `thread.assigned`도 thread list cache에 반영한다.
- `connection.lost`, `connection.restored`는 banner로 노출한다.
- `connection.restored` 후 lastEventId 기준으로 `/api/inbox/events?after=` 를 호출해 backfill한다.

## 메시지 전송

- composer에 텍스트를 입력하고 보내면 즉시 sending 상태 placeholder가 보인다.
- 응답 성공 시 sending → sent로 교체된다 (clientId 매칭).
- 응답 실패 시 failed로 표시되고 retry 버튼이 보인다.
- 같은 thread의 draft는 새로고침 후에도 복구 가능해야 한다.

## 부분 실패

- `customer-error` scenario에서 customer panel만 에러 상태로 보인다.
- `messages-error` scenario에서 messages panel만 에러 상태로 보인다.
- `threads-error` scenario에서 thread list panel만 에러 상태로 보인다.

## 비기능 요구

- `pnpm typecheck` 통과
- `pnpm build` 통과
- Vitest 테스트가 절반 이상 실제 테스트로 채워져야 한다.
- Playwright smoke가 통과한다.
