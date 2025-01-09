import { notesQuery } from '@/features/notes/api/get-notes';
import { supabase } from '@/lib/supabase';
import { INote } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noteQuery } from './get-note';

export async function updateNote({
  id,
  title,
  body,
}: {
  id: string;
  title?: string;
  body?: string;
}) {
  const { data, error } = await supabase
    .from('notes')
    .update({ id, title, body })
    .eq('id', id)
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
    .returns<INote[]>();
  if (error) {
    throw error;
  }
  return data.at(0)!;
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-note'],
    mutationFn: updateNote,
    onSuccess: updatedNote => {
      queryClient.setQueryData(noteQuery(updatedNote.id).queryKey, updatedNote);
      queryClient.setQueryData<INote[]>(notesQuery.queryKey, oldData => {
        if (oldData) {
          return oldData.map(note =>
            note.id === updatedNote.id ? updatedNote : note,
          );
        }
      });
    },
  });
}
