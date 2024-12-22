import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { queryClient } from '@/lib/react-query';
import { LogOut } from 'lucide-react';

export function Settings() {
  const { logout } = useAuth();
  return (
    <div className="flex items-center justify-between p-2">
      {/* <p>test@exampe.com</p> */}
      <ModeToggle />
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          logout();
          queryClient.clear();
        }}
      >
        <LogOut size="16" />
      </Button>
    </div>
  );
}
