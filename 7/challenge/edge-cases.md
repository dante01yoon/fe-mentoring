# Edge Cases

최소 5개 이상을 실제로 처리하고, 선택한 케이스를 PR 설명이나 제출 메모에 적습니다.

## Drag-and-drop

- 같은 column에서 첫 번째 카드를 마지막으로 옮김
- 같은 column에서 마지막 카드를 첫 번째로 옮김
- 빈 column으로 카드 이동
- card 위가 아니라 column 빈 영역에 drop
- drag 시작 후 Escape로 취소
- drag 중 필터 결과가 바뀜
- 이미 선택된 drawer 카드가 다른 column으로 이동됨

## 서버 상태

- move API 500 후 rollback
- move API 409 후 conflict 안내
- move 요청 중 같은 카드 다시 이동
- move 요청 성공 후 board refetch에서 다른 순서가 내려옴
- board-error 후 retry
- slow network에서 loading/saving 표시

## 업무 규칙

- WIP limit 초과 column으로 이동
- done column에서 다시 in_progress로 되돌림
- urgent 카드가 done으로 이동됨
- due date가 지난 카드가 이동됨

## URL state

- `/board?cardId=card_002` 직접 접근
- 존재하지 않는 `cardId`
- 필터 때문에 선택 카드가 목록에서 사라짐
- 검색어 지운 뒤 query param 제거
- 브라우저 뒤로가기로 drawer 닫기

## 접근성

- keyboard만으로 카드 이동
- drag 후 focus 유지
- drawer 열림/닫힘 focus 복구
- reduced motion 환경
- 작은 viewport에서 horizontal board scroll
