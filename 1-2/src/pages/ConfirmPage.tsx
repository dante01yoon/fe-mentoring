import { useNavigate } from 'react-router-dom';
import StepNavigation from '../components/StepNavigation';

/**
 * /confirm — 최종 확인 + 결제
 *
 * TODO (1회차 유지):
 * - 진입 시 api.postQuote() 호출 → 최종 금액 표시
 * - quote loading 중 결제 버튼 비활성화
 * - quote 실패 시 retry UI
 * - 상품/구매자/배송/결제수단/약관 요약 표시
 * - 결제 요청 중 중복 클릭 방지 (버튼 disabled + pending 상태)
 * - 성공 → navigate('/complete')
 * - 실패/취소 → 에러 메시지 표시
 *
 * TODO (2회차 추가):
 * 1) 쿠폰
 *    - 쿠폰 코드 입력란 + 적용/해제 버튼
 *    - api.postCouponApply() 로 유효성 확인 → 유효 시 api.postQuote({ couponCode })
 *      로 quote 재계산
 *    - 중복 적용 차단, 해제 시 quote 원복
 *    - analytics.track('coupon_apply', { ... })
 *
 * 2) verify (quote 무결성)
 *    - 결제 클릭 시 가장 먼저 api.postVerify({ orderId, quoteVersion })
 *    - ok: false (QUOTE_STALE)이면:
 *        - 결제 API 호출 금지
 *        - 최신 총액/메시지 안내
 *        - 최신 quote로 재조회 후 사용자에게 diff 노출
 *
 * 3) paymentMode 분기
 *    - direct:
 *        - api.postDirectPayment() 호출
 *        - status === 'success' → /complete
 *        - fail/cancel → 컨텍스트 유지, 재시도 동선 노출
 *    - hosted:
 *        - api.postHostedPayment() 호출 → redirectUrl 수신
 *        - window.location.assign(redirectUrl) 로 이동 (mock 외부 결제창)
 *        - 돌아오면 /payment-result에서 결과 복구
 *
 * 4) analytics
 *    - step_view, step_submit, payment_click, payment_success, payment_fail
 */
export default function ConfirmPage() {
  const _navigate = useNavigate();

  return (
    <div>
      <section>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>주문 요약</h2>
        <p>상품 / 구매자 / 배송 / 결제수단 / 약관 요약 영역 — 구현 필요</p>
      </section>

      <section style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>쿠폰 / 프로모션</h2>
        <p>쿠폰 코드 입력 + 적용/해제 UI — 구현 필요 (2회차)</p>
      </section>

      <section style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>최종 결제 금액</h2>
        <p>Quote API 결과 표시 영역 — 구현 필요</p>
      </section>

      {/*
       * StepNavigation 대신 직접 결제 버튼을 구현해도 됩니다.
       * nextLabel로 라벨만 바꿔둔 상태입니다.
       * onBeforeNext에서 verify → direct/hosted 분기 → 결과 처리 로직을 넣으세요.
       */}
      <StepNavigation
        current="/confirm"
        nextLabel="결제하기"
        disableNext={false /* TODO: quote 로딩 중 or 결제 중 or verify 중이면 true */}
      />
    </div>
  );
}
