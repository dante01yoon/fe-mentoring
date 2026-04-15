import StepNavigation from '../components/StepNavigation';

/**
 * /payment — 결제 수단 선택
 *
 * TODO:
 * - bootstrap 데이터의 paymentMethods 목록 표시
 * - enabled=false인 수단은 disabled
 * - 하나만 선택 가능 (radio)
 * - 선택값 draft 저장
 * - 선택 안 했으면 disableNext={true}
 */
export default function PaymentPage() {
  return (
    <div>
      <section>
        <p>결제 수단 선택 영역 — 구현 필요</p>
      </section>

      <StepNavigation current="/payment" />
    </div>
  );
}
