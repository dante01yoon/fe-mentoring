# 평가 기준

총 100점.

```text
요구사항 충족도: 25
상태 모델링: 20
실시간 이벤트 병합: 20
optimistic update/retry: 15
partial failure 처리: 10
테스트 품질: 5
문서화: 5
```

## 1. 요구사항 충족도 (25)

- `/inbox`에서 3-column shell이 동작 (5)
- thread/messages/customer 데이터가 로드되어 화면에 표시 (5)
- URL query state가 SSOT로 작동 (5)
- 메시지 전송이 끝까지 동작 (5)
- saved view가 적어도 1개 시나리오에서 동작 (5)

## 2. 상태 모델링 (20)

- URL / server / realtime / local 상태가 명확히 분리되어 있는가 (8)
- queryKey 모양이 일관되고 곳곳에서 같은 모양으로 사용되는가 (4)
- derived 값이 cache가 아니라 컴포넌트에서 계산되는가 (4)
- 상태 흐름을 PR 본문 또는 README에서 설명하는가 (4)

## 3. 실시간 이벤트 병합 (20)

- `message.created`가 messages 목록에 정확히 추가되는가 (5)
- `thread.updated`/`thread.assigned`가 thread list cache에 반영되는가 (5)
- duplicate eventId가 무시되는가 (4)
- reconnect 후 backfill 이벤트가 들어오는가 (3)
- backfill에서 중복 이벤트가 제거되는가 (3)

## 4. Optimistic update / retry (15)

- 보내기를 누르면 즉시 sending placeholder가 보이는가 (4)
- clientId 매칭으로 sending → sent 교체되는가 (4)
- 실패 시 failed로 표시되는가 (3)
- failed 메시지를 retry할 수 있는가 (4)

## 5. Partial failure 처리 (10)

- `customer-error` scenario에서 customer panel만 에러 (4)
- `messages-error` scenario에서 messages panel만 에러 (3)
- `threads-error` scenario에서 thread list만 에러 (3)

## 6. 테스트 품질 (5)

- `eventDedupe.test.ts`에서 it.todo 절반 이상 실제 테스트로 채움 (2)
- `optimisticMessage.test.tsx`에서 sending → sent / failed 흐름 중 1건 이상 (2)
- `reconnectBackfill.test.tsx`에서 1건 이상 (1)

## 7. 문서화 (5)

- README의 “주요 구현 TODO” 영역을 본인 구현으로 업데이트 (2)
- challenge/state-model-guide.md를 본인 구현 결정에 맞춰 보강 (2)
- 의사결정 기록(예: saved view를 localStorage로 둔 이유)을 PR에 남김 (1)
