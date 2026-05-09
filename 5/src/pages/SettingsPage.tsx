import { INBOX_SCENARIO } from '../mocks/scenarios';

/**
 * /settings — scaffold용 placeholder 페이지.
 * 멘티가 scenario switcher를 만들거나 사용자 환경설정을 추가할 수 있도록 자리만 잡아둡니다.
 */
export default function SettingsPage() {
  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <p>현재 scenario: <code>{INBOX_SCENARIO}</code></p>
      <p className="settings-page__hint">
        TODO(student): scenario switcher / 알림 설정 / 내 정보 같은 운영자 옵션을 추가하세요.
      </p>
    </div>
  );
}
