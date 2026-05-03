# 4회차 과제 명세서 — Vanilla Component Kit

## 1. 과제 개요

이 과제의 목적은 프레임워크 없이 **재사용 가능한 UI 컴포넌트 3개와 이를 조합한 light SPA 데모**를 구현하면서,
프론트엔드 개발자가 아래를 얼마나 명확하게 설계하는지 확인하는 것입니다.

이번 회차에서 보고 싶은 것은 아래입니다.

- 컴포넌트의 public API를 얼마나 설명 가능하게 설계하는가
- DOM과 이벤트를 직접 다루면서도 재사용성을 확보하는가
- mount / update / destroy lifecycle을 분명하게 정의하는가
- keyboard navigation, focus 관리, aria 같은 접근성 기본기를 지키는가
- 스타일 커스터마이징 경계를 CSS 변수 등으로 안정적으로 여는가
- API가 전혀 없어도 상태, 라우팅, 이벤트 계약을 스스로 정의할 수 있는가

이번 과제는 **의도적으로 API가 거의 필요 없는 과제**입니다.
즉, “서버가 없어서 못 했다”는 이유가 통하지 않습니다.
오히려 서버 없이도 구현 가능한 문제를 얼마나 단단하게 푸는지를 봅니다.

---

## 2. API가 없는데 어떻게 진행하는가

## 2.1 이번 회차의 전제

이번 과제는 실제 HTTP API가 없어도 충분히 구현 가능한 과제입니다.
기본적으로 아래 원칙으로 진행합니다.

1. 필수 기능은 **모두 클라이언트 단에서 구현**합니다.
2. 폼 상태, step 상태, 선택 상태, 열림/닫힘 상태는 메모리 또는 URL로 관리합니다.
3. 필요하다면 `Promise` 기반 fake async loader를 써도 되지만, 실제 HTTP 요청은 필수가 아닙니다.
4. 테스트도 서버 응답이 아니라 DOM 변화와 이벤트 계약 검증에 집중합니다.

## 2.2 이번 회차는 왜 무API 과제인가

이 회차는 React, Query, Form 라이브러리 도움 없이도 아래를 직접 다루는지 보기 위함입니다.

- DOM 생성과 업데이트
- 이벤트 리스너 등록/해제
- focus 이동
- 컴포넌트 간 통신
- hash/history 라우팅 또는 internal state routing
- teardown 이후 메모리 누수 방지

즉, 이번 회차의 핵심은 **브라우저 기본기를 드러내는 것**입니다.

## 2.3 평가 대상이 아닌 것

- 실제 서버 통신
- 백엔드 구현
- 전역 상태 라이브러리
- 번들러 최적화
- 대규모 디자인 시스템

## 2.4 평가 대상인 것

- 컴포넌트의 public contract
- custom event 설계
- controlled / uncontrolled 판단
- destroy와 cleanup
- 접근성 기초
- light SPA로 조합하는 능력

---

## 3. 구현 범위

## 3.1 필수 구현 대상

아래 3개 컴포넌트를 구현합니다.

1. `Stepper`
2. `Modal` 또는 `BottomSheet` 중 택1
3. `Select` 또는 `Autocomplete` 중 택1

## 3.2 필수 데모 페이지

위 3개 컴포넌트를 조합해 아래 흐름을 가진 데모 페이지를 만듭니다.

- Step 1: 서비스 유형 선택
- Step 2: 추가 옵션 선택
- Step 3: 약관 동의 또는 요약 확인
- Step 4: 완료 화면

즉, **미니 설문 + 약관 확인 + 완료** 흐름의 light SPA를 만들어야 합니다.

## 3.3 필수 제약

- React/Vue/Svelte 같은 프레임워크 금지
- 외부 UI 라이브러리 금지
- 가상 DOM 라이브러리 금지
- 컴포넌트는 재사용 가능해야 하며, 데모 페이지 전용 함수 묶음이어서는 안 됨
- destroy 후 이벤트 리스너나 타이머가 남지 않아야 함
- 키보드만으로 주요 기능을 사용할 수 있어야 함

---

## 4. 구현 대상 상세 요구사항

## 4.1 `Stepper`

### 목적
여러 단계를 표현하고 현재 단계/완료 상태를 시각적으로 보여줍니다.

### 필수 기능
- 총 step 목록 렌더링
- 현재 step 표시
- 완료된 step 표시
- 사용 가능 step 클릭 이동 또는 programmatic 이동
- 이전/다음 제어와 연동 가능해야 함

### 권장 public API 예시
- `createStepper(options)`
- `mount(container)`
- `setCurrentStep(stepId)`
- `setCompleted(stepIds)`
- `on('stepChange', handler)`
- `destroy()`

### 요구사항
- 현재 step은 시각적으로 구분되어야 함
- 현재 step 이전/이후 상태를 명확히 구분
- 클릭 가능한지 여부를 제어할 수 있어야 함
- step label은 텍스트로 제공 가능해야 함

### 접근성 요구사항
- step list의 역할을 명확히 표현할 것
- 현재 step을 보조기기에 전달할 것
- 키보드로 step 전환이 가능하거나, 적어도 포커스 이동이 가능해야 함

---

## 4.2 `Modal` 또는 `BottomSheet`

### 목적
약관 확인, 보조 정보 표시, 상세 선택 UI 등에 재사용 가능한 레이어 컴포넌트를 구현합니다.

### 필수 기능
- 열기 / 닫기
- overlay 클릭 닫기 여부 설정 가능
- ESC 키 닫기
- focus trap 또는 close 후 focus restore
- 제목/본문/액션 영역 지원
- body scroll lock 또는 이에 준하는 처리

### 권장 public API 예시
- `createModal(options)` 또는 `createBottomSheet(options)`
- `open()`
- `close()`
- `setContent(content)`
- `on('open', handler)`
- `on('close', handler)`
- `destroy()`

### 요구사항
- 열렸을 때 focus가 적절한 위치로 이동해야 함
- 닫히면 이전 focus로 복원되어야 함
- 중첩 modal은 필수가 아니지만, 최소한 재진입 시 깨지지 않아야 함
- 데모 페이지에서는 약관 보기 또는 선택 보조 UI에 실제로 사용해야 함

### 접근성 요구사항
- dialog 역할과 label 연결
- 키보드만으로 닫기 가능
- 포커스가 레이어 밖으로 빠져나가지 않게 처리

---

## 4.3 `Select` 또는 `Autocomplete`

### 목적
옵션 선택용 재사용 컴포넌트를 구현합니다.

### 필수 기능
- 옵션 목록 렌더링
- 현재 선택값 표시
- 키보드로 이동/선택
- disabled 상태 지원
- 초기값 설정 가능
- value 변경 이벤트 제공

### 추가 요구사항
- `Select`를 선택했다면:
  - 열기/닫기
  - 옵션 highlight
  - 선택 후 닫힘
- `Autocomplete`를 선택했다면:
  - 입력값에 따른 필터링
  - 키보드 탐색
  - 결과 없음 상태

### 권장 public API 예시
- `createSelect(options)` 또는 `createAutocomplete(options)`
- `mount(container)`
- `setOptions(options)`
- `setValue(value)`
- `getValue()`
- `on('change', handler)`
- `destroy()`

### 접근성 요구사항
- label과 연결
- 현재 선택 상태 전달
- 키보드 탐색 가능
- 포커스 이동이 자연스러울 것

---

## 4.4 데모 페이지(light SPA)

### 목적
만든 컴포넌트가 실제 문제 해결에 조합 가능한지 확인합니다.

### 필수 흐름
- Step 1: 서비스 유형 선택
  - 예: 청소 / 수리 / 교육
- Step 2: 옵션 선택
  - Select 또는 Autocomplete 사용
- Step 3: 약관 확인
  - Modal 또는 BottomSheet 사용
- Step 4: 완료 화면
  - 선택 요약 표시

### 필수 요구사항
- Stepper와 데모 페이지가 연동되어야 함
- 브라우저 뒤로가기 또는 hash routing 중 하나를 지원해야 함
- 새로고침 후 마지막 step 복구는 선택이지만 권장
- 사용자가 선택한 값 요약을 완료 화면에 보여줄 것
- 최소 하나 이상의 invalid state를 사용자에게 보여줄 것
  - 예: 옵션 미선택 시 다음 단계로 진행 불가

### 권장 구현 방식
- hash 기반 light SPA
- internal router + in-memory state
- 상태 복구가 필요하면 localStorage 사용 가능

---

## 5. 컴포넌트 계약 요구사항

## 5.1 공통 원칙

모든 컴포넌트는 아래 공통 원칙을 만족해야 합니다.

1. 생성과 mount가 분리되어 있을 것
2. 외부에서 제어 가능한 최소 public API가 있을 것
3. custom event 또는 callback contract가 문서화되어 있을 것
4. destroy 시 이벤트 리스너, observer, timer가 정리될 것
5. 스타일 오버라이드 경계가 문서화되어 있을 것

## 5.2 이벤트 계약

각 컴포넌트는 아래처럼 예측 가능한 이벤트 계약을 가져야 합니다.

### 예시
- Stepper
  - `stepChange`
- Modal/BottomSheet
  - `open`
  - `close`
- Select/Autocomplete
  - `change`
  - `open`
  - `close`

이벤트 payload는 아래처럼 **설명 가능한 shape**를 가져야 합니다.

```json
{
  "type": "change",
  "value": "cleaning",
  "label": "청소"
}
```

## 5.3 controlled / uncontrolled 판단

반드시 둘 다 구현할 필요는 없습니다.
하지만 아래는 문서로 반드시 설명해야 합니다.

- 이 컴포넌트는 controlled 인가
- uncontrolled 인가
- 외부 state와 어떻게 연결되는가
- 내부 state는 어디까지 책임지는가

## 5.4 스타일 커스터마이징

컴포넌트는 최소한 아래 수준의 스타일 확장성을 가져야 합니다.

- CSS 변수 기반 색상/spacing 조정
- variant class 또는 data attribute 활용 가능
- host 페이지 스타일과 충돌을 최소화하는 구조

---

## 6. 상태 / 라우팅 요구사항

## 6.1 상태 관리

이번 회차는 서버 상태가 없기 때문에 아래 정도의 상태만으로 충분합니다.

- 현재 step
- 각 step의 입력값
- modal 열림/닫힘 상태
- select/autocomplete 선택값
- 완료 여부

### 권장 저장 위치
- 메모리 state
- URL hash 또는 history state
- 필요하면 localStorage

## 6.2 라우팅

아래 중 하나를 선택합니다.

1. hash 기반 light SPA
2. history API 기반 light SPA

둘 중 어느 쪽을 쓰든, 아래가 만족되어야 합니다.

- 현재 step을 URL과 어느 정도 연결할 것
- 뒤로가기 동작이 자연스러울 것
- 잘못된 step 접근 시 안전하게 복구할 것

## 6.3 API가 꼭 필요하다면

필수는 아니지만, `Select` 옵션 로딩을 async처럼 보여주고 싶다면
실제 HTTP 대신 아래와 같은 fake loader를 쓸 수 있습니다.

```ts
function loadOptions(): Promise<Array<{ label: string; value: string }>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { label: '청소', value: 'cleaning' },
        { label: '수리', value: 'repair' },
        { label: '교육', value: 'education' }
      ]);
    }, 300);
  });
}
```

이 경우에도 핵심은 서버 통신이 아니라 **로딩 상태와 재사용 가능한 옵션 컴포넌트 설계**입니다.

---

## 7. UX 요구사항

- 키보드만으로 주요 흐름을 사용할 수 있어야 함
- Select/Autocomplete는 현재 focus와 highlight가 시각적으로 드러나야 함
- Modal/BottomSheet가 열렸을 때 배경과 구분되어야 함
- 약관을 보지 않고 넘어갈 수 없는 경우 적절한 안내가 있어야 함
- 완료 화면에는 사용자가 선택한 핵심 값이 요약되어야 함
- 에러 메시지는 가능한 한 인접한 위치에 보여줄 것
- destroy 후 다시 mount해도 깨지지 않아야 함

---

## 8. 테스트 요구사항

최소 아래 테스트를 포함해야 합니다.

1. Stepper step 전환 이벤트가 올바르게 발생하는지
2. Modal/BottomSheet 닫힘 후 focus restore가 되는지
3. Select/Autocomplete change 이벤트가 올바르게 발생하는지

권장 추가 테스트
- destroy 후 listener 정리 여부
- keyboard navigation
- hash route 변화와 step 동기화
- invalid state에서 진행 차단

---

## 9. 제출물

### 필수 제출물
- Git 저장소
- 실행 방법
- README
- 컴포넌트 API 문서
- 테스트 실행 결과

### README 필수 항목
- 문제 해석
- 각 컴포넌트의 public API
- 이벤트 목록
- controlled / uncontrolled 판단
- 라우팅 방식
- 접근성 고려 사항
- 스타일 확장 전략
- 구현 범위 / 미구현 범위
- trade-off
- 회고

---

## 10. 채점 기준

- 요구사항 충족: 25점
- 컴포넌트 계약 설계: 25점
- DOM/이벤트 처리 안정성: 20점
- 접근성/UX: 15점
- 테스트: 10점
- 문서화: 5점

---

## 11. 큰 감점 요소

- 컴포넌트가 사실상 데모 페이지 전용 코드인 경우
- destroy가 없어 listener 누수 가능성이 큰 경우
- 키보드 사용이 거의 불가능한 경우
- focus 관리가 전혀 없는 경우
- 이벤트 payload나 public API가 문서화되지 않은 경우
- 프레임워크 또는 외부 UI 라이브러리에 의존한 경우
- README에 “왜 이렇게 설계했는지”가 없는 경우

---

## 12. 멘토용 운영 메모

이번 회차는 “예쁘게 만들기”보다,
**브라우저 기본기와 컴포넌트 계약을 얼마나 설명 가능하게 드러내는지**를 보는 회차입니다.

멘토는 아래를 집중적으로 확인하면 좋습니다.

1. 컴포넌트의 생성 / mount / destroy 경계가 분명한가
2. custom event contract가 재사용 가능한 수준인가
3. internal state와 external state의 책임이 분명한가
4. focus restore, ESC 닫기, keyboard navigation 같은 기본기가 지켜졌는가
5. 데모 페이지가 이 컴포넌트를 실제로 조합 가능한지 보여주는가

이 회차에서 자주 나오는 실수는 아래입니다.

- 컴포넌트 생성 시 바로 DOM에 붙여버려 재사용성이 떨어짐
- 이벤트 이름과 payload가 제각각이라 API가 불명확함
- Modal을 닫은 뒤 focus가 사라짐
- destroy가 사실상 아무 일도 안 함
- Stepper가 단순 스타일 컴포넌트에 머물고 실제 흐름과 연결되지 않음
- Select가 클릭으로만 동작하고 키보드 탐색이 없음
