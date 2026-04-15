import StepNavigation from '../components/StepNavigation';

/**
 * /agreement — 약관 동의
 *
 * TODO:
 * - bootstrap 데이터의 agreements 목록 표시
 * - 필수 약관 / 선택 약관 구분
 * - 전체 동의 체크박스
 * - 전체 동의 선택 → 모두 체크, 개별 해제 → 전체 동의 해제
 * - 필수 약관 모두 동의해야 disableNext={false}
 */
export default function AgreementPage() {
  return (
    <div>
      <section>
        <p>약관 동의 영역 — 구현 필요</p>
      </section>

      <StepNavigation current="/agreement" />
    </div>
  );
}
