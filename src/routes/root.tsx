import { Button, buttonVariants } from '@/components/ui/button';
import { signInWithEmail, useAuth } from '@/lib/auth';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Root() {
  const { setSession, demoLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    demoLogout();
  }, [demoLogout]);

  async function handleDemo() {
    const { data, error } = await signInWithEmail(
      'demo@example.com',
      'demo@example.com',
    );
    if (error || !data.session) {
      throw error;
    }
    setSession(data.session);
    navigate('/demo');
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h1>Supanotes</h1>
      <div>
        <Button onClick={handleDemo}>Demo</Button>
        {/* <Link className={buttonVariants({ variant: 'outline' })} to="demo">
        Demo
      </Link> */}
        <Link className={buttonVariants({ variant: 'outline' })} to="login">
          Login
        </Link>
      </div>
    </div>
  );
}
