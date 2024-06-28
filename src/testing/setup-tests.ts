import '@testing-library/jest-dom/vitest';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';
import { queryClient } from '@/lib/react-query';
import { fetch } from 'cross-fetch';
// import * as matchers from '@testing-library/jest-dom/matchers';

// expect.extend(matchers);
global.fetch = fetch;

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  // console.log('msw started', server.listHandlers());
});
afterAll(() => server.close());

afterEach(() => {
  cleanup();
  server.resetHandlers();
  queryClient.clear();
});
