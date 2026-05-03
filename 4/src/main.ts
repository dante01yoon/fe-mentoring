import { createFunnelPage } from './pages/funnel';

const root = document.querySelector<HTMLElement>('#app');

if (!root) {
  throw new Error('App root element (#app) not found.');
}

const page = createFunnelPage();
page.mount(root);

// 개발 중 HMR을 쓰는 경우, 이전 인스턴스를 깔끔하게 destroy해야 listener가 누적되지 않는다.
// (멘티는 dev 환경에서도 destroy가 정확히 동작하는지 확인하면 좋다.)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    page.destroy();
  });
}
