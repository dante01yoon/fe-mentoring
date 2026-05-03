# 4회차 멘티 과제 요구서 — Vanilla Component Kit

> 이 문서는 **무엇을 만들어야 하는지**만 빠르게 확인할 수 있도록 정리한 요구서입니다.
> 평가 기준 / 운영 메모 / 큰 감점 요소 등 더 자세한 배경은 [`04-vanilla-component-kit.md`](./04-vanilla-component-kit.md) 를 보세요.
> 이 둘이 충돌하면 [`04-vanilla-component-kit.md`](./04-vanilla-component-kit.md) 가 우선합니다.

---

## 0. 한 줄 요약

프레임워크와 외부 UI 라이브러리 없이 **재사용 가능한 UI 컴포넌트 3개를 만들고**,
이 컴포넌트들을 조합해 **“미니 설문 + 약관 확인 + 완료” 흐름의 light SPA 데모 페이지**를 만드세요.

---

## 1. 무엇을 만드나요?

### 1.1 만들어야 하는 컴포넌트 (3개, 재사용 가능)

| 컴포넌트 | 옵션 | 위치 | 한 줄 정의 |
|---|---|---|---|
| **Stepper** | (필수) | [src/components/Stepper.ts](./src/components/Stepper.ts) | 단계 진행 상태(현재/완료/예정)를 시각·접근성 면에서 명확히 보여주는 컴포넌트 |
| **Modal** *또는* **BottomSheet** | 택1 | [src/components/Modal.ts](./src/components/Modal.ts) | 약관/보조정보를 띄우는 레이어 컴포넌트. ESC·overlay·focus trap·scroll lock 처리 |
| **Select** *또는* **Autocomplete** | 택1 | [src/components/Select.ts](./src/components/Select.ts) | 키보드로 탐색·선택 가능한 옵션 선택 컴포넌트 |

각 컴포넌트는 **데모 페이지 전용 함수 묶음이 아니라 독립적으로 재사용 가능해야 합니다.**
즉, 다른 프로젝트에 그대로 가져가서 쓸 수 있는 형태여야 합니다.

#### 모든 컴포넌트가 만족해야 하는 공통 계약

1. **생성 / mount / destroy 분리** — `createXxx()` 로 인스턴스를 만들고, `mount(container)` 로 DOM에 붙이고, `destroy()` 로 깔끔히 떼낼 수 있어야 함.
2. **public API 최소 셋** — 적어도 `setXxx`, `getXxx`(필요 시), `on(event, handler)`, `destroy()` 가 있어야 함.
3. **이벤트 계약** — payload는 README에 적힌 shape와 정확히 일치. 예시:
   ```json
   { "type": "change", "value": "cleaning", "label": "청소" }
   ```
4. **destroy 시 누수 0** — 본인이 등록한 listener / observer / timer / scroll lock / focus 추적은 모두 원상복구.
5. **접근성 기본기** — role/aria 속성, 키보드 탐색, focus 관리, label 연결.
6. **스타일 커스터마이징 경계 공개** — CSS 변수 또는 data attribute로 색상/spacing을 외부에서 조절할 수 있어야 함.

### 1.2 만들어야 하는 앱 — “서비스 신청 light SPA”

3개 컴포넌트를 조합해, 4단계로 진행되는 **미니 설문 + 약관 확인 + 완료 화면**을 만드세요.

| Step | 화면 | 사용해야 하는 컴포넌트 | 핵심 동작 |
|---|---|---|---|
| **Step 1** | 서비스 유형 선택 (예: 청소 / 수리 / 교육) | Stepper | 라디오 또는 카드 선택 UI. 선택 전에는 다음 단계로 갈 수 없음. |
| **Step 2** | 추가 옵션 선택 | Stepper + **Select(또는 Autocomplete)** | 옵션 목록을 키보드만으로 선택 가능해야 함. 미선택 시 진행 차단. |
| **Step 3** | 약관 확인 | Stepper + **Modal(또는 BottomSheet)** | 약관은 레이어로 띄우고, 동의 체크가 없으면 다음 단계로 갈 수 없음. |
| **Step 4** | 완료 + 요약 | Stepper | 사용자가 선택한 값(서비스 타입, 옵션, 동의 여부)이 한 화면에 요약되어야 함. |

데모 페이지의 컨테이너/뼈대는 [src/pages/funnel.ts](./src/pages/funnel.ts) 에 이미 들어 있습니다. 그 안의 `TODO(mentee)` 들을 채우면 됩니다.

---

## 2. 필수 / 금지 사항

### 2.1 필수

- 모든 step 흐름은 **키보드만으로** 처음부터 끝까지 사용 가능해야 함.
- 현재 step은 **URL과 동기화**되어야 함 (hash 라우팅 또는 history API 중 택1, 권장: hash).
- 잘못된 step 또는 만족되지 않은 전제 step에 직접 진입하면 **안전한 step으로 복구**할 것.
- 최소 **하나 이상의 invalid state 안내** 를 사용자에게 노출할 것 (예: 옵션 미선택 시 “다음” 버튼 비활성화 + 메시지).
- Modal/BottomSheet 닫힌 직후 **focus 가 이전 트리거로 복원**되어야 함.
- 컴포넌트는 destroy 후 다시 mount 해도 **깨지지 않아야** 함.

### 2.2 금지

- React / Vue / Svelte 등 프레임워크 사용 금지.
- 외부 UI 라이브러리(예: Radix, MUI, headless UI 등) 사용 금지.
- 가상 DOM 라이브러리(예: lit-html, preact, htm) 사용 금지.
- 데모 페이지 안에서만 동작하는 내부 함수에 컴포넌트 로직을 묻어두는 것 금지.

### 2.3 권장 (필수는 아님)

- 새로고침 후 마지막 step과 입력값을 `localStorage` 로 복구.
- `Promise` 기반 fake async loader로 옵션 로딩 상태(loading / success / error)를 데모.
- 컴포넌트별 단위 테스트와 데모 페이지 통합 테스트 모두 작성.

---

## 3. 제출물 (필수)

1. **Git 저장소** — 이 폴더(`4/`) 기준.
2. **README** — 아래 항목을 모두 포함:
   - 문제 해석 및 구현 범위 / 미구현 범위
   - 각 컴포넌트의 public API + 이벤트 contract (예시 payload 포함)
   - controlled / uncontrolled 판단과 그 근거
   - 라우팅 방식 (hash / history) 선택 이유
   - 접근성 고려 사항 (role/aria/keyboard/focus)
   - 스타일 확장 전략 (어떤 CSS 변수를 노출했는지)
   - trade-off / 회고
3. **컴포넌트 API 문서** — README 안에 포함하거나 `docs/` 로 분리.
4. **테스트 결과** — 최소 아래 3개 테스트는 반드시 포함:
   1. Stepper의 `stepChange` 이벤트가 올바르게 발생하는가
   2. Modal/BottomSheet 닫힘 후 focus가 이전 트리거로 복원되는가
   3. Select/Autocomplete의 `change` 이벤트가 올바르게 발생하는가
5. **실행 방법** — `pnpm install && pnpm dev` 로 동작해야 함.

---

## 4. 평가 기준 요약

| 항목 | 비중 |
|---|---|
| 요구사항 충족 | 25점 |
| 컴포넌트 계약 설계 (public API · 이벤트 contract) | 25점 |
| DOM/이벤트 처리 안정성 (destroy / 누수 / 재진입) | 20점 |
| 접근성 / UX (키보드 · focus · aria) | 15점 |
| 테스트 | 10점 |
| 문서화 | 5점 |

자세한 채점/감점 요소는 [`04-vanilla-component-kit.md`](./04-vanilla-component-kit.md) §10–§11 참고.

---

## 5. 시작 순서 (권장)

1. [`README.md`](./README.md) 의 "스캐폴드에 뭐가 있고, 무엇을 채워야 하는지" 절을 먼저 읽기.
2. `pnpm install && pnpm dev` 로 페이지가 뜨는지 확인.
3. `src/components/*.ts` 의 시그니처와 `TODO(mentee)` 부터 채우기 (Stepper → Select/Modal 순서 권장).
4. `src/pages/funnel.ts` 에서 컴포넌트들을 조합해 4단계 흐름 완성.
5. 라우팅(hash) ↔ step ↔ 입력값 동기화.
6. 접근성 점검 (키보드만으로 끝까지 / 스크린리더에 현재 step 전달 / Modal focus trap).
7. destroy 검증 (console에 listener leak이 없는지, dispose 후 다시 mount해도 정상 동작하는지).
8. 테스트 추가 + README 채우기.
