# Unified Inbox Console — 5회차 스캐폴드

5회차 프론트엔드 멘토링 과제 scaffold입니다. **이 저장소는 정답 앱이 아니라 출발점**이며, 핵심 로직은 모두 `TODO(student)` 자리로 남아 있습니다.

전체 요구기획서는 [`REQUIREMENTS.md`](./REQUIREMENTS.md)가 소스 오브 트루스입니다. 이 README는 **무엇을 / 왜 / 어떻게** 만드는지 멘티가 한눈에 파악할 수 있도록 정리한 문서입니다.

---

## 1. 이 과제는 왜 존재하는가

운영 콘솔 화면은 프론트엔드에서 가장 까다로운 부류에 속합니다. 한 화면 안에서 다음이 동시에 일어납니다.

- REST 초기 데이터로 그려진 후
- WebSocket(또는 SSE) 이벤트가 일부 영역만 갱신하고
- 사용자가 입력한 메시지는 서버 응답이 오기 전부터 보여야 하고 (optimistic)
- 네트워크가 잠시 끊겼다 돌아오면 누락된 이벤트를 backfill해야 하고
- 일부 패널만 실패하면 나머지는 살아 있어야 하고
- URL · localStorage · 서버 saved view 가 동일한 필터를 두고 충돌할 수 있고
- 5,000개 스레드가 들어와도 화면이 죽지 않아야 합니다.

대부분의 튜토리얼은 이 중 하나만 다룹니다. 5회차는 이 모두를 **하나의 일관된 화면 상태로 합치는 능력**을 검증하는 것이 목적입니다.

> 이 과제는 채팅 UI를 예쁘게 만드는 과제가 아닙니다.
> 여러 데이터 source(REST · realtime · 사용자 입력 · localStorage · URL)를 한 화면 상태로 일관되게 묶어내는 설계 능력을 보는 과제입니다.

---

## 2. 검증하려는 역량 (왜 이런 요구를 하는가)

| 검증 대상 | 왜 검증하는가 | 어디서 드러나는가 |
| --- | --- | --- |
| REST 초기 데이터 + realtime 이벤트 병합 | 운영 콘솔의 본질이자, 가장 흔하게 깨지는 지점 | `useThreads`, `useThreadMessages`, `useInboxRealtime` |
| 서버 / 로컬 / optimistic 상태 분리 | 셋을 섞으면 race condition · UI 깜빡임 · 잘못된 진실의 원천이 발생 | `MessagePanel`, `MessageComposer`, `useMessageDraft` |
| optimistic update / 실패 / retry | "보내기" 누른 직후 즉시 반응하지 않으면 운영자 입장에서 쓸 수 없음 | `MessageComposer`, `MessagePanel` |
| reconnect 후 backfill 설계 | 네트워크 끊김은 production에서 가장 자주 발생하는 사고이며, 이때 데이터를 잃지 않는 게 콘솔의 신뢰도 | `useInboxRealtime`, `GET /api/inbox/events?after=...` |
| event dedupe | 재연결 후 동일 이벤트가 두 번 들어오는 것은 서버 보장 사항이 아니라 **클라이언트가 막아야** 함 | `eventDedupe.ts` |
| partial failure 처리 | 고객 정보 API 하나가 죽었다고 인박스 전체가 죽으면 안 됨 | `CustomerInfoPanel`, panel별 error boundary |
| URL state 동기화 | 운영자가 링크 공유 · 새로고침 · 뒤로가기로 같은 화면을 재현할 수 있어야 함 | `urlState.ts`, `InboxToolbar`, `SavedViewBar` |
| saved view / draft 복구 | 페이지 이동 · 새로고침 · 다른 운영자에게 인계 시 작업 맥락 보존 | `useSavedViews`, `useMessageDraft` |
| 5,000개 데이터에서의 성능 | 운영 인박스는 결국 데이터가 쌓임. 이때도 죽지 않는 렌더링 전략을 강제 | `large-dataset` 시나리오 |

---

## 3. 무엇을 만들어야 하는가 (요구사항)

### 3.1 화면

기본 경로:

```text
/inbox
/inbox?threadId=t_001&query=refund&status=open&channel=web&assignee=me&unreadOnly=true&sort=latest
/settings
```

3-column layout:

```text
┌───────────────────────────────────────────────┐
│ InboxToolbar / Search / Filter / Saved Views  │
├──────────────┬─────────────────┬──────────────┤
│ Thread List  │ Message Panel   │ Customer Info│
└──────────────┴─────────────────┴──────────────┘
```

### 3.2 컴포넌트별 책임 (TODO 위치)

| 컴포넌트 | 멘티가 채워야 할 책임 | 왜 그래야 하는가 |
| --- | --- | --- |
| `ThreadListPanel` | REST 목록 · URL 필터 동기화 · `thread.updated` 이벤트 반영 · unread count 일관성 | 좌측 목록은 모든 상태가 모이는 첫 화면. 여기에서 일관성이 깨지면 우측이 무엇을 해도 무의미 |
| `MessagePanel` | 메시지 조회 · `message.created` 병합 · optimistic send · 실패 retry | 운영자가 가장 오래 보는 영역. 입력 즉시 반응이 핵심 |
| `CustomerInfoPanel` | customerId 조회 · panel-level error 격리 | API 일부가 죽어도 인박스가 죽지 않아야 함을 증명하는 자리 |
| `ConnectionStatusBanner` | 연결 상태 표시 · backfill 진행 표시 | 운영자에게 "지금 데이터가 신뢰할 만한가?"를 알리는 신호 |
| `InboxToolbar` / `SavedViewBar` | 필터 ↔ URL ↔ saved view 3자 동기화 | 같은 필터를 표현하는 3개 source를 충돌 없이 다루는 훈련 |
| `MessageComposer` | draft 보존 · 전송 mutation · 전송 중 thread 전환 | thread를 바꿔도 작성 중이던 글이 사라지면 안 됨 |

각 컴포넌트 상단에 `TODO(student)` 주석으로 무엇을 해야 하는지 적혀 있습니다.

### 3.3 도메인 타입 (이미 정의됨)

`src/features/inbox/model/types.ts` 에 정의되어 있습니다. 멘티는 이 타입을 변경하지 말고 사용해야 합니다. 변경하면 mock API와 계약이 깨집니다.

핵심 타입: `Thread`, `Message`, `Customer`, `Agent`, `InboxFilters`, `SavedView`, `InboxEvent`, `ConnectionStatus`.

`InboxEvent` 는 union이며 `message.created`, `thread.updated`, `thread.assigned`, `connection.lost`, `connection.restored` 5종이 있습니다. 모든 이벤트에 `eventId`가 있는 이유는 **dedupe를 강제하기 위해서**입니다.

### 3.4 Mock REST API (제공됨, MSW)

| Method | Path | 용도 |
| ------ | ---- | ---- |
| GET    | `/api/inbox/bootstrap`                  | 운영자 / 채널 / 상태 / 정렬 옵션 |
| GET    | `/api/inbox/threads`                    | 목록 (filter · pageSize · sort 지원) |
| GET    | `/api/inbox/threads/:threadId/messages` | 스레드 메시지 |
| POST   | `/api/inbox/threads/:threadId/messages` | 메시지 전송 (`clientId` 필수) |
| GET    | `/api/inbox/customers/:customerId`      | 고객 정보 |
| GET    | `/api/inbox/events?after=evt_xxx`       | 누락 이벤트 backfill |
| GET    | `/api/inbox/saved-views`                | saved view 목록 |
| POST   | `/api/inbox/saved-views`                | saved view 생성 |
| DELETE | `/api/inbox/saved-views/:id`            | saved view 삭제 |

전체 계약: [`challenge/api-contract.md`](./challenge/api-contract.md).

### 3.5 Mock Realtime (제공됨, fake)

`src/features/inbox/realtime/MockRealtimeClient.ts` 가 시나리오에 따라 이벤트를 emit합니다. 인터페이스는 다음과 같습니다.

```ts
export type RealtimeClient = {
  connect(): void;
  disconnect(): void;
  getStatus(): ConnectionStatus;
  subscribe(callback: (event: InboxEvent) => void): RealtimeUnsubscribe;
};
```

> 실제 WebSocket 서버를 띄우지 않습니다. 멘티의 학습 목표는 **transport가 아니라 이벤트 병합 전략**이기 때문에, transport는 fake로 고정합니다.

### 3.6 Scenario 시스템 (제공됨)

같은 코드를 다른 환경에서 검증하기 위해 `VITE_INBOX_SCENARIO` 로 스위칭합니다. 이 시스템 자체가 학습 자료입니다 — 멘티는 production 디버깅에서 똑같은 패턴을 만나게 됩니다.

| scenario | 동작 | 이 시나리오가 검증하는 것 |
| --- | --- | --- |
| `default`             | 정상 응답 | 기본 happy path |
| `slow`                | 모든 응답에 ~1.5초 지연 | loading UX 결정 (skeleton / stale / spinner) |
| `empty`               | 모든 목록 비어 있음 | empty state 처리 |
| `threads-error`       | 스레드 목록만 500 | panel 단위 에러 표면화 |
| `messages-error`      | 메시지 조회만 500 | partial failure |
| `customer-error`      | 고객 조회만 500 | partial failure (가장 자주 누락되는 케이스) |
| `send-failure`        | 메시지 전송 500 | optimistic + retry |
| `connection-lost`     | 연결 끊긴 상태로 시작 | offline 시작 시 UX |
| `reconnect-backfill`  | 끊겼다가 복구되면 누락 이벤트 emit | backfill 설계 |
| `duplicate-events`    | 같은 eventId 두 번 | dedupe 강제 |
| `out-of-order-events` | createdAt 역순 emit | 시간순 정렬의 안정성 |
| `large-dataset`       | 5,000개 thread (generator) | 대용량에서의 렌더 전략 |

### 3.7 멘티가 직접 채워야 할 핵심 TODO

| 위치 | 무엇을 | 왜 |
| --- | --- | --- |
| `src/features/inbox/hooks/useInboxRealtime.ts`        | event → query cache 병합 | 가장 핵심. 이 코드가 곧 점수 |
| `src/features/inbox/utils/eventDedupe.ts`             | duplicate eventId 무시 | 서버는 보장하지 않음 |
| `src/features/inbox/utils/urlState.ts`                | URL ↔ `InboxFilters` | 새로고침 / 공유 / 뒤로가기 |
| `src/features/inbox/components/MessagePanel.tsx`      | optimistic send + retry | 운영자 UX의 핵심 |
| `src/features/inbox/components/MessageComposer.tsx`   | draft 보존 + 전송 mutation | thread 전환 시 손실 방지 |
| `src/features/inbox/hooks/useSavedViews.ts`           | saved view CRUD + URL 복원 | 3자 동기화 |
| `src/features/inbox/hooks/useMessageDraft.ts`         | thread별 draft key + 새로고침 복구 | localStorage 사용 훈련 |

---

## 4. 절대 하지 말아야 할 것 (왜)

| 금지 | 왜 |
| --- | --- |
| Redux / Zustand 도입 | TanStack Query + URL state + localStorage 만으로 풀 수 있는지가 평가 대상 |
| 디자인 시스템 / Tailwind / shadcn | UI 미려함이 평가 대상이 아님. 시간 낭비 |
| 실제 WebSocket 서버 구현 | 학습 목표가 transport가 아니라 병합 전략 |
| 백엔드 서버 구현 | MSW + fixture로 충분 |
| `it.todo` 모두 통과시키는 정답 코드 미리 작성 | 멘티가 직접 작성해야 함 |
| 과도한 abstraction | "재사용 가능한 인박스 시스템"이 아니라 "이 화면 하나"를 만드는 과제 |

---

## 5. 실행 방법

```bash
pnpm install
pnpm dev          # http://localhost:5173/inbox
```

시나리오 별:

```bash
VITE_INBOX_SCENARIO=slow pnpm dev
VITE_INBOX_SCENARIO=send-failure pnpm dev
VITE_INBOX_SCENARIO=reconnect-backfill pnpm dev
VITE_INBOX_SCENARIO=duplicate-events pnpm dev
VITE_INBOX_SCENARIO=large-dataset pnpm dev
```

> Windows 호환을 위해 npm scripts는 `cross-env` 를 사용합니다 (`pnpm dev:slow`, `pnpm dev:send-failure`, `pnpm dev:reconnect`).

---

## 6. 검증 방법

```bash
pnpm typecheck    # 타입 검사 (스캐폴드 상태에서도 통과)
pnpm test         # Vitest. 현재는 대부분 it.todo
pnpm test:e2e     # Playwright smoke (3-column layout 렌더링만 확인)
pnpm build        # 빌드 검증
```

> `pnpm test`가 처음부터 통과한다고 끝난 게 아닙니다. 멘티는 `it.todo` 를 실제 `it(...)` 로 바꿔야 합니다.

---

## 7. 제출 요구사항

- [ ] `/inbox` 가 3-column shell로 정상 동작
- [ ] 다음 시나리오에서 화면이 깨지지 않음
  `default`, `empty`, `threads-error`, `messages-error`, `customer-error`, `send-failure`, `reconnect-backfill`, `duplicate-events`
- [ ] Vitest stub의 절반 이상을 실제 테스트로 작성
- [ ] [`challenge/edge-cases.md`](./challenge/edge-cases.md) 의 케이스 중 최소 5개 처리
- [ ] `pnpm typecheck` / `pnpm build` / `pnpm test` 통과

---

## 8. 평가 기준

자세한 점수는 [`challenge/rubric.md`](./challenge/rubric.md).

| 항목 | 점수 | 의미 |
| --- | --- | --- |
| 요구사항 충족도 | 25 | 화면 / API / scenario 커버리지 |
| 상태 모델링 | 20 | URL / server / realtime / local / derived 의 명확한 분리 |
| 실시간 이벤트 병합 | 20 | dedupe · 순서 · query cache 병합 |
| optimistic update / retry | 15 | 즉시 반응 · 실패 표시 · 재시도 |
| partial failure 처리 | 10 | 한 패널 죽어도 나머지 살아 있음 |
| 테스트 품질 | 5 | `it.todo` → 실제 테스트 |
| 문서화 | 5 | 결정 근거를 README · PR description에 남김 |

---

## 9. 참고 문서

- [`REQUIREMENTS.md`](./REQUIREMENTS.md) — 전체 요구기획서 (소스 오브 트루스)
- [`challenge/overview.md`](./challenge/overview.md) — 과제 의도
- [`challenge/requirements.md`](./challenge/requirements.md) — 요구사항 체크리스트
- [`challenge/api-contract.md`](./challenge/api-contract.md) — Mock API 계약
- [`challenge/state-model-guide.md`](./challenge/state-model-guide.md) — 상태 분리 가이드
- [`challenge/edge-cases.md`](./challenge/edge-cases.md) — 반드시 다뤄야 할 엣지 케이스
- [`challenge/rubric.md`](./challenge/rubric.md) — 채점 기준
- [`challenge/submission-checklist.md`](./challenge/submission-checklist.md) — 제출 체크리스트
