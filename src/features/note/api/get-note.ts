import { supabase } from '@/lib/supabase';
import { INote } from '@/lib/types';

export const noteQuery = (id: string) => ({
  queryKey: ['notes', id],
  queryFn: async () => fetchNote(id),
});

async function fetchNote(noteId: string) {
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
    .eq('id', noteId)
    .returns<INote[]>();
  if (error) {
    throw error;
  }
  return data?.at(0);
}
