import { Skeleton } from '@/components/ui/skeleton';
import { Suspense, useState } from 'react';
import { Await } from 'react-router-dom';
import { FilteredNotes } from './filtered-notes';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
  selectedTagName: string;
  notes: Promise<unknown>;
}

export function NotesList({ selectedTagName, notes }: Props) {
  const [search, setSearch] = useState('');
  return (
    <>
      <div className="px-4">
        <Input
          className="mb-6"
          placeholder="Search note"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <ScrollArea className="h-full">
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
              return (
                <FilteredNotes
                  notes={notes}
                  tagName={selectedTagName}
                  search={search}
                />
              );
            }}
          </Await>
        </Suspense>
      </ScrollArea>
    </>
  );
}
