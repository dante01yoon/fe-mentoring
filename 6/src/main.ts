/**
 * 데모 host 페이지의 entry point.
 *
 * 이 파일은 host 페이지의 역할 (host JS) 와 SDK 의 진입 (widget JS) 을 한꺼번에 시뮬레이션합니다.
 * 실제 배포 시에는 host 페이지가 widget.js 만 <script> 로 불러오는 형태가 되겠지만,
 * 학습 환경에서는 동일 Vite 번들 안에서 둘 다 로드합니다.
 *
 * 주의: ./sdk 를 import 하는 순간 window.SupportWidget 이 등록됩니다.
 *      host 페이지 입장에서는 그 다음에 boot() 를 호출하는 형태가 됩니다.
 */

import './sdk';
import { renderDemoHost } from './host/demo-host';

const appRoot = document.getElementById('app');
if (!appRoot) {
  throw new Error('#app element가 host 페이지에 존재하지 않습니다.');
}

renderDemoHost(appRoot);
