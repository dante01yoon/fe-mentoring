/**
 * SDK 가 throw 할 수 있는 에러 타입 모음입니다.
 *
 * 멘티 가이드:
 * - boot 이전 show/hide/track 호출에 어떤 에러를 던질지 결정하세요.
 * - host 페이지를 깨뜨리지 않게 하려면 일부 에러는 console.warn 으로 강등할 수 있습니다.
 *   (예: track 실패, fake API 에러)
 * - 어느 케이스를 throw 하고, 어느 케이스를 silent 하게 처리할지를 README 에 명시하세요.
 */

export class SupportWidgetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SupportWidgetError';
  }
}

export class SupportWidgetNotBootedError extends SupportWidgetError {
  constructor(method: string) {
    super(`SupportWidget.${method}() called before boot()`);
    this.name = 'SupportWidgetNotBootedError';
  }
}

export class SupportWidgetAlreadyBootedError extends SupportWidgetError {
  constructor() {
    super('SupportWidget.boot() called while widget is already booted');
    this.name = 'SupportWidgetAlreadyBootedError';
  }
}

export class SupportWidgetConfigError extends SupportWidgetError {
  constructor(message: string) {
    super(`SupportWidget config error: ${message}`);
    this.name = 'SupportWidgetConfigError';
  }
}
