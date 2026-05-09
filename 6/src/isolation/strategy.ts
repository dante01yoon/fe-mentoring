/**
 * 격리 전략 dispatcher skeleton.
 *
 * 위젯이 host 페이지로부터 받는 영향을 줄이기 위한 격리 방식 두 가지를 제공합니다.
 *   - 'shadow-dom': host DOM 트리 안에 Shadow Root 를 만들고 그 안에서만 위젯을 그림
 *   - 'iframe':     완전히 분리된 iframe document 안에서 위젯을 그림
 *
 * 멘티는 둘 중 하나를 선택해 구현해야 합니다.
 * 두 파일(create-shadow-root.ts, create-iframe-root.ts) 모두 placeholder 로 제공되니,
 * 선택하지 않은 쪽은 그대로 두거나 삭제해도 됩니다.
 *
 * 트레이드오프 비교는 각 파일 상단 주석을 참고하세요.
 */

import { createShadowRoot } from './create-shadow-root';
import { createIframeRoot } from './create-iframe-root';

export type IsolationStrategy = 'shadow-dom' | 'iframe';

export type CreateIsolatedRootOptions = {
  strategy: IsolationStrategy;
  host: HTMLElement;
};

export type IsolatedRoot = {
  /**
   * 위젯 DOM 을 그리기 위한 ParentNode.
   *  - shadow-dom: ShadowRoot
   *  - iframe:     iframe.contentDocument.body
   */
  mountTarget: ParentNode;

  /**
   * css 를 inject 할 때 사용하는 root.
   * shadow-dom 인 경우 ShadowRoot 자체에, iframe 인 경우 iframe document 의 head 에 inject 해야 합니다.
   */
  injectStyles(css: string): void;

  /**
   * isolation root 자체를 정리합니다. cleanup 시 host 페이지에 흔적이 남지 않게 만드세요.
   */
  destroy(): void;
};

/**
 * TODO(student):
 *   - 멘티가 선택한 전략의 실제 구현을 create-shadow-root.ts 또는 create-iframe-root.ts 에서 채우세요.
 *   - 이 dispatcher 는 단순히 dispatch 만 합니다.
 */
export function createIsolatedRoot(options: CreateIsolatedRootOptions): IsolatedRoot {
  switch (options.strategy) {
    case 'shadow-dom':
      return createShadowRoot(options.host);
    case 'iframe':
      return createIframeRoot(options.host);
    default: {
      // 미래 확장을 위한 exhaustive check
      const _never: never = options.strategy;
      throw new Error(`Unknown isolation strategy: ${String(_never)}`);
    }
  }
}
