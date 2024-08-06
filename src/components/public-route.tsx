import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export function PublicRoute() {
  const { session } = useAuth();

  if (session && session?.user.email !== 'demo@example.com') {
    return <Navigate to="/notes" />;
  }

  return <Outlet />;
}
