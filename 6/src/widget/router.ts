/**
 * 위젯 "내부" 라우터 skeleton.
 *
 * 주의: 이 라우터는 host 페이지의 URL 을 바꾸지 않습니다.
 *      위젯 panel 안에서 home / faq / messages 화면을 전환하는 용도입니다.
 *
 * 멘티 가이드:
 * - host URL 을 바꿔도 되지만, 그러면 host 페이지 라우터와 충돌할 수 있습니다.
 *   안전한 기본값은 "host URL 을 건드리지 않고 internal state 만 관리" 입니다.
 * - 마지막 route 를 storage 에 저장해 boot 직후 복구할지 여부도 멘티가 결정하세요.
 */

export type WidgetRoute = 'home' | 'faq' | 'messages';

export type WidgetRouter = {
  current(): WidgetRoute;
  go(route: WidgetRoute): void;
  subscribe(listener: (route: WidgetRoute) => void): () => void;
};

/**
 * TODO(student):
 *   - 내부 route state 를 관리하세요. (closure 변수 / Map / 등 자유)
 *   - go() 호출 시 listener 들에게 새 route 를 알리세요.
 *   - widget:route-changed 이벤트를 event bus 로 emit 할지, 직접 listener 만 쓸지 결정하세요.
 *   - host URL 도 바꾸고 싶다면 query/hash 방식 중 한 쪽을 골라 README 에 명시하세요.
 */
export function createWidgetRouter(_initial: WidgetRoute = 'home'): WidgetRouter {
  // TODO(student): 실제 라우터 구현
  return {
    current: () => 'home',
    go: () => {
      /* TODO(student) */
    },
    subscribe: () => () => {
      /* TODO(student) */
    },
  };
}
