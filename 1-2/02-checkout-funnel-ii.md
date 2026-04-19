# 2회차 과제 명세서 — Checkout Funnel II (Hardening)

## 1. 과제 개요

이 과제는 1회차에서 구현한 `Checkout Funnel I`를 기반으로,
실무에서 실제로 자주 문제 되는 **복구 가능성, 결제 무결성, stale quote 처리, redirect 결과 복원, 이벤트 기록**을 추가하는 회차입니다.

핵심은 새로 만드는 것이 아니라, **기존 퍼널을 운영 가능한 수준으로 단단하게 만드는 것**입니다.

이번 회차에서 보고 싶은 것은 아래입니다.

- quote 무결성 검증
- 결제 방식 분기(direct / hosted)
- redirect 후 컨텍스트 복구
- 실패 후 재진입 UX
- 쿠폰/프로모션 적용 흐름
- 이벤트 추적 경계 설계

---

## 2. API가 없는데 어떻게 진행하는가

### 2.1 이번 회차의 전제

이번 회차도 실제 서버는 없습니다.
다만 1회차보다 요구사항이 늘어나므로, **Mock API 계약도 조금 더 상세해집니다.**

이번 과제는 다음을 평가합니다.

- 외부 결제/redirect가 있다고 가정했을 때 프론트엔드가 어디까지 책임져야 하는가
- quote가 바뀌었을 때 사용자를 어떻게 안전하게 되돌릴 것인가
- redirect 이후 상태를 어떻게 복구할 것인가
- 이벤트 추적 코드를 UI와 얼마나 느슨하게 분리할 수 있는가

### 2.2 운영 원칙

1. 실제 PG사 연동은 하지 않습니다.
2. hosted 결제는 **redirect가 일어나는 것처럼 보이는 mock**으로 구현합니다.
3. direct 결제는 **페이지를 떠나지 않는 mock**으로 구현합니다.
4. API는 실제 서버가 아니라 MSW 또는 fake async layer로 구현합니다.
5. 아래 계약을 명세로 간주하고, 응답 형태는 임의로 변경하지 않습니다.

---

## 3. 이번 회차의 작업 범위

### 3.1 반드시 지켜야 할 원칙

- 1회차 저장소를 이어서 사용합니다.
- 전면 재작성 금지
- route 구조와 핵심 상태 모델을 유지한 상태에서 기능을 확장합니다.

### 3.2 이번 회차에서 새로 추가되는 기능

1. 쿠폰/프로모션 적용
2. direct 결제와 hosted 결제 2가지 모드 지원
3. redirect 결과 복구
4. stale quote version 검증
5. 실패 후 재진입 가능 흐름
6. analytics event queue

---

## 4. 화면/기능 요구사항 상세

## 4.1 쿠폰/프로모션 적용

### 위치
- `/payment` 또는 `/confirm` 화면 중 한 곳에 배치

### 필수 요구사항
- 쿠폰 코드 입력란 제공
- 쿠폰 적용 버튼 제공
- 유효한 쿠폰일 경우 할인 금액 표시
- 무효 쿠폰일 경우 error message 표시
- 쿠폰 적용/해제 후 quote를 다시 계산할 수 있어야 함

### 검증 포인트
- 쿠폰 적용 결과가 Confirm 화면 금액 요약에 반영되는가
- 쿠폰을 제거하면 할인 금액이 원복되는가
- 중복 적용이 막히는가

---

## 4.2 direct 결제 모드

### 목적
앱을 떠나지 않고 결제 결과를 받는 흐름입니다.

### 필수 요구사항
- direct 모드 선택 시 현재 앱 내에서 결제 요청을 보냅니다.
- 결제 요청 중 pending UI가 보여야 합니다.
- success / fail / cancel 결과를 처리해야 합니다.
- fail 또는 cancel 시 이전 입력 컨텍스트가 유지되어야 합니다.

### UX 요구사항
- success면 `/complete`로 이동
- fail이면 오류 메시지와 재시도 버튼 제공
- cancel이면 사용자가 자연스럽게 `/confirm` 또는 `/payment`로 돌아올 수 있어야 함

---

## 4.3 hosted 결제 모드

### 목적
외부 결제창으로 이동했다가 돌아오는 것처럼 동작하는 흐름입니다.

### 필수 요구사항
- hosted 모드 선택 시 `redirectUrl`을 받아 이동합니다.
- redirect 후 돌아왔을 때 쿼리 파라미터만 보고도 결과를 복구할 수 있어야 합니다.
- `success / fail / cancel` 케이스를 모두 처리해야 합니다.
- redirect 중 앱 메모리 상태가 사라져도 로컬에 저장된 draft를 기반으로 복구할 수 있어야 합니다.

### 전체 흐름

hosted 결제는 아래 순서로 진행됩니다.

```
/confirm (결제하기 클릭)
  → POST /api/payments/hosted  →  redirectUrl 수신
  → redirectUrl로 이동 (예: /payment-hosted — mock 외부 결제창)
  → 결제 처리 후 successUrl / failUrl / cancelUrl로 리다이렉트
  → /payment-result?status=success&paymentKey=...&orderId=...
  → GET /api/payments/result 호출하여 결과 확인
  → 성공이면 /complete, 실패/취소면 재시도 동선 제공
```

### 구현 가이드
- 실제 외부 페이지가 없어도 됩니다.
- 앱 내부 route를 외부 결제 페이지처럼 사용합니다.
- `/payment-hosted` — mock 외부 결제창 역할 (결과를 시뮬레이션 후 successUrl/failUrl/cancelUrl로 리다이렉트)
- `/payment-result` — redirect 결과를 수신하여 복구하는 페이지

### 왜 두 라우트를 분리하는가

두 라우트는 단순히 UI를 쪼갠 것이 아니라, **서로 다른 주체의 페이지**를 흉내내기 위한 경계입니다.

- `/payment-hosted` — "나는 PG사 결제창이다. 앱 state를 알지 못한다. 아는 것은 쿼리로 받은 주문 정보뿐이다."
- `/payment-result` — "나는 방금 외부에서 돌아왔다. 가진 것은 URL 쿼리 + localStorage뿐이다."

한 라우트/컴포넌트 안에서 `useState`로 stage(`'idle' → 'pending' → 'result'`)를 전환해 흐름을 흉내낼 수도 있습니다. 하지만 이 방식은 아래 제약이 **재현되지 않습니다.**

1. **페이지 언로드 미경험**
   실제 PG 연동에서는 앱이 완전히 언로드되고, 돌아올 때 새로 마운트됩니다. in-memory state는 전부 사라집니다. 같은 컴포넌트 안에 머물면 이 단절이 일어나지 않아, "돌아왔을 때 state가 없다"는 진짜 제약을 체감할 수 없습니다.

2. **새로고침 시나리오 테스트 불가**
   §6 권장 시나리오의 "redirect 후 새로고침"은 URL이 실제로 바뀌어야 성립합니다. `useState` 기반이면 새로고침 시 `idle`로 돌아가 버려서 §4.5의 "새로고침해도 결과 화면 복원" 요구사항을 검증할 수 없습니다.

3. **쿼리 파라미터 복원 훈련 생략**
   §4.5가 요구하는 "쿼리만 보고 상태 복구"는 `useState` 패턴에서는 필요 없어져 건너뛰게 됩니다. 결과적으로 redirect 기반 통합의 핵심 기술을 배우지 못합니다.

4. **localStorage 복구 경계 흐려짐**
   "draft가 살아 있어야 돌아와 복구 가능"이라는 제약(§4.3)이 같은 컴포넌트 안에서는 성립하지 않습니다. localStorage를 안 써도 동작하므로 §7.3 draft 정리 규칙이 유명무실해집니다.

### 구현 체크포인트
- `/payment-hosted`로의 이동은 반드시 `window.location.assign(redirectUrl)`을 사용합니다. `navigate()`(React Router)를 쓰면 SPA 내부 전환이라 페이지 언로드가 일어나지 않습니다.
- `/payment-hosted → /payment-result` 이동도 마찬가지로 `window.location.assign()`으로 합니다.
- `/payment-result`는 마운트 시점에 **URL 쿼리와 localStorage만으로** 결과를 복원할 수 있어야 합니다. 컴포넌트 외부에서 전달받은 props나 context에 의존하지 않습니다.

---

## 4.4 quote version 검증

### 목적
사용자가 Confirm 화면에 도달한 뒤, 금액이나 주문 조건이 변경되었을 때
잘못된 금액으로 결제를 시도하지 않도록 막습니다.

### 필수 요구사항
- quote 응답에는 `quoteVersion`이 포함되어야 합니다.
- 결제 직전, **verify API를 먼저 호출**하고 `ok: true`를 받은 뒤에만 direct/hosted 결제 API를 호출합니다.
- 현재 quoteVersion이 stale이면 결제를 막고 Confirm으로 되돌립니다.
- stale 발생 시 아래 정보가 사용자에게 보여야 합니다.
  - 무엇이 바뀌었는지
  - 최신 금액이 얼마인지
  - 다시 확인 후 결제해야 한다는 메시지

### 예시 stale 상황
- 쿠폰 만료
- 배송비 변동
- 프로모션 할인 종료

---

## 4.5 redirect 후 결과 복구

### 필수 요구사항
- hosted 결제 후 돌아온 페이지는 쿼리 파라미터를 읽어 상태를 복구해야 합니다.
- 최소 다음 정보를 처리합니다.
  - `status`
  - `orderId`
  - `paymentKey` 또는 `errorCode`
- 사용자가 페이지를 새로고침해도 결과 화면이 다시 복원되어야 합니다.

### 권장 구현 방식
- 결과를 localStorage에 한 번 저장
- 결과 복원 후 draft 정리 여부를 명확히 처리

---

## 4.6 실패 후 재진입 UX

### 필수 요구사항
- 결제 실패 후 사용자는 “처음부터 다시”가 아니라 **가장 최근 유효 Step**에서 재개할 수 있어야 합니다.
- direct fail이면 기본적으로 `/confirm` 또는 `/payment`로 돌아갈 수 있어야 합니다.
- hosted fail이면 redirect 결과 화면에서 재시도 동선을 제공해야 합니다.
- 실패 메시지는 원인과 다음 행동이 함께 보여야 합니다.

### 허용되지 않는 구현
- **`history.back()` / `router(-1)` 단독 전략은 허용되지 않습니다.** history에 funnel 외부 페이지(외부 링크·검색 결과)가 남아 있으면 사용자가 funnel 밖으로 튕길 수 있습니다. 반드시 `saveLastValidStep` / `loadLastValidStep` 같이 **명시적으로 추적된 복귀 지점**을 기준으로 이동해야 합니다.
- history-based 이동을 보조 수단으로 병행하는 것은 허용하지만, 1순위는 저장된 lastValidStep이어야 합니다.

예:
- 카드 승인 실패 → 다른 카드로 다시 시도
- 사용자가 취소 → 결제 수단 선택으로 이동
- quote stale → Confirm에서 최신 금액 재검토

---

## 4.7 analytics event queue

### 목적
이벤트를 UI 코드에 직접 흩뿌리지 않고, 추적 포인트를 정리하는 훈련입니다.

### 이번 회차의 원칙
- 실제 analytics 서버는 필요 없습니다.
- **이벤트 큐를 설계하고 쌓는 것 자체**가 요구사항입니다.
- flush는 선택 구현입니다.

### 최소 이벤트 목록
- `step_view`
- `step_submit`
- `coupon_apply`
- `payment_click`
- `payment_success`
- `payment_fail`

### 이벤트 payload 예시

```json
{
  "eventName": "payment_click",
  "timestamp": "2026-04-15T12:00:00+09:00",
  "step": "confirm",
  "orderId": "order_20260415_001",
  "paymentMode": "hosted",
  "paymentMethod": "card"
}
```

### 구현 요구사항
- `track(event)` 같은 공통 추상화를 둘 것
- 컴포넌트마다 `console.log`를 직접 박는 방식은 지양
- 이벤트는 in-memory queue 또는 localStorage queue로 보관 가능

---

## 5. Mock API 계약

## 5.1 기존 API 유지 및 마이그레이션

1회차의 아래 API는 계속 유지합니다.

- `GET /api/checkout/bootstrap`
- `POST /api/checkout/quote` (이번 회차에서 요청/응답 필드가 확장됩니다 — 5.3절 참고)

1회차의 `POST /api/payments/request`는 **이번 회차에서 `POST /api/payments/direct`로 대체**합니다.
`direct` API는 `mode` 필드가 응답에 추가되고, 요청에 `quoteVersion`이 포함되는 점이 다릅니다.
기존 `/api/payments/request` 핸들러는 제거하거나, `/api/payments/direct`로 리다이렉트하는 방식으로 정리합니다.

### 5.1a 타입 마이그레이션

1회차의 `PaymentResponse` 판별 유니온은 두 타입으로 분리됩니다.

- `PaymentResponse` → **`DirectPaymentResponse`** (`mode: 'direct'` + success/fail/cancel 유니온)
- hosted 모드는 **`PaymentResultResponse`** 를 별도로 사용 (status: success/fail/cancel)

`usePostPaymentMutation` 같은 기존 mutation hook을 쓰고 있다면 타입 시그니처 교체가 필요합니다. 권장 분리는 다음과 같습니다.

- `usePostDirectPaymentMutation` — direct 결제
- `usePostHostedPaymentMutation` — hosted 결제 (redirectUrl 반환)
- `useGetPaymentResultQuery` or `usePaymentResultQuery` — hosted redirect 후 결과 조회
- `usePostVerifyMutation` — 결제 직전 quoteVersion 검증
- `usePostCouponMutation` — 쿠폰 유효성 확인

이름은 자유지만, **direct / hosted / result / verify / coupon 다섯 경계를 타입 수준에서 섞지 않는 것**이 목표입니다.

이번 회차에서 신규로 추가되는 API는 아래와 같습니다.

---

## 5.2 `POST /api/coupons/apply`

### 목적
쿠폰의 유효성을 확인하고 할인 금액을 계산합니다.

### 요청 예시

```json
{
  "code": "WELCOME10",
  "subtotal": 153000
}
```

### 성공 응답 예시

```json
{
  "valid": true,
  "code": "WELCOME10",
  "discountAmount": 10000,
  "message": "쿠폰이 적용되었습니다."
}
```

### 실패 응답 예시

```json
{
  "valid": false,
  "code": "WELCOME10",
  "message": "사용할 수 없는 쿠폰입니다."
}
```

---

## 5.3 `POST /api/checkout/quote`

### 변경 사항
이번 회차부터 요청에 `couponCode`(optional)를, 응답에 `appliedCoupon`(optional)을 포함할 수 있습니다.
1회차의 `QuoteRequest` / `QuoteResponse` 타입에 아래 필드를 optional로 추가하세요.

- 요청: `couponCode?: string`
- 응답: `appliedCoupon?: string`

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
  "paymentMethod": "card",
  "couponCode": "WELCOME10"
}
```

### 응답 예시

```json
{
  "orderId": "order_20260415_001",
  "quoteVersion": 2,
  "subtotal": 153000,
  "shippingFee": 3000,
  "discountAmount": 10000,
  "totalAmount": 146000,
  "appliedCoupon": "WELCOME10",
  "expiresAt": "2026-04-15T12:40:00+09:00"
}
```

---

## 5.4 `POST /api/checkout/verify`

### 목적
결제 직전 quoteVersion이 최신인지 확인합니다.

### 요청 예시

```json
{
  "orderId": "order_20260415_001",
  "quoteVersion": 2
}
```

### 최신 상태 응답 예시

```json
{
  "ok": true,
  "quoteVersion": 2
}
```

### stale 응답 예시

```json
{
  "ok": false,
  "reason": "QUOTE_STALE",
  "latestQuoteVersion": 3,
  "latestTotalAmount": 151000,
  "message": "결제 금액이 변경되었습니다. 최신 금액을 확인한 후 다시 결제해주세요."
}
```

---

## 5.5 `POST /api/payments/direct`

### 목적
페이지 이탈 없이 결제를 처리합니다.

### 요청 예시

```json
{
  "orderId": "order_20260415_001",
  "amount": 146000,
  "quoteVersion": 2,
  "paymentMethod": "card"
}
```

### 성공 응답 예시

```json
{
  "mode": "direct",
  "status": "success",
  "paymentKey": "pay_direct_001",
  "orderId": "order_20260415_001",
  "amount": 146000,
  "approvedAt": "2026-04-15T12:02:00+09:00"
}
```

### 실패 응답 예시

```json
{
  "mode": "direct",
  "status": "fail",
  "code": "CARD_DECLINED",
  "message": "카드 승인에 실패했습니다."
}
```

### 취소 응답 예시

```json
{
  "mode": "direct",
  "status": "cancel",
  "code": "USER_CANCELLED",
  "message": "사용자가 결제를 취소했습니다."
}
```

---

## 5.6 `POST /api/payments/hosted`

### 목적
외부 결제 페이지로 이동하는 것처럼 동작하는 흐름을 만듭니다.

### 요청 예시

```json
{
  "orderId": "order_20260415_001",
  "amount": 146000,
  "quoteVersion": 2,
  "paymentMethod": "card",
  "successUrl": "/payment-result?status=success",
  "failUrl": "/payment-result?status=fail",
  "cancelUrl": "/payment-result?status=cancel"
}
```

### 응답 예시

```json
{
  "mode": "hosted",
  "redirectUrl": "/payment-hosted?orderId=order_20260415_001&amount=146000"
}
```

---

## 5.7 `GET /api/payments/result`

### 목적
redirect 이후 결과를 복원합니다.

### 요청 예시

```txt
GET /api/payments/result?paymentKey=pay_hosted_001&orderId=order_20260415_001
```

### 성공 응답 예시

```json
{
  "status": "success",
  "paymentKey": "pay_hosted_001",
  "orderId": "order_20260415_001",
  "amount": 146000,
  "approvedAt": "2026-04-15T12:03:00+09:00"
}
```

### 실패 응답 예시

```json
{
  "status": "fail",
  "code": "PAYMENT_FAILED",
  "message": "결제에 실패했습니다. 다시 시도해주세요."
}
```

### 취소 응답 예시

```json
{
  "status": "cancel",
  "code": "USER_CANCELLED",
  "message": "결제가 취소되었습니다."
}
```

---

## 6. Mock 시나리오 요구사항

1회차의 시나리오(`default`, `bootstrap-fail`, `slow-quote`, `quote-fail`, `payment-fail`, `payment-cancel`)는 **모두 유지**합니다.
이번 회차에서는 아래 시나리오를 추가합니다.

### 1회차 유지 시나리오

- `default` — 이번 회차에서 아래와 같이 확장됩니다
- `bootstrap-fail` — 그대로 유지
- `slow-quote` — 그대로 유지
- `quote-fail` — 그대로 유지
- `payment-fail` — direct-fail로 동작하도록 확장 가능
- `payment-cancel` — direct 모드의 cancel로 동작하도록 확장 가능

### 2회차 추가 시나리오

#### `default`
- quote 정상
- direct 결제 성공
- hosted 결제 성공

#### `coupon-invalid`
- 쿠폰 적용 실패

#### `coupon-expired-after-confirm`
- Confirm에 도달한 뒤 verify 시 stale 발생

#### `direct-fail`
- direct 결제 실패

#### `hosted-fail`
- hosted redirect 후 실패 결과 반환

#### `hosted-cancel`
- hosted redirect 후 취소 결과 반환

#### `stale-quote`
- verify 시 최신 quoteVersion이 더 큼

#### `slow-result`
- payment result 조회 지연

### 권장 시나리오
- 같은 결제 버튼을 빠르게 두 번 누른 상황
- 쿠폰 적용 직후 바로 결제 시도
- redirect 후 새로고침

---

## 7. 상태 관리 요구사항

## 7.1 추가 상태 항목

1회차 상태에 더해 아래가 필요합니다.

- `paymentMode` (`direct` | `hosted`)
- `coupon` 정보
- `quoteVersion`
- `paymentAttempt` 상태
- `paymentResult` 캐시
- `analyticsQueue`

### 7.1a 상태 확장 방식

위 항목을 어떤 형태로 얹을지는 멘티의 결정 영역이지만 아래 원칙을 따릅니다.

- **기존 1회차 draft 구조를 유지하며 확장하는 것을 기본**으로 삼습니다. 전면 재작성은 §13의 감점 요소입니다.
- 신규 필드는 **optional**로 추가해, 기존 사용자의 localStorage draft가 마이그레이션 없이 로드 가능해야 합니다.
- 큰 슬라이스로 분리하는 선택도 가능하지만, **분리 사유를 self-review에 명시**해야 합니다. (예: "form 입력 draft와 결제 수행 상태의 수명이 달라서")
- `paymentResult`, `analyticsQueue`는 사용자 입력 draft와 의미가 다르므로 **별도 저장 키**로 분리하는 것을 권장합니다 (§7.2 참고).

## 7.2 localStorage 키 권장안

1회차의 키를 유지하고, 아래 2개를 추가합니다.

```txt
checkout:funnel:v1:draft              (1회차 유지)
checkout:funnel:v1:last-valid-step    (1회차 유지)
checkout:funnel:v1:scenario           (1회차 유지)
checkout:funnel:v1:payment-result     (2회차 추가)
checkout:funnel:v1:analytics-queue    (2회차 추가)
```

## 7.3 Draft 정리 규칙

- 결제 성공 후에는 draft를 정리해도 됩니다.
- 다만 hosted redirect 결과를 보여주기 위해 필요한 최소 결과 정보는 남겨둘 수 있습니다.
- 실패/취소 시에는 사용자가 다시 시도할 수 있도록 draft를 유지해야 합니다.

---

## 8. UX 요구사항

### 필수
- **verify 실패 시 왜 막혔는지 보여줄 것**
  - `toast` 하나만으로는 부족합니다. 사용자가 놓치면 "왜 결제가 안 됐는지" 추적 불가.
  - Confirm 화면 **내부에 inline UI**로 "이전 금액 → 최신 금액" diff와 "최신 금액 확인했습니다. 다시 결제" CTA를 제공할 것.
  - 응답은 `latestTotalAmount`만 주므로, 이전 금액(직전 quote의 `totalAmount`)은 **클라이언트가 verify 호출 직전에 기억**해 두어야 합니다.
- hosted redirect에서 돌아온 사용자가 당황하지 않도록 현재 상태를 설명할 것
  - `/payment-result` 진입 시 즉시 로딩 상태 노출 + "결제 결과를 확인 중입니다" 문구.
  - `status=success`여도 서버 조회(`GET /api/payments/result`) 완료 전까지 `/complete`로 이동하지 말 것.
- coupon 적용/해제 결과를 즉시 확인 가능할 것
  - 최종 금액 계산 반영까지 시차가 있어도, 적용 상태 자체(코드·할인액 or 오류)는 즉시 노출.
- direct / hosted 차이를 사용자가 구분할 수 있게 할 것
  - 선택 시점에 각 모드가 어떤 경험을 주는지 1줄 설명 권장. "현재 화면에서 결제" vs "외부 결제창으로 이동".

### 권장
- Confirm 화면에 quoteVersion 또는 quote generated 시점을 내부적으로 관리할 것
- stale 발생 시 diff처럼 바뀐 금액을 강조해서 보여줄 것

---

## 9. 테스트 요구사항

### 9.0 1회차 테스트와의 관계
- 1회차에서 작성한 테스트는 **유지**합니다. 제거·축소 금지.
- 이번 회차의 **최소 5개**는 1회차 테스트에 **추가**되는 분량입니다.
- 계약 변경(`PaymentResponse` → `DirectPaymentResponse` / `PaymentResultResponse`)으로 깨지는 1회차 테스트는 새 계약에 맞춰 수정하며, 이는 "추가 5개"에 포함되지 않습니다.
- 결제 중복 클릭 방지 테스트가 1회차에 이미 있다면, 이번 회차 5개 중 해당 항목(§9.5)은 direct/hosted **두 모드 모두**에 대해 확장하거나, 다른 필수 항목으로 대체합니다.

### 9.1 최소 5개 필수 테스트
최소 5개 이상의 테스트를 작성해야 합니다.

### 필수 테스트 대상
1. 쿠폰 적용 성공/실패
2. verify stale 발생 시 결제 차단
3. direct 결제 실패 후 컨텍스트 유지
4. hosted redirect 결과 복구
5. 결제 중복 클릭 방지

### 권장 테스트 대상
- analytics 이벤트 큐 적재
- payment result 새로고침 복원
- 취소 후 결제 수단 재선택

---

## 10. 제출물

필수 제출물은 아래와 같습니다.

1. 1회차 저장소를 확장한 Git 저장소
2. README
3. state diagram 업데이트본
4. 테스트 결과
5. self-review.md

### README에 반드시 추가되어야 하는 섹션
- direct / hosted를 나눈 이유
- quoteVersion 검증 방식
- 실패/취소 후 복구 정책
- 쿠폰 모델링 방식
- 이벤트 추적 구조
- 아직 남아 있는 리스크

### self-review.md 필수 항목
- 1회차 대비 추가한 기능
- 유지한 구조 / 바꾼 구조
- 가장 위험한 엣지케이스
- 전면 재작성을 하지 않은 이유

---

## 11. 채점 기준

- 요구사항 충족: 25
- 상태/무결성 설계: 25
- 실패/복구 UX: 20
- 테스트 선택: 10
- 코드 개선의 절제력: 10
- 문서화: 10

---

## 12. 1회차 스캐폴드 확장 가이드

1회차에서 제공된 스캐폴드를 아래와 같이 확장해야 합니다.

### 타입 확장 (`src/mocks/types.ts`)
- `QuoteRequest`에 `couponCode?: string` 추가
- `QuoteResponse`에 `appliedCoupon?: string` 추가
- 신규 타입 추가: `CouponRequest`, `CouponResponse`, `VerifyRequest`, `VerifyResponse`, `DirectPaymentRequest`, `DirectPaymentResponse`, `HostedPaymentRequest`, `HostedPaymentResponse`, `PaymentResultResponse`

### MSW 핸들러 추가 (`src/mocks/handlers.ts`)
- 기존 3개 핸들러 유지 (bootstrap, quote, payment/request → direct로 전환)
- 신규 핸들러 5개 추가: `POST /api/coupons/apply`, `POST /api/checkout/verify`, `POST /api/payments/direct`, `POST /api/payments/hosted`, `GET /api/payments/result`

### API 클라이언트 확장 (`src/lib/api.ts`)
- 기존 메서드 유지: `getBootstrap()`, `postQuote()`
- `postPayment()` → `postDirectPayment()`로 리네이밍
- 신규 메서드 추가: `postCouponApply()`, `postVerify()`, `postHostedPayment()`, `getPaymentResult()`

### 라우트 추가 (`src/App.tsx`)
- 기존 7개 route 유지
- 신규 route 추가: `/payment-hosted`, `/payment-result`

### 라우트 추가 시 주의점
- 두 신규 route는 Layout(Step Indicator 포함)과 **분리**되어야 합니다. 외부 결제창/결과 화면이 "Step 1~7" 네비게이션 위에 떠 있으면 안 됩니다.
- 동시에 `/payment-result`는 checkout context(주문·쿠폰·draft)의 일부 값을 참조할 가능성이 높습니다.
- 따라서 기존 구조가 `Provider`를 `Layout`과 같은 Route 트리에 묶어 둔 형태라면, **Provider를 끌어올려 BrowserRouter 바로 아래로** 이동시키는 구조 변경이 필요할 수 있습니다. 그 뒤 Layout은 기존 7개 step route만 감싸고, hosted 2개 route는 Layout 밖에 평행 배치합니다.
- 이 리팩터는 스펙 §3.1 "route 구조와 핵심 상태 모델 유지" 원칙과 모순되지 않습니다. route 경로 자체는 유지되고, provider의 **스코프만 확장**됩니다.

---

## 13. 큰 감점 요소

- 1회차 코드를 사실상 버리고 새로 작성함
- verify 없이 바로 결제 진행
- hosted redirect 결과 복구 없음
- 쿠폰 적용 결과가 Confirm 금액과 불일치
- 결제 실패 후 다시 처음부터 입력해야 함
- 이벤트 추적이 UI 코드에 직접 흩어져 있음

---

## 14. 멘토용 운영 메모

- 이번 회차의 핵심은 기능 추가보다 **운영 안정성**이다.
- API가 없다고 해서 hosted 결제나 redirect 복구를 못 하는 것이 아니다.
  프론트엔드 관점에서는 `redirectUrl`, `result query`, `verify response`만 정의되면 충분하다.
- 난이도를 높이고 싶다면 API를 더 복잡하게 만들지 말고, `stale-quote`, `hosted-fail`, `redirect refresh` 같은 시나리오를 추가한다.
- 멘티가 백엔드 부재를 이유로 quote 검증을 생략하지 않도록, verify API 계약을 명확히 강제한다.
