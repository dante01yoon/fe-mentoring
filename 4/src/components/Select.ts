/*
 * Select 컴포넌트 — 스켈레톤
 * (요구사항 §4.3 — Select 또는 Autocomplete 중 택1.
 *  본 스켈레톤은 Select 기준. Autocomplete으로 바꿀 거면 setQuery/필터링/결과 없음 상태 등을
 *  추가하고, on('change') payload는 동일한 shape를 유지할 것.)
 *
 * 필수 동작:
 *  - 옵션 목록 렌더링, 현재 값 표시
 *  - 키보드 탐색(↑/↓/Enter/Esc/Home/End), 옵션 highlight
 *  - 선택 시 닫힘, ESC/외부 클릭으로 닫힘
 *  - disabled 상태 지원
 *  - label 연결(aria-labelledby 또는 외부 <label for>)
 *  - destroy 시 외부 클릭 리스너/키보드 리스너/포커스 추적까지 모두 정리
 */

import { createEmitter, type Emitter } from '../lib/createEmitter';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectChangeEvent {
  type: 'change';
  value: string;
  label: string;
}

export interface SelectOpenEvent {
  type: 'open';
}
export interface SelectCloseEvent {
  type: 'close';
  reason: 'select' | 'esc' | 'blur' | 'programmatic';
}

export interface SelectEventMap {
  change: SelectChangeEvent;
  open: SelectOpenEvent;
  close: SelectCloseEvent;
}

export interface SelectOptions {
  options?: SelectOption[];
  initialValue?: string;
  placeholder?: string;
  disabled?: boolean;
  /** label과 연결할 id. 외부에서 <label for=""> 또는 aria-labelledby로 연결. */
  labelId?: string;
}

export interface Select {
  mount(container: HTMLElement): void;
  setOptions(options: SelectOption[]): void;
  setValue(value: string | null): void;
  getValue(): string | null;
  setDisabled(disabled: boolean): void;
  on: Emitter<SelectEventMap>['on'];
  destroy(): void;
}

export function createSelect(options: SelectOptions = {}): Select {
  const emitter = createEmitter<SelectEventMap>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _options = options;

  // TODO(mentee): 내부 상태(opts, value, open, highlightedIndex, disabled, dom refs)를 정의.

  return {
    mount(_container) {
      // TODO(mentee):
      //  1. trigger button과 listbox dom 생성. role="combobox" + aria-haspopup="listbox" 권장.
      //  2. 트리거 클릭/Enter/Space/ArrowDown으로 open. ESC/blur로 close.
      //  3. listbox 내 ↑/↓로 highlight, Enter로 select, Home/End 지원.
      //  4. 외부 클릭 감지 리스너는 mount 시 등록하고 destroy 시 해제.
      throw new Error('Select.mount not implemented');
    },
    setOptions(_opts) {
      // TODO(mentee): 옵션 갱신. 현재 value가 새 옵션 목록에 없으면 어떻게 할지 정책을 정해 README에 적을 것.
      throw new Error('Select.setOptions not implemented');
    },
    setValue(_value) {
      // TODO(mentee): trigger의 표시 라벨 갱신, aria-activedescendant 갱신, change 이벤트 emit.
      throw new Error('Select.setValue not implemented');
    },
    getValue() {
      // TODO(mentee)
      return null;
    },
    setDisabled(_disabled) {
      // TODO(mentee): aria-disabled 처리, 이벤트 무력화.
      throw new Error('Select.setDisabled not implemented');
    },
    on: emitter.on,
    destroy() {
      // TODO(mentee): 리스너/dom 정리, emitter.clear()
      emitter.clear();
    },
  };
}
