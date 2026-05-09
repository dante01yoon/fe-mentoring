/**
 * iframe 기반 격리 전략 placeholder.
 *
 * 장점:
 *   - host CSS 의 영향에서 거의 완벽히 격리됨.
 *   - host JS 가 위젯 내부 DOM 에 직접 접근하기 어려움 (cross-document boundary).
 *   - 분리된 document 라 font-family / color 상속도 차단됨.
 *
 * 단점:
 *   - 같은 viewport 좌표계가 아니라서 fixed positioning, z-index 처리에 추가 작업 필요.
 *   - sandbox / focus / accessibility 처리 비용이 큼.
 *   - host 와 통신하려면 postMessage 같은 명시적 채널이 필요.
 *   - css 를 iframe document 안에 별도로 주입해야 함.
 */

import type { IsolatedRoot } from './strategy';

export function createIframeRoot(_host: HTMLElement): IsolatedRoot {
  // TODO(student):
  //   1. document.createElement('iframe') 으로 iframe 을 만들고 host 에 append 하세요.
  //   2. iframe load 이후 contentDocument 에 body / head 가 준비되었는지 확인하세요.
  //   3. mountTarget 으로 iframe.contentDocument.body 를 노출하세요.
  //   4. injectStyles 는 iframe.contentDocument.head 에 <style> 을 append 하세요.
  //   5. destroy 는 iframe 자체를 host 에서 떼어내세요.
  //   6. host 와의 통신이 필요하면 postMessage 채널을 만드세요. (보안 / origin 검사 필수)
  throw new Error('TODO(student): implement iframe isolation');
}
