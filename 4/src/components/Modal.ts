/*
 * Modal 컴포넌트 — 스켈레톤
 * (요구사항 §4.2 — Modal 또는 BottomSheet 중 택1. 본 스켈레톤은 Modal 기준이며,
 *  BottomSheet으로 바꿀 거면 파일명도 BottomSheet.ts로 바꾸고 motion/포지셔닝만 맞추면 된다.)
 *
 * 필수 동작:
 *  - 열기 / 닫기, ESC로 닫힘
 *  - overlay 클릭 닫기 여부를 옵션으로 제어
 *  - focus trap 또는 close 후 focus restore
 *  - 제목/본문/액션 영역 지원 (slot-like API)
 *  - body scroll lock 처리
 *  - aria role="dialog" + aria-labelledby 연결
 *  - destroy 시 키보드 핸들러, scroll lock, 잔여 dom 모두 원상복구
 */

import { createEmitter, type Emitter } from '../lib/createEmitter';

export interface ModalOpenEvent {
  type: 'open';
}
export interface ModalCloseEvent {
  type: 'close';
  reason: 'overlay' | 'esc' | 'programmatic' | 'action';
}

export interface ModalEventMap {
  open: ModalOpenEvent;
  close: ModalCloseEvent;
}

export interface ModalContent {
  title: string;
  body: HTMLElement | string;
  /** 푸터 액션. 첫 번째 요소가 기본 포커스 대상이 되도록 권장. */
  actions?: HTMLElement[];
}

export interface ModalOptions {
  /** 기본 true. false면 overlay 클릭으로 닫히지 않음. */
  closeOnOverlay?: boolean;
  /** 기본 true. false면 ESC로 닫히지 않음. (약관 강제 확인 등 흐름에서 사용) */
  closeOnEsc?: boolean;
  /** 기본 true. body scroll lock. */
  lockBodyScroll?: boolean;
  /** 마운트할 컨테이너. 기본: document.body */
  appendTo?: HTMLElement;
}

export interface Modal {
  open(): void;
  close(reason?: ModalCloseEvent['reason']): void;
  setContent(content: ModalContent): void;
  isOpen(): boolean;
  on: Emitter<ModalEventMap>['on'];
  destroy(): void;
}

export function createModal(options: ModalOptions = {}): Modal {
  const emitter = createEmitter<ModalEventMap>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _options = options;

  // TODO(mentee): 내부 상태(open 여부, 이전 active element, dom refs, listener 모음)를 정의.

  return {
    open() {
      // TODO(mentee):
      //  1. document.activeElement를 저장 (focus restore용)
      //  2. dom을 appendTo에 붙이고 role/aria 속성 세팅
      //  3. body scroll lock 적용
      //  4. focus trap을 위해 키 다운 핸들러 등록 + 첫 focusable에 focus
      //  5. emit('open', { type: 'open' })
      throw new Error('Modal.open not implemented');
    },
    close(_reason = 'programmatic') {
      // TODO(mentee):
      //  1. 키 다운 핸들러 해제, scroll lock 해제, dom 제거 또는 hidden 처리
      //  2. 저장한 active element로 focus 복원 (없으면 body)
      //  3. emit('close', { type: 'close', reason })
      throw new Error('Modal.close not implemented');
    },
    setContent(_content) {
      // TODO(mentee): 제목/본문/액션 슬롯을 갱신. 열려 있는 동안 갱신해도 focus가 깨지면 안 됨.
      throw new Error('Modal.setContent not implemented');
    },
    isOpen() {
      // TODO(mentee)
      return false;
    },
    on: emitter.on,
    destroy() {
      // TODO(mentee): 열린 상태였다면 close 처리, 모든 리스너 해제, dom 제거, emitter.clear()
      emitter.clear();
    },
  };
}
