# 1회차 과제 명세서 — Checkout Funnel I

## 1. 과제 개요

이 과제의 목적은 **장바구니 → 결제 완료**까지 이어지는 다단계 퍼널을 구현하면서,
프론트엔드 개발자가 아래를 얼마나 안정적으로 설계하는지 확인하는 것입니다.

- Step 전이 설계
- 입력값 보존과 복구
- 잘못된 진입 방지(guard)
- 중복 요청 방지
- 비정상 흐름 처리(loading / error / retry)
- 문서화와 설명력

이 과제는 **백엔드 구현 과제**가 아닙니다.
실제 API가 없더라도 과제를 진행할 수 있도록, 아래에 **Mock API 계약**과 **시나리오**를 함께 제공합니다.

---

## 2. API가 없는데 어떻게 진행하는가

### 2.1 운영 원칙

이 과제는 실서비스 API 연동 능력 자체를 평가하는 것이 아니라,
**API가 있다고 가정했을 때 프론트엔드가 어떤 상태를 관리하고 어떤 예외를 처리해야 하는지**를 평가합니다.

따라서 다음 원칙으로 진행합니다.

1. 아래 문서에 정의된 **API Contract를 서버 명세로 간주**합니다.
2. 이미 mock 서버가 구현이 되어있습니다. 만약 필요하다면 수정해도 괜찮습니다.
   수정할 경우 멘티는 실제 서버 대신 다음 중 하나를 사용해 구현합니다.
   - MSW(Mock Service Worker)
   - `setTimeout` 기반 fake async function
   - 과제 저장소 내 간단한 in-memory mock server
3. 응답 구조는 임의로 바꾸지 않습니다.
4. 서버가 없는 대신, **지연/실패/취소/중복 요청** 같은 비정상 상황을 mock 시나리오로 재현해야 합니다.

### 2.2 평가 대상이 아닌 것

아래는 이번 회차의 평가 핵심이 아닙니다.

- 실제 PG사 연동
- 실제 백엔드 구축
- DB 영속화
- 인증/인가 시스템 구축
- 복잡한 결제 보안 구현

### 2.3 평가 대상인 것

아래는 이번 회차의 핵심 평가 항목입니다.

- Step별 진입 조건과 이탈 조건을 올바르게 모델링했는가
- 새로고침 / 뒤로가기 / 직접 URL 진입 시 흐름이 깨지지 않는가
- 결제 버튼 중복 클릭을 막았는가
- loading / error / retry UX가 자연스러운가
- 서버가 없더라도 API 계약을 기준으로 UI/상태를 설계했는가

---

## 3. 구현 범위

### 3.1 필수 Step

아래 7개 Step을 각각 **별도 라우트**로 구현합니다.

1. `/cart`
2. `/buyer`
3. `/shipping`
4. `/payment`
5. `/agreement`
6. `/confirm`
7. `/complete`

### 3.2 기본 흐름

- 사용자는 장바구니 내용을 확인한다.
- 구매자 정보를 입력한다.
- 배송 정보를 입력한다.
- 결제 수단을 선택한다.
- 약관에 동의한다.
- 최종 확인 화면에서 주문 내용을 검토한다.
- 결제를 완료하면 완료 화면으로 이동한다.

### 3.3 필수 제약

- 이전 Step을 완료하지 않으면 다음 Step으로 직접 진입할 수 없어야 합니다.
- 새로고침 후에도 현재 Step과 입력값이 유지되어야 합니다.
- 뒤로가기를 눌렀을 때 Step 흐름이 논리적으로 맞아야 합니다.
- 결제 요청 중 연속 클릭으로 중복 요청이 발생하지 않아야 합니다.
- 적어도 1개 이상의 loading, error, retry 상황을 눈에 보이게 처리해야 합니다.

---

## 4. 화면별 상세 요구사항

## 4.1 `/cart`

### 목적
주문 대상과 금액의 기본 정보를 보여줍니다.

### 필수 표시 항목
- 장바구니 상품 목록
- 상품명
- 수량
- 단가
- 합계 금액
- 배송비 안내 문구
- 다음 Step으로 이동 버튼

### 기능 요구사항
- 장바구니가 비어 있는 경우 empty state를 표시합니다.
- 장바구니 정보는 Mock API의 bootstrap 데이터에서 가져옵니다.
- bootstrap 로딩 중에는 skeleton 또는 loading UI를 표시합니다.
- bootstrap 실패 시 retry 버튼을 제공합니다.

### 진입 조건
- 없음

### 이탈 조건
- 장바구니가 비어 있지 않을 것

---

## 4.2 `/buyer`

### 목적
구매자 기본 정보를 입력받습니다.

### 필수 입력 항목
- 이름
- 전화번호
- 이메일

### 검증 규칙
- 이름: 2자 이상
- 전화번호: 숫자/하이픈 포함 유효 형식
- 이메일: 기본 이메일 형식

### 기능 요구사항
- 유효하지 않은 입력은 inline error로 보여줍니다.
- 입력 완료 후 다음 Step으로 이동할 수 있습니다.
- 작성 중인 값은 local draft로 저장되어야 합니다.

### 진입 조건
- `/cart`가 유효하게 완료되어 있을 것

### 이탈 조건
- 이름, 전화번호, 이메일이 모두 유효할 것

---

## 4.3 `/shipping`

### 목적
배송 정보를 입력받습니다.

### 필수 입력 항목
- 수령인 이름
- 주소
- 상세주소
- 배송 요청사항
- 희망 배송일

### 검증 규칙
- 수령인 이름: 2자 이상
- 주소: 비어 있지 않을 것
- 상세주소: 비어 있지 않을 것
- 희망 배송일: 오늘 이후 날짜만 허용

### 기능 요구사항
- 배송 요청사항은 선택 입력
- 구매자와 동일한 이름을 복사하는 선택 기능 제공 가능
- 작성 중인 값은 local draft로 저장

### 진입 조건
- `/buyer`가 유효하게 완료되어 있을 것

### 이탈 조건
- 필수 입력값이 모두 유효할 것

---

## 4.4 `/payment`

### 목적
결제 수단을 선택합니다.

### 필수 표시 항목
- 결제 수단 목록
  - 카드
  - 가상계좌
  - 간편결제
- 선택된 결제 수단

### 기능 요구사항
- 결제 수단 목록은 bootstrap 데이터에서 가져옵니다.
- 사용 불가능한 결제 수단은 disabled 상태로 표시할 수 있습니다.
- 하나만 선택 가능

### 진입 조건
- `/shipping`이 유효하게 완료되어 있을 것

### 이탈 조건
- 결제 수단이 1개 선택되어 있을 것

---

## 4.5 `/agreement`

### 목적
주문/결제 전 필수 약관 동의를 받습니다.

### 필수 표시 항목
- 필수 약관 2개 이상
- 선택 약관 1개 이상
- 전체 동의 체크박스

### 기능 요구사항
- 전체 동의 선택 시 모든 약관이 체크됩니다.
- 개별 약관 해제 시 전체 동의는 해제됩니다.
- 필수 약관에 모두 동의해야 다음 Step으로 이동할 수 있습니다.

### 진입 조건
- `/payment`가 유효하게 완료되어 있을 것

### 이탈 조건
- 필수 약관에 모두 동의했을 것

---

## 4.6 `/confirm`

### 목적
결제 전 최종 확인 화면입니다.

### 필수 표시 항목
- 상품 요약
- 구매자 정보 요약
- 배송 정보 요약
- 결제 수단 요약
- 약관 동의 상태 요약
- 총 결제 금액
- 결제하기 버튼

### 기능 요구사항
- 진입 시 Quote API를 호출해 최종 금액을 가져옵니다.
- Quote 로딩 중에는 결제 버튼이 비활성화됩니다.
- Quote 실패 시 재시도 UI를 보여줍니다.
- 결제 버튼 클릭 시 Payment API를 호출합니다.
- 결제 요청 중에는 중복 클릭을 막아야 합니다.

### 진입 조건
- `/agreement`가 유효하게 완료되어 있을 것

### 이탈 조건
- Quote가 성공적으로 준비되었을 것
- 결제 요청이 성공했을 것

---

## 4.7 `/complete`

### 목적
결제 완료 결과를 보여줍니다.

### 필수 표시 항목
- 주문번호
- 결제 상태
- 최종 결제 금액
- 간단한 완료 메시지
- 첫 화면으로 이동 또는 주문내역 보기 버튼

### 기능 요구사항
- 결제가 성공한 경우에만 정상 진입 가능
- 결제가 취소되거나 실패한 경우에는 `/confirm` 또는 `/payment`로 유도 가능
- 완료 시 draft를 정리해야 합니다.

---

## 5. 상태 관리 요구사항

## 5.1 저장 위치 권장안

아래는 권장안이며, 동일한 문제를 더 설득력 있게 풀 수 있다면 다른 방식도 허용합니다.

### URL
- 현재 route
- mock scenario 선택용 query string(optional)

### 메모리 상태
- 현재 입력 폼 상태
- 버튼 pending 상태
- 일시적인 toast / inline error

### localStorage
- Step별 입력 draft
- 마지막 유효 Step

### Mock API 응답
- 장바구니 데이터
- 결제 수단 목록
- 약관 목록
- 최종 Quote 금액
- 결제 결과

## 5.2 localStorage 키 규칙

아래 키를 기본으로 사용합니다.

```txt
checkout:funnel:v1:draft
checkout:funnel:v1:last-valid-step
checkout:funnel:v1:scenario
```

---

## 6. Step Guard 규칙

아래 조건을 만족하지 않으면 사용자는 해당 Step에 진입할 수 없습니다.

| Step | 진입 조건 |
|---|---|
| `/cart` | 항상 가능 |
| `/buyer` | 장바구니가 비어 있지 않음 |
| `/shipping` | buyer 정보 유효 |
| `/payment` | shipping 정보 유효 |
| `/agreement` | paymentMethod 선택 완료 |
| `/confirm` | 필수 약관 동의 완료 |
| `/complete` | 결제 성공 결과가 존재 |

### 잘못된 진입 시 동작
- 가장 최근의 유효 Step으로 리다이렉트
- 또는 이전 필수 Step으로 리다이렉트
- 에러 페이지로 보내는 방식은 권장하지 않음

---

## 7. Mock API 계약

## 7.1 공통 원칙

- 모든 API는 실제 서버 대신 mock으로 구현합니다.
- 네트워크 지연은 최소 300ms 이상 주는 것을 권장합니다.
- 실패 시나리오를 위해 일부 API는 강제로 실패할 수 있어야 합니다.
- 응답 구조는 아래 명세를 따릅니다.

## 7.2 `GET /api/checkout/bootstrap`

### 목적
초기 진입에 필요한 기본 데이터를 가져옵니다.

### 응답 예시

```json
{
  "cart": {
    "items": [
      {
        "id": "item_1",
        "name": "프리미엄 헤드셋",
        "quantity": 1,
        "unitPrice": 129000
      },
      {
        "id": "item_2",
        "name": "USB-C 케이블",
        "quantity": 2,
        "unitPrice": 12000
      }
    ],
    "subtotal": 153000,
    "shippingFee": 3000,
    "currency": "KRW"
  },
  "paymentMethods": [
    { "id": "card", "label": "카드", "enabled": true },
    { "id": "virtual-account", "label": "가상계좌", "enabled": true },
    { "id": "easy-pay", "label": "간편결제", "enabled": true }
  ],
  "agreements": [
    {
      "id": "terms-of-purchase",
      "title": "주문 내용 확인 및 결제 동의",
      "required": true
    },
    {
      "id": "privacy-collection",
      "title": "개인정보 수집 및 이용 동의",
      "required": true
    },
    {
      "id": "marketing",
      "title": "마케팅 정보 수신 동의",
      "required": false
    }
  ]
}
```

### 실패 예시

```json
{
  "message": "초기 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
}
```

---

## 7.3 `POST /api/checkout/quote`

### 목적
최종 결제 전 확인용 금액을 계산합니다.

### 요청 예시

```json
{
  "cartItemIds": ["item_1", "item_2"],
  "buyer": {
    "name": "홍길동",
    "phone": "010-1234-5678",
    "email": "hong@example.com"
  },
  "shipping": {
    "receiverName": "홍길동",
    "address1": "서울시 성동구 ...",
    "address2": "101동 1001호",
    "memo": "문 앞에 두세요.",
    "requestedDate": "2026-04-20"
  },
  "paymentMethod": "card"
}
```

### 성공 응답 예시

```json
{
  "orderId": "order_20260415_001",
  "quoteVersion": 1,
  "subtotal": 153000,
  "shippingFee": 3000,
  "discountAmount": 0,
  "totalAmount": 156000,
  "expiresAt": "2026-04-15T12:30:00+09:00"
}
```

### 실패 응답 예시

```json
{
  "message": "최종 금액 계산에 실패했습니다. 다시 시도해주세요."
}
```

---

## 7.4 `POST /api/payments/request`

### 목적
결제를 요청하고 결과를 시뮬레이션합니다.

### 요청 예시

```json
{
  "orderId": "order_20260415_001",
  "amount": 156000,
  "paymentMethod": "card",
  "buyer": {
    "name": "홍길동",
    "email": "hong@example.com"
  }
}
```

### 성공 응답 예시

```json
{
  "status": "success",
  "paymentKey": "pay_001",
  "orderId": "order_20260415_001",
  "amount": 156000,
  "approvedAt": "2026-04-15T12:01:00+09:00"
}
```

### 실패 응답 예시

```json
{
  "status": "fail",
  "code": "PAYMENT_FAILED",
  "message": "결제 승인에 실패했습니다. 다른 결제 수단을 이용해주세요."
}
```

### 취소 응답 예시

```json
{
  "status": "cancel",
  "code": "USER_CANCELLED",
  "message": "사용자가 결제를 취소했습니다."
}
```

---

## 8. Mock 시나리오 요구사항

아래 시나리오를 최소한 지원해야 합니다.

### `default`
- bootstrap 성공
- quote 성공
- payment 성공

### `bootstrap-fail`
- 초기 데이터 로드 실패
- retry 후 성공 가능

### `slow-quote`
- quote 응답이 2초 이상 지연

### `quote-fail`
- quote 계산 실패
- retry 필요

### `payment-fail`
- 결제 실패 응답 반환

### `payment-cancel`
- 결제 취소 응답 반환

### 시나리오 선택 방식
아래 중 하나 이상을 구현합니다.

- query string: `?scenario=payment-fail`
- localStorage: `checkout:funnel:v1:scenario`
- 개발자 전용 scenario panel

---

## 9. UX 요구사항

### 필수
- loading 상태를 텍스트만이 아니라 시각적으로도 구분할 것
- error 상태에는 원인 문구와 retry 액션을 함께 보여줄 것
- 필드 validation 에러는 사용자가 어디를 수정해야 하는지 알 수 있게 표현할 것
- 결제 요청 중 버튼을 disabled 또는 pending 상태로 처리할 것

### 권장
- Step indicator
- 입력 완료 여부 요약
- Confirm 화면에서 이전 Step으로 돌아가기

---

## 10. 테스트 요구사항

최소 3개 이상의 테스트를 작성해야 합니다.

### 필수 테스트 대상
1. Step guard
2. 새로고침 또는 draft 복구
3. 결제 중복 클릭 방지

### 권장 테스트 대상
- quote 실패 후 retry
- 필수 약관 미동의 시 진행 차단
- 장바구니 empty state

---

## 11. 제출물

필수 제출물은 아래와 같습니다.

1. Git 저장소
2. 실행 방법이 포함된 README
3. 상태도 또는 step 전이 다이어그램
4. 테스트 실행 결과
5. self-review.md

### README 필수 섹션
- 프로젝트 개요
- 실행 방법
- 테스트 방법
- Step 구조
- 상태 저장 전략
- 예외 흐름 처리 방식
- 구현 범위 / 미구현 범위
- 트레이드오프

### self-review.md 필수 항목
- 완성한 범위
- 포기한 범위
- 가장 위험한 엣지케이스
- 가장 찝찝한 코드 3곳

---

## 12. 채점 기준

- 요구사항 충족: 30
- 상태 모델링: 25
- 예외 흐름 처리: 20
- 테스트 선택: 10
- UX 완성도: 10
- 문서화: 5

---

## 13. 실격에 가까운 감점 요소

- Step guard가 사실상 없음
- 결제 버튼 중복 요청 방지 없음
- local draft 복구가 전혀 없음
- API 응답 구조를 임의로 변경
- README에 설계 이유가 없음
- happy path만 구현하고 실패 흐름이 없음

---

## 14. 제공된 스캐폴드 안내

이 과제는 보일러플레이트 셋업이 아닌 **퍼널 설계 능력**을 평가합니다.
따라서 아래 코드가 미리 제공되어 있으며, 이를 활용해 바로 구현에 집중하면 됩니다.

### 14.1 프로젝트 구조

```
src/
├── main.tsx                    # MSW 부트스트랩 + ReactDOM
├── App.tsx                     # BrowserRouter + 7개 Route 정의
├── components/
│   ├── Layout.tsx              # Step indicator + 공통 레이아웃
│   └── StepNavigation.tsx      # 이전/다음 네비게이션 버튼
├── lib/
│   ├── steps.ts                # Step 상수 (path, label, index)
│   ├── api.ts                  # fetch wrapper (getBootstrap, postQuote, postPayment)
│   └── storage.ts              # localStorage 유틸 (draft, lastValidStep, clearAll)
├── mocks/
│   ├── types.ts                # API contract 타입 정의
│   ├── data.ts                 # Bootstrap fixture 데이터
│   ├── handlers.ts             # MSW 핸들러 (bootstrap, quote, payment)
│   ├── scenario.ts             # 시나리오 선택 유틸 (?scenario= 또는 localStorage)
│   └── browser.ts              # MSW worker 초기화
└── pages/
    ├── CartPage.tsx
    ├── BuyerPage.tsx
    ├── ShippingPage.tsx
    ├── PaymentPage.tsx
    ├── AgreementPage.tsx
    ├── ConfirmPage.tsx
    └── CompletePage.tsx
```

### 14.2 페이지별 네비게이션 구성

각 페이지에는 `StepNavigation` 컴포넌트가 이미 배치되어 있습니다.
이전/다음 버튼과 라벨은 Step 순서에 따라 자동으로 결정됩니다.

| 페이지 | ← 이전 | 다음 → |
|---|---|---|
| `/cart` | (없음) | 구매자 정보 → |
| `/buyer` | ← 장바구니 | 배송 정보 → |
| `/shipping` | ← 구매자 정보 | 결제 수단 → |
| `/payment` | ← 배송 정보 | 약관 동의 → |
| `/agreement` | ← 결제 수단 | 주문 확인 → |
| `/confirm` | ← 약관 동의 | 결제하기 → |
| `/complete` | (없음) | 처음으로 돌아가기 |

### 14.3 `StepNavigation` 확장 포인트

`StepNavigation` 컴포넌트는 아래 props를 통해 각 페이지의 흐름을 제어할 수 있습니다.

```tsx
<StepNavigation
  current="/buyer"
  disableNext={!isFormValid}
  onBeforeNext={() => {
    if (!validate()) return false;
    saveDraft(formData);
  }}
/>
```

| prop | 타입 | 설명 |
|---|---|---|
| `current` | `StepPath` | 현재 페이지 경로 (필수) |
| `disableNext` | `boolean` | `true`이면 다음 버튼을 비활성화합니다. validation 상태에 연결하세요. |
| `onBeforeNext` | `() => boolean \| void` | 다음 버튼 클릭 시 이동 전에 실행됩니다. `false`를 반환하면 이동을 차단합니다. draft 저장, validation 체크 등에 사용하세요. |
| `nextLabel` | `string` | 다음 버튼 라벨을 변경합니다. `/confirm`에서 `"결제하기"`로 사용 중입니다. |

### 14.4 제공된 유틸리티

#### `lib/api.ts` — API 클라이언트

| 메서드 | 설명 |
|---|---|
| `api.getBootstrap()` | 장바구니, 결제수단, 약관 초기 데이터 조회 |
| `api.postQuote(body)` | 최종 결제 금액 계산 요청 |
| `api.postPayment(body)` | 결제 요청 |

요청 실패 시 `Error`를 throw합니다. 각 페이지에서 loading / error / retry를 직접 처리하세요.

#### `lib/storage.ts` — localStorage 유틸

| 함수 | 설명 |
|---|---|
| `loadDraft()` | 저장된 draft 전체를 읽어옵니다 |
| `saveDraft(data)` | draft 전체를 저장합니다 |
| `clearDraft()` | draft를 삭제합니다 |
| `loadLastValidStep()` | 마지막으로 완료한 step index를 반환합니다 |
| `saveLastValidStep(index)` | 완료한 step index를 저장합니다 |
| `clearAll()` | 모든 checkout 관련 storage를 정리합니다 |

#### `lib/steps.ts` — Step 상수

| 함수/상수 | 설명 |
|---|---|
| `STEPS` | 7개 Step 배열 (`{ path, label, index }`) |
| `getStepByPath(path)` | 경로로 Step 조회 |
| `getStepByIndex(index)` | 인덱스로 Step 조회 |

### 14.5 시작하기

```bash
npm install
npm run dev
```

dev 서버 시작 시 MSW가 자동으로 Service Worker를 등록합니다.
시나리오 전환은 URL에 `?scenario=payment-fail` 등을 추가하면 됩니다.

### 14.6 직접 구현해야 하는 것

아래는 스캐폴드에 포함되어 있지 않으며, 직접 설계하고 구현해야 합니다.

- **Step Guard** — 진입 조건 미충족 시 리다이렉트 처리
- **폼 상태 관리** — 각 페이지의 입력 폼과 validation
- **draft 저장/복구** — 새로고침 시 입력값 유지
- **loading / error / retry UI** — API 호출 결과에 따른 상태 처리
- **중복 클릭 방지** — 결제 버튼 pending 상태 관리
- **Step indicator 개선** — 완료 상태 표시, 클릭 이동 등

---

## 15. 멘토용 운영 메모

- 이 과제는 실제 결제 연동 과제가 아니다.
- 구현 난이도를 높이고 싶다면 API 개수를 늘리지 말고, **시나리오 개수**를 늘리는 편이 낫다.
- 멘티가 백엔드 부재를 핑계로 삼지 않도록, 처음부터 “Mock API 계약이 곧 서버 명세”라고 명확히 전달한다.
- 이 회차에서는 hosted redirect까지 요구하지 않는다. 그 내용은 2회차에서 확장한다.
