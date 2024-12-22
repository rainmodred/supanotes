import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/lib/auth';

export function ProtectedRoute() {
  const { session } = useAuth();

  if (session === null) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
