# 6회차 스캐폴드 프로젝트 요구기획서

## 과제명

**Embeddable Support Widget**

## 문서 목적

이 문서는 6회차 과제용 스캐폴드 저장소를 만들기 위한 요구기획서입니다.

중요한 점은, 이 저장소는 완성된 정답 앱이 아닙니다.
멘티가 과제를 수행할 수 있도록 **프로젝트 구조, 타입, mock adapter, host page, 테스트 stub, TODO 위치, 문서 템플릿만 제공**해야 합니다.

정답이 되는 핵심 구현은 의도적으로 남겨두어야 합니다.

---

## 1. 과제의 핵심 의도

6회차는 React/Vue 같은 프레임워크를 사용하지 않고, **바닐라 TypeScript로 외부 웹사이트에 삽입되는 고객지원 위젯 SDK**를 만드는 과제입니다.

멘티가 최종적으로 만들어야 할 것은 아래와 같은 형태입니다.

```html
<script src="/widget.js"></script>
<script>
  window.SupportWidget.boot({
    appId: "demo-app",
    user: {
      id: "u_001",
      name: "Jaewon Kim",
      email: "jaewon@example.com"
    }
  });

  window.SupportWidget.show();
</script>
```

하지만 스캐폴드 단계에서는 완성된 SDK를 제공하면 안 됩니다.

스캐폴드는 아래만 제공해야 합니다.

- 바닐라 TypeScript 기반 프로젝트 구조
- SDK public API 타입과 TODO 함수
- widget lifecycle 자리
- host page 데모
- Shadow DOM 또는 iframe 격리 전략을 구현할 수 있는 placeholder
- fake API adapter
- fake unread/message data
- 테스트 stub
- 과제 문서와 README 템플릿

---

## 2. 이 과제로 검증하려는 역량

멘티에게 이 과제를 통해 보려는 것은 아래입니다.

1. **프레임워크 없이 DOM과 이벤트를 다룰 수 있는가**
2. **외부 웹페이지에 삽입되는 SDK의 public API를 설계할 수 있는가**
3. **boot / shutdown / show / hide / track lifecycle을 안전하게 구현할 수 있는가**
4. **host page의 CSS와 JS 환경에 영향을 덜 받도록 격리할 수 있는가**
5. **위젯이 host page를 오염시키지 않고 cleanup될 수 있는가**
6. **익명 사용자와 로그인 사용자의 boot 흐름을 구분할 수 있는가**
7. **SPA route 변경 후에도 위젯 상태를 유지하거나 재동기화할 수 있는가**
8. **테스트 가능한 구조로 SDK를 분리할 수 있는가**

이 과제는 "채팅창 UI를 예쁘게 만드는 과제"가 아닙니다.

핵심은 **남의 웹페이지 위에서도 안정적으로 동작하는 임베더블 프론트엔드 SDK의 경계와 lifecycle을 설계하는 것**입니다.

---

## 3. 에이전트 작업 목표

에이전트는 아래 결과물을 만들어야 합니다.

- `embeddable-support-widget`라는 standalone Vite + TypeScript 프로젝트
- React, Vue, Svelte 등 프레임워크 사용 금지
- SDK public API skeleton
- widget runtime skeleton
- host page demo
- fake API client
- fake storage adapter
- fake route change simulator
- 테스트 stub
- 문서 템플릿
- `TODO(student)` 주석이 포함된 구현 빈칸

에이전트는 아래를 구현하면 안 됩니다.

- 완성된 Shadow DOM/iframe isolation 전략
- 완성된 router
- 완성된 unread badge 동기화
- 완성된 message screen
- 완성된 lifecycle state machine
- 완성된 cleanup/destroy 로직
- 모든 테스트가 이미 통과하는 정답 수준의 구현

스캐폴드의 목적은 멘티가 "무엇을 구현해야 하는지" 이해하고 바로 시작할 수 있게 되는 것입니다.

---

## 4. 기술 스택

필수:

```text
Vite
TypeScript
Vanilla DOM
Vitest
Testing Library DOM 또는 DOM Testing Library
Playwright
ESLint
Prettier
```

선택 가능:

```text
zod
```

zod는 boot config runtime validation 용도로 사용할 수 있지만, 필수는 아닙니다.

금지:

```text
React
Vue
Svelte
Solid
Lit
jQuery
대형 UI 라이브러리
상태관리 라이브러리
```

---

## 5. 생성될 저장소 이름

```text
embeddable-support-widget
```

package name:

```json
{
  "name": "embeddable-support-widget"
}
```

---

## 6. 최종 폴더 구조

아래 구조로 생성합니다.

```text
embeddable-support-widget/
├─ README.md
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ vitest.config.ts
├─ playwright.config.ts
├─ index.html
├─ .gitignore
├─ .editorconfig
├─ challenge/
│  ├─ overview.md
│  ├─ requirements.md
│  ├─ api-contract.md
│  ├─ review-checklist.md
│  └─ scoring-rubric.md
├─ public/
│  └─ demo-host.css
├─ src/
│  ├─ main.ts
│  ├─ sdk/
│  │  ├─ index.ts
│  │  ├─ public-api.ts
│  │  ├─ runtime.ts
│  │  ├─ lifecycle.ts
│  │  ├─ config.ts
│  │  └─ errors.ts
│  ├─ widget/
│  │  ├─ mount.ts
│  │  ├─ shell.ts
│  │  ├─ router.ts
│  │  ├─ views/
│  │  │  ├─ home-view.ts
│  │  │  ├─ faq-view.ts
│  │  │  └─ messages-view.ts
│  │  ├─ components/
│  │  │  ├─ launcher.ts
│  │  │  ├─ unread-badge.ts
│  │  │  ├─ notification.ts
│  │  │  └─ close-button.ts
│  │  └─ styles/
│  │     ├─ widget.css
│  │     └─ tokens.css
│  ├─ isolation/
│  │  ├─ create-shadow-root.ts
│  │  ├─ create-iframe-root.ts
│  │  └─ strategy.ts
│  ├─ host/
│  │  ├─ demo-host.ts
│  │  ├─ route-simulator.ts
│  │  └─ custom-launcher.ts
│  ├─ mocks/
│  │  ├─ api-client.ts
│  │  ├─ fixtures.ts
│  │  ├─ scenarios.ts
│  │  └─ delay.ts
│  ├─ shared/
│  │  ├─ dom.ts
│  │  ├─ events.ts
│  │  ├─ storage.ts
│  │  ├─ invariant.ts
│  │  └─ types.ts
│  └─ test/
│     ├─ setup.ts
│     ├─ sdk.test.ts
│     ├─ lifecycle.test.ts
│     └─ isolation.test.ts
└─ e2e/
   ├─ widget-boot.spec.ts
   ├─ custom-launcher.spec.ts
   └─ host-navigation.spec.ts
```

---

## 7. 파일별 요구사항

### 7.1 `src/sdk/public-api.ts`

SDK가 외부에 노출할 public API 타입을 정의합니다.

타입 필수:

```ts
export type SupportWidgetUser =
  | {
      id: string;
      name?: string;
      email?: string;
    }
  | null;

export type SupportWidgetBootConfig = {
  appId: string;
  user?: SupportWidgetUser;
  locale?: "ko" | "en";
  launcher?: {
    mode: "default" | "custom";
    selector?: string;
  };
  theme?: {
    primaryColor?: string;
  };
};

export type TrackEventPayload = {
  name: string;
  properties?: Record<string, unknown>;
};

export type SupportWidgetAPI = {
  boot(config: SupportWidgetBootConfig): Promise<void> | void;
  shutdown(): void;
  show(): void;
  hide(): void;
  track(event: TrackEventPayload): void;
};
```

주의:

- 타입만 충분히 제공합니다.
- 구현은 TODO로 남깁니다.
- boot 중복 호출, shutdown 전 show 호출 같은 비정상 흐름은 멘티가 처리하게 합니다.

---

### 7.2 `src/sdk/index.ts`

전역 namespace를 등록하는 진입점입니다.

요구사항:

```ts
declare global {
  interface Window {
    SupportWidget?: SupportWidgetAPI;
  }
}
```

아래 형태로 skeleton만 둡니다.

```ts
import { createRuntime } from "./runtime";

const runtime = createRuntime();

window.SupportWidget = {
  boot: runtime.boot,
  shutdown: runtime.shutdown,
  show: runtime.show,
  hide: runtime.hide,
  track: runtime.track,
};
```

단, `createRuntime` 내부 구현은 필수 TODO를 남깁니다.

---

### 7.3 `src/sdk/runtime.ts`

SDK runtime을 생성하는 파일입니다.

포함해야 할 TODO:

```ts
export function createRuntime(): SupportWidgetAPI {
  // TODO(student): lifecycle state를 정의하세요.
  // TODO(student): boot 중복 호출 시 정책을 정하세요.
  // TODO(student): shutdown 시 DOM, event listener, timer, storage subscription을 정리하세요.
  // TODO(student): show/hide 호출 가능 상태를 검증하세요.
}
```

기본적으로 throw만 하거나 minimal placeholder만 둬도 됩니다.

---

### 7.4 `src/sdk/lifecycle.ts`

lifecycle state type을 제공합니다.

예시:

```ts
export type WidgetLifecycleState =
  | "idle"
  | "booting"
  | "booted"
  | "visible"
  | "hidden"
  | "shutting-down"
  | "destroyed";
```

여기서 상태 전이 구현은 작성하지 말고 helper skeleton만 둡니다.

---

### 7.5 `src/widget/mount.ts`

위젯을 DOM에 붙이는 함수 skeleton입니다.

```ts
export type MountWidgetOptions = {
  container: HTMLElement;
  config: SupportWidgetBootConfig;
};

export function mountWidget(options: MountWidgetOptions) {
  // TODO(student): root element 생성
  // TODO(student): launcher / panel / badge 구성
  // TODO(student): cleanup 함수 반환
}
```

반환 타입은 cleanup에 유리해야 합니다.

```ts
export type MountedWidget = {
  root: HTMLElement;
  show(): void;
  hide(): void;
  destroy(): void;
};
```

---

### 7.6 `src/isolation/strategy.ts`

격리 전략을 선택할 수 있게 합니다.

```ts
export type IsolationStrategy = "shadow-dom" | "iframe";

export type CreateIsolatedRootOptions = {
  strategy: IsolationStrategy;
  host: HTMLElement;
};

export function createIsolatedRoot(options: CreateIsolatedRootOptions) {
  // TODO(student): shadow-dom 또는 iframe 중 하나를 선택해 구현하세요.
}
```

스캐폴드는 두 파일을 모두 제공하지만, 정답 구현은 하지 않습니다.

- `create-shadow-root.ts`
- `create-iframe-root.ts`

각 파일에는 장단점 설명 주석을 넣습니다.

---

### 7.7 `src/widget/router.ts`

위젯 내부 라우터 skeleton입니다.

타입 route:

```ts
export type WidgetRoute = "home" | "faq" | "messages";
```

라우터 구현은 최소 placeholder로 둡니다.

```ts
export function createWidgetRouter() {
  // TODO(student): 내부 route state를 관리하세요.
  // TODO(student): Home / FAQ / Messages 전환을 구현하세요.
}
```

주의:

- host page router와 혼동되지 않게 문서화합니다.
- 위젯 내부 라우트는 host URL을 반드시 바꿀 필요는 없습니다.
- 단, 멘티가 query/hash 방식을 선택할 수 있도록 guidance를 남깁니다.

---

### 7.8 `src/host/demo-host.ts`

host page를 시뮬레이션합니다.

요구사항:

- host page의 강한 CSS가 widget을 깨뜨릴 수 있도록 일부러 시끄러운 스타일 제공
- custom launcher 버튼 제공
- route simulator 버튼 제공
- boot/shutdown/show/hide/track 버튼 제공

예시 host UI:

```text
[Boot anonymous]
[Boot member]
[Shutdown]
[Show]
[Hide]
[Track fake event]
[Simulate host route change]
[Use custom launcher]
```

---

### 7.9 `public/demo-host.css`

host page의 CSS 오염을 테스트하기 위한 파일입니다.

일부러 시끄러운 스타일을 포함합니다.

```css
* {
  box-sizing: border-box;
}

button {
  all: unset;
  font-size: 48px;
  color: red;
}

div {
  border: 10px solid hotpink;
}

.fixed {
  z-index: 1;
}
```

주의:

- 이 CSS는 위젯을 깨뜨리기 위한 host 환경입니다.
- 멘티는 isolation 전략을 통해 widget이 영향을 덜 받도록 만들어야 합니다.

---

## 8. Fake API 요구사항

실제 백엔드는 없습니다.
fake API client를 제공합니다.

### 8.1 `src/mocks/api-client.ts`

아래 함수 skeleton을 제공합니다.

```ts
export async function fetchWidgetBootstrap(config: SupportWidgetBootConfig) {
  // TODO(student): anonymous/member 분기와 failure scenario를 고려하세요.
}

export async function fetchUnreadCount(userId?: string) {
  // TODO(student): unread count를 가져오는 fake API를 구현하세요.
}

export async function fetchFaqItems() {
  // TODO(student): FAQ 목록을 가져오는 fake API를 구현하세요.
}

export async function fetchMessages(userId?: string) {
  // TODO(student): 메시지 목록을 가져오는 fake API를 구현하세요.
}

export async function sendMessage(input: { body: string; userId?: string }) {
  // TODO(student): 메시지 전송 성공/실패 시나리오를 구현하세요.
}

export async function trackEvent(input: TrackEventPayload) {
  // TODO(student): track event 처리 방식을 구현하세요.
}
```

스캐폴드에서는 간단한 fixture와 delay helper만 제공합니다.

정답 수준의 상태 동기화는 구현하지 않습니다.

---

## 9. Mock scenario 요구사항

`src/mocks/scenarios.ts`에 아래 시나리오 타입을 둡니다.

```ts
export type WidgetScenario =
  | "default"
  | "anonymous"
  | "member"
  | "slow-boot"
  | "boot-failure"
  | "unread-failure"
  | "message-send-failure"
  | "host-route-change"
  | "css-conflict";
```

각 시나리오는 멘티가 테스트와 구현에서 사용할 수 있어야 합니다.

스캐폴드는 scenario setter/getter만 제공합니다.

```ts
let currentScenario: WidgetScenario = "default";

export function setWidgetScenario(scenario: WidgetScenario) {
  currentScenario = scenario;
}

export function getWidgetScenario() {
  return currentScenario;
}
```

---

## 10. Local Storage 요구사항

`src/shared/storage.ts`에 storage adapter를 제공합니다.

필수 저장 대상 후보:

```text
widget:visibility
widget:last-route
widget:draft-message
widget:user
```

단, 완성 구현은 제공하지 않고 adapter interface와 skeleton만 제공합니다.

```ts
export type StorageAdapter = {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clearByPrefix(prefix: string): void;
};
```

멘티가 shutdown 시 어떤 저장값을 지울지, 어떤 저장값을 남길지 결정하게 합니다.

---

## 11. Event Bus 요구사항

`src/shared/events.ts`에 간단한 event bus skeleton을 둡니다.

필수 이벤트 예시:

```ts
export type WidgetEventMap = {
  "widget:booted": { appId: string };
  "widget:shown": undefined;
  "widget:hidden": undefined;
  "widget:shutdown": undefined;
  "widget:route-changed": { route: WidgetRoute };
  "widget:track": TrackEventPayload;
};
```

정답 구현은 간단한 TODO로 남깁니다.

이 과제에서 보는 것은 DOM event, custom event, cleanup이므로 event bus를 완성하면 안 됩니다.

---

## 12. 테스트 stub 요구사항

테스트는 실패해도 괜찮지만, 멘티가 무엇을 통과시켜야 하는지 알 수 있어야 합니다.

### 12.1 `src/test/sdk.test.ts`

포함할 테스트명:

```ts
describe("SupportWidget SDK", () => {
  it.todo("registers exactly one global namespace");
  it.todo("does not allow show before boot");
  it.todo("handles duplicate boot calls according to documented policy");
  it.todo("tracks events without throwing after boot");
});
```

### 12.2 `src/test/lifecycle.test.ts`

```ts
describe("widget lifecycle", () => {
  it.todo("mounts the widget on boot");
  it.todo("removes DOM nodes and listeners on shutdown");
  it.todo("can boot again after shutdown");
});
```

### 12.3 `src/test/isolation.test.ts`

```ts
describe("widget isolation", () => {
  it.todo("keeps widget styles isolated from host page styles");
  it.todo("does not leak widget styles into host page");
});
```

### 12.4 E2E tests

`e2e/widget-boot.spec.ts`

```ts
test("widget can boot and show on demo host page", async ({ page }) => {
  // TODO(student): implement e2e test
});
```

`e2e/custom-launcher.spec.ts`

```ts
test("custom launcher opens the widget", async ({ page }) => {
  // TODO(student): implement e2e test
});
```

`e2e/host-navigation.spec.ts`

```ts
test("widget state survives host route simulation", async ({ page }) => {
  // TODO(student): implement e2e test
});
```

---

## 13. 문서 요구사항

### 13.1 `README.md`

README에는 아래 섹션이 있어야 합니다.

```md
# Embeddable Support Widget

## 프로젝트 개요

## 과제 목적

## 실행 방법

## SDK 사용 예시

## Public API

## 구현해야 할 기능

## 권장 구현 순서

## 테스트 방법

## 제출 전 체크리스트

## 구현 범위 / 미구현 범위

## 트레이드오프

## 한계
```

### 13.2 `challenge/overview.md`

멘티가 무엇을 만드는지 명확히 설명합니다.

반드시 포함할 문장:

```md
이 과제는 채팅 UI를 예쁘게 만드는 과제가 아닙니다.
외부 웹페이지에 삽입되는 SDK의 public API, lifecycle, isolation, cleanup을 설계할 수 있는지 보는 과제입니다.
```

### 13.3 `challenge/requirements.md`

필수 요구사항:

```md
- script 한 줄로 삽입 가능한 SDK 형태
- window.SupportWidget namespace 하나만 노출
- boot / shutdown / show / hide / track 구현
- anonymous/member boot 분기
- custom launcher 지원
- unread badge 표시
- popup notification 표시
- 내부 route: Home / FAQ / Messages
- Shadow DOM 또는 iframe 기반 isolation 중 택1
- host page CSS 충돌 방지
- shutdown cleanup
- SPA host route 변경 후 상태 유지
```

### 13.4 `challenge/api-contract.md`

fake API 계약을 문서화합니다.

```md
- fetchWidgetBootstrap
- fetchUnreadCount
- fetchFaqItems
- fetchMessages
- sendMessage
- trackEvent
```

실제 네트워크 API가 아니라 fake adapter라는 점을 명시합니다.

### 13.5 `challenge/scoring-rubric.md`

채점 기준:

```text
Public API 설계: 20
Lifecycle 안전성: 20
Isolation 전략: 20
DOM/Event 기본기: 15
Cleanup/메모리 누수 방지: 10
테스트 품질: 10
문서화: 5
```

### 13.6 `challenge/review-checklist.md`

멘토 리뷰 질문:

```md
- global namespace를 하나만 쓰도록 보장했나요?
- boot 이전 show 호출을 어떻게 처리했나요?
- duplicate boot 호출 시 정책은 무엇인가요?
- shutdown 시 어떤 DOM과 listener를 정리했나요?
- Shadow DOM과 iframe 중 무엇을 선택했고 이유는 무엇인가요?
- host CSS가 위젯을 깨뜨리지 못하게 어떻게 막았나요?
- custom launcher가 제거되면 어떻게 되나요?
- SPA route 변경 후 state를 어떻게 유지했나요?
- anonymous user와 member user의 boot 흐름은 어떻게 다른가요?
- track이 실패해도 사용자 경험에 영향을 주지 않나요?
```

---

## 14. `package.json` scripts

필수 scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
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

## 15. Acceptance Criteria

에이전트 작업이 완료되었다고 판단하는 기준입니다.

### 프로젝트 생성 기준

- [ ] Vite + TypeScript 프로젝트가 생성되어 있다.
- [ ] React/Vue/Svelte 등 프레임워크가 없다.
- [ ] `pnpm install` 가능하다.
- [ ] `pnpm dev` 실행 시 demo host page가 열린다.
- [ ] `pnpm build`가 통과한다.
- [ ] `pnpm test`가 실행된다.
- [ ] `pnpm test:e2e`가 실행 가능한 상태다.

### 스캐폴드 기준

- [ ] `window.SupportWidget` public API skeleton이 있다.
- [ ] boot/shutdown/show/hide/track TODO가 명확하다.
- [ ] widget mount/destroy skeleton이 있다.
- [ ] isolation strategy placeholder가 있다.
- [ ] host CSS conflict를 재현할 demo가 있다.
- [ ] custom launcher demo가 있다.
- [ ] fake API client가 있다.
- [ ] scenario system이 있다.
- [ ] test todo가 있다.
- [ ] challenge 문서가 있다.

### 금지 기준

- [ ] 완성된 정답 구현을 제공하지 않는다.
- [ ] lifecycle state machine을 완성하지 않는다.
- [ ] isolation을 완성 구현하지 않는다.
- [ ] message sending optimistic update를 완성하지 않는다.
- [ ] unread badge sync를 완성하지 않는다.
- [ ] host route persistence를 완성하지 않는다.

---

## 16. 이 스캐폴드의 핵심 원칙

```text
완성된 위젯을 주지 말고,
위젯을 완성하기 위해 필요한 경계와 문제 상황을 제공한다.
```

이 과제에서 평가해야 할 것은 예쁜 UI가 아니라 다음입니다.

```text
SDK 표면 설계
lifecycle 안전성
host 환경 격리
DOM/Event 기본기
cleanup
테스트 가능성
문서화
```
