import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  RouterProvider,
  createBrowserRouter,
  useRouteError,
} from 'react-router-dom';
import { Root } from './routes/root';
import { Login, action as loginAction } from './routes/auth/login';
import { Register, action as registerAction } from './routes/auth/register';
import { PublicRoute } from './components/public-route';
import {
  Notes,
  loader as notesLoader,
  action as notesAction,
} from './routes/notes/notes';
import {
  Note,
  action as noteAction,
  loader as noteLoader,
} from './routes/note/note';
import { ProtectedRoute } from './components/protected-route';
import { NewNote, action as newNoteAction } from './routes/new';
import { queryClient } from './lib/react-query';
import { AppProvider } from './app-provider';
import { DemoRoute } from './components/demo-route';

function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  return <div>Dang!</div>;
}

async function enableMocking() {
  if (import.meta.env.VITE_MSW !== 'enabled') {
    return;
  }

  const { worker } = await import('./testing/mocks/browser');

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
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
          element: <Login />,
          action: loginAction,
        },
        {
          path: '/register',
          element: <Register />,
          action: registerAction,
        },
      ],
    },
    {
      element: <DemoRoute />,
      children: [
        {
          path: '/demo',
          element: <Notes />,
          loader: notesLoader(queryClient),
          action: notesAction(queryClient),
          children: [
            {
              path: 'new',
              element: <NewNote />,
              action: newNoteAction(queryClient),
            },
            {
              path: ':noteId',
              element: <Note />,
              action: noteAction(queryClient),
              loader: noteLoader(queryClient),
              errorElement: <ErrorBoundary />,
            },
          ],
        },
      ],
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: '/notes',
          element: <Notes />,
          loader: notesLoader(queryClient),
          action: notesAction(queryClient),
          // shouldRevalidate: () => false,
          children: [
            {
              path: 'new',
              element: <NewNote />,
              action: newNoteAction(queryClient),
            },
            {
              path: ':noteId',
              element: <Note />,
              action: noteAction(queryClient),
              loader: noteLoader(queryClient),
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
