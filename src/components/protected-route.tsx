import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export function ProtectedRoute() {
  const { session } = useAuth();

  if (session === null || session?.user.email === 'demo@example.com') {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
