import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();

  if (session === null) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
