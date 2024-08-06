import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export function DemoRoute() {
  const { session } = useAuth();

  console.log('session', session);
  if (session?.user.email === 'demo@example.com') {
    return <Outlet />;
  }

  return <Navigate to="/" />;
}
