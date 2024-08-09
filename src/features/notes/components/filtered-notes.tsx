import { useMemo } from 'react';
import { filterNotes } from '../api/filter-notes';
import { INote } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NotePreview } from './note-preview';

interface Props {
  notes: INote[];
  tagName: string | null;
  search: string;
}

export function FilteredNotes({ notes, tagName, search }: Props) {
  const filteredNotes = useMemo(
    () => filterNotes(notes, tagName, search),
    [notes, tagName, search],
  );

  return (
    <ScrollArea className="py-30 my-30 flex-grow">
      {filteredNotes.map(note => {
        return <NotePreview note={note} key={note.id} />;
      })}
    </ScrollArea>
  );
}
