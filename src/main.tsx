import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  RouterProvider,
  createBrowserRouter,
  useRouteError,
} from 'react-router-dom';
import { Root } from './routes/root';
import { PublicRoute } from './components/public-route';
import { ProtectedRoute } from './components/protected-route';
import { queryClient } from './lib/react-query';
import { AppProvider } from './app-provider';

function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  return <div>Dang!</div>;
}

// enable in .env for e2e tests
async function enableMocking() {
  if (import.meta.env.VITE_MSW !== 'enabled') {
    return;
  }

  const { worker } = await import('./testing/mocks/browser');

  return worker.start();
}

enableMocking().then(() => {
  const router = createBrowserRouter([
    {
      element: <PublicRoute />,
      children: [
        {
          path: '/',
          element: <Root />,
        },

        {
          path: '/login',
          lazy: async () => {
            const { Login, action } = await import('./routes/auth/login');
            return { Component: Login, action };
          },
        },
        {
          path: '/register',
          lazy: async () => {
            const { Register, action } = await import('./routes/auth/register');
            return { Component: Register, action };
          },
        },
      ],
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: '/notes',
          lazy: async () => {
            const { Notes, action, loader } = await import(
              './routes/notes/notes'
            );
            return {
              Component: Notes,
              action: action(queryClient),
              loader: loader(queryClient),
            };
          },
          // shouldRevalidate: () => false,
          children: [
            {
              path: 'new',
              lazy: async () => {
                const { NewNote, action } = await import('./routes/new');
                return { Component: NewNote, action: action(queryClient) };
              },
            },
            {
              path: ':noteId',
              lazy: async () => {
                const { Note, action, loader } = await import(
                  './routes/note/note'
                );
                return {
                  Component: Note,
                  action: action(queryClient),
                  loader: loader(queryClient),
                };
              },
              errorElement: <ErrorBoundary />,
            },
          ],
        },
      ],
    },
  ]);
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </React.StrictMode>,
  );
});
