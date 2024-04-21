import { Navigate } from 'react-router-dom';
import { useAuth } from './auth-provider';

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();

  if (session) {
    return <Navigate to="/notes" />;
  }

  return <>{children}</>;
}
