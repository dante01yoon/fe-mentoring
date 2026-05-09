/**
 * boot config 검증 / 정규화 helper.
 *
 * 멘티 가이드:
 * - appId 가 빈 문자열인 경우, locale 이 'ko' | 'en' 이 아닌 경우 등을 검사하세요.
 * - launcher.mode === 'custom' 일 때 selector 가 없으면 어떻게 처리할지 결정하세요.
 * - zod 를 도입해도 좋고, 직접 if 로 검사해도 됩니다.
 */

import type { SupportWidgetBootConfig } from './public-api';

export const DEFAULT_LOCALE = 'ko' as const;

/**
 * boot 시 들어온 config 를 internal-friendly 한 형태로 정규화합니다.
 * 예: locale 누락 시 'ko' 로 채우기, user 가 undefined 면 null 로 강제 등.
 *
 * TODO(student):
 *   - 잘못된 입력에 대해 SupportWidgetConfigError 를 던지세요.
 *   - 어떤 필드를 정규화하고, 어떤 필드를 그대로 둘지 정책을 정하고 README 에 적으세요.
 */
export function normalizeBootConfig(config: SupportWidgetBootConfig): SupportWidgetBootConfig {
  // TODO(student): 검증 / 기본값 채우기 구현
  return {
    ...config,
    locale: config.locale ?? DEFAULT_LOCALE,
    user: config.user ?? null,
    launcher: config.launcher ?? { mode: 'default' },
  };
}
