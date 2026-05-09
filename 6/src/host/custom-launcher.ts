/**
 * Custom launcher 데모.
 *
 * 멘티 가이드:
 * - boot config.launcher.mode === 'custom' + selector 가 주어졌을 때, host 페이지의 임의 버튼을
 *   launcher 로 사용할 수 있어야 합니다.
 * - 이 selector 가 가리키는 element 가 사라지거나 다시 mount 될 때 어떻게 대응할지 README 에 기록하세요.
 *   (MutationObserver, document.querySelector 재시도 등)
 */

/**
 * host 페이지에 "Use custom launcher" 라는 host 측 버튼을 만듭니다.
 * 멘티는 boot 시 launcher.mode = 'custom', selector = '#custom-support-launcher' 처럼 SDK 에 알려줘야 합니다.
 */
export function createCustomLauncherDemoButton(): HTMLButtonElement {
  const button = document.createElement('button');
  button.id = 'custom-support-launcher';
  button.type = 'button';
  button.textContent = 'Custom Launcher (host)';
  return button;
}
