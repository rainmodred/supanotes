import { Plus } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';

export function NotesHeader({ children }: { children?: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');

  return (
    <div className="flex items-center justify-between px-4 pb-2">
      <div className="flex items-center gap-2">
        {children}
        <span className="text-md font-semibold">
          {filter === null || filter === '*' ? 'Notes' : `# ${filter}`}
        </span>
      </div>
      <Link
        to="new"
        // className={cn(buttonVariants({ variant: 'ghost' }), 'p-0')}
        data-testid="create-note"
      >
        <Plus size="16px" />
      </Link>
    </div>
  );
}
