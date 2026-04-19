import { http, HttpResponse, delay } from 'msw';
import { bootstrapData, couponCatalog } from './data';
import { getScenario } from './scenario';
import type {
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
} from './types';

// ─── 내부 상태 ────────────────────────────────────────────────────

let bootstrapFailCount = 0; // bootstrap-fail: 첫 호출 실패 → retry 성공
let quoteFailCount = 0;     // quote-fail: 첫 호출 실패 → retry 성공
let orderSeq = 0;

/**
 * orderId 별로 최신 quote 스냅샷을 들고 있습니다.
 * verify 시 stale 여부를 판단할 때 참조합니다.
 */
const quoteStore = new Map<
  string,
  { quoteVersion: number; totalAmount: number }
>();

// ─── Handlers ─────────────────────────────────────────────────────

export const handlers = [
  // ── GET /api/checkout/bootstrap ──────────────────────────────────
  http.get('/api/checkout/bootstrap', async () => {
    const scenario = getScenario();
    await delay(300);

    if (scenario === 'bootstrap-fail') {
      bootstrapFailCount++;
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

    if (scenario === 'slow-quote') {
      await delay(2_000);
    } else {
      await delay(300);
    }

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

    const matchedItems = bootstrapData.cart.items.filter((item) =>
      body.cartItemIds.includes(item.id),
    );
    const subtotal = matchedItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    const shippingFee = bootstrapData.cart.shippingFee;

    // 쿠폰이 포함돼 있으면 catalog 기반으로 discount를 반영
    let discountAmount = 0;
    let appliedCoupon: string | undefined;
    if (body.couponCode) {
      const coupon = couponCatalog[body.couponCode];
      if (coupon) {
        discountAmount = Math.min(coupon.discountAmount, subtotal);
        appliedCoupon = body.couponCode;
      }
    }

    const totalAmount = subtotal + shippingFee - discountAmount;
    const expiresAt = new Date(now.getTime() + 30 * 60_000).toISOString();

    const response: QuoteResponse = {
      orderId,
      quoteVersion: 1,
      subtotal,
      shippingFee,
      discountAmount,
      totalAmount,
      appliedCoupon,
      expiresAt,
    };

    quoteStore.set(orderId, { quoteVersion: 1, totalAmount });

    return HttpResponse.json(response);
  }),

  // ── POST /api/coupons/apply ──────────────────────────────────────
  http.post('/api/coupons/apply', async ({ request }) => {
    const scenario = getScenario();
    const body = (await request.json()) as CouponRequest;
    await delay(200);

    if (scenario === 'coupon-invalid') {
      const response: CouponResponse = {
        valid: false,
        code: body.code,
        message: '사용할 수 없는 쿠폰입니다.',
      };
      return HttpResponse.json(response);
    }

    const coupon = couponCatalog[body.code];
    if (!coupon) {
      const response: CouponResponse = {
        valid: false,
        code: body.code,
        message: '사용할 수 없는 쿠폰입니다.',
      };
      return HttpResponse.json(response);
    }

    const response: CouponResponse = {
      valid: true,
      code: body.code,
      discountAmount: Math.min(coupon.discountAmount, body.subtotal),
      message: coupon.message,
    };
    return HttpResponse.json(response);
  }),

  // ── POST /api/checkout/verify ────────────────────────────────────
  http.post('/api/checkout/verify', async ({ request }) => {
    const scenario = getScenario();
    const body = (await request.json()) as VerifyRequest;
    await delay(200);

    const isStaleScenario =
      scenario === 'stale-quote' || scenario === 'coupon-expired-after-confirm';

    if (isStaleScenario) {
      const latest = quoteStore.get(body.orderId);
      const latestVersion = (latest?.quoteVersion ?? body.quoteVersion) + 1;
      const latestTotal = (latest?.totalAmount ?? 0) + 5_000;

      // store도 최신 값으로 업데이트 (재시도 시 최신 상태 반영되도록)
      quoteStore.set(body.orderId, {
        quoteVersion: latestVersion,
        totalAmount: latestTotal,
      });

      const response: VerifyResponse = {
        ok: false,
        reason: 'QUOTE_STALE',
        latestQuoteVersion: latestVersion,
        latestTotalAmount: latestTotal,
        message:
          '결제 금액이 변경되었습니다. 최신 금액을 확인한 후 다시 결제해주세요.',
      };
      return HttpResponse.json(response);
    }

    const response: VerifyResponse = {
      ok: true,
      quoteVersion: body.quoteVersion,
    };
    return HttpResponse.json(response);
  }),

  // ── POST /api/payments/direct ────────────────────────────────────
  http.post('/api/payments/direct', async ({ request }) => {
    const scenario = getScenario();
    const body = (await request.json()) as DirectPaymentRequest;
    await delay(800);

    // 1회차 호환: payment-fail / payment-cancel은 direct 모드에서도 동일 동작
    if (scenario === 'direct-fail' || scenario === 'payment-fail') {
      const response: DirectPaymentResponse = {
        mode: 'direct',
        status: 'fail',
        code: 'CARD_DECLINED',
        message: '카드 승인에 실패했습니다.',
      };
      return HttpResponse.json(response, { status: 400 });
    }

    if (scenario === 'payment-cancel') {
      const response: DirectPaymentResponse = {
        mode: 'direct',
        status: 'cancel',
        code: 'USER_CANCELLED',
        message: '사용자가 결제를 취소했습니다.',
      };
      return HttpResponse.json(response, { status: 400 });
    }

    const response: DirectPaymentResponse = {
      mode: 'direct',
      status: 'success',
      paymentKey: `pay_direct_${String(orderSeq).padStart(3, '0')}`,
      orderId: body.orderId,
      amount: body.amount,
      approvedAt: new Date().toISOString(),
    };

    return HttpResponse.json(response);
  }),

  // ── POST /api/payments/hosted ────────────────────────────────────
  http.post('/api/payments/hosted', async ({ request }) => {
    const body = (await request.json()) as HostedPaymentRequest;
    await delay(400);

    // redirectUrl은 앱 내부 /payment-hosted를 외부 결제창처럼 사용합니다.
    const params = new URLSearchParams({
      orderId: body.orderId,
      amount: String(body.amount),
      successUrl: body.successUrl,
      failUrl: body.failUrl,
      cancelUrl: body.cancelUrl,
    });
    const response: HostedPaymentResponse = {
      mode: 'hosted',
      redirectUrl: `/payment-hosted?${params.toString()}`,
    };
    return HttpResponse.json(response);
  }),

  // ── GET /api/payments/result ─────────────────────────────────────
  http.get('/api/payments/result', async ({ request }) => {
    const scenario = getScenario();
    const url = new URL(request.url);
    const paymentKey = url.searchParams.get('paymentKey') ?? undefined;
    const orderId = url.searchParams.get('orderId') ?? '';

    if (scenario === 'slow-result') {
      await delay(2_000);
    } else {
      await delay(300);
    }

    if (scenario === 'hosted-fail') {
      const response: PaymentResultResponse = {
        status: 'fail',
        code: 'PAYMENT_FAILED',
        message: '결제에 실패했습니다. 다시 시도해주세요.',
      };
      return HttpResponse.json(response);
    }

    if (scenario === 'hosted-cancel') {
      const response: PaymentResultResponse = {
        status: 'cancel',
        code: 'USER_CANCELLED',
        message: '결제가 취소되었습니다.',
      };
      return HttpResponse.json(response);
    }

    const response: PaymentResultResponse = {
      status: 'success',
      paymentKey: paymentKey ?? `pay_hosted_${String(orderSeq).padStart(3, '0')}`,
      orderId,
      amount: quoteStore.get(orderId)?.totalAmount ?? 0,
      approvedAt: new Date().toISOString(),
    };
    return HttpResponse.json(response);
  }),
];
