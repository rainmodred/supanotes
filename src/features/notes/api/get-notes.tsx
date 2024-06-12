import { supabase } from '@/lib/supabase';
import { INote } from '@/lib/types';

export const notesQuery = {
  queryKey: ['notes'],
  queryFn: () => fetchNotes(),
};

async function fetchNotes() {
  const { data, error } = await supabase
    .from('notes')
    .select(
      `
      id, 
      created_at, 
      updated_at, 
      title, 
      body, 
      tags(id, name)
    `,
    )
    .returns<Omit<INote, 'user_id'>[]>();
  if (error) {
    throw error;
  }
  return data;
}
