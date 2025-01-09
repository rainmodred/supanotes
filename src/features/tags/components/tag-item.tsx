import { Spinner } from '@/components/spinner';
import { buttonVariants } from '@/components/ui/button';
import { ITag } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useSearchParams, Link } from 'react-router';
import { EditTag } from './edit-tag';
import { Hash } from 'lucide-react';

export function TagsListItem({
  tag,
  isLoading = false,
  onSelect,
}: {
  tag: ITag;
  isLoading?: boolean;
  onSelect?: () => void;
}) {
  const [searchParams] = useSearchParams();

  return (
    <li
      key={tag.id}
      className={cn(
        `mt-0 flex w-full items-center justify-between gap-2 px-4 pr-1`,
        {
          'bg-accent': searchParams.get('filter') === tag.name,
        },
      )}
    >
      <Link
        onClick={onSelect}
        to={`?filter=${tag.name}`}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          `hover:none flex w-full grow justify-start gap-2 border-none bg-inherit px-0 py-0`,
        )}
      >
        <Hash size="16px" className="shrink-0" />
        <span className="overflow-hidden text-ellipsis">{tag.name}</span>
      </Link>
      {isLoading && <Spinner size="md" data-testid="loading" />}
      <EditTag tag={tag} hidden={isLoading} />
    </li>
  );
}
