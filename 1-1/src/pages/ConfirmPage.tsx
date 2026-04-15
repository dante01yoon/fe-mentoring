import { useNavigate } from 'react-router-dom';
import StepNavigation from '../components/StepNavigation';

/**
 * /confirm — 최종 확인 + 결제
 *
 * TODO:
 * - 진입 시 api.postQuote() 호출 → 최종 금액 표시
 * - quote loading 중 결제 버튼 비활성화
 * - quote 실패 시 retry UI
 * - 상품/구매자/배송/결제수단/약관 요약 표시
 * - "결제하기" 클릭 → api.postPayment() 호출
 * - 결제 요청 중 중복 클릭 방지 (버튼 disabled + pending 상태)
 * - 성공 → navigate('/complete')
 * - 실패/취소 → 에러 메시지 표시
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
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>최종 결제 금액</h2>
        <p>Quote API 결과 표시 영역 — 구현 필요</p>
      </section>

      {/*
       * StepNavigation 대신 직접 결제 버튼을 구현해도 됩니다.
       * nextLabel로 라벨만 바꿔둔 상태입니다.
       * onBeforeNext에서 postPayment 호출 + 성공 시 /complete로 이동하는 로직을 넣으세요.
       */}
      <StepNavigation
        current="/confirm"
        nextLabel="결제하기"
        disableNext={false /* TODO: quote 로딩 중 or 결제 중이면 true */}
      />
    </div>
  );
}
