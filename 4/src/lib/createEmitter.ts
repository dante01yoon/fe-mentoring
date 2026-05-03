/*
 * 작은 이벤트 에미터.
 * 컴포넌트마다 개별 emitter를 갖게 하면 destroy 시 listener 정리가 쉬워진다.
 *
 * NOTE: 멘티가 그대로 써도 되고, custom event(EventTarget) 기반으로 바꿔도 좋다.
 *       어떤 방식을 택했는지는 README에 근거와 함께 적을 것.
 */

export type EmitterListener<TPayload> = (payload: TPayload) => void;

export interface Emitter<TEventMap extends Record<string, unknown>> {
  on<TKey extends keyof TEventMap>(
    type: TKey,
    listener: EmitterListener<TEventMap[TKey]>,
  ): () => void;
  off<TKey extends keyof TEventMap>(
    type: TKey,
    listener: EmitterListener<TEventMap[TKey]>,
  ): void;
  emit<TKey extends keyof TEventMap>(type: TKey, payload: TEventMap[TKey]): void;
  clear(): void;
}

export function createEmitter<TEventMap extends Record<string, unknown>>(): Emitter<TEventMap> {
  const listeners: { [K in keyof TEventMap]?: Set<EmitterListener<TEventMap[K]>> } = {};

  return {
    on(type, listener) {
      const set = (listeners[type] ??= new Set()) as Set<EmitterListener<TEventMap[typeof type]>>;
      set.add(listener);
      return () => set.delete(listener);
    },
    off(type, listener) {
      listeners[type]?.delete(listener as never);
    },
    emit(type, payload) {
      listeners[type]?.forEach((fn) => fn(payload as never));
    },
    clear() {
      (Object.keys(listeners) as Array<keyof TEventMap>).forEach((key) => {
        listeners[key]?.clear();
      });
    },
  };
}
