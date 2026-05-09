/**
 * SDK runtime factory.
 *
 * createRuntime() 은 SDK 의 "내부 인스턴스" 를 만들고, public API (boot/shutdown/show/hide/track)
 * 에 대응되는 메서드를 반환합니다.
 *
 * 이 파일은 의도적으로 미완성 상태입니다. 멘티가 직접 채워야 합니다.
 */

import type {
  SupportWidgetAPI,
  SupportWidgetBootConfig,
  TrackEventPayload,
} from './public-api';

export function createRuntime(): SupportWidgetAPI {
  // TODO(student): lifecycle state 를 정의하세요. (lifecycle.ts 참고)
  // TODO(student): boot 중복 호출 시 정책을 정하세요. (덮어쓰기 / 무시 / throw 중 택1)
  // TODO(student): shutdown 시 DOM, event listener, timer, storage subscription 을 정리하세요.
  // TODO(student): show/hide 호출 가능 상태를 검증하세요.
  // TODO(student): mountWidget() 의 반환값(MountedWidget)을 어떻게 보관할지 결정하세요.

  const boot = async (_config: SupportWidgetBootConfig): Promise<void> => {
    // TODO(student):
    //   1. config 를 normalizeBootConfig 로 검증/정규화
    //   2. 현재 lifecycle state 검사 (이미 booted 면 정책 적용)
    //   3. fetchWidgetBootstrap 으로 초기 데이터 로드
    //   4. mountWidget 으로 DOM 부착
    //   5. event bus 로 'widget:booted' emit
    throw new Error('TODO(student): implement createRuntime().boot()');
  };

  const shutdown = (): void => {
    // TODO(student):
    //   1. mountedWidget.destroy() 호출
    //   2. listener / timer / storage subscription cleanup
    //   3. window.SupportWidget 을 다시 idle 상태로 복구
    throw new Error('TODO(student): implement createRuntime().shutdown()');
  };

  const show = (): void => {
    // TODO(student): booted 상태에서만 동작하도록 가드하세요.
    throw new Error('TODO(student): implement createRuntime().show()');
  };

  const hide = (): void => {
    // TODO(student): visible 상태에서만 의미 있도록 가드하세요.
    throw new Error('TODO(student): implement createRuntime().hide()');
  };

  const track = (_event: TrackEventPayload): void => {
    // TODO(student):
    //   - track 은 실패해도 host 페이지에 영향이 없어야 합니다.
    //   - mocks/api-client.ts 의 trackEvent 를 호출하되, throw 하지 마세요.
    throw new Error('TODO(student): implement createRuntime().track()');
  };

  return { boot, shutdown, show, hide, track };
}
