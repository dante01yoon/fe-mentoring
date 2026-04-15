import type {
  BootstrapResponse,
  QuoteRequest,
  QuoteResponse,
  PaymentRequest,
  PaymentResponse,
  ApiError,
} from '../mocks/types';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    url: string,
    options?: RequestInit,
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      const body: ApiError = await response.json();
      throw new Error(body.message);
    }

    return response.json();
  }

  /** 장바구니·결제수단·약관 초기 데이터 */
  getBootstrap() {
    return this.request<BootstrapResponse>('/api/checkout/bootstrap');
  }

  /** 최종 금액 계산 */
  postQuote(body: QuoteRequest) {
    return this.request<QuoteResponse>('/api/checkout/quote', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /** 결제 요청 */
  postPayment(body: PaymentRequest) {
    return this.request<PaymentResponse>('/api/payments/request', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}

export const api = new ApiClient();
