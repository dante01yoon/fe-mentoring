/*
 * Stepper 컴포넌트 — 스켈레톤
 *
 * 목적: 여러 단계를 표현하고 현재/완료 상태를 시각적으로 보여준다.
 *
 * 멘티 구현 가이드:
 *  - 생성(createStepper)과 mount(container)를 분리할 것.
 *  - destroy 시 자기가 등록한 모든 리스너/타이머/observer를 정리할 것.
 *  - 클릭 가능한 step 여부는 옵션으로 제어 가능해야 함.
 *  - aria 속성으로 현재 step과 완료 step을 보조기기에 전달할 것.
 *  - 키보드(예: ArrowLeft/ArrowRight, Home/End)로 포커스 이동을 지원할 것.
 *  - 이벤트 payload는 README에 적은 contract와 정확히 일치해야 함.
 */

import { createEmitter, type Emitter } from '../lib/createEmitter';

export interface StepDefinition {
  id: string;
  label: string;
}

export interface StepChangeEvent {
  type: 'stepChange';
  prevStepId: string | null;
  stepId: string;
  reason: 'click' | 'keyboard' | 'programmatic';
}

export interface StepperEventMap {
  stepChange: StepChangeEvent;
}

export interface StepperOptions {
  steps: StepDefinition[];
  initialStepId?: string;
  /** 사용자가 step 헤더를 직접 눌러 이동할 수 있는지. 기본: 완료된 step만 클릭 가능. */
  clickable?: 'all' | 'completed' | 'none';
}

export interface Stepper {
  mount(container: HTMLElement): void;
  setCurrentStep(stepId: string): void;
  setCompleted(stepIds: string[]): void;
  on: Emitter<StepperEventMap>['on'];
  destroy(): void;
}

export function createStepper(options: StepperOptions): Stepper {
  const emitter = createEmitter<StepperEventMap>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _options = options;

  // TODO(mentee): 내부 상태(current step, completed set, container, dom refs, abort controller 등)를 정의.
  // TODO(mentee): mount/destroy 사이에서만 살아있는 리스너만 등록할 것.

  return {
    mount(_container) {
      // TODO(mentee):
      //  1. step list를 렌더링한다 (역할/aria attribute 포함).
      //  2. clickable 정책에 따라 step 헤더에 click 핸들러를 단다.
      //  3. 키보드 탐색을 위해 keydown 핸들러를 단다.
      //  4. 등록한 모든 리스너는 destroy()에서 해제할 수 있도록 추적한다.
      throw new Error('Stepper.mount not implemented');
    },
    setCurrentStep(_stepId) {
      // TODO(mentee): 시각/aria 상태를 갱신하고, 변경 시 stepChange 이벤트를 emit.
      throw new Error('Stepper.setCurrentStep not implemented');
    },
    setCompleted(_stepIds) {
      // TODO(mentee): 완료 표시 갱신. 완료 step에는 aria-current/checked 등 보조기기 신호를 추가.
      throw new Error('Stepper.setCompleted not implemented');
    },
    on: emitter.on,
    destroy() {
      // TODO(mentee): listener 해제, dom 제거, emitter.clear()
      emitter.clear();
    },
  };
}
