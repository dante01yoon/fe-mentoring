# 4회차 — Vanilla Component Kit (스캐폴드)

프레임워크 없이 재사용 가능한 컴포넌트 3개를 만들고, 이를 조합한 light SPA 데모 페이지를 구현합니다.
이 디렉터리는 **멘티가 바로 작업을 시작할 수 있도록 준비된 스캐폴드**입니다.

> 과제 명세서(원문): [`04-vanilla-component-kit.md`](./04-vanilla-component-kit.md)
> 멘티용 요구서(요약): [`REQUIREMENTS.md`](./REQUIREMENTS.md)
> 이 README는 **무엇이 이미 만들어져 있고 / 무엇을 멘티가 채워야 하는지**만 정리합니다.

---

## 1. 실행

```bash
pnpm install
pnpm dev
```

- 개발 서버는 [http://localhost:5174](http://localhost:5174) 에서 열립니다.
- 백엔드/Mock 서버는 없습니다. 본 회차는 **API가 필요 없는 과제**입니다.

빌드/타입 체크:

```bash
pnpm build
pnpm typecheck
```

---

## 2. 디렉터리 구조

```
4/
├── 04-vanilla-component-kit.md   ← 과제 명세 (원문)
├── REQUIREMENTS.md                ← 멘티용 요구서 (이걸 먼저 읽으세요)
├── README.md                      ← 이 문서 (스캐폴드 안내)
├── index.html                     ← #app 마운트 포인트, base.css 로딩
└── src/
    ├── main.ts                    ← FunnelPage 마운트 + HMR dispose
    ├── styles/
    │   └── base.css               ← 토큰(색/spacing/focus ring), 리셋
    ├── lib/
    │   ├── createEmitter.ts       ← 작은 타입 안전 이벤트 에미터
    │   └── router.ts              ← 최소 hash 라우터
    ├── components/
    │   ├── Stepper.ts             ← 시그니처 + TODO 스켈레톤
    │   ├── Modal.ts               ← 시그니처 + TODO 스켈레톤 (BottomSheet으로 대체 가능)
    │   └── Select.ts              ← 시그니처 + TODO 스켈레톤 (Autocomplete으로 대체 가능)
    └── pages/
        └── funnel.ts              ← 4단계 데모 페이지 컨테이너 (TODO)
```

---

## 3. 무엇이 이미 만들어져 있나요?

이 영역은 **건드리지 않아도 됩니다.** (필요하면 수정해도 됩니다.)

### 3.1 Vite + TypeScript 환경

- `vite`, `typescript` 만 설치된 최소 구성.
- 외부 UI 라이브러리/프레임워크 의존성 없음 — 의도적으로 빈 상태입니다.

### 3.2 베이스 스타일 토큰

[src/styles/base.css](./src/styles/base.css) 에 색/spacing/focus ring CSS 변수를 정리해 두었습니다.
컴포넌트는 이 토큰을 그대로 쓰거나, 컴포넌트 내부에서 자체 변수로 덮어써 커스터마이징 경계를 보여주세요.

### 3.3 작은 유틸 두 개

- [src/lib/createEmitter.ts](./src/lib/createEmitter.ts) — 타입 안전한 작은 emitter. 컴포넌트마다 개별로 갖게 하면 `destroy()` 시 정리가 쉽습니다.
- [src/lib/router.ts](./src/lib/router.ts) — 최소 hash 라우터. start/stop/go/on 만 있는 골격.

> 이 둘은 “굳이 직접 안 짜도 되는 잡일”을 줄이기 위함입니다. 직접 다시 짜고 싶다면 그래도 됩니다 — 단, 이유를 README에 적어주세요.

### 3.4 데모 페이지 컨테이너

[src/pages/funnel.ts](./src/pages/funnel.ts) 에 `mount/destroy` 골격, step 정의, 라우터 연결만 들어 있습니다.
실제 step별 화면 / 컴포넌트 조합은 멘티가 채웁니다.

---

## 4. 무엇을 채워야 하나요?

### 4.1 컴포넌트 구현 (필수)

| 파일 | 핵심 작업 |
|---|---|
| [src/components/Stepper.ts](./src/components/Stepper.ts) | step 렌더, 현재/완료 표시, 클릭/키보드 이동, `stepChange` emit, destroy 정리 |
| [src/components/Modal.ts](./src/components/Modal.ts) | open/close, ESC, overlay, focus trap + restore, body scroll lock, `open`/`close` emit |
| [src/components/Select.ts](./src/components/Select.ts) | 키보드 탐색(↑↓/Enter/Esc/Home/End), highlight, 선택 후 닫힘, `change` emit, 외부 클릭 처리 |

각 파일에 시그니처와 `TODO(mentee)` 가 미리 적혀 있습니다. 시그니처를 굳이 따라가지 않아도 되지만, **public API 와 이벤트 payload contract 는 README/REQUIREMENTS와 일치**시켜야 합니다.

> Modal 대신 BottomSheet, Select 대신 Autocomplete을 골랐다면 파일명도 그에 맞춰 바꾸고, `pages/funnel.ts` 의 import도 갱신하세요. 이벤트 contract는 동일한 shape를 유지해야 합니다.

### 4.2 데모 페이지 (필수)

[src/pages/funnel.ts](./src/pages/funnel.ts) 에서 다음을 채웁니다:

1. Stepper, Modal, Select 인스턴스 생성 + mount
2. step별 dom 렌더 (`step-1` ~ `step-4`)
3. 라우트 ↔ Stepper ↔ 입력값 상태 동기화
4. 잘못된 step 진입 시 안전한 step으로 redirect
5. invalid state 안내 (옵션/약관 미충족 시 “다음” 차단 + 메시지)
6. destroy 시 모든 컴포넌트 destroy 호출

### 4.3 라우팅 (필수)

기본 골격은 hash 라우터입니다. 그대로 써도 되고 history API 기반으로 바꿔도 됩니다.
선택한 방식과 이유를 README의 “라우팅 방식” 절에 적어주세요.

### 4.4 테스트 (필수, 최소 3개)

테스트 러너는 미리 설치해두지 않았습니다. Vitest 권장이지만 자유입니다 — 선택한 도구를 추가하면서 README에 이유를 적어주세요.

최소 포함해야 할 케이스:

1. Stepper의 `stepChange` 이벤트가 올바른 payload로 발생하는가
2. Modal/BottomSheet 닫힘 후 focus가 트리거로 복원되는가
3. Select/Autocomplete의 `change` 이벤트가 올바른 payload로 발생하는가

권장 추가:

- destroy 후 listener / scroll lock / event 누수가 없는가
- keyboard navigation (Tab, ↑↓, Enter, Esc)
- hash 변경과 step 동기화
- invalid state에서 다음 진행이 차단되는가

### 4.5 문서 (필수)

제출 시 README에 아래 슬롯을 채워주세요. 자세한 항목은 [`REQUIREMENTS.md`](./REQUIREMENTS.md) §3 참고.

- 프로젝트 개요 / 실행 방법 / 테스트 방법
- 각 컴포넌트의 public API + 이벤트 contract
- controlled / uncontrolled 판단
- 라우팅 방식 선택 이유
- 접근성 전략 (role/aria/keyboard/focus)
- 스타일 확장 전략 (노출한 CSS 변수)
- 구현 / 미구현 범위, trade-off, 회고

---

## 5. 자주 빠지는 함정

원문 §12 “자주 나오는 실수”에서 발췌:

- 컴포넌트 생성 시 바로 DOM에 붙여버려 재사용성이 떨어진다 → `create` 와 `mount` 를 분리하세요.
- 이벤트 이름과 payload가 컴포넌트마다 제각각이다 → README에 contract를 고정한 뒤 일관되게 씁니다.
- Modal을 닫은 뒤 focus가 사라진다 → open 직전 active element를 저장하고 close에서 복원.
- destroy가 사실상 아무 일도 안 한다 → 본인이 등록한 모든 listener/timer/observer를 정리.
- Stepper가 단순 스타일 컴포넌트에 머물고 흐름과 연결되지 않는다 → 라우터/상태와 양방향 동기화.
- Select가 클릭으로만 동작한다 → 키보드 탐색이 없으면 큰 감점.
