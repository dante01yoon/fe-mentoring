import StepNavigation from '../components/StepNavigation';

/**
 * /shipping — 배송 정보
 *
 * TODO:
 * - 수령인 이름 / 주소 / 상세주소 / 배송 요청사항 / 희망 배송일
 * - 검증: 수령인 2자↑, 주소·상세주소 비어있지 않을 것, 배송일 오늘 이후
 * - 배송 요청사항은 선택 입력
 * - "구매자와 동일" 체크 시 이름 복사 (선택 기능)
 * - draft 저장/복구
 * - onBeforeNext에서 validation 체크
 */
export default function ShippingPage() {
  return (
    <div>
      <section>
        <p>배송 정보 입력 폼 영역 — 구현 필요</p>
      </section>

      <StepNavigation current="/shipping" />
    </div>
  );
}
