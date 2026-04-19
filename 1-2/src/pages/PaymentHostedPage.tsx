import type { CSSProperties } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * /payment-hosted — 외부 결제창을 대체하는 mock 페이지 (2회차 추가)
 *
 * 실제 PG 연동이 없으므로, 앱 내부 route를 외부 결제창처럼 사용합니다.
 * postHostedPayment 응답의 redirectUrl이 이 페이지로 오면,
 * 사용자가 success / fail / cancel 중 하나를 "시뮬레이션" 선택하게 합니다.
 *
 * TODO:
 * - query로 전달된 successUrl / failUrl / cancelUrl 중 하나로 window.location.assign
 * - 각 결과에 맞춰 paymentKey 또는 errorCode를 쿼리로 함께 붙여주기
 *   예) successUrl + '&paymentKey=pay_hosted_xxx&orderId=order_xxx'
 * - "결제 대기 중입니다..." 같은 안내 문구와 함께 3개 버튼 제공
 *
 * 이 페이지는 mock 외부 결제창이므로 Layout(step indicator) 없이 단독 route입니다.
 */
export default function PaymentHostedPage() {
  const [params] = useSearchParams();

  const orderId = params.get('orderId') ?? '';
  const amount = params.get('amount') ?? '0';
  const successUrl = params.get('successUrl') ?? '/payment-result?status=success';
  const failUrl = params.get('failUrl') ?? '/payment-result?status=fail';
  const cancelUrl = params.get('cancelUrl') ?? '/payment-result?status=cancel';

  // TODO: 아래 핸들러에서 window.location.assign(target) 로 리다이렉트
  const _handleSuccess = () => {
    const target = appendQuery(successUrl, {
      orderId,
      paymentKey: `pay_hosted_${Date.now()}`,
    });
    window.location.assign(target);
  };
  const _handleFail = () => {
    const target = appendQuery(failUrl, { orderId, errorCode: 'PAYMENT_FAILED' });
    window.location.assign(target);
  };
  const _handleCancel = () => {
    const target = appendQuery(cancelUrl, { orderId, errorCode: 'USER_CANCELLED' });
    window.location.assign(target);
  };

  return (
    <div style={{ maxWidth: 520, margin: '4rem auto', padding: '1.5rem', border: '1px solid #ddd', borderRadius: 12 }}>
      <h1 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>[MOCK] 외부 결제창</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        주문번호 <code>{orderId}</code> · 결제 금액 <strong>{Number(amount).toLocaleString()}원</strong>
      </p>

      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1rem' }}>
        아래 버튼 중 하나를 눌러 결과를 시뮬레이션하세요. 실제 구현 시 buttons의 onClick에
        핸들러를 연결하면 됩니다.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="button" style={buttonPrimary}>결제 성공</button>
        <button type="button" style={buttonMuted}>결제 실패</button>
        <button type="button" style={buttonMuted}>결제 취소</button>
      </div>
    </div>
  );
}

function appendQuery(url: string, extra: Record<string, string>): string {
  const [base, search = ''] = url.split('?');
  const params = new URLSearchParams(search);
  Object.entries(extra).forEach(([key, value]) => params.set(key, value));
  return `${base}?${params.toString()}`;
}

const buttonPrimary: CSSProperties = {
  padding: '0.6rem 1rem',
  border: 'none',
  borderRadius: 6,
  background: '#2b6cb0',
  color: '#fff',
  cursor: 'pointer',
};

const buttonMuted: CSSProperties = {
  padding: '0.6rem 1rem',
  border: '1px solid #ccc',
  borderRadius: 6,
  background: '#fff',
  cursor: 'pointer',
};
