import { http, HttpResponse, delay } from 'msw';
import { bootstrapData } from './data';
import { getScenario } from './scenario';
import type {
  QuoteRequest,
  QuoteResponse,
  PaymentRequest,
  PaymentResponse,
} from './types';

// ─── 내부 상태 ────────────────────────────────────────────────────

let bootstrapFailCount = 0; // bootstrap-fail 시나리오: 첫 호출 실패 → retry 성공
let quoteFailCount = 0;     // quote-fail 시나리오: 첫 호출 실패 → retry 성공
let orderSeq = 0;

// ─── Handlers ─────────────────────────────────────────────────────

export const handlers = [
  // ── GET /api/checkout/bootstrap ──────────────────────────────────
  http.get('/api/checkout/bootstrap', async () => {
    const scenario = getScenario();
    await delay(300);

    if (scenario === 'bootstrap-fail') {
      bootstrapFailCount++;
      // 첫 번째 요청만 실패, 이후 retry 시 성공
      if (bootstrapFailCount <= 1) {
        return HttpResponse.json(
          { message: '초기 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.' },
          { status: 500 },
        );
      }
    }

    return HttpResponse.json(bootstrapData);
  }),

  // ── POST /api/checkout/quote ─────────────────────────────────────
  http.post('/api/checkout/quote', async ({ request }) => {
    const scenario = getScenario();
    const body = (await request.json()) as QuoteRequest;

    // slow-quote: 2초 지연
    if (scenario === 'slow-quote') {
      await delay(2_000);
    } else {
      await delay(300);
    }

    // quote-fail: 첫 번째 요청 실패 → retry 성공
    if (scenario === 'quote-fail') {
      quoteFailCount++;
      if (quoteFailCount <= 1) {
        return HttpResponse.json(
          { message: '최종 금액 계산에 실패했습니다. 다시 시도해주세요.' },
          { status: 500 },
        );
      }
    }

    orderSeq++;
    const now = new Date();
    const orderId = `order_${now.toISOString().slice(0, 10).replace(/-/g, '')}_${String(orderSeq).padStart(3, '0')}`;

    // cart에서 금액 계산
    const matchedItems = bootstrapData.cart.items.filter((item) =>
      body.cartItemIds.includes(item.id),
    );
    const subtotal = matchedItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    const shippingFee = bootstrapData.cart.shippingFee;

    const expiresAt = new Date(now.getTime() + 30 * 60_000).toISOString();

    const response: QuoteResponse = {
      orderId,
      quoteVersion: 1,
      subtotal,
      shippingFee,
      discountAmount: 0,
      totalAmount: subtotal + shippingFee,
      expiresAt,
    };

    return HttpResponse.json(response);
  }),

  // ── POST /api/payments/request ───────────────────────────────────
  http.post('/api/payments/request', async ({ request }) => {
    const scenario = getScenario();
    const body = (await request.json()) as PaymentRequest;
    await delay(800);

    if (scenario === 'payment-fail') {
      const response: PaymentResponse = {
        status: 'fail',
        code: 'PAYMENT_FAILED',
        message: '결제 승인에 실패했습니다. 다른 결제 수단을 이용해주세요.',
      };
      return HttpResponse.json(response, { status: 400 });
    }

    if (scenario === 'payment-cancel') {
      const response: PaymentResponse = {
        status: 'cancel',
        code: 'USER_CANCELLED',
        message: '사용자가 결제를 취소했습니다.',
      };
      return HttpResponse.json(response, { status: 400 });
    }

    const response: PaymentResponse = {
      status: 'success',
      paymentKey: `pay_${String(orderSeq).padStart(3, '0')}`,
      orderId: body.orderId,
      amount: body.amount,
      approvedAt: new Date().toISOString(),
    };

    return HttpResponse.json(response);
  }),
];
