# 과제 개요

> 이 과제는 채팅 UI를 예쁘게 만드는 과제가 아닙니다. REST 초기 데이터, 실시간 이벤트, optimistic update, reconnect/backfill, local draft를 하나의 일관된 화면 상태로 병합할 수 있는지 보는 과제입니다.

## 만들어야 하는 것

3-column 운영 콘솔 화면입니다. 좌측에 스레드 목록, 가운데 메시지/composer, 우측에 고객 정보가 들어갑니다. 화면 위쪽에는 검색/필터/saved view, realtime 연결 상태 배너가 위치합니다.

## 핵심 도전 과제

1. **상태 모델링**
   - URL state, server state, realtime state, local state, derived state를 분리해서 다루세요.
   - 각 상태가 “어디 살고 있는지”를 명확하게 만드는 것이 가장 중요한 평가 포인트입니다.

2. **이벤트 병합**
   - `MockRealtimeClient`가 scenario에 따라 다양한 이벤트를 emit합니다.
   - 동일한 eventId가 두 번 들어와도, 순서가 뒤섞여 있어도, 연결이 끊겼다 돌아와도 화면 상태는 깨지지 않아야 합니다.

3. **optimistic update**
   - 메시지 전송 시 응답을 기다리지 말고 sending 상태 placeholder를 먼저 보여주세요.
   - 응답 성공 시 server message로 교체, 실패 시 failed로 표시하고 retry 가능해야 합니다.

4. **partial failure**
   - `customer-error` scenario에서 고객 조회가 실패해도 thread/messages 화면은 정상 동작해야 합니다.
   - 화면 영역별로 에러 경계를 따로 둘 것.

## 무엇이 평가되는가

- 정답에 가까운 화면이 보이는지가 아니라, **상태 흐름이 일관되고 예측 가능한지**.
- 실패 시 사용자가 다음 동작을 알 수 있는지.
- 멘티가 비즈니스 요구사항이 바뀌었을 때 어디를 고치면 되는지 설명할 수 있는지.

## 학습 후 도착해야 하는 곳

- 같은 데이터를 “REST로 받은 결과”와 “실시간 이벤트의 결과”로 같은 모양으로 다룰 수 있어야 합니다.
- 실패는 “전체가 깨진다”가 아니라 “특정 영역만 깨진다”로 표현할 수 있어야 합니다.
- 멘티가 본 코드를 6개월 뒤에 다시 봤을 때 “여기가 server cache, 여기가 realtime, 여기가 local”라고 말할 수 있어야 합니다.
