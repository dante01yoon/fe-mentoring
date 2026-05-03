/*
 * 아주 작은 hash 라우터 스켈레톤.
 *
 * 멘티 TODO:
 *   - 잘못된 경로 진입 시 안전한 step으로 복구하는 정책을 정할 것
 *   - 새로고침/뒤로가기에서도 현재 step이 자연스럽게 복구되는지 확인할 것
 *   - history API 기반으로 바꾸어도 무방. 단, 어느 쪽을 택했는지 근거를 README에 적을 것
 *
 * 이 파일은 "동작하는 최소 골격"만 제공한다. 실제 step 검증/리다이렉트 로직은 추가 구현이 필요하다.
 */

export type RouteListener = (route: string) => void;

export interface Router {
  start(): void;
  stop(): void;
  go(route: string): void;
  current(): string;
  on(listener: RouteListener): () => void;
}

export function createHashRouter(initial: string): Router {
  const listeners = new Set<RouteListener>();

  const read = () => {
    const raw = window.location.hash.replace(/^#\/?/, '');
    return raw.length === 0 ? initial : raw;
  };

  const handler = () => {
    const next = read();
    listeners.forEach((fn) => fn(next));
  };

  return {
    start() {
      if (window.location.hash.length === 0) {
        window.location.replace(`#/${initial}`);
      }
      window.addEventListener('hashchange', handler);
    },
    stop() {
      window.removeEventListener('hashchange', handler);
      listeners.clear();
    },
    go(route) {
      window.location.hash = `#/${route}`;
    },
    current() {
      return read();
    },
    on(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
