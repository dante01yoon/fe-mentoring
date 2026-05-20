# Challenge Requirements

## 필수 구현

1. `/board`에서 보드와 카드 목록을 렌더링합니다.
2. 같은 column 안에서 카드 순서를 바꿀 수 있어야 합니다.
3. 다른 column으로 카드를 옮길 수 있어야 합니다.
4. drop 직후 optimistic UI를 적용합니다.
5. move API 실패 시 rollback합니다.
6. stale-version 409 응답을 사용자에게 설명합니다.
7. WIP limit 초과 정책을 구현하고 문서화합니다.
8. card detail drawer를 `cardId` URL state와 연결합니다.
9. query/assignee/label/priority 필터를 URL과 연결합니다.
10. 최소 테스트 요구사항을 충족합니다.

## 선택 구현

- 카드 생성 form
- 카드 상세 edit form
- activity log
- column collapse
- drag 중 auto-scroll polish
- virtualization

선택 구현은 필수 기능을 안정적으로 만든 뒤에 진행합니다.
