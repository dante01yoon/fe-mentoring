# Kanban Board — 7회차 스캐폴드

7회차 프론트엔드 멘토링 과제 scaffold입니다. 이 저장소는 정답 앱이 아니라 **출발점**입니다. 기본 화면 shell, 타입, MSW mock API, drag-and-drop 라이브러리 의존성만 제공합니다. 실제 drag-and-drop, optimistic update, rollback, URL 필터, drawer 상세 구현은 멘티가 직접 작성해야 하며 핵심 위치는 `TODO(student)`로 남아 있습니다.

전체 요구기획서는 [`REQUIREMENTS.md`](./REQUIREMENTS.md)가 소스 오브 트루스입니다. 이 README에도 멘티가 바로 과제를 시작할 수 있도록 핵심 요구사항, 구현 범위, 제출 기준을 함께 적어둡니다.

---

## 1. 이 과제는 왜 존재하는가

칸반 보드는 겉보기에는 "카드를 끌어서 옮기는 UI"처럼 보입니다. 하지만 실제 제품에서는 다음 문제가 한꺼번에 붙습니다.

- drag 중인 카드와 실제 데이터 상태가 다를 수 있고
- 사용자는 저장 응답을 기다리지 않고 다음 행동을 하며
- 서버 저장이 실패하면 방금 본 UI를 되돌려야 하고
- 다른 사용자가 같은 카드를 먼저 옮기면 충돌을 복구해야 하고
- column별 WIP limit 같은 업무 규칙이 UI와 서버 양쪽에 걸쳐 있고
- 상세 drawer, 필터, 선택 카드가 URL과 동기화되어야 하며
- 키보드 사용자도 같은 이동 작업을 할 수 있어야 합니다.

이 과제는 예쁜 보드 UI가 목적이 아닙니다.

> 목적은 **drag-and-drop interaction을 서버 상태, optimistic update, rollback, URL state, 접근성과 함께 안전하게 설계하는 능력**을 보는 것입니다.

---

## 2. 검증하려는 역량

| 검증 대상 | 왜 검증하는가 | 어디서 드러나는가 |
| --- | --- | --- |
| Drag-and-drop 상태 모델링 | drag UI 이벤트를 도메인 이동 명령으로 바꾸는 경계가 가장 자주 깨짐 | `KanbanBoard`, `boardOrdering.ts` |
| @dnd-kit 사용 | pointer, keyboard, overlay, collision 처리를 직접 조합해야 함 | `dnd/SortableCard.tsx`, `KanbanColumn.tsx` |
| Optimistic update | 드롭 직후 UI가 반응해야 운영 도구처럼 느껴짐 | `useMoveCardMutation.ts` |
| Rollback 처리 | PATCH 실패 시 잘못된 위치를 계속 보여주면 사용자가 신뢰를 잃음 | `move-failure` scenario |
| Version conflict 복구 | 협업 도구는 같은 카드를 여러 사용자가 만질 수 있음 | `stale-version` scenario |
| URL state | 필터와 선택 카드가 새로고침/공유/뒤로가기에 살아 있어야 함 | `urlState.ts`, `CardDetailDrawer.tsx` |
| WIP limit | 단순 UI 이동이 아니라 업무 규칙까지 반영해야 함 | `KanbanColumn.tsx`, API contract |
| 접근성 | drag는 마우스 전용 기능이 되기 쉬움 | keyboard sensor, e2e TODO |
| 테스트 가능한 분리 | DnD 이벤트와 순수 ordering 로직을 분리하지 않으면 테스트가 어려움 | `__tests__/boardOrdering.test.ts` |

---

## 3. 제공된 구조

```text
7/
├── README.md
├── REQUIREMENTS.md
├── challenge/
│   ├── api-contract.md
│   ├── dnd-state-model.md
│   ├── edge-cases.md
│   ├── overview.md
│   ├── requirements.md
│   ├── rubric.md
│   └── submission-checklist.md
├── e2e/
│   └── kanban.spec.ts
├── public/
├── src/
│   ├── app/
│   ├── features/kanban/
│   │   ├── api/
│   │   ├── components/
│   │   ├── dnd/
│   │   ├── hooks/
│   │   ├── model/
│   │   └── utils/
│   ├── mocks/
│   │   ├── fixtures/
│   │   ├── browser.ts
│   │   ├── handlers.ts
│   │   └── scenarios.ts
│   ├── shared/
│   └── styles/
└── package.json
```

이 구조는 5회차의 `feature + MSW + challenge docs` 흐름을 따릅니다. 다만 완성 앱이 아니라 과제 보일러플레이트이므로 `src/features/kanban/components`는 화면 배치와 TODO 안내만 갖고 있습니다.

---

## 4. 화면 요구사항

기본 경로:

```text
/board
/board?query=filter&assigneeId=mem_001&labelId=lbl_frontend&priority=high&cardId=card_002
```

화면 구성:

```text
┌───────────────────────────────────────────────────────────────┐
│ BoardToolbar / Search / New Card / BoardStatus / Error Banner │
├────────────┬────────────┬────────────┬────────────┬───────────┤
│ Backlog    │ Todo       │ In Progress│ Review     │ Done      │
│ cards      │ cards      │ cards      │ cards      │ cards     │
└────────────┴────────────┴────────────┴────────────┴───────────┘
                                      ┌─────────────────────────┐
                                      │ CardDetailDrawer        │
                                      └─────────────────────────┘
```

---

## 5. 과제 요구사항

멘티는 제공된 스캐폴드를 바탕으로 아래 요구사항을 직접 구현해야 합니다. 현재 코드에는 요구사항을 만족하는 정답 로직이 들어 있지 않습니다.

### 5.1 보드 조회

- `/board` 경로에서 5개 column을 렌더링합니다.
- `GET /api/kanban/board` 응답을 사용해 카드 목록을 column별로 보여줍니다.
- loading, empty, error 상태를 각각 처리합니다.
- `board-error` scenario에서 retry 가능한 error UI를 보여줍니다.
- `large-board` scenario에서 카드가 많아도 화면이 사용할 수 없을 정도로 느려지지 않아야 합니다.

### 5.2 Drag-and-drop

- `@dnd-kit/core`, `@dnd-kit/sortable`을 사용해 카드 이동을 구현합니다.
- 같은 column 안에서 카드 순서를 바꿀 수 있어야 합니다.
- 다른 column으로 카드를 옮길 수 있어야 합니다.
- 빈 column에도 카드를 drop할 수 있어야 합니다.
- drag 중인 카드와 drop 가능한 영역이 시각적으로 구분되어야 합니다.
- pointer drag뿐 아니라 keyboard 조작 또는 명확한 대체 이동 조작을 제공해야 합니다.

### 5.3 서버 저장과 optimistic update

- drop 직후 UI를 먼저 변경해 사용자에게 즉시 반응을 보여줍니다.
- 카드 이동 저장은 `PATCH /api/kanban/cards/:cardId/move`를 사용합니다.
- 요청에는 `fromColumnId`, `toColumnId`, `beforeCardId`, `afterCardId`, `expectedVersion`, `clientMutationId`를 포함합니다.
- 저장 성공 시 서버가 반환한 `card.version`과 `boardRevision`을 반영합니다.
- `move-failure` scenario에서 저장 실패 시 이전 board snapshot으로 rollback합니다.
- rollback이 발생했음을 사용자가 알 수 있어야 합니다.

### 5.4 버전 충돌 처리

- 카드 이동 요청에는 사용자가 이동 전에 본 `card.version`을 `expectedVersion`으로 보냅니다.
- `stale-version` scenario에서 서버가 409를 반환하면 충돌 상태를 사용자에게 설명합니다.
- 사용자는 최신 서버 상태로 새로고침하거나 이동을 다시 시도할 수 있어야 합니다.
- 409를 조용히 무시하거나 단순 refetch만 하는 방식은 요구사항을 만족하지 않습니다.

### 5.5 WIP limit

- `todo`, `in_progress`, `review` column의 WIP limit을 표시합니다.
- 현재 카드 수가 limit을 초과하면 시각적으로 구분합니다.
- limit을 초과하는 이동을 어떻게 처리할지 정책을 정하고 구현합니다.

허용되는 정책:

- hard block: drop 자체를 막습니다.
- soft warning: 이동은 허용하되 경고를 보여줍니다.
- server reject: optimistic 이동 후 서버 실패처럼 rollback합니다.

선택한 정책은 제출 메모에 적어야 합니다.

### 5.6 URL state와 상세 drawer

- `query`, `assigneeId`, `labelId`, `priority` 필터를 URL query와 동기화합니다.
- 새로고침해도 같은 필터가 유지되어야 합니다.
- 카드 클릭 시 `cardId`를 URL query에 넣고 상세 drawer를 엽니다.
- `/board?cardId=card_002`로 직접 접근하면 drawer가 열린 상태로 시작해야 합니다.
- drawer를 닫으면 URL에서 `cardId`를 제거합니다.
- 필터 변경 후 선택 카드가 결과에서 사라지는 경우의 정책을 정합니다.
- drawer는 focus 관리와 Escape 닫기를 고려해야 합니다.

### 5.7 테스트

- `boardOrdering.ts`의 순수 이동 계산 로직을 단위 테스트로 검증합니다.
- optimistic update, rollback, stale-version 처리 테스트를 작성합니다.
- URL parse/serialize 테스트를 작성합니다.
- Playwright로 최소 1개 이상의 실제 카드 이동 시나리오를 검증합니다.
- 기존 `it.todo`와 `test.skip`은 제출 전 의미 있는 테스트로 바꿔야 합니다.

---

## 6. 멘티가 채워야 할 핵심 TODO

| 위치 | 무엇을 구현해야 하는가 | 왜 중요한가 |
| --- | --- | --- |
| `src/features/kanban/components/KanbanBoard.tsx` | `DragEndEvent`를 실제 move command로 변환 | UI 이벤트와 서버 계약을 잇는 핵심 |
| `src/features/kanban/utils/boardOrdering.ts` | 같은 column reorder, 다른 column 이동, before/after 계산 | 테스트 가능한 순수 로직 |
| `src/features/kanban/hooks/useMoveCardMutation.ts` | optimistic cache update, rollback, success normalization | 운영 도구다운 즉시 반응과 신뢰성 |
| `src/features/kanban/utils/urlState.ts` | 필터와 선택 카드의 URL 정책 확정 | 공유 링크, 새로고침, 뒤로가기 안정성 |
| `src/features/kanban/components/CardDetailDrawer.tsx` | 상세 편집, focus 관리, Escape 닫기 | 실제 업무 화면의 깊이 |
| `src/features/kanban/components/BoardToolbar.tsx` | assignee/label/priority 필터, 새 카드 진입점 | 검색/필터 UX |
| `src/features/kanban/components/KanbanColumn.tsx` | WIP limit 표시와 이동 제한 정책 | 업무 규칙 반영 |
| `src/features/kanban/dnd/SortableCard.tsx` | drag handle, keyboard instruction, overlay polish | 접근성/상호작용 품질 |
| `src/mocks/handlers.ts` | 필요 시 scenario 확장 | 실패/충돌/대용량 검증 |
| `src/features/kanban/__tests__/*` | `it.todo`를 실제 테스트로 전환 | 회귀 방지 |
| `e2e/kanban.spec.ts` | 실제 drag/keyboard/rollback 시나리오 추가 | 브라우저 동작 검증 |

---

## 7. Mock API

MSW가 서버 역할을 합니다. 실제 백엔드는 만들지 않습니다.

| Method | Path | 용도 |
| --- | --- | --- |
| GET | `/api/kanban/bootstrap` | 멤버, 라벨, priority, 카드 타입 |
| GET | `/api/kanban/board` | 보드, column, card 목록 조회 |
| PATCH | `/api/kanban/cards/:cardId/move` | 카드 이동 저장 |
| POST | `/api/kanban/cards` | 카드 생성 |

전체 계약은 [`challenge/api-contract.md`](./challenge/api-contract.md)에 있습니다.

---

## 8. Scenario 시스템

`VITE_KANBAN_SCENARIO`로 mock server 동작을 바꿉니다.

| scenario | 동작 | 검증 목적 |
| --- | --- | --- |
| `default` | 기본 데이터와 정상 응답 | happy path |
| `slow` | API 응답 지연 | loading, saving, stale UI |
| `empty` | 카드 없는 보드 | empty state |
| `board-error` | 보드 조회 500 | 초기 로딩 실패 복구 |
| `move-failure` | 카드 이동 PATCH 500 | optimistic rollback |
| `stale-version` | 카드 이동 PATCH 409 | 협업 충돌 복구 |
| `large-board` | 240개 카드 | 렌더링/drag 성능 |

실행 예:

```bash
pnpm dev
pnpm dev:slow
pnpm dev:move-failure
pnpm dev:stale-version
pnpm dev:large-board
```

---

## 9. 실행 방법

```bash
pnpm install
pnpm dev          # http://localhost:5177/board
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

처음 스캐폴드는 smoke test와 `it.todo` 중심입니다. `pnpm test`가 통과한다고 과제가 끝난 것이 아닙니다. 멘티는 TODO 테스트를 실제 테스트로 바꿔야 합니다.

---

## 10. 권장 구현 순서

1. `boardOrdering.ts`에 순수 이동 계산 함수를 먼저 작성합니다.
2. `boardOrdering.test.ts`의 TODO를 실제 테스트로 바꿉니다.
3. `KanbanBoard.tsx`에서 `DragEndEvent`를 move request로 변환합니다.
4. `useMoveCardMutation.ts`에 optimistic update와 rollback을 구현합니다.
5. `move-failure`, `stale-version` scenario를 수동으로 검증합니다.
6. WIP limit 정책을 정합니다. 막을지, 경고만 할지, 서버에서 거절할지 명확히 합니다.
7. `CardDetailDrawer`의 URL/focus/Escape 동작을 마무리합니다.
8. keyboard drag와 e2e test를 추가합니다.
9. `large-board`에서 성능을 확인하고 필요한 경우 렌더링 최적화를 합니다.

---

## 11. 하지 말아야 할 것

| 금지 | 이유 |
| --- | --- |
| 백엔드 서버 구현 | 학습 목표는 클라이언트 상태/상호작용입니다. MSW로 충분합니다. |
| Redux/Zustand 먼저 도입 | TanStack Query + URL state + local state 경계를 먼저 이해해야 합니다. |
| 카드 이동을 DOM 순서만 보고 처리 | 서버 계약과 재조회 후 상태가 깨집니다. |
| 실패 시 `invalidateQueries`만 호출 | 사용자가 본 위치가 왜 되돌아갔는지 설명되지 않습니다. |
| pointer drag만 구현 | keyboard 사용자와 테스트 자동화가 빠집니다. |
| 대형 디자인 시스템 도입 | 과제의 핵심이 흐려집니다. |

---

## 12. 제출 전 체크리스트

- [ ] `/board`에서 모든 column이 렌더링됨
- [ ] loading, empty, error 상태 처리
- [ ] 같은 column 안에서 카드 순서 변경 가능
- [ ] 다른 column으로 카드 이동 가능
- [ ] 빈 column으로 카드 이동 가능
- [ ] 이동 직후 optimistic UI 반영
- [ ] `move-failure`에서 rollback
- [ ] rollback 또는 저장 실패가 사용자에게 표시됨
- [ ] `stale-version`에서 충돌 안내와 복구
- [ ] WIP limit 초과 정책이 UI/서버 관점에서 일관됨
- [ ] `cardId` URL로 drawer 열림/닫힘
- [ ] search/assignee/label/priority 필터가 URL과 동기화됨
- [ ] keyboard drag 또는 대체 이동 조작 제공
- [ ] `pnpm typecheck`, `pnpm build`, `pnpm test` 통과
- [ ] 최소 1개 이상의 Playwright drag 시나리오 통과

---

## 13. 평가 기준

자세한 기준은 [`challenge/rubric.md`](./challenge/rubric.md)를 참고하세요.
