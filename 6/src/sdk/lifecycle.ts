/**
 * 위젯 lifecycle 상태 정의.
 *
 * 멘티 가이드:
 * - 아래 union 타입은 "최소 권장" 상태이며, 필요하다면 본인이 더 쪼개도 됩니다.
 * - 각 상태에서 어떤 메서드 호출이 허용되는지를 결정하고, runtime.ts 에서 검증하세요.
 *
 * 예) 'idle' 상태에서 show() 호출은 거부 또는 무시.
 *     'booted' 상태에서 boot() 재호출 시 정책을 정해야 함.
 */

export type WidgetLifecycleState =
  | 'idle'
  | 'booting'
  | 'booted'
  | 'visible'
  | 'hidden'
  | 'shutting-down'
  | 'destroyed';

/**
 * 상태 전이 규칙 helper skeleton.
 *
 * TODO(student):
 *   - 상태 전이 가능 여부를 검증하는 함수를 구현하세요.
 *   - 예: canTransition('idle', 'booting') === true
 *         canTransition('destroyed', 'visible') === false
 *   - 이 helper 는 boot/shutdown/show/hide 진입 시 검사용으로 쓰일 수 있습니다.
 */
export function canTransition(_from: WidgetLifecycleState, _to: WidgetLifecycleState): boolean {
  // TODO(student): 상태 전이 매트릭스를 정의하세요.
  return true;
}

/**
 * 상태 머신 자체는 멘티가 직접 작성합니다.
 * 어떤 자료구조(closure / class / 단순 변수)를 쓸지도 멘티 선택입니다.
 */
