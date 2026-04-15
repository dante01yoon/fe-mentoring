import StepNavigation from '../components/StepNavigation';

/**
 * /cart — 장바구니
 *
 * TODO:
 * - api.getBootstrap() 호출 → 장바구니 상품 목록 표시
 * - loading 중 skeleton / spinner
 * - 실패 시 에러 메시지 + retry 버튼
 * - 장바구니가 비어 있으면 empty state
 * - 장바구니가 비어 있으면 disableNext={true}
 */
export default function CartPage() {
  return (
    <div>
      <section>
        <p>장바구니 상품 목록 영역 — 구현 필요</p>
      </section>

      <StepNavigation current="/cart" />
    </div>
  );
}
