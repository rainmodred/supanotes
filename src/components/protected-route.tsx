import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/lib/auth';
import { Spinner } from './spinner';

export function ProtectedRoute() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (session === null) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
