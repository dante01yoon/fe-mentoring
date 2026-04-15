import StepNavigation from '../components/StepNavigation';

/**
 * /buyer — 구매자 정보
 *
 * TODO:
 * - 이름 / 전화번호 / 이메일 입력 폼
 * - 검증: 이름 2자↑, 전화번호 형식, 이메일 형식
 * - inline validation error 표시
 * - draft 저장/복구 (localStorage)
 * - onBeforeNext에서 validation 체크
 */
export default function BuyerPage() {
  return (
    <div>
      <section>
        <p>구매자 정보 입력 폼 영역 — 구현 필요</p>
      </section>

      <StepNavigation current="/buyer" />
    </div>
  );
}
