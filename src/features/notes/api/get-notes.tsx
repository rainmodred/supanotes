import { supabase } from '@/lib/supabase';
import { INote } from '@/lib/types';

export const notesQuery = {
  queryKey: ['notes'],
  queryFn: () => fetchNotes(),
};

async function fetchNotes() {
  try {
    const { data } = await supabase
      .from('notes')
      .select(`id, title, tags(id, name)`)
      .returns<
        Omit<INote, 'created_at' | 'updated_at' | 'body' | 'user_id'>[]
      >();
    console.log('fetchNotes', data);
    return data;
  } catch (error) {
    console.log('error', error);
  }
}
