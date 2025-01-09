import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { useCreateNote } from '@/features/note/api/create-note';
import { useAuth } from '@/lib/auth';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'react-router';

export function NotesHeader({ children }: { children?: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');

  const createNoteMutation = useCreateNote();
  const { session } = useAuth();

  return (
    <div className="flex items-center justify-between px-4 pb-2">
      <div className="flex items-center gap-2">
        {children}
        <span className="text-md font-semibold">
          {filter === null || filter === '*' ? 'Notes' : `# ${filter}`}
        </span>
      </div>
      {createNoteMutation.isPending ? (
        <Spinner size="sm" />
      ) : (
        <Button
          onClick={() =>
            createNoteMutation.mutate({
              title: 'New note...',
              userId: session!.user.id,
            })
          }
          variant="ghost"
          data-testid="create-note"
        >
          <Plus size="16px" />
        </Button>
      )}
    </div>
  );
}
