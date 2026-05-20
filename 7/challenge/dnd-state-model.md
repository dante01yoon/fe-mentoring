# Drag-and-Drop State Model Guide

드래그앤드롭 구현의 핵심은 "이벤트를 데이터 명령으로 번역하는 것"입니다.

---

## 1. 권장 데이터 흐름

```text
Pointer/Keyboard event
  → @dnd-kit DragEndEvent
  → active card / over target 판별
  → calculateMoveTarget(...)
  → MoveCardRequest
  → optimistic cache update
  → PATCH /move
  → success normalize or rollback
```

---

## 2. 구분해야 하는 id

| id | 예 | 의미 |
| --- | --- | --- |
| active id | `card_002` | 사용자가 들고 있는 카드 |
| over id | `todo` 또는 `card_003` | 현재 drop 대상 |
| from column | `todo` | 이동 전 column |
| to column | `review` | 이동 후 column |
| before/after card | `card_004` | 서버가 순서를 계산할 힌트 |

`over.id`가 항상 column이라고 가정하면 같은 column reorder가 깨집니다. card 위에 drop했는지, 빈 column 영역에 drop했는지 구분해야 합니다.

---

## 3. 순수 함수로 분리할 것

`boardOrdering.ts`에 다음 식의 함수를 구현하는 것을 권장합니다.

```ts
type MoveTarget = {
  fromColumnId: ColumnId;
  toColumnId: ColumnId;
  beforeCardId: string | null;
  afterCardId: string | null;
};

function calculateMoveTarget(args: {
  activeCardId: string;
  overId: string;
  cardsByColumn: Record<ColumnId, KanbanCard[]>;
  columns: KanbanColumn[];
}): MoveTarget | null;
```

이 함수를 분리하면 DnD 라이브러리 없이도 대부분의 이동 규칙을 Vitest로 검증할 수 있습니다.

---

## 4. Optimistic update 규칙

1. mutation 시작 전 board query를 cancel합니다.
2. 현재 board snapshot을 저장합니다.
3. query cache에서 카드를 즉시 이동합니다.
4. 실패하면 snapshot으로 되돌립니다.
5. 성공하면 서버가 반환한 `card`와 `boardRevision`을 반영합니다.

주의:

- `invalidateQueries`만으로 rollback을 대체하지 마세요.
- 느린 네트워크에서는 사용자가 같은 카드를 다시 옮길 수 있습니다.
- 같은 카드의 pending move가 여러 개일 때 어떤 요청이 최신인지 정책이 필요합니다.

---

## 5. Keyboard 접근성

@dnd-kit의 `KeyboardSensor`를 쓰면 시작점은 마련됩니다. 하지만 충분하지 않습니다.

검토할 것:

- drag handle에 명확한 label이 있는가?
- keyboard로 카드 이동을 시작/취소할 수 있는가?
- 이동 후 focus가 사라지지 않는가?
- screen reader 사용자가 현재 위치를 알 수 있는가?
- pointer drag가 어려운 사용자를 위한 move button 대안이 있는가?
