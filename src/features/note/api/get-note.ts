import { notesQuery } from '@/features/notes/api/get-notes';
import { supabase } from '@/lib/supabase';
import { INote } from '@/lib/types';
import { QueryClient } from '@tanstack/react-query';

export const noteQuery = (id: string, queryClient: QueryClient) => ({
  queryKey: ['notes', id],
  queryFn: async () => fetchNote(id),
  initialData: () => {
    return queryClient
      .getQueryData(notesQuery.queryKey)
      ?.find(note => note.id === id);
  },
});

async function fetchNote(noteId: string) {
  try {
    const { data } = await supabase
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
    console.log('fetchNote', data);
    return data?.at(0);
  } catch (error) {
    console.log('error', error);
  }
}
