/**
 * Shadow DOM 기반 격리 전략 placeholder.
 *
 * 장점:
 *   - host CSS 의 글로벌 영향(`button { all: unset }`, `* { ... }` 등)에서 어느 정도 보호됨.
 *   - 같은 document 안이라 focus, accessibility, event 가 비교적 자연스럽게 동작.
 *   - z-index, positioning 이 host 와 같은 viewport 좌표계라 띄우기 쉬움.
 *
 * 단점:
 *   - 모든 host CSS 로부터 완벽히 격리되는 것은 아님 (CSS custom property 상속, font-family, color 등은 새어 들어옴).
 *   - host 페이지의 JS 가 querySelector 등을 통해 위젯 내부에 접근할 가능성이 여전히 있음.
 *   - 글로벌 css 라이브러리(font icon 등) 를 inject 하려면 별도 처리가 필요.
 */

import type { IsolatedRoot } from './strategy';

export function createShadowRoot(_host: HTMLElement): IsolatedRoot {
  // TODO(student):
  //   1. host 안에 div 를 만들고 attachShadow({ mode: 'open' }) 으로 ShadowRoot 를 만드세요.
  //   2. mountTarget 에 ShadowRoot 를 그대로 노출하세요.
  //   3. injectStyles 는 <style> 태그를 ShadowRoot 안쪽에 append 하거나
  //      adoptedStyleSheets 를 사용하세요. (브라우저 호환성 고려)
  //   4. destroy 는 host 에서 div 를 떼어내고 reference 를 해제하세요.
  //   5. 두 번 destroy 호출돼도 안전해야 합니다.
  throw new Error('TODO(student): implement Shadow DOM isolation');
}
