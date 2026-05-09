import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from '../../mocks/server';

// MSW server lifecycle.
// 멘티가 핸들러를 추가하거나 override할 때도 reset 사이클이 자동으로 동작합니다.

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
