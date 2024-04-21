import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './auth-provider';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
