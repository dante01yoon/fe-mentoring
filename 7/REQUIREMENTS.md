# 7회차 요구기획서 — Kanban Board

이 문서는 7회차 과제의 소스 오브 트루스입니다. README보다 자세하며, 구현 중 모호한 지점이 생기면 이 문서를 우선합니다.

현재 scaffold는 요구사항을 만족하는 완성 앱이 아닙니다. 멘티는 이 문서의 요구사항을 읽고, 제공된 타입/API/mock server를 바탕으로 기능을 직접 구현해야 합니다.

---

## 1. 제품 맥락

팀은 작은 제품 개발 보드를 운영하고 있습니다. 사용자는 카드의 우선순위, 담당자, 라벨, 진행 상태를 보며 작업을 옮깁니다. 보드는 단순 개인 TODO 앱이 아니라 여러 명이 함께 쓰는 업무 도구입니다.

이 맥락 때문에 다음이 중요합니다.

- 카드를 옮기는 순간 UI는 즉시 반응해야 합니다.
- 서버 저장 실패나 충돌은 사용자에게 명확히 보여야 합니다.
- 현재 필터/선택 카드 상태는 링크로 공유 가능해야 합니다.
- column별 WIP limit은 업무 규칙으로 취급해야 합니다.
- drag-and-drop은 mouse/pointer 전용 기능이 아니어야 합니다.

---

## 2. 기술 스택

필수:

- React 18
- TypeScript
- Vite
- TanStack Query
- @dnd-kit/core
- @dnd-kit/sortable
- MSW
- Vitest
- Playwright

금지:

- 별도 백엔드 서버
- Redux/Zustand 같은 전역 상태 관리 라이브러리 선도입
- drag-and-drop을 위한 별도 거대 UI 프레임워크
- 과제 목적과 무관한 인증/권한 시스템 구현

---

## 3. 핵심 사용자 시나리오

### 3.1 보드 조회

사용자는 `/board`에 들어오면 5개 column과 카드 목록을 봅니다.

필수 조건:

- loading 상태가 있어야 합니다.
- 실패 시 retry 가능한 error state가 있어야 합니다.
- empty scenario에서 빈 column이 깨지지 않아야 합니다.
- large-board scenario에서 화면이 지나치게 느려지지 않아야 합니다.

### 3.2 카드 이동

사용자는 카드를 같은 column 안에서 reorder하거나 다른 column으로 이동할 수 있습니다.

필수 조건:

- drag 시작 시 active 카드가 시각적으로 구분됩니다.
- drag 중 drop 가능한 column이 구분됩니다.
- drop 후 UI가 즉시 새 위치를 보여줍니다.
- 서버 저장 요청은 `PATCH /api/kanban/cards/:cardId/move`를 사용합니다.
- 저장 성공 후 서버가 반환한 card version과 board revision을 반영합니다.
- 저장 실패 후 이전 snapshot으로 rollback합니다.

### 3.3 충돌 복구

사용자가 카드를 옮기는 사이 다른 사용자가 같은 카드를 먼저 옮길 수 있습니다.

필수 조건:

- request에는 `expectedVersion`이 포함되어야 합니다.
- 서버가 409를 반환하면 "내가 본 카드가 오래됨"을 알 수 있어야 합니다.
- 사용자는 서버 최신 상태로 새로고침하거나, 내 이동을 다시 시도할 수 있어야 합니다.
- 단순히 조용히 invalidate만 하는 것은 충분하지 않습니다.

### 3.4 WIP limit

`todo`, `in_progress`, `review` column에는 WIP limit이 있습니다.

필수 조건:

- 현재 카드 수와 limit을 column header에 표시합니다.
- 초과 상태는 시각적으로 드러나야 합니다.
- 카드를 초과 column으로 옮길 때 정책을 명확히 선택합니다.

허용 정책:

- hard block: drop 자체를 막음
- soft warning: 이동은 허용하되 경고 표시
- server reject: optimistic 이동 후 서버가 거절하고 rollback

선택한 정책은 README나 PR 설명에 적어야 합니다.

### 3.5 상세 drawer

사용자는 카드를 클릭해 상세 drawer를 엽니다.

필수 조건:

- URL query `cardId`가 drawer의 source of truth입니다.
- `/board?cardId=card_002`로 직접 들어오면 해당 drawer가 열립니다.
- 닫으면 `cardId`가 URL에서 제거됩니다.
- 필터 변경 후 선택 카드가 결과에서 사라지는 경우 정책이 있어야 합니다.
- focus 관리와 Escape 닫기를 고려해야 합니다.

### 3.6 필터

사용자는 카드 검색/필터를 사용할 수 있습니다.

필수 필터:

- `query`
- `assigneeId`
- `labelId`
- `priority`

필수 조건:

- 필터는 URL query와 동기화됩니다.
- 새로고침해도 같은 필터가 유지됩니다.
- 검색어 입력은 불필요한 API 요청을 만들지 않도록 submit 또는 debounce 정책이 있어야 합니다.

---

## 4. 상태 모델

구현에서 상태를 섞지 않는 것이 중요합니다.

| 상태 | 위치 | 예 |
| --- | --- | --- |
| Server state | TanStack Query | board, cards, labels, members |
| URL state | React Router search params | query, assigneeId, labelId, priority, cardId |
| Drag transient state | local component state / @dnd-kit | activeId, overId |
| Mutation snapshot | TanStack Query mutation context | rollback용 previous board |
| Derived state | memoized selector | column별 cards, WIP 초과 여부 |

주의:

- drag 중인 위치를 곧바로 서버 상태로 취급하지 마세요.
- optimistic 상태와 서버 최신 상태를 구분하세요.
- URL에서 복원 가능한 상태와 복원하면 안 되는 transient 상태를 분리하세요.

---

## 5. API 요구사항

전체 API는 [`challenge/api-contract.md`](./challenge/api-contract.md)에 정의되어 있습니다.

필수 구현 흐름:

1. `GET /api/kanban/board`로 보드를 조회합니다.
2. drag가 끝나면 `MoveCardRequest`를 만듭니다.
3. `PATCH /api/kanban/cards/:cardId/move`를 호출합니다.
4. 성공하면 cache를 서버 응답 기준으로 정규화합니다.
5. 실패하면 mutation context의 snapshot으로 rollback합니다.

---

## 6. 테스트 요구사항

최소 단위 테스트:

- 같은 column reorder
- 다른 column 이동
- before/after id 계산
- optimistic update
- rollback
- stale-version conflict 처리
- URL filter parse/serialize

최소 E2E:

- 기본 보드 렌더링
- pointer drag로 column 이동
- keyboard 또는 대체 버튼으로 카드 이동
- move-failure rollback
- stale-version conflict 안내

---

## 7. 평가 기준 요약

| 항목 | 비중 |
| --- | ---: |
| drag-and-drop 정확도 | 25 |
| optimistic update / rollback | 25 |
| 상태 분리와 URL 동기화 | 20 |
| 충돌/WIP/실패 edge case | 15 |
| 접근성과 UX 완성도 | 10 |
| 테스트 품질 | 5 |
