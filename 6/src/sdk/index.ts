/**
 * SDK 진입점.
 *
 * 외부 host 페이지 입장에서 보면 이 파일이 곧 "widget.js" 입니다.
 * 즉, 이 파일이 실행되는 순간 `window.SupportWidget` 이 등록되어야 합니다.
 *
 * 멘티 가이드:
 * - 전역 namespace 는 정확히 하나(`window.SupportWidget`) 만 노출하세요.
 * - boot 함수가 여러 번 import 되더라도 SDK 인스턴스는 하나여야 합니다.
 *   (멘티가 module 단일성에 대해 고민하도록 의도적으로 자유롭게 둡니다.)
 */

import { createRuntime } from './runtime';
import type { SupportWidgetAPI } from './public-api';

declare global {
  interface Window {
    SupportWidget?: SupportWidgetAPI;
  }
}

const runtime = createRuntime();

window.SupportWidget = {
  boot: runtime.boot,
  shutdown: runtime.shutdown,
  show: runtime.show,
  hide: runtime.hide,
  track: runtime.track,
};

// TODO(student): 동일한 SDK 가 여러 번 로드될 때의 정책을 결정하세요.
//   - 이미 window.SupportWidget 이 존재하면 덮어쓰기? 무시? warn?
