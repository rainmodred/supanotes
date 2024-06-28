import {
  RouterProvider,
  createBrowserRouter,
  useRouteError,
} from 'react-router-dom';
import { Root } from './routes/root';
import { AuthProvider } from './lib/auth';
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
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/react-query';

function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  return <div>Dang!</div>;
}

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

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App;
