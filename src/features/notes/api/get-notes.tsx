import { supabase } from '@/lib/supabase';
import { INote } from '@/lib/types';
import { useSuspenseQuery } from '@tanstack/react-query';

export const notesQuery = {
  queryKey: ['notes'],
  queryFn: () => fetchNotes(),
};

export function useNotes() {
  return useSuspenseQuery({ ...notesQuery });
}

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
    .order('updated_at', { ascending: false })
    .returns<INote[]>();
  // .returns<Omit<INote, 'userId'>[]>();
  if (error) {
    throw error;
  }
  return data;
}
