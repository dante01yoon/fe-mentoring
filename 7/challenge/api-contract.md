# API Contract

MSW가 이 계약을 구현합니다. 멘티는 실제 백엔드를 만들지 않고 이 계약에 맞춰 클라이언트 코드를 작성합니다.

Base URL은 같은 origin입니다.

```text
/api/kanban/*
```

---

## 1. 공통 에러 형태

```ts
type ApiErrorResponse = {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
};
```

주요 에러 코드:

| code | status | 의미 |
| --- | ---: | --- |
| `BOARD_UNAVAILABLE` | 500 | 보드 조회 실패 |
| `MOVE_FAILED` | 500 | 카드 이동 저장 실패 |
| `CARD_NOT_FOUND` | 404 | 카드 없음 |
| `STALE_CARD_VERSION` | 409 | 클라이언트가 본 카드 버전이 오래됨 |

---

## 2. 도메인 타입

```ts
type ColumnId = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
type Priority = 'low' | 'medium' | 'high' | 'urgent';
type CardType = 'feature' | 'bug' | 'chore' | 'research';
```

```ts
type KanbanCard = {
  id: string;
  title: string;
  description: string;
  type: CardType;
  columnId: ColumnId;
  assigneeId?: string;
  labelIds: string[];
  priority: Priority;
  dueDate?: string;
  position: number;
  version: number;
  createdAt: string;
  updatedAt: string;
};
```

`version`은 충돌 감지를 위한 필수 필드입니다. 클라이언트는 이동 요청마다 자신이 본 `version`을 `expectedVersion`으로 보내야 합니다.

---

## 3. GET /api/kanban/bootstrap

초기 form option과 사용자 정보를 조회합니다.

### Response

```ts
type BootstrapResponse = {
  me: Member;
  members: Member[];
  labels: BoardLabel[];
  priorities: Priority[];
  cardTypes: CardType[];
};
```

### 사용 위치

- filter option
- assignee select
- label select
- card create/edit form

---

## 4. GET /api/kanban/board

보드와 카드 목록을 조회합니다.

### Query parameters

| name | type | 설명 |
| --- | --- | --- |
| `query` | string | title/description 검색 |
| `assigneeId` | string | 담당자 필터 |
| `labelId` | string | 라벨 필터 |
| `priority` | `Priority` | 우선순위 필터 |
| `due` | `overdue | today | week` | 마감일 필터 |

### Response

```ts
type BoardResponse = {
  board: Board;
  cards: KanbanCard[];
  members: Member[];
  labels: BoardLabel[];
  serverTime: string;
};
```

### 실패

`board-error` scenario:

```json
{
  "message": "보드 데이터를 불러오지 못했습니다.",
  "code": "BOARD_UNAVAILABLE"
}
```

---

## 5. PATCH /api/kanban/cards/:cardId/move

카드 이동을 저장합니다.

### Request

```ts
type MoveCardRequest = {
  cardId: string;
  fromColumnId: ColumnId;
  toColumnId: ColumnId;
  beforeCardId?: string | null;
  afterCardId?: string | null;
  expectedVersion: number;
  clientMutationId: string;
};
```

### 필드 의미

| field | 의미 |
| --- | --- |
| `cardId` | 이동한 카드 |
| `fromColumnId` | drag 시작 시 카드가 있던 column |
| `toColumnId` | drop된 column |
| `beforeCardId` | 이동 후 바로 앞 카드. 없으면 null |
| `afterCardId` | 이동 후 바로 뒤 카드. 없으면 null |
| `expectedVersion` | 사용자가 이동 전 본 card.version |
| `clientMutationId` | 중복 요청/dedupe 추적용 클라이언트 id |

### Response

```ts
type MoveCardResponse = {
  card: KanbanCard;
  boardRevision: string;
};
```

### 실패: move-failure

```json
{
  "message": "카드 이동 저장에 실패했습니다.",
  "code": "MOVE_FAILED"
}
```

클라이언트 기대 동작:

- optimistic 위치를 이전 snapshot으로 rollback
- 사용자에게 저장 실패를 알림
- 재시도 가능해야 함

### 실패: stale-version

```json
{
  "message": "카드가 다른 사용자에 의해 먼저 변경되었습니다.",
  "code": "STALE_CARD_VERSION",
  "details": {
    "serverCard": {
      "id": "card_004",
      "version": 2
    }
  }
}
```

클라이언트 기대 동작:

- 조용히 무시하지 않음
- 서버 최신 상태와 내 시도 사이 충돌을 설명
- 최신 상태로 새로고침하거나 다시 이동할 수 있는 경로 제공

---

## 6. POST /api/kanban/cards

새 카드를 생성합니다.

### Request

```ts
type CreateCardRequest = {
  title: string;
  description?: string;
  columnId: ColumnId;
  assigneeId?: string;
  labelIds?: string[];
  priority?: Priority;
  type?: CardType;
  dueDate?: string;
};
```

### Response

```ts
type CreateCardResponse = {
  card: KanbanCard;
  boardRevision: string;
};
```

이 endpoint는 scaffold에 포함되어 있지만 필수 구현의 중심은 아닙니다. 시간이 부족하면 카드 생성보다 move/rollback을 우선합니다.

---

## 7. Scenario별 서버 동작

| scenario | board | move | create |
| --- | --- | --- | --- |
| `default` | 6개 카드 | 성공 | 성공 |
| `slow` | 지연 후 성공 | 지연 후 성공 | 지연 후 성공 |
| `empty` | 빈 카드 목록 | 성공 | 성공 |
| `board-error` | 500 | 호출 가능하나 보통 도달하지 않음 | 성공 |
| `move-failure` | 성공 | 500 | 성공 |
| `stale-version` | 성공 | 409 | 성공 |
| `large-board` | 240개 카드 | 성공 | 성공 |
