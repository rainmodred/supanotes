import { supabase } from '@/lib/supabase';
import { INote } from '@/lib/types';
import { useSuspenseQuery } from '@tanstack/react-query';

export const noteQuery = (id: string) => ({
  queryKey: ['notes', id],
  queryFn: async () => fetchNote(id),
});

export function useNote(id: string) {
  return useSuspenseQuery({ ...noteQuery(id) });
}

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
