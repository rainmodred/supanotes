import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router/dom';
import { AppProvider } from './app-provider';
import { createBrowserRouter } from 'react-router';
import { routes } from './routes';

// enable in .env for e2e tests
async function enableMocking() {
  if (import.meta.env.VITE_MSW !== 'enabled') {
    return;
  }

  const { worker } = await import('./testing/mocks/browser');

  return worker.start();
}

enableMocking().then(() => {
  const router = createBrowserRouter(routes, {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  });
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </React.StrictMode>,
  );
});
