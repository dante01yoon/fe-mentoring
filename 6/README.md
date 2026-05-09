# Embeddable Support Widget — 6회차 스캐폴드

6회차 프론트엔드 멘토링 과제 scaffold입니다. **이 저장소는 정답이 아니며**, 멘티가 채워야 할 위치(`TODO(student)`) 가 곳곳에 비어 있습니다.

전체 요구기획서는 [`REQUIREMENTS.md`](./REQUIREMENTS.md)가 소스 오브 트루스입니다. 이 README는 **무엇을 / 왜 / 어떻게** 만드는지 멘티가 한눈에 파악할 수 있도록 정리한 문서입니다.

---

## 1. 이 과제는 왜 존재하는가

지금까지의 회차는 모두 "내 페이지 안에서 동작하는 React 앱"을 만들었습니다. 6회차는 정반대입니다.

> **남의 웹페이지 위에 한 줄 `<script>` 로 삽입되어, 내 통제 밖의 환경에서 안전하게 동작해야 하는 SDK** 를 만듭니다.

```html
<script src="/widget.js"></script>
<script>
  window.SupportWidget.boot({
    appId: "demo-app",
    user: { id: "u_001", name: "Jaewon Kim", email: "jaewon@example.com" }
  });
  window.SupportWidget.show();
</script>
```

이 환경은 React 앱을 만들 때와 가정이 완전히 다릅니다.

- host 페이지의 CSS가 `* { all: unset }` 처럼 적대적일 수 있고
- host가 SPA 라면 route가 바뀌어도 페이지가 새로 로드되지 않고
- host가 다른 라이브러리로 전역을 더럽혔을 수 있고
- 사용자가 `shutdown()` 을 호출하면 흔적 없이 사라져야 하고
- React, Vue, jQuery 어떤 환경에 들어가도 동작해야 하기에 **프레임워크를 쓸 수 없습니다.**

이런 제약은 평소 React 컴포넌트를 만들 때는 보이지 않습니다. 이 과제는 그 보이지 않던 경계 — **SDK 표면 · lifecycle · isolation · cleanup** — 을 직접 다뤄보게 만드는 것이 목적입니다.

> 이 과제는 채팅창 UI를 예쁘게 만드는 과제가 아닙니다.
> 외부 웹페이지에 삽입되는 SDK의 **public API · lifecycle · isolation · cleanup** 을 설계할 수 있는지 보는 과제입니다.

---

## 2. 검증하려는 역량 (왜 이런 요구를 하는가)

| 검증 대상 | 왜 검증하는가 | 어디서 드러나는가 |
| --- | --- | --- |
| 프레임워크 없이 DOM/Event 다루기 | host가 어떤 환경이든 동작해야 하므로 React를 쓸 수 없음 | 모든 widget 코드 |
| public API 표면 설계 | 잘못된 API는 한번 깔리면 되돌릴 수 없음. SDK는 곧 계약 | `src/sdk/public-api.ts`, `src/sdk/index.ts` |
| boot/shutdown/show/hide/track lifecycle | 잘못된 순서 호출(예: boot 전 show)도 죽지 않아야 함 | `src/sdk/runtime.ts`, `src/sdk/lifecycle.ts` |
| host CSS·JS 격리 | host의 `button { all: unset }` 같은 강한 CSS가 위젯을 깨뜨림 | `src/isolation/`, `public/demo-host.css` |
| cleanup / 메모리 누수 방지 | shutdown 후 listener·timer·DOM 흔적이 남으면 host가 천천히 죽음 | `mount.ts` 의 destroy 반환값 |
| anonymous / member 분기 | 익명·로그인 사용자의 부팅 흐름이 다름 (인증·데이터 로딩 차이) | `runtime.ts`, `mocks/api-client.ts` |
| SPA host route 변경 대응 | host가 pushState로 라우트를 바꿔도 위젯이 깨지지 않아야 함 | `src/host/route-simulator.ts` |
| 테스트 가능한 분리 | DOM 직접 조작은 테스트가 어려워서 분리하지 않으면 망함 | `src/test/*.test.ts` |

---

## 3. 무엇을 만들어야 하는가 (요구사항)

### 3.1 Public API

`window.SupportWidget` 하나만 노출합니다. 이 외의 전역은 만들지 않습니다.

```ts
type SupportWidgetAPI = {
  boot(config: SupportWidgetBootConfig): Promise<void> | void;
  shutdown(): void;
  show(): void;
  hide(): void;
  track(event: TrackEventPayload): void;
};
```

전체 타입은 `src/sdk/public-api.ts` 에 이미 정의되어 있습니다 (변경 금지 — 변경하면 host와의 계약이 깨집니다).

### 3.2 Boot Config

```ts
type SupportWidgetBootConfig = {
  appId: string;
  user?: { id: string; name?: string; email?: string } | null;
  locale?: "ko" | "en";
  launcher?: { mode: "default" | "custom"; selector?: string };
  theme?: { primaryColor?: string };
};
```

- `user: null` → anonymous 부팅
- `user: { id, ... }` → member 부팅
- `launcher.mode: "custom"` → host의 임의 버튼을 launcher로 사용 (`selector` 로 지정)

### 3.3 멘티가 채워야 할 핵심 TODO

| 위치 | 무엇을 | 왜 |
| --- | --- | --- |
| `src/sdk/runtime.ts`                   | lifecycle state · boot 중복 정책 · shutdown cleanup · show/hide 가드 | SDK의 심장. 여기 깨지면 전부 깨짐 |
| `src/sdk/lifecycle.ts`                 | 상태 전이 helper | 잘못된 호출 순서를 명시적으로 방어 |
| `src/widget/mount.ts`                  | root 생성 · launcher/panel/badge 구성 · destroy 반환 | cleanup 가능한 형태가 핵심 |
| `src/widget/router.ts`                 | Home / FAQ / Messages 전환 | host URL을 침범하지 않는 내부 라우팅 |
| `src/widget/components/launcher.ts`    | 기본 launcher 또는 custom launcher 어댑팅 | host 버튼을 빌려쓸 수 있어야 함 |
| `src/widget/components/unread-badge.ts` | unread count 표시 + 동기화 | fake API · 이벤트 · localStorage 3자 합치기 |
| `src/widget/components/notification.ts` | popup notification | mount/unmount 타이밍 훈련 |
| `src/isolation/strategy.ts`            | shadow-dom 또는 iframe 중 하나 선택 | host CSS로부터 위젯을 보호 |
| `src/isolation/create-shadow-root.ts`  | Shadow DOM 격리 구현 | 가벼운 격리, 일부 상속 위험 |
| `src/isolation/create-iframe-root.ts`  | iframe 격리 구현 | 강한 격리, 통신·좌표·a11y 비용 |
| `src/host/route-simulator.ts`          | host의 SPA route 변경 시뮬 | 멘티가 자신의 widget을 깨뜨려보는 자리 |
| `src/host/custom-launcher.ts`          | host 임의 버튼을 launcher로 | "host 버튼이 사라지면?" 도 멘티 몫 |
| `src/mocks/api-client.ts`              | bootstrap / unread / faq / messages / sendMessage / track | 시나리오 분기 + 실패 처리 |
| `src/shared/storage.ts`                | localStorage adapter (visibility · last-route · draft · user) | private mode · 차단 환경 fallback |
| `src/shared/events.ts`                 | event bus 구현 | DOM event vs custom event vs subscribe 결정 |
| `src/test/*.test.ts`                   | `it.todo` → 실제 `it(...)` | 테스트 가능성을 강제 |
| `e2e/*.spec.ts`                        | boot · custom launcher · host route 시나리오 | 진짜 환경에서의 검증 |

### 3.4 Mock scenario 시스템 (제공됨)

이 시스템 자체가 학습 자료입니다. SDK는 다양한 실패에 대비해야 하기에, 시나리오를 미리 코드에 박아둡니다.

| scenario | 검증 목적 |
| --- | --- |
| `default`              | happy path |
| `anonymous`            | 익명 부팅 |
| `member`               | 로그인 부팅 |
| `slow-boot`            | bootstrap 지연 시 UX |
| `boot-failure`         | bootstrap 실패 시 graceful fallback |
| `unread-failure`       | unread API만 실패 (badge가 죽어도 위젯은 살아야 함) |
| `message-send-failure` | 전송 실패 시 사용자 표시 + retry |
| `host-route-change`    | host SPA route가 바뀌어도 위젯 상태 유지 |
| `css-conflict`         | host의 적대적 CSS가 적용된 상태 |

### 3.5 Demo Host Page (제공됨, 일부러 시끄러움)

`public/demo-host.css` 는 **일부러** 적대적입니다.

```css
* { box-sizing: border-box; }
button { all: unset; font-size: 48px; color: red; }
div { border: 10px solid hotpink; }
.fixed { z-index: 1; }
```

이게 정상입니다. **isolation 전략을 적용하기 전에는 위젯이 깨져 보이는 게 맞습니다.** 멘티가 Shadow DOM 또는 iframe으로 격리한 후에는 깨지지 않아야 합니다 — 이 차이가 isolation 학습의 핵심입니다.

데모 host에는 다음 버튼이 있습니다 (제공됨):

```text
[Boot anonymous] [Boot member] [Shutdown]
[Show] [Hide] [Track fake event]
[Simulate host route change] [Use custom launcher]
```

---

## 4. 절대 하지 말아야 할 것 (왜)

| 금지 | 왜 |
| --- | --- |
| React / Vue / Svelte / Solid / Lit | host 환경 어디든 동작해야 하므로 프레임워크 없이 DOM 기본기로 |
| jQuery | 위젯이 host의 jQuery 버전과 충돌할 수 있음 |
| 상태 관리 라이브러리 | 위젯의 상태는 매우 작음. 라이브러리는 과도함 |
| 대형 UI 라이브러리 | 번들이 커지면 host 페이지가 느려짐 |
| 추가 전역 변수 | `window.SupportWidget` 하나만 허용 |
| 정답 lifecycle / isolation 미리 작성 | 멘티 학습 목표를 망침 |

---

## 5. 실행 방법

```bash
pnpm install
pnpm dev          # http://localhost:5176 (데모 host 페이지)
pnpm typecheck
pnpm build
pnpm test         # Vitest. 현재는 대부분 it.todo
pnpm test:e2e     # Playwright. 스캐폴드는 placeholder
```

scenario 변경:

- 데모 host 페이지의 버튼을 누르면 `setWidgetScenario(...)` 가 호출됩니다.
- 또는 브라우저 콘솔에서 직접:
  ```js
  // src/mocks/scenarios.ts 의 setWidgetScenario 가 import 되어 있어야 합니다.
  setWidgetScenario("boot-failure");
  ```

---

## 6. 권장 구현 순서

학습 효과가 가장 큰 순서입니다.

1. **`src/sdk/runtime.ts`** — boot/shutdown/show/hide/track 의 lifecycle state를 먼저 설계합니다. 이게 흔들리면 다른 모든 게 흔들립니다.
2. **`src/widget/mount.ts`** — 단순한 panel만 mount. 이 시점에는 host CSS에 깨져 보여야 정상입니다.
3. **isolation 1개 선택** — Shadow DOM 또는 iframe. 적용 후 깨지지 않는지 비교.
4. **launcher / panel / unread badge** — 컴포넌트 단위로 점진적 추가.
5. **fake API 연동** — `mocks/api-client.ts` 의 시나리오 분기 채우기.
6. **위젯 내부 router** — Home / FAQ / Messages.
7. **shutdown cleanup 검증** — listener · timer · DOM · storage 흔적 확인.
8. **SPA host route 변경 대응** — `host-route-change` 시나리오로 검증.
9. **테스트** — `it.todo` → 실제 `it(...)`.

---

## 7. 제출 전 체크리스트

- [ ] `pnpm typecheck` 통과
- [ ] `pnpm build` 통과
- [ ] `pnpm test` 통과 (`it.todo` 가 실제 테스트로 바뀌어야 함)
- [ ] `pnpm test:e2e` 가 최소 1개 시나리오에서 통과
- [ ] `window.SupportWidget` 외에 추가 전역이 없음 (`Object.keys(window)` 비교)
- [ ] shutdown 직후 DOM / listener / timer / storage 흔적이 남지 않음
- [ ] host CSS가 위젯을 깨뜨리지 않음 (isolation 적용 전/후 스크린샷 비교)
- [ ] anonymous / member boot 분기 동작
- [ ] custom launcher 동작 (`launcher.mode: "custom"`)
- [ ] SPA host route 변경 후 위젯 상태 유지

---

## 8. 평가 기준

자세한 점수는 [`challenge/scoring-rubric.md`](./challenge/scoring-rubric.md).

| 항목 | 점수 | 의미 |
| --- | --- | --- |
| Public API 설계 | 20 | 사용자(host 개발자) 입장에서 일관되고 안전한가 |
| Lifecycle 안전성 | 20 | 잘못된 순서 호출에도 죽지 않는가 |
| Isolation 전략 | 20 | host CSS가 위젯을 깨뜨리지 못하는가 |
| DOM/Event 기본기 | 15 | 프레임워크 없이도 깔끔한가 |
| Cleanup / 메모리 누수 방지 | 10 | shutdown 후 흔적이 없는가 |
| 테스트 품질 | 10 | 단위 + e2e |
| 문서화 | 5 | 결정 근거 (Shadow DOM vs iframe 등) 가 README에 |

---

## 9. 트레이드오프 (멘티가 결정해야 할 항목)

이 과제에는 정답이 없는 결정이 몇 가지 있습니다. **선택과 그 이유** 를 README나 PR description에 남기세요.

- **Shadow DOM vs iframe**
  Shadow DOM은 같은 document 안이라 focus / event가 자연스럽지만 일부 CSS 상속이 새어 들어옵니다.
  iframe은 더 강한 격리지만 postMessage 통신 / 좌표계 / accessibility 비용이 큽니다.

- **history API 패치 vs popstate만 듣기**
  진짜 SPA host는 `pushState` 후 popstate를 발생시키지 않으므로 `history.pushState`를 monkey-patch 해야 100% 감지됩니다. 하지만 이는 host 환경 침해입니다.
  안전한 기본값과 강력한 기본값 사이에서 선택해야 합니다.

- **Storage 의존**
  `localStorage`는 private mode / SSR / 차단된 환경에서 throw 합니다.
  in-memory fallback을 준비하거나, 위젯이 storage 없이도 동작하게 해야 합니다.

- **Boot 중복 호출 정책**
  - 무시? → 과거 config가 유지됨 (이상한 디버깅 발생)
  - 기존 인스턴스 destroy 후 재부팅? → state 손실
  - throw? → host 개발자에게 친화적이지 않음
  멘티가 정책을 정하고 문서화해야 합니다.

---

## 10. 한계

- 실제 백엔드는 없습니다. `mocks/api-client.ts` 의 in-memory state만 있습니다.
- 디자인 polish는 평가 대상이 아닙니다. SDK 표면 · lifecycle · isolation 만 평가합니다.
- 멘티가 작성한 e2e가 통과하려면 dev server가 켜져 있어야 합니다.

---

## 11. 참고 문서

- [`REQUIREMENTS.md`](./REQUIREMENTS.md) — 전체 요구기획서 (소스 오브 트루스)
- [`challenge/overview.md`](./challenge/overview.md) — 과제 의도
- [`challenge/requirements.md`](./challenge/requirements.md) — 요구사항 체크리스트
- [`challenge/api-contract.md`](./challenge/api-contract.md) — fake API 계약
- [`challenge/review-checklist.md`](./challenge/review-checklist.md) — 멘토 리뷰 질문
- [`challenge/scoring-rubric.md`](./challenge/scoring-rubric.md) — 채점 기준
