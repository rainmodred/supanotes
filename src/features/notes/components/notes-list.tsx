import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { Await } from 'react-router-dom';
import { FilteredNotes } from './filtered-notes';

interface Props {
  selectedTagName: string;
  getNotes: Promise<unknown>;
}

export function NotesList({ selectedTagName, getNotes }: Props) {
  return (
    <Suspense
      fallback={Array.from({ length: 20 }).map((_, i) => {
        return <Skeleton key={`st-${i}`} className="mb-2 h-[20px]" />;
      })}
    >
      <Await resolve={getNotes}>
        {notes => {
          return <FilteredNotes notes={notes} tagName={selectedTagName} />;
        }}
      </Await>
    </Suspense>
  );
}
