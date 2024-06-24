import { setupServer } from 'msw/node';

import { handlers } from './handlers';

export const server = setupServer(...handlers);
export const TEST_API = import.meta.env.VITE_URL;

server.events.on('request:start', ({ request }) => {
  console.log('MSW intercepted:', request.method, request.url);
});
