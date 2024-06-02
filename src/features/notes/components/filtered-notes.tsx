import { useMemo } from 'react';
import { filterNotes } from '../api/filter-notes';
import { INote } from '@/lib/types';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface Props {
  notes: INote[];
  tagName: string;
}

export function FilteredNotes({ notes, tagName }: Props) {
  const filteredNotes = useMemo(
    () => filterNotes(notes, tagName),
    [notes, tagName],
  );
  return filteredNotes.map(note => {
    return (
      <Link
        key={note.id}
        to={note.id.toString()}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'flex w-full justify-start gap-2 border-none',
        )}
      >
        {note.title}
      </Link>
    );
  });
}
