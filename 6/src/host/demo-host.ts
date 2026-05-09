/**
 * Demo host page 컨트롤 패널.
 *
 * 이 파일은 "위젯이 임베드될 가짜 외부 웹사이트" 를 시뮬레이션합니다.
 * SDK 와 직접적인 의존이 없도록 의도적으로 분리되어 있으며, host 페이지 입장에서
 * window.SupportWidget 을 호출하는 모습을 그대로 보여줍니다.
 *
 * 표시 버튼:
 *   - Boot anonymous
 *   - Boot member
 *   - Shutdown
 *   - Show
 *   - Hide
 *   - Track fake event
 *   - Simulate host route change
 *   - Use custom launcher
 */

import { createCustomLauncherDemoButton } from './custom-launcher';
import { createRouteSimulator } from './route-simulator';
import {
  setWidgetScenario,
  type WidgetScenario,
} from '../mocks/scenarios';

type HostButtonSpec = {
  label: string;
  onClick: () => void;
  scenario?: WidgetScenario;
};

export function renderDemoHost(root: HTMLElement): void {
  root.innerHTML = '';

  const heading = document.createElement('h1');
  heading.textContent = 'Demo Host Page';
  root.appendChild(heading);

  const description = document.createElement('p');
  description.textContent =
    '이 페이지는 위젯이 임베드될 외부 웹사이트를 시뮬레이션합니다. demo-host.css 의 강한 글로벌 스타일이 위젯을 어떻게 깨뜨리는지 isolation 전략 없이/있이 비교해보세요.';
  root.appendChild(description);

  const routeSim = createRouteSimulator();

  const callSdk = (method: 'shutdown' | 'show' | 'hide'): void => {
    const sdk = window.SupportWidget;
    if (!sdk) {
      console.warn('[demo-host] window.SupportWidget 이 등록되지 않았습니다.');
      return;
    }
    try {
      sdk[method]();
    } catch (err) {
      console.warn(`[demo-host] SupportWidget.${method}() threw`, err);
    }
  };

  const callBoot = (
    user: { id: string; name?: string; email?: string } | null,
    extra?: { launcherSelector?: string },
  ): void => {
    const sdk = window.SupportWidget;
    if (!sdk) {
      console.warn('[demo-host] window.SupportWidget 이 등록되지 않았습니다.');
      return;
    }
    try {
      void sdk.boot({
        appId: 'demo-app',
        user,
        locale: 'ko',
        launcher: extra?.launcherSelector
          ? { mode: 'custom', selector: extra.launcherSelector }
          : { mode: 'default' },
      });
    } catch (err) {
      console.warn('[demo-host] SupportWidget.boot() threw', err);
    }
  };

  const buttons: HostButtonSpec[] = [
    {
      label: 'Boot anonymous',
      scenario: 'anonymous',
      onClick: () => callBoot(null),
    },
    {
      label: 'Boot member',
      scenario: 'member',
      onClick: () =>
        callBoot({
          id: 'u_001',
          name: 'Jaewon Kim',
          email: 'jaewon@example.com',
        }),
    },
    {
      label: 'Shutdown',
      onClick: () => callSdk('shutdown'),
    },
    {
      label: 'Show',
      onClick: () => callSdk('show'),
    },
    {
      label: 'Hide',
      onClick: () => callSdk('hide'),
    },
    {
      label: 'Track fake event',
      onClick: () => {
        const sdk = window.SupportWidget;
        if (!sdk) return;
        try {
          sdk.track({ name: 'demo_clicked', properties: { source: 'host' } });
        } catch (err) {
          console.warn('[demo-host] SupportWidget.track() threw', err);
        }
      },
    },
    {
      label: 'Simulate host route change',
      scenario: 'host-route-change',
      onClick: () => routeSim.go(`/host-page/${Date.now()}`),
    },
    {
      label: 'Use custom launcher',
      onClick: () =>
        callBoot(
          { id: 'u_001', name: 'Jaewon Kim' },
          { launcherSelector: '#custom-support-launcher' },
        ),
    },
  ];

  const buttonRow = document.createElement('div');
  buttonRow.className = 'demo-host-button-row';

  for (const spec of buttons) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = spec.label;
    btn.addEventListener('click', () => {
      if (spec.scenario) {
        setWidgetScenario(spec.scenario);
      }
      spec.onClick();
    });
    buttonRow.appendChild(btn);
  }

  root.appendChild(buttonRow);

  // host 측 fake content 영역 (host CSS 가 div { border: 10px solid hotpink } 인 것을 시각적으로 보여줍니다.)
  const fakeContent = document.createElement('div');
  fakeContent.innerHTML = `
    <h2>외부 host 페이지의 본문</h2>
    <p>이 div 들은 demo-host.css 에 의해 hotpink 보더가 강제로 그려집니다.</p>
    <p>위젯이 host CSS 의 영향을 얼마나 받는지/막는지가 핵심 평가 포인트입니다.</p>
  `;
  root.appendChild(fakeContent);

  // host 측 custom launcher 후보 버튼
  const customLauncherWrap = document.createElement('div');
  const customLauncherTitle = document.createElement('h3');
  customLauncherTitle.textContent = 'Host 페이지의 custom launcher 후보';
  customLauncherWrap.appendChild(customLauncherTitle);
  customLauncherWrap.appendChild(createCustomLauncherDemoButton());
  root.appendChild(customLauncherWrap);
}
