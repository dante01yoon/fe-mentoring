/**
 * SPA host 라우트 변경을 시뮬레이션합니다.
 *
 * 멘티 가이드:
 * - 진짜 history.pushState 를 호출하면 host 페이지의 URL 이 바뀌고, popstate 가 발생합니다.
 * - 위젯이 host route 변경을 감지하고 상태를 유지해야 한다는 점을 보여주는 데모입니다.
 * - 멘티는 `popstate` 또는 history 패치를 통해 host route 변경을 감지하는 방식을 README 에 적어야 합니다.
 */

export type RouteSimulator = {
  go(path: string): void;
  destroy(): void;
};

export function createRouteSimulator(): RouteSimulator {
  let active = true;
  const go = (path: string): void => {
    if (!active) return;
    try {
      window.history.pushState({}, '', path);
      // popstate 는 사용자 navigation 에서만 발생하므로 직접 dispatchEvent 합니다.
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err) {
      // host 환경에 따라 pushState 가 막혀 있을 수 있습니다.
      console.warn('[demo-host] pushState failed', err);
    }
  };

  const destroy = (): void => {
    active = false;
  };

  return { go, destroy };
}
