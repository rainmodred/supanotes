import { RouterProvider, createBrowserRouter } from 'react-router-dom';
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
import { Note } from './routes/note';
import { ProtectedRoute } from './components/protected-route';
import { Editor } from './components/editor';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PublicRoute>
        <Root />
      </PublicRoute>
    ),
    children: [
      // {
      //   path: 'new',
      //   element: <NewNote />,
      //   action: newNoteAction,
      // },
      // {
      //   path: 'note/:noteId',
      //   element: <Note />,
      //   loader: noteLoader,
      //   action: noteAction,
      //   errorElement: <h2>Note not found</h2>,
      // },
    ],
  },

  {
    path: '/notes',
    element: (
      <ProtectedRoute>
        <Notes />
      </ProtectedRoute>
    ),
    children: [{ path: ':noteId', element: <Note /> }],
    loader: notesLoader,
    action: notesAction,
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

  // {
  //   path: 'demo',
  //   element: <Demo />,
  //   loader: demoLoader,
  //   action: newNoteAction,
  //   children: [
  //     { path: 'note/:noteId', element: <Editor /> },
  //     {
  //       path: 'note/new',
  //       element: <Editor />,
  //     },
  //   ],
  // },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
