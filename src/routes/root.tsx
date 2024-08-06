import { buttonVariants } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Root() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h1>Supanotes</h1>
      <div>
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
