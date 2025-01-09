import { useState } from 'react';
import { FilteredNotes } from './filtered-notes';
import { Input } from '@/components/ui/input';
import { useNotes } from '../api/get-notes';

export function NotesList() {
  const [search, setSearch] = useState('');
  const { data: notes } = useNotes();

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
      <FilteredNotes notes={notes} search={search} />
    </>
  );
}
