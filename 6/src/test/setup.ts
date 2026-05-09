/**
 * Vitest setup file. jsdom 환경에서 공통 셋업을 합니다.
 *
 * 멘티 가이드:
 * - 위젯이 window.SupportWidget 을 등록하므로 테스트마다 격리가 필요합니다.
 *   beforeEach 에서 window.SupportWidget = undefined 로 정리하는 방법을 고려하세요.
 */

import '@testing-library/jest-dom/vitest';

beforeEach(() => {
  // TODO(student): window.SupportWidget 정리, document.body 초기화 등
});
