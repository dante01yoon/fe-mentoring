// scenario 식별자.
// 실제 매핑은 src/mocks/scenarios.ts에서 import.meta.env.VITE_INBOX_SCENARIO를 통해 정해집니다.
// 이 파일은 도메인 영역에서 scenario 값을 “타입”으로만 노출하기 위한 얇은 alias입니다.

export type {
  InboxScenario,
} from '../../../mocks/scenarios';

export {
  INBOX_SCENARIO,
  isInboxScenario,
} from '../../../mocks/scenarios';
