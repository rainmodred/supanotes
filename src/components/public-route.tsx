import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/lib/auth';

export function PublicRoute() {
  const { session } = useAuth();

  if (session) {
    return <Navigate to="/notes" />;
  }

  return <Outlet />;
}
