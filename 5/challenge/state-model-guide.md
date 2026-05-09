# 상태 모델 가이드

이 화면이 다루는 상태는 “장소”에 따라 다섯 갈래로 나뉩니다. 멘티는 각 상태가 어디에 살고, 누가 갱신하는지 분명하게 정의해야 합니다.

```text
URL state:
- threadId
- query
- status
- channel
- assignee
- unreadOnly
- sort

Server state:
- threads
- messages
- customers
- saved views

Realtime event state:
- connection status
- lastEventId
- pending backfill

Local state:
- drafts
- visible panel
- saved view storage option

Derived state:
- unread summary
- selected thread
- active filter count
```

## URL state

- 단일 SSOT.
- 사용자가 새로고침하거나 링크를 공유했을 때 화면이 그대로 복원되어야 합니다.
- 잘못된 값(예: status=foo)은 무시하고 기본값으로 fallback.
- `utils/urlState.ts`에서 parsing/serialization을 한 곳에 모아 두세요.

## Server state

- TanStack Query의 cache가 SSOT.
- queryKey factory는 `api/queryKeys.ts`에 모았습니다. filters를 어떻게 normalize해서 key로 만들지 결정하세요.
- 직접 `setQueryData`로 cache를 갱신할 일이 많으니, queryKey 모양을 **불변**으로 유지하는 것이 중요합니다.

## Realtime event state

- `connection status`는 UI에 직접 보여집니다.
- `lastEventId`는 reconnect 후 backfill 호출에 필요합니다. localStorage에 보관할지, 메모리에만 둘지 결정하세요.
- duplicate eventId는 cache에 들어가기 전에 차단해야 합니다. (`utils/eventDedupe.ts`)

## Local state

- composer draft는 thread별로 분리된 key를 사용하세요. (`storageKeys.messageDraft(threadId)`)
- 사용자가 thread를 바꿨을 때 draft를 잃어버리면 안 됩니다.

## Derived state

- 가능하면 `useMemo`로 컴포넌트 내부에서 계산하세요. cache에 derived 값을 직접 저장하면 inconsistency가 늘어납니다.
- 예: unread 합계, selected thread 객체, active filter count.

## 예시: 메시지 전송 1회의 상태 흐름

1. 사용자가 composer에 입력 → **Local state** 변경
2. 보내기 클릭 → optimistic message가 messages cache에 추가 (**Server cache 직접 조작**)
3. POST 응답 도착 → clientId 매칭으로 sending → sent 교체
4. 같은 메시지가 realtime `message.created` 이벤트로 들어옴 → eventDedupe 또는 clientId로 중복 무시
5. thread list cache의 lastMessage / unreadCount 갱신

이 흐름의 어디에서 실패하더라도 화면은 “알 수 있는 상태”로 남아야 합니다.
