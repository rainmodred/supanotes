import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { Await } from 'react-router-dom';
import { FilteredNotes } from './filtered-notes';

interface Props {
  selectedTagName: string;
  notes: Promise<unknown>;
}

export function NotesList({ selectedTagName, notes }: Props) {
  return (
    <Suspense
      fallback={
        <div className="px-2">
          {Array.from({ length: 20 }).map((_, i) => {
            return <Skeleton key={`st-${i}`} className="mb-2 h-[20px]" />;
          })}
        </div>
      }
    >
      <Await resolve={notes}>
        {notes => {
          return <FilteredNotes notes={notes} tagName={selectedTagName} />;
        }}
      </Await>
    </Suspense>
  );
}
