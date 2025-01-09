import { RouteObject, useRouteError } from 'react-router';
import { ProtectedRoute } from './components/protected-route';
import { PublicRoute } from './components/public-route';
import { queryClient } from './lib/react-query';
import { Root } from './routes/root';
import { QueryClient } from '@tanstack/react-query';
import { Spinner } from './components/spinner';

function HydrateFallback() {
  return (
    <div className="grid h-full place-content-center">
      <Spinner size="lg" />
    </div>
  );
}

function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  return <div>Dang!</div>;
}

function convert(queryClient: QueryClient) {
  return (m: any) => {
    const { clientLoader, clientAction, default: Component, ...rest } = m;
    return {
      ...rest,
      loader: clientLoader?.(queryClient),
      action: clientAction?.(queryClient),
      Component,
      // HydrateFallback,
    };
  };
}

export const routes: RouteObject[] = [
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/',
        element: <Root />,
        HydrateFallback,
      },
      {
        path: '/login',
        lazy: () => import('./routes/auth/login').then(convert(queryClient)),
      },
      {
        path: '/register',
        lazy: () => import('./routes/auth/register').then(convert(queryClient)),
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/notes',
        lazy: () => import('./routes/notes/notes').then(convert(queryClient)),
        children: [
          {
            path: ':noteId',
            lazy: () => import('./routes/note/note').then(convert(queryClient)),
            errorElement: <ErrorBoundary />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    lazy: () => import('./routes/not-found').then(convert(queryClient)),
  },
];
