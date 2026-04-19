import StepNavigation from '../components/StepNavigation';

/**
 * /payment — 결제 수단 + 결제 모드 선택
 *
 * TODO (1회차 유지):
 * - bootstrap 데이터의 paymentMethods 목록 표시 (radio)
 * - enabled=false인 수단은 disabled
 * - 선택값 draft 저장
 * - 선택 안 했으면 disableNext={true}
 *
 * TODO (2회차 추가):
 * - paymentMode 선택 UI: 'direct' | 'hosted'
 *   - direct: 앱을 떠나지 않고 결제
 *   - hosted: 외부 결제창으로 redirect 후 복귀
 *   - 두 모드 차이를 사용자가 구분할 수 있게 설명 문구 제공
 * - paymentMode 선택값도 draft에 저장
 */
export default function PaymentPage() {
  return (
    <div>
      <section>
        <h2 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>결제 수단</h2>
        <p>결제 수단 선택 영역 — 구현 필요</p>
      </section>

      <section style={{ marginTop: '1.25rem' }}>
        <h2 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>결제 모드</h2>
        <p>direct / hosted 선택 영역 — 구현 필요 (2회차)</p>
      </section>

      <StepNavigation current="/payment" />
    </div>
  );
}
