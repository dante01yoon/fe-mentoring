/**
 * SDK 의 외부에 노출되는 public API 타입 정의 모음입니다.
 *
 * 이 파일은 "타입 계약" 만 책임지고, 실제 구현은 다른 파일들(runtime, mount 등)에서 이뤄집니다.
 * 외부 host 페이지에서는 `window.SupportWidget` 을 통해 이 타입의 함수만 호출할 수 있습니다.
 */

/**
 * 위젯이 식별하는 사용자 정보.
 * - null 이면 anonymous (비로그인) 사용자로 간주합니다.
 * - id 만 필수이며, name / email 은 선택입니다.
 */
export type SupportWidgetUser =
  | {
      id: string;
      name?: string;
      email?: string;
    }
  | null;

/**
 * boot() 호출 시 host 페이지가 SDK 에 전달하는 설정.
 *
 * 멘티 가이드:
 * - appId 는 항상 필수입니다.
 * - user 가 없거나 null 이면 anonymous boot 로 처리하세요.
 * - launcher.mode === 'custom' 인 경우 host 페이지의 selector 를 launcher 로 사용해야 합니다.
 */
export type SupportWidgetBootConfig = {
  appId: string;
  user?: SupportWidgetUser;
  locale?: 'ko' | 'en';
  launcher?: {
    mode: 'default' | 'custom';
    selector?: string;
  };
  theme?: {
    primaryColor?: string;
  };
};

/**
 * track() 호출 시 host 페이지가 보내는 이벤트 페이로드.
 */
export type TrackEventPayload = {
  name: string;
  properties?: Record<string, unknown>;
};

/**
 * SupportWidget 이 외부에 노출하는 함수 시그니처.
 *
 * 이 타입에 정의된 메서드 외의 표면을 추가로 노출하지 마세요.
 * (전역 namespace 오염 방지)
 */
export type SupportWidgetAPI = {
  boot(config: SupportWidgetBootConfig): Promise<void> | void;
  shutdown(): void;
  show(): void;
  hide(): void;
  track(event: TrackEventPayload): void;
};
