/**
 * fake API 가 분기에 활용할 scenario flag.
 *
 * 멘티 가이드:
 * - 시나리오를 바꿀 수 있는 UI 는 host page 데모에 둬도 좋고, dev tools 콘솔에서 setWidgetScenario('...') 로
 *   바꿔도 됩니다.
 * - 각 시나리오에서 fake API 가 어떻게 동작해야 하는지는 멘티가 결정합니다.
 *   (api-client.ts 의 TODO 와 짝을 맞춰서 작성하세요.)
 */

export type WidgetScenario =
  | 'default'
  | 'anonymous'
  | 'member'
  | 'slow-boot'
  | 'boot-failure'
  | 'unread-failure'
  | 'message-send-failure'
  | 'host-route-change'
  | 'css-conflict';

let currentScenario: WidgetScenario = 'default';

export function setWidgetScenario(scenario: WidgetScenario): void {
  currentScenario = scenario;
}

export function getWidgetScenario(): WidgetScenario {
  return currentScenario;
}
