import { useMemo } from 'react';
import { filterNotes } from '../api/filter-notes';
import { INote } from '@/lib/types';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface Props {
  notes: INote[];
  tagName: string | null;
  search: string;
}

function NotePreview({ note }: { note: INote }) {
  let truncatedBody = note.body.split('\n').slice(0, 2);
  return (
    <Link
      key={note.id}
      to={note.id.toString()}
      className={cn(
        buttonVariants({ variant: 'outline' }),
        'flex w-full justify-start gap-2 border-none',
      )}
    >
      {truncatedBody}
    </Link>
  );
}

export function FilteredNotes({ notes, tagName, search }: Props) {
  const filteredNotes = useMemo(
    () => filterNotes(notes, tagName, search),
    [notes, tagName, search],
  );
  return filteredNotes.map(note => {
    return <NotePreview note={note} />;
  });
}
