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

// POST /api/checkout/quote
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

export interface QuoteRequest {
  cartItemIds: string[];
  buyer: Buyer;
  shipping: Shipping;
  paymentMethod: PaymentMethod['id'];
}

export interface QuoteResponse {
  orderId: string;
  quoteVersion: number;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  expiresAt: string; // ISO 8601
}

// POST /api/payments/request
export interface PaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod['id'];
  buyer: Pick<Buyer, 'name' | 'email'>;
}

export interface PaymentSuccess {
  status: 'success';
  paymentKey: string;
  orderId: string;
  amount: number;
  approvedAt: string; // ISO 8601
}

export interface PaymentFail {
  status: 'fail';
  code: 'PAYMENT_FAILED';
  message: string;
}

export interface PaymentCancel {
  status: 'cancel';
  code: 'USER_CANCELLED';
  message: string;
}

export type PaymentResponse = PaymentSuccess | PaymentFail | PaymentCancel;

// Error envelope (shared)
export interface ApiError {
  message: string;
}

// ─── Scenarios ────────────────────────────────────────────────────

export type Scenario =
  | 'default'
  | 'bootstrap-fail'
  | 'slow-quote'
  | 'quote-fail'
  | 'payment-fail'
  | 'payment-cancel';
