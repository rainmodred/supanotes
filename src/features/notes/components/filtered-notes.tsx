import { useMemo } from 'react';
import { filterNotes } from '../api/filter-notes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NotePreview } from './note-preview';
import { useSearchParams } from 'react-router';
import { INote } from '@/lib/types';

interface Props {
  notes: INote[];
  search: string;
}

export function FilteredNotes({ notes, search }: Props) {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');

  const filteredNotes = useMemo(
    () => filterNotes(notes, filter, search),
    [notes, filter, search],
  );

  return (
    <ScrollArea className="py-30 my-30 flex-grow">
      {filteredNotes.map(note => {
        return <NotePreview note={note} key={note.id} />;
      })}
    </ScrollArea>
  );
}
