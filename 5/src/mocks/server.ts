// Vitest용 mock server. 노드 환경에서 fetch를 인터셉트합니다.
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
