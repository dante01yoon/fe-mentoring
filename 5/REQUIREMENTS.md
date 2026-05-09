# 05회차 스캐폴드 프로젝트 요구기획서

## 0. 문서 목적

이 문서는 **5회차 과제 `Unified Inbox Console`의 스캐폴드 프로젝트**를 만들기 위한 요구기획서입니다.

이 프로젝트는 멘티가 과제를 풀기 위한 **출발점 scaffold**입니다. 완성된 정답 앱이 아닙니다. 에이전트는 프로젝트 구조, mock API, fake realtime adapter, fixture, TODO placeholder, 테스트 stub, 문서를 만들어야 하며, 핵심 정답 로직은 남겨두어야 합니다.

---

## 1. 프로젝트 개요

### 저장소명

`fe-05-unified-inbox-console`

### 과제명

`Unified Inbox Console`

### 한 줄 설명

고객 문의/상담 스레드를 하나의 인박스 화면에서 보고, 메시지를 전송하고, 실시간 이벤트를 반영하는 운영 콘솔 스캐폴드를 만든다.

### 과제 목적

멘티가 아래 역량을 훈련할 수 있도록 scaffold를 제공한다.

- REST 초기 데이터와 실시간 이벤트를 병합하는 능력
- 서버 상태, 로컬 UI 상태, optimistic 상태를 구분하는 능력
- 메시지 전송 optimistic update / 실패 / retry 처리 능력
- reconnect 이후 누락 이벤트 backfill 설계 능력
- partial failure를 화면 영역별로 처리하는 능력
- saved view, draft, 마지막 선택 상태를 localStorage 또는 mock API로 복구하는 능력

이 과제는 **채팅 UI를 예쁘게 만드는 과제**가 아니라, 여러 데이터 source를 하나의 일관된 화면 상태로 합치는 프론트엔드 설계 능력을 보는 과제입니다.

---

## 2. 에이전트의 작업 목표

에이전트는 React + TypeScript 기반 스캐폴드 저장소를 생성합니다.

### 반드시 해야 할 일

1. Vite + React + TypeScript 프로젝트 생성
2. TanStack Query 기본 연결
3. React Router 기본 연결
4. MSW 기반 mock REST API 구성
5. fake realtime client 구성
6. inbox 도메인 type 정의
7. mock fixture 데이터 제공
8. scenario flag 기반으로 정상/실패/지연/재연결 상황 재현 가능하게 구성
9. 기본 3-column layout shell 제공
10. 각 주요 기능 위치에 `TODO(student)` 주석 배치
11. README와 challenge 문서 작성
12. 테스트 stub 제공
13. Playwright smoke test 제공

### 절대 하지 말아야 할 일

- 완성된 인박스 앱 구현 금지
- optimistic update, reconnect backfill, event dedupe 로직 완성 금지
- 모든 테스트를 통과하는 정답 코드 작성 금지
- Redux/Zustand 같은 전역 상태 라이브러리 기본 포함 금지
- 디자인 시스템 구현 금지
- 실제 WebSocket 서버 구현 금지
- 백엔드 서버 구현 금지
- monorepo 금지
- 과도한 abstraction 금지

---

## 3. 기술 스택

### 필수

- Vite
- React
- TypeScript
- React Router
- TanStack Query
- MSW
- Vitest
- React Testing Library
- Playwright
- ESLint
- Prettier

### 기본 포함하지 말 것

- Zustand
- Redux Toolkit
- Storybook
- Tailwind
- Radix UI
- shadcn/ui
- 실제 WebSocket server
- GraphQL
- codegen

### 스타일링

기본 CSS 또는 CSS Modules 수준이면 충분합니다. 이 과제의 초점은 UI 미려함이 아니라 상태 모델링과 이벤트 병합입니다.

---

## 4. 최종 폴더 구조

아래 구조를 기준으로 생성합니다.

```text
fe-05-unified-inbox-console/
├─ README.md
├─ package.json
├─ index.html
├─ vite.config.ts
├─ vitest.config.ts
├─ playwright.config.ts
├─ tsconfig.json
├─ .eslintrc.cjs
├─ .prettierrc
├─ .gitignore
├─ challenge/
│  ├─ overview.md
│  ├─ requirements.md
│  ├─ api-contract.md
│  ├─ state-model-guide.md
│  ├─ edge-cases.md
│  ├─ rubric.md
│  └─ submission-checklist.md
└─ src/
   ├─ main.tsx
   ├─ app/
   │  ├─ App.tsx
   │  ├─ router.tsx
   │  ├─ providers/
   │  │  ├─ AppProviders.tsx
   │  │  └─ queryClient.ts
   │  └─ layouts/
   │     └─ ConsoleLayout.tsx
   ├─ pages/
   │  ├─ InboxPage.tsx
   │  └─ SettingsPage.tsx
   ├─ features/
   │  └─ inbox/
   │     ├─ README.md
   │     ├─ components/
   │     │  ├─ ThreadListPanel.tsx
   │     │  ├─ MessagePanel.tsx
   │     │  ├─ CustomerInfoPanel.tsx
   │     │  ├─ InboxToolbar.tsx
   │     │  ├─ SavedViewBar.tsx
   │     │  ├─ ConnectionStatusBanner.tsx
   │     │  └─ MessageComposer.tsx
   │     ├─ api/
   │     │  ├─ inboxApi.ts
   │     │  └─ queryKeys.ts
   │     ├─ realtime/
   │     │  ├─ RealtimeClient.ts
   │     │  ├─ MockRealtimeClient.ts
   │     │  └─ inboxEventBus.ts
   │     ├─ hooks/
   │     │  ├─ useThreads.ts
   │     │  ├─ useThreadMessages.ts
   │     │  ├─ useInboxRealtime.ts
   │     │  ├─ useSavedViews.ts
   │     │  └─ useMessageDraft.ts
   │     ├─ model/
   │     │  ├─ types.ts
   │     │  ├─ constants.ts
   │     │  └─ scenario.ts
   │     ├─ utils/
   │     │  ├─ eventDedupe.ts
   │     │  ├─ messageId.ts
   │     │  ├─ storageKeys.ts
   │     │  └─ urlState.ts
   │     └─ __tests__/
   │        ├─ eventDedupe.test.ts
   │        ├─ optimisticMessage.test.tsx
   │        └─ reconnectBackfill.test.tsx
   ├─ shared/
   │  ├─ components/
   │  │  ├─ EmptyState.tsx
   │  │  ├─ ErrorState.tsx
   │  │  ├─ LoadingState.tsx
   │  │  └─ Panel.tsx
   │  ├─ lib/
   │  │  ├─ assertNever.ts
   │  │  ├─ date.ts
   │  │  └─ localStorage.ts
   │  └─ test/
   │     ├─ setupTests.ts
   │     └─ renderWithProviders.tsx
   ├─ mocks/
   │  ├─ browser.ts
   │  ├─ server.ts
   │  ├─ handlers.ts
   │  ├─ scenarios.ts
   │  └─ fixtures/
   │     ├─ agents.ts
   │     ├─ customers.ts
   │     ├─ threads.ts
   │     ├─ messages.ts
   │     ├─ savedViews.ts
   │     └─ events.ts
   └─ styles/
      ├─ globals.css
      └─ console.css
└─ e2e/
   └─ inbox.spec.ts
```

---

## 5. 화면 요구사항

### 기본 경로

```text
/inbox
/inbox?threadId=t_001&query=refund&status=open&channel=web&assignee=me&unreadOnly=true&sort=latest
/settings
```

### 3-column console layout

```text
┌───────────────────────────────────────────────┐
│ InboxToolbar / Search / Filter / Saved Views  │
├──────────────┬─────────────────┬──────────────┤
│ Thread List  │ Message Panel   │ Customer Info│
└──────────────┴─────────────────┴──────────────┘
```

### 컴포넌트별 scaffold

#### `ThreadListPanel`

- thread 목록 placeholder
- loading / empty / error 상태 placeholder
- selected thread 표시 placeholder
- TODO 주석 포함

```tsx
/**
 * TODO(student):
 * - REST thread 목록을 연결하세요.
 * - URL query state와 필터를 동기화하세요.
 * - 실시간 thread.updated 이벤트를 목록에 반영하세요.
 * - unread count가 일관되게 보이도록 처리하세요.
 */
```

#### `MessagePanel`

- selected thread 없을 때 empty state
- 메시지 목록 placeholder
- composer placeholder
- TODO 주석 포함

```tsx
/**
 * TODO(student):
 * - threadId가 있을 때 메시지를 조회하세요.
 * - message.created 이벤트를 현재 thread 메시지 목록에 병합하세요.
 * - 메시지 전송 optimistic update를 구현하세요.
 * - 실패 메시지 retry를 구현하세요.
 */
```

#### `CustomerInfoPanel`

- 고객 정보 placeholder
- panel-level error placeholder

```tsx
/**
 * TODO(student):
 * - 선택된 thread의 customerId로 고객 정보를 조회하세요.
 * - customer 조회 실패가 전체 화면을 깨뜨리지 않게 하세요.
 */
```

#### `ConnectionStatusBanner`

- connected / reconnecting / disconnected 상태 placeholder

```tsx
/**
 * TODO(student):
 * - realtime client connection status를 연결하세요.
 * - reconnect 후 backfill 진행 상태를 사용자에게 보여주세요.
 */
```

---

## 6. 도메인 타입

`src/features/inbox/model/types.ts`에 정의합니다.

```ts
export type Channel = "web" | "kakao" | "email" | "app";
export type ThreadStatus = "open" | "pending" | "closed";
export type MessageSender = "customer" | "agent" | "system";
export type MessageStatus = "sending" | "sent" | "failed";

export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "reconnecting"
  | "error";

export type Thread = {
  id: string;
  customerId: string;
  customerName: string;
  channel: Channel;
  status: ThreadStatus;
  assigneeId?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  tags: string[];
};

export type Message = {
  id: string;
  clientId?: string;
  threadId: string;
  sender: MessageSender;
  body: string;
  createdAt: string;
  status?: MessageStatus;
};

export type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  tags: string[];
  memo?: string;
  createdAt: string;
};

export type Agent = {
  id: string;
  name: string;
  role: "viewer" | "operator" | "admin";
};

export type InboxFilters = {
  query?: string;
  status?: ThreadStatus;
  channel?: Channel;
  assignee?: "me" | "unassigned" | string;
  unreadOnly?: boolean;
  sort?: "latest" | "unread" | "oldest";
};

export type SavedView = {
  id: string;
  name: string;
  state: InboxFilters;
  createdAt: string;
};

export type InboxEvent =
  | {
      type: "message.created";
      eventId: string;
      threadId: string;
      message: Message;
      createdAt: string;
    }
  | {
      type: "thread.updated";
      eventId: string;
      threadId: string;
      patch: Partial<Thread>;
      createdAt: string;
    }
  | {
      type: "thread.assigned";
      eventId: string;
      threadId: string;
      assigneeId: string;
      createdAt: string;
    }
  | {
      type: "connection.lost";
      eventId: string;
      createdAt: string;
    }
  | {
      type: "connection.restored";
      eventId: string;
      createdAt: string;
    };
```

---

## 7. Mock REST API 계약

MSW handlers로 아래 API를 제공합니다.

### Bootstrap

```http
GET /api/inbox/bootstrap
```

응답:

```json
{
  "me": { "id": "agent_001", "name": "Mentor Agent", "role": "operator" },
  "channels": ["web", "kakao", "email", "app"],
  "statuses": ["open", "pending", "closed"],
  "sortOptions": ["latest", "unread", "oldest"]
}
```

### Thread 목록

```http
GET /api/inbox/threads?query=&status=open&channel=web&assignee=me&unreadOnly=true&sort=latest&page=1&pageSize=30
```

응답:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 30,
  "totalCount": 0,
  "totalPages": 0,
  "serverTime": "2026-05-07T10:00:00.000Z"
}
```

### Thread 메시지

```http
GET /api/inbox/threads/:threadId/messages
```

응답:

```json
{
  "threadId": "t_001",
  "items": [],
  "cursor": null
}
```

### 메시지 전송

```http
POST /api/inbox/threads/:threadId/messages
```

요청:

```json
{
  "clientId": "client_123",
  "body": "확인 후 안내드리겠습니다."
}
```

응답:

```json
{
  "message": {
    "id": "m_999",
    "clientId": "client_123",
    "threadId": "t_001",
    "sender": "agent",
    "body": "확인 후 안내드리겠습니다.",
    "createdAt": "2026-05-07T10:00:00.000Z",
    "status": "sent"
  }
}
```

### 고객 정보

```http
GET /api/inbox/customers/:customerId
```

### 누락 이벤트 backfill

```http
GET /api/inbox/events?after=evt_001
```

응답:

```json
{
  "events": [],
  "latestEventId": "evt_010"
}
```

### Saved Views

```http
GET /api/inbox/saved-views
POST /api/inbox/saved-views
DELETE /api/inbox/saved-views/:id
```

Saved views는 localStorage로 구현해도 됩니다. scaffold에는 hook과 API 자리만 제공합니다.

---

## 8. Mock scenario

`src/mocks/scenarios.ts`에 정의합니다.

```ts
export type InboxScenario =
  | "default"
  | "slow"
  | "empty"
  | "threads-error"
  | "messages-error"
  | "customer-error"
  | "send-failure"
  | "connection-lost"
  | "reconnect-backfill"
  | "duplicate-events"
  | "out-of-order-events"
  | "large-dataset";
```

scenario 변경 방식:

```ts
export const INBOX_SCENARIO =
  import.meta.env.VITE_INBOX_SCENARIO ?? "default";
```

실행 예:

```bash
VITE_INBOX_SCENARIO=send-failure pnpm dev
VITE_INBOX_SCENARIO=reconnect-backfill pnpm dev
```

Windows 호환을 위해 `cross-env`를 사용하는 것이 좋습니다.

---

## 9. Fake Realtime Client 요구사항

실제 WebSocket 서버는 만들지 않습니다. interface와 fake 구현만 제공합니다.

```ts
export type RealtimeUnsubscribe = () => void;

export type RealtimeClient = {
  connect(): void;
  disconnect(): void;
  getStatus(): ConnectionStatus;
  subscribe(callback: (event: InboxEvent) => void): RealtimeUnsubscribe;
};
```

`MockRealtimeClient`는 아래를 제공해야 합니다.

- `connect()`
- `disconnect()`
- `subscribe(callback)`
- scenario에 따른 이벤트 발생
- 중복 이벤트 발생 가능
- out-of-order 이벤트 발생 가능
- connection lost/restored 이벤트 발생 가능

단, 이벤트를 query cache에 병합하는 정답 구현은 멘티 몫입니다. scaffold에는 `useInboxRealtime` hook과 TODO만 둡니다.

```ts
/**
 * TODO(student):
 * - realtime event를 구독하세요.
 * - message.created 이벤트를 thread list와 message list에 병합하세요.
 * - duplicate eventId를 제거하세요.
 * - connection.restored 이후 backfill API를 호출하세요.
 */
export function useInboxRealtime() {
  return null;
}
```

---

## 10. Hook scaffold 요구사항

### `useThreads.ts`

```ts
/**
 * TODO(student):
 * - filters를 queryKey에 포함하세요.
 * - 검색/필터/정렬 변경 시 기존 결과의 loading UX를 어떻게 처리할지 결정하세요.
 * - page/pageSize를 추가할지 선택하세요.
 */
```

### `useThreadMessages.ts`

```ts
/**
 * TODO(student):
 * - threadId가 없을 때 query를 비활성화하세요.
 * - 메시지를 시간순으로 안정적으로 정렬하세요.
 * - optimistic message와 서버 message를 어떻게 병합할지 설계하세요.
 */
```

### `useSavedViews.ts`

```ts
/**
 * TODO(student):
 * - saved view를 localStorage로 둘지 mock API로 둘지 선택하세요.
 * - saved view 클릭 시 URL state를 복원하세요.
 */
```

### `useMessageDraft.ts`

```ts
/**
 * TODO(student):
 * - threadId별 draft key를 분리하세요.
 * - 전송 성공 시 draft를 정리하세요.
 * - 새로고침 후 draft 복구 여부를 확인하세요.
 */
```

---

## 11. URL state 요구사항

스캐폴드는 URL state를 다룰 수 있는 helper 자리를 제공합니다.

URL 예:

```text
/inbox?threadId=t_001&query=refund&status=open&channel=web&assignee=me&unreadOnly=true&sort=latest
```

멘티가 구현해야 할 URL state:

- `threadId`
- `query`
- `status`
- `channel`
- `assignee`
- `unreadOnly`
- `sort`

`src/features/inbox/utils/urlState.ts`에 TODO를 남깁니다.

```ts
/**
 * TODO(student):
 * - URLSearchParams를 InboxFilters로 파싱하세요.
 * - InboxFilters를 URLSearchParams로 직렬화하세요.
 * - 유효하지 않은 query 값이 들어왔을 때 fallback을 정의하세요.
 */
```

---

## 12. Fixture 데이터 요구사항

### threads fixture

최소 30개 기본 제공.

다양한 조합을 포함합니다.

- channel: web/kakao/email/app
- status: open/pending/closed
- assigneeId 있음/없음
- unreadCount 0/1/5+
- tags: refund, vip, urgent, payment, delivery 등

### messages fixture

각 thread당 3~15개 메시지 제공.

- customer message
- agent message
- system message
- 시간순/역순 혼합 가능

### customers fixture

thread의 customerId와 연결되는 고객 데이터 제공.

### events fixture

아래 이벤트 포함.

- 신규 메시지
- 스레드 상태 변경
- 담당자 배정
- 중복 이벤트
- 순서가 뒤바뀐 이벤트
- reconnect 후 backfill용 이벤트

### large dataset

`large-dataset` scenario에서 사용할 5,000개 thread 생성 함수를 제공합니다. 정적 JSON 5,000개를 커밋하지 말고 generator 함수로 생성합니다.

---

## 13. 테스트 stub 요구사항

테스트는 정답을 제공하지 말고, 멘티가 채워 넣을 수 있는 stub 형태로 만듭니다.

### `eventDedupe.test.ts`

```ts
describe("event dedupe", () => {
  it.todo("ignores duplicated events with the same eventId");
  it.todo("keeps newer event when duplicated payload differs");
});
```

### `optimisticMessage.test.tsx`

```ts
describe("optimistic message", () => {
  it.todo("shows temporary sending message before server response");
  it.todo("marks message as failed when send API fails");
  it.todo("replaces temporary message with server message on success");
});
```

### `reconnectBackfill.test.tsx`

```ts
describe("reconnect backfill", () => {
  it.todo("loads missed events after connection is restored");
  it.todo("does not duplicate events that already exist locally");
});
```

### e2e smoke

`e2e/inbox.spec.ts`

- `/inbox` 진입 가능
- 3개 panel visible
- thread list placeholder visible
- message panel placeholder visible

핵심 기능 e2e는 TODO로 남기고, scaffold 자체가 깨지지 않는 수준만 확인합니다.

---

## 14. 문서 요구사항

### `README.md`

반드시 포함:

```md
# Unified Inbox Console

## 과제 목적
## 무엇을 만들 것인가
## 실행 방법
## 테스트 방법
## Mock API
## Mock Realtime
## Scenario 스위처
## 주요 구현 TODO
## 제출 요구사항
## 평가 기준
```

### `challenge/overview.md`

반드시 포함할 문장:

> 이 과제는 채팅 UI를 예쁘게 만드는 과제가 아닙니다. REST 초기 데이터, 실시간 이벤트, optimistic update, reconnect/backfill, local draft를 하나의 일관된 화면 상태로 병합할 수 있는지 보는 과제입니다.

### `challenge/state-model-guide.md`

상태 분리 안내:

```text
URL state:
- threadId
- query
- status
- channel
- assignee
- unreadOnly
- sort

Server state:
- threads
- messages
- customers
- saved views

Realtime event state:
- connection status
- lastEventId
- pending backfill

Local state:
- drafts
- visible panel
- saved view storage option

Derived state:
- unread summary
- selected thread
- active filter count
```

### `challenge/edge-cases.md`

최소 포함:

- 같은 eventId가 두 번 들어오는 경우
- 메시지 전송 후 서버 응답이 실패하는 경우
- 전송 중인 메시지가 있는 상태에서 thread를 바꾸는 경우
- 연결이 끊긴 동안 새 메시지가 들어온 경우
- reconnect 후 backfill 이벤트가 기존 이벤트와 중복되는 경우
- customer info API만 실패하는 경우
- saved view를 적용했는데 URL query가 기존 상태와 충돌하는 경우
- unread count가 서버 값과 클라이언트 이벤트 계산 값이 다를 경우

### `challenge/rubric.md`

```text
요구사항 충족도: 25
상태 모델링: 20
실시간 이벤트 병합: 20
optimistic update/retry: 15
partial failure 처리: 10
테스트 품질: 5
문서화: 5
```

---

## 15. package scripts

`package.json`에 아래 script가 있어야 합니다.

```json
{
  "scripts": {
    "dev": "vite",
    "dev:slow": "cross-env VITE_INBOX_SCENARIO=slow vite",
    "dev:send-failure": "cross-env VITE_INBOX_SCENARIO=send-failure vite",
    "dev:reconnect": "cross-env VITE_INBOX_SCENARIO=reconnect-backfill vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

---

## 16. Acceptance Criteria

### 프로젝트 실행

- `pnpm install` 성공
- `pnpm dev` 성공
- `/inbox` 화면 진입 가능
- 3-column console layout 표시

### 빌드/테스트

- `pnpm typecheck` 성공
- `pnpm build` 성공
- `pnpm test` 성공
- `pnpm test:e2e` 성공 또는 smoke test 통과

### mock

- MSW가 dev 환경에서 동작
- `GET /api/inbox/bootstrap` 응답 가능
- `GET /api/inbox/threads` 응답 가능
- `GET /api/inbox/threads/:threadId/messages` 응답 가능
- `POST /api/inbox/threads/:threadId/messages` 응답 가능
- scenario 변경 가능

### 문서

- README 존재
- challenge 문서 6개 이상 존재
- API contract 문서 존재
- state model guide 존재
- rubric 존재

### 스캐폴드 위치

- 핵심 정답 로직은 TODO로 남아 있음
- 과제가 너무 쉽게 풀릴 정도로 완성 구현을 제공하지 않음
- 하지만 멘티가 무엇을 만들지 모를 정도로 비어 있지도 않음
