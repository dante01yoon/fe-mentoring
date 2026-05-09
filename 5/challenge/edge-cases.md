# 엣지 케이스

아래 경우에 화면 상태가 일관성을 잃지 않도록 설계하세요.

## 1. 같은 eventId가 두 번 들어오는 경우

- `MockRealtimeClient`가 `duplicate-events` scenario에서 동일 이벤트를 두 번 emit합니다.
- 두 번째 이벤트는 무시되어야 합니다. messages 목록에 같은 메시지가 두 번 보이면 안 됩니다.

## 2. 메시지 전송 후 서버 응답이 실패하는 경우

- `send-failure` scenario에서 POST가 500을 반환합니다.
- 사용자는 자기 메시지가 “실패”로 표시된 상태에서 retry할 수 있어야 합니다.
- 다른 thread의 메시지나 thread 목록은 영향받지 않아야 합니다.

## 3. 전송 중인 메시지가 있는 상태에서 thread를 바꾸는 경우

- 사용자가 thread A에서 메시지를 보내는 중에 thread B로 이동했다고 가정.
- 응답이 늦게 도착한 메시지가 thread B의 화면에 잘못 추가되면 안 됩니다.
- thread A로 다시 돌아왔을 때 sending → sent 전환이 정상적으로 보여야 합니다.

## 4. 연결이 끊긴 동안 새 메시지가 들어온 경우

- `connection-lost` scenario에서 banner는 disconnected 상태를 표시합니다.
- 이 상태에서 사용자가 메시지를 작성하면 어떻게 할지 결정하세요. (전송 막기 / 큐에 저장 / 즉시 시도)

## 5. reconnect 후 backfill 이벤트가 기존 이벤트와 중복되는 경우

- `reconnect-backfill` scenario에서 끊김 → 복구 후 `/api/inbox/events?after=...`로 누락 이벤트가 들어옵니다.
- backfill 이벤트 중 일부는 이미 cache에 있는 이벤트일 수 있습니다.
- 이를 dedupe해야 합니다.

## 6. customer info API만 실패하는 경우

- `customer-error` scenario에서 customer 조회가 500.
- 이 패널만 에러 UI를 보여줘야 합니다. thread list / messages는 정상 동작해야 합니다.

## 7. saved view를 적용했는데 URL query가 기존 상태와 충돌하는 경우

- 예: 현재 `?status=open` 상태에서 “내 미답변” saved view (status=open, unreadOnly=true)를 적용.
- 정책을 정해두세요. saved view가 항상 덮어쓰는지, merge하는지.

## 8. unread count가 서버 값과 클라이언트 이벤트 계산 값이 다를 경우

- 새 메시지 이벤트가 들어왔을 때 thread list cache의 unreadCount를 +1 하면 서버 값과 어긋날 수 있습니다.
- 어느 쪽을 우선시할지 정책을 정하세요. (다음 fetch에서 서버 값으로 보정 / 항상 서버 값을 fetch하지 않고 client만 누적)

## 9. URL에 잘못된 값이 들어온 경우

- `/inbox?sort=banana` 같은 잘못된 query.
- 무시하고 기본값으로 fallback해야 합니다. 절대로 throw해서 화면을 깨뜨리면 안 됩니다.
