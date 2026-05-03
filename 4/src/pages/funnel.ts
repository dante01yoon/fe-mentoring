/*
 * 데모 페이지 (light SPA)
 *
 * 목표: 만든 3개 컴포넌트를 실제 흐름에 조합해 “미니 설문 + 약관 + 완료” 플로우를 구현한다.
 *
 * 흐름:
 *   step-1  서비스 유형 선택 (예: 청소 / 수리 / 교육)
 *   step-2  옵션 선택       (Select 또는 Autocomplete 사용)
 *   step-3  약관 확인       (Modal 또는 BottomSheet 사용)
 *   step-4  완료 + 요약
 *
 * 멘티 TODO:
 *  - 상태(서비스 타입, 옵션, 약관 동의 여부)는 메모리 또는 URL/localStorage로 관리.
 *  - Stepper와 페이지 내 step 영역이 항상 동기화되어야 함.
 *  - 잘못된 step에 직접 진입하면(예: 옵션 미선택 상태로 step-3) 안전한 step으로 보낼 것.
 *  - 최소 1개 이상의 invalid state 안내(예: 옵션 미선택 시 다음 단계 진행 차단)를 보여줄 것.
 *  - 새로고침 후 마지막 step 복구는 권장(localStorage 활용).
 *  - 페이지를 떠날 때(또는 다시 mount할 때) 모든 컴포넌트의 destroy를 호출해 리스너 누수를 막을 것.
 */

import { createHashRouter, type Router } from '../lib/router';

export interface FunnelPage {
  mount(container: HTMLElement): void;
  destroy(): void;
}

export const STEPS = [
  { id: 'step-1', label: '서비스 유형' },
  { id: 'step-2', label: '옵션 선택' },
  { id: 'step-3', label: '약관 확인' },
  { id: 'step-4', label: '완료' },
] as const;

export type StepId = (typeof STEPS)[number]['id'];

export function createFunnelPage(): FunnelPage {
  let router: Router | null = null;
  let unsubscribeRoute: (() => void) | null = null;
  // TODO(mentee): Stepper / Select / Modal 인스턴스를 보관할 변수를 선언.
  // TODO(mentee): 사용자가 입력한 값(서비스 타입/옵션/약관 동의)을 보관할 상태를 선언.

  return {
    mount(container) {
      container.innerHTML = `
        <header class="funnel__header">
          <h1>4회차 — Vanilla Component Kit Demo</h1>
          <p>Stepper · Modal(or BottomSheet) · Select(or Autocomplete) 를 조합한 light SPA 데모입니다.</p>
        </header>
        <section id="stepper-slot" aria-label="진행 단계"></section>
        <section id="step-slot"  class="funnel__step" aria-live="polite"></section>
      `;

      router = createHashRouter('step-1');
      router.start();

      unsubscribeRoute = router.on((route) => {
        // TODO(mentee):
        //  1. route 가 STEPS에 포함된 id인지 검증, 아니면 안전한 step으로 redirect.
        //  2. 진행 가능한지(이전 step의 입력값이 채워졌는지) 검증.
        //  3. step 영역 dom을 갱신 + Stepper.setCurrentStep 호출.
        // 현재는 디버깅 텍스트만 노출.
        const stepSlot = container.querySelector<HTMLElement>('#step-slot');
        if (stepSlot) stepSlot.textContent = `[TODO] render ${route}`;
      });

      // TODO(mentee): Stepper, Modal, Select 인스턴스 생성 + mount.
      // TODO(mentee): 첫 진입 시 라우트와 dom을 한 번 동기화.
    },
    destroy() {
      unsubscribeRoute?.();
      unsubscribeRoute = null;
      router?.stop();
      router = null;
      // TODO(mentee): Stepper.destroy(), Modal.destroy(), Select.destroy() 호출.
    },
  };
}
