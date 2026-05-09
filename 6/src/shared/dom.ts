/**
 * 작은 DOM helper 모음.
 *
 * 멘티 가이드:
 * - 라이브러리 사용 금지이므로, 자주 쓰는 DOM 패턴(요소 만들기, 안전하게 제거 등)은
 *   이 파일에 모아두면 isolation 전략과 cleanup 구현 시 도움이 됩니다.
 * - 본인 스타일에 맞게 시그니처를 자유롭게 변경해도 좋습니다.
 */

export type ElementProps = {
  className?: string;
  text?: string;
  attrs?: Record<string, string>;
  children?: Node[];
};

/**
 * 작은 createElement helper. 멘티가 자유롭게 확장하세요.
 */
export function createEl<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: ElementProps = {},
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (props.className) el.className = props.className;
  if (props.text !== undefined) el.textContent = props.text;
  if (props.attrs) {
    for (const [key, value] of Object.entries(props.attrs)) {
      el.setAttribute(key, value);
    }
  }
  if (props.children) {
    for (const child of props.children) {
      el.appendChild(child);
    }
  }
  return el;
}

/**
 * 안전하게 노드를 부모에서 떼어냅니다. cleanup 시 유용합니다.
 */
export function safeRemove(node: Node | null | undefined): void {
  if (!node) return;
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

/**
 * addEventListener + 해제 함수를 한번에 반환하는 helper.
 *
 * 멘티 가이드:
 * - shutdown 시 listener 누수를 막으려면 이런 helper 가 유용합니다.
 * - return 값을 모아 두었다가 destroy 시 일괄 해제하세요.
 */
export function on<K extends keyof HTMLElementEventMap>(
  target: EventTarget,
  event: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions,
): () => void {
  target.addEventListener(event, handler as EventListener, options);
  return () => target.removeEventListener(event, handler as EventListener, options);
}
