import {
  RouterProvider,
  createBrowserRouter,
  useRouteError,
} from 'react-router-dom';
import { Root } from './routes/root';
import { AuthProvider } from './components/auth-provider';
import { Login, action as loginAction } from './routes/login';
import { Register, action as registerAction } from './routes/register';
import { PublicRoute } from './components/public-route';
import {
  Notes,
  loader as notesLoader,
  action as notesAction,
} from './routes/notes';
import {
  Note,
  action as noteAction,
  loader as noteLoader,
} from './routes/note';
import { ProtectedRoute } from './components/protected-route';
import { NewNote, action as newNoteAction } from './routes/new';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  return <div>Dang!</div>;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, staleTime: 1000 * 60 * 10 },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PublicRoute>
        <Root />
      </PublicRoute>
    ),
  },

  {
    path: '/notes',
    element: (
      <ProtectedRoute>
        <Notes />
      </ProtectedRoute>
    ),
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

  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
    action: loginAction,
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
    action: registerAction,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
