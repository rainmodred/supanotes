import { supabase } from '@/lib/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noteQuery } from './get-note';
import { INote } from '@/lib/types';
import { notesQuery } from '@/features/notes/api/get-notes';
import { useNavigate } from 'react-router';

export async function deleteNote(noteId: string) {
  const { data, error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)
    .select(`id`)
    .returns<Pick<INote, 'id'>[]>();
  if (error) {
    throw error;
  }
  return data.at(0)!;
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: ({ id }) => {
      queryClient.removeQueries({
        queryKey: noteQuery(id).queryKey,
      });

      queryClient.setQueryData<INote[]>(notesQuery.queryKey, oldData => {
        if (oldData) {
          return oldData.filter(note => note.id !== id);
        }
      });

      navigate('/');
    },
  });
}
