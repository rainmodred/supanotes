import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Notebook } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';

interface Props {
  onSelect?: () => void;
}

export function TagsHeader({ onSelect }: Props) {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');

  return (
    <Link
      onClick={onSelect}
      to={`?filter=*`}
      className={cn(
        buttonVariants({ variant: 'outline', size: 'icon' }),
        'flex w-full justify-start gap-2 border-none px-4',
        {
          'bg-accent': filter === null || filter === '*',
        },
      )}
    >
      <Notebook size="16" />

      <span className="text-md font-semibold">All Notes</span>
    </Link>
  );
}
