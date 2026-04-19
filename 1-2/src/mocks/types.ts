// ─── API Contract Types ───────────────────────────────────────────

// GET /api/checkout/bootstrap
export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  currency: 'KRW';
}

export interface PaymentMethod {
  id: 'card' | 'virtual-account' | 'easy-pay';
  label: string;
  enabled: boolean;
}

export interface Agreement {
  id: string;
  title: string;
  required: boolean;
}

export interface BootstrapResponse {
  cart: Cart;
  paymentMethods: PaymentMethod[];
  agreements: Agreement[];
}

// ─── Checkout / Quote ─────────────────────────────────────────────

export interface Buyer {
  name: string;
  phone: string;
  email: string;
}

export interface Shipping {
  receiverName: string;
  address1: string;
  address2: string;
  memo: string;
  requestedDate: string; // YYYY-MM-DD
}

/**
 * POST /api/checkout/quote
 * 2회차: `couponCode`가 optional로 추가됩니다.
 */
export interface QuoteRequest {
  cartItemIds: string[];
  buyer: Buyer;
  shipping: Shipping;
  paymentMethod: PaymentMethod['id'];
  couponCode?: string;
}

/**
 * 2회차: `appliedCoupon`이 optional로 추가됩니다.
 */
export interface QuoteResponse {
  orderId: string;
  quoteVersion: number;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  appliedCoupon?: string;
  expiresAt: string; // ISO 8601
}

// ─── Coupon ───────────────────────────────────────────────────────

// POST /api/coupons/apply
export interface CouponRequest {
  code: string;
  subtotal: number;
}

export interface CouponValid {
  valid: true;
  code: string;
  discountAmount: number;
  message: string;
}

export interface CouponInvalid {
  valid: false;
  code: string;
  message: string;
}

export type CouponResponse = CouponValid | CouponInvalid;

// ─── Verify (stale quote) ─────────────────────────────────────────

// POST /api/checkout/verify
export interface VerifyRequest {
  orderId: string;
  quoteVersion: number;
}

export interface VerifyOk {
  ok: true;
  quoteVersion: number;
}

export interface VerifyStale {
  ok: false;
  reason: 'QUOTE_STALE';
  latestQuoteVersion: number;
  latestTotalAmount: number;
  message: string;
}

export type VerifyResponse = VerifyOk | VerifyStale;

// ─── Payment (direct) ─────────────────────────────────────────────

export type PaymentMode = 'direct' | 'hosted';

// POST /api/payments/direct
export interface DirectPaymentRequest {
  orderId: string;
  amount: number;
  quoteVersion: number;
  paymentMethod: PaymentMethod['id'];
}

export interface DirectPaymentSuccess {
  mode: 'direct';
  status: 'success';
  paymentKey: string;
  orderId: string;
  amount: number;
  approvedAt: string;
}

export interface DirectPaymentFail {
  mode: 'direct';
  status: 'fail';
  code: 'CARD_DECLINED' | 'PAYMENT_FAILED';
  message: string;
}

export interface DirectPaymentCancel {
  mode: 'direct';
  status: 'cancel';
  code: 'USER_CANCELLED';
  message: string;
}

export type DirectPaymentResponse =
  | DirectPaymentSuccess
  | DirectPaymentFail
  | DirectPaymentCancel;

// ─── Payment (hosted) ─────────────────────────────────────────────

// POST /api/payments/hosted
export interface HostedPaymentRequest {
  orderId: string;
  amount: number;
  quoteVersion: number;
  paymentMethod: PaymentMethod['id'];
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
}

export interface HostedPaymentResponse {
  mode: 'hosted';
  redirectUrl: string;
}

// GET /api/payments/result?paymentKey=...&orderId=...
export interface PaymentResultSuccess {
  status: 'success';
  paymentKey: string;
  orderId: string;
  amount: number;
  approvedAt: string;
}

export interface PaymentResultFail {
  status: 'fail';
  code: 'PAYMENT_FAILED' | 'CARD_DECLINED';
  message: string;
}

export interface PaymentResultCancel {
  status: 'cancel';
  code: 'USER_CANCELLED';
  message: string;
}

export type PaymentResultResponse =
  | PaymentResultSuccess
  | PaymentResultFail
  | PaymentResultCancel;

// ─── Shared ───────────────────────────────────────────────────────

export interface ApiError {
  message: string;
}

// ─── Scenarios ────────────────────────────────────────────────────

export type Scenario =
  // 1회차 유지
  | 'default'
  | 'bootstrap-fail'
  | 'slow-quote'
  | 'quote-fail'
  | 'payment-fail'
  | 'payment-cancel'
  // 2회차 추가
  | 'coupon-invalid'
  | 'coupon-expired-after-confirm'
  | 'direct-fail'
  | 'hosted-fail'
  | 'hosted-cancel'
  | 'stale-quote'
  | 'slow-result';

// ─── Analytics ────────────────────────────────────────────────────

export type AnalyticsEventName =
  | 'step_view'
  | 'step_submit'
  | 'coupon_apply'
  | 'payment_click'
  | 'payment_success'
  | 'payment_fail';

export interface AnalyticsEvent {
  eventName: AnalyticsEventName;
  timestamp: string; // ISO 8601
  step?: string;
  orderId?: string;
  paymentMode?: PaymentMode;
  paymentMethod?: PaymentMethod['id'];
  /** 자유 payload — 필요한 metadata를 담는 용도 */
  meta?: Record<string, unknown>;
}
