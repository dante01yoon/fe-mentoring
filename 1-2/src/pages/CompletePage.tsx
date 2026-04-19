import { useNavigate } from 'react-router-dom';

/**
 * /complete — 주문 완료
 *
 * TODO (1회차 유지):
 * - 주문번호 / 결제 상태 / 최종 금액 / 완료 메시지 표시
 * - 결제 성공 결과가 없으면 진입 불가 (guard)
 *
 * TODO (2회차 조정):
 * - 완료 시 clearCheckoutArtifacts()로 draft / last-valid-step / payment-result 정리
 *   (analytics queue는 관측용으로 유지)
 * - 성공 이벤트 track('payment_success', { ... })
 */
export default function CompletePage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
      <h2>주문이 완료되었습니다</h2>

      <section style={{ margin: '2rem 0' }}>
        <p>주문번호 / 결제 금액 / 결제 상태 표시 영역 — 구현 필요</p>
      </section>

      <button
        type="button"
        onClick={() => navigate('/cart')}
        style={{
          padding: '0.6rem 1.2rem',
          border: '1px solid #ccc',
          borderRadius: 6,
          background: '#fff',
          cursor: 'pointer',
        }}
      >
        처음으로 돌아가기
      </button>
    </div>
  );
}
