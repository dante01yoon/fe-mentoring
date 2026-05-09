# API Contract

> 주의: 이 문서는 "fake API" 의 계약입니다. 실제 네트워크 백엔드는 존재하지 않습니다.
> `src/mocks/api-client.ts` 가 in-memory 시뮬레이션을 제공합니다.

## 함수 목록

- `fetchWidgetBootstrap(config)`
- `fetchUnreadCount(userId?)`
- `fetchFaqItems()`
- `fetchMessages(userId?)`
- `sendMessage({ body, userId? })`
- `trackEvent(payload)`

## 시나리오

`src/mocks/scenarios.ts` 의 `WidgetScenario` union 으로 분기됩니다.

| 시나리오                  | 기대 동작                                   |
| ------------------------- | ------------------------------------------- |
| `default`                 | 기본 happy path                             |
| `anonymous`               | user === null 으로 간주, unread = 0         |
| `member`                  | 로그인 사용자, unread > 0                   |
| `slow-boot`               | bootstrap 응답 1500ms 지연                  |
| `boot-failure`            | bootstrap 호출이 reject                     |
| `unread-failure`          | fetchUnreadCount 가 reject                  |
| `message-send-failure`    | sendMessage 결과가 status: 'failed'         |
| `host-route-change`       | host pushState 발생 후 동작 검증            |
| `css-conflict`            | host CSS 가 위젯을 깨뜨리는 시나리오 검증   |

## 스캐폴드가 정해두지 않은 것

- 응답 schema 의 구체 모양 (멘티가 자유롭게 확장)
- 에러 객체 모양 (Error 그대로 던질지 / `{ code, message }` 로 감쌀지)
- 재시도 정책

각 시나리오에서 fake API 가 어떻게 동작하는지는 멘티가 `api-client.ts` 에 직접 구현하고 README 에 짧게 적습니다.
