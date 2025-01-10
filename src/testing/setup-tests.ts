import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
// import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';
import { queryClient } from '@/lib/react-query';
import { fetch } from 'cross-fetch';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;
window.PointerEvent = MouseEvent as typeof PointerEvent;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
global.fetch = fetch;

function getBoundingClientRect(): DOMRect {
  const rec = {
    x: 0,
    y: 0,
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
  };
  return { ...rec, toJSON: () => rec };
}

class FakeDOMRectList extends Array<DOMRect> implements DOMRectList {
  item(index: number): DOMRect | null {
    return this[index];
  }
}

document.elementFromPoint = (): null => null;
HTMLElement.prototype.getBoundingClientRect = getBoundingClientRect;
HTMLElement.prototype.getClientRects = (): DOMRectList => new FakeDOMRectList();
Range.prototype.getBoundingClientRect = getBoundingClientRect;
Range.prototype.getClientRects = (): DOMRectList => new FakeDOMRectList();

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  // console.log('msw started', server.listHandlers());
});
afterAll(() => server.close());

afterEach(() => {
  // cleanup();
  server.resetHandlers();
  queryClient.clear();
});
