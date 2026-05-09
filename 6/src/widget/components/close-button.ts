/**
 * Close button skeleton.
 *
 * 멘티 가이드:
 * - panel 우측 상단 X 버튼을 만드세요.
 * - 클릭 시 hide() 와 동등하게 작동하면 충분합니다.
 * - 버튼이 host CSS 의 `button { all: unset; }` 영향을 받지 않게 isolation 안에서 그리세요.
 */

export type CloseButtonComponent = {
  root: HTMLElement;
  destroy(): void;
};

export type CloseButtonOptions = {
  onClick: () => void;
};

export function createCloseButton(_options: CloseButtonOptions): CloseButtonComponent {
  // TODO(student): close button DOM + click handler + cleanup
  throw new Error('TODO(student): implement createCloseButton()');
}
