import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';

export function Notes() {
  const { session, logout } = useAuth();
  return (
    <div>
      Notes
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
