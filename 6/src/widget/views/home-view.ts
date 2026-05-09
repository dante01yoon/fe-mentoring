/**
 * Home view skeleton.
 *
 * 멘티 가이드:
 * - boot 직후 노출되는 첫 화면입니다.
 * - anonymous user 와 member user 의 노출 정보를 다르게 가져갈지 결정하세요.
 * - 위젯 내부 router 의 go('faq') / go('messages') 로 이동시키는 트리거가 여기 있습니다.
 */

export type HomeView = {
  root: HTMLElement;
  destroy(): void;
};

export function createHomeView(): HomeView {
  // TODO(student): 실제 home view DOM 구성 (제목, FAQ 미리보기, 메시지 진입 버튼 등)
  throw new Error('TODO(student): implement createHomeView()');
}
