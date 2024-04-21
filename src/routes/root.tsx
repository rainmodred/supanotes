import { useAuth } from '@/components/auth-provider';
import { buttonVariants } from '@/components/ui/button';
import { Link, Outlet } from 'react-router-dom';

export function Root() {
  return (
    <div className="flex h-full items-center justify-center">
      {/* <Link className={buttonVariants({ variant: 'outline' })} to="demo">
        Demo
      </Link> */}
      <Link className={buttonVariants({ variant: 'outline' })} to="login">
        Login
      </Link>
    </div>
  );
}
