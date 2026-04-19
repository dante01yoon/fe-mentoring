import type {
  BootstrapResponse,
  QuoteRequest,
  QuoteResponse,
  CouponRequest,
  CouponResponse,
  VerifyRequest,
  VerifyResponse,
  DirectPaymentRequest,
  DirectPaymentResponse,
  HostedPaymentRequest,
  HostedPaymentResponse,
  PaymentResultResponse,
  ApiError,
} from '../mocks/types';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      const body: ApiError = await response.json().catch(() => ({
        message: '알 수 없는 오류가 발생했습니다.',
      }));
      throw new Error(body.message);
    }

    return response.json();
  }

  /** 장바구니·결제수단·약관 초기 데이터 */
  getBootstrap() {
    return this.request<BootstrapResponse>('/api/checkout/bootstrap');
  }

  /** 최종 금액 계산 (2회차: couponCode 포함 가능) */
  postQuote(body: QuoteRequest) {
    return this.request<QuoteResponse>('/api/checkout/quote', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /** 쿠폰 적용 확인 */
  postCouponApply(body: CouponRequest) {
    return this.request<CouponResponse>('/api/coupons/apply', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /** 결제 직전 quoteVersion 무결성 확인 */
  postVerify(body: VerifyRequest) {
    return this.request<VerifyResponse>('/api/checkout/verify', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /** direct 모드 결제 요청 */
  postDirectPayment(body: DirectPaymentRequest) {
    return this.request<DirectPaymentResponse>('/api/payments/direct', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /** hosted 모드 결제 요청 (redirectUrl 반환) */
  postHostedPayment(body: HostedPaymentRequest) {
    return this.request<HostedPaymentResponse>('/api/payments/hosted', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /** hosted redirect 이후 결과 복원 */
  getPaymentResult(params: { paymentKey?: string; orderId: string }) {
    const query = new URLSearchParams();
    if (params.paymentKey) query.set('paymentKey', params.paymentKey);
    query.set('orderId', params.orderId);
    return this.request<PaymentResultResponse>(
      `/api/payments/result?${query.toString()}`,
    );
  }
}

export const api = new ApiClient();
