import { useSearchParams } from 'react-router-dom';

/**
 * /payment-result — hosted redirect 결과 복원 페이지 (2회차 추가)
 *
 * 흐름:
 *   1) 쿼리에서 status / orderId / paymentKey 또는 errorCode를 읽는다
 *   2) api.getPaymentResult({ paymentKey, orderId }) 로 결과 재확인
 *   3) 결과를 localStorage(payment-result)에 저장 → 새로고침해도 복원 가능
 *   4) 성공이면 /complete로 이동
 *      실패/취소면 원인 + 재시도 동선 (→ /confirm 또는 /payment) 제공
 *
 * TODO:
 * - 새로고침 시 쿼리가 없어도 localStorage(payment-result)로 복구
 * - draft는 실패/취소 시 유지, 성공 시 clearCheckoutArtifacts()
 * - analytics.track('payment_success' | 'payment_fail', { ... })
 *
 * 이 페이지도 외부에서 돌아오는 route이므로 Layout 없이 단독으로 렌더링합니다.
 */
export default function PaymentResultPage() {
  const [params] = useSearchParams();

  const status = params.get('status'); // 'success' | 'fail' | 'cancel'
  const orderId = params.get('orderId') ?? '';
  const paymentKey = params.get('paymentKey') ?? undefined;
  const errorCode = params.get('errorCode') ?? undefined;

  return (
    <div style={{ maxWidth: 520, margin: '4rem auto', padding: '1.5rem' }}>
      <h1 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>결제 결과 확인 중</h1>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        status: <code>{status ?? '(없음)'}</code> · orderId: <code>{orderId || '(없음)'}</code>
        {paymentKey ? <> · paymentKey: <code>{paymentKey}</code></> : null}
        {errorCode ? <> · errorCode: <code>{errorCode}</code></> : null}
      </p>

      <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.5 }}>
        이 페이지는 hosted redirect 이후 결과를 복원하는 자리입니다.
        <br />
        <strong>TODO:</strong> api.getPaymentResult() 호출, localStorage 저장, 분기 처리.
      </p>
    </div>
  );
}
