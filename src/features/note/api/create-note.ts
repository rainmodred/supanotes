import { notesQuery } from '@/features/notes/api/get-notes';
import { supabase } from '@/lib/supabase';
import { INote } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export async function createNote({
  title,
  userId,
}: {
  title: string;
  userId: string;
}) {
  const { data, error } = await supabase
    .from('notes')
    .insert({ title, user_id: userId })
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
  return { ...data.at(0)!, tags: [] };
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createNote,
    onSuccess: note => {
      queryClient.setQueryData<INote[]>(notesQuery.queryKey, oldData => {
        if (oldData) {
          return [{ ...note }, ...oldData];
        }
      });
      navigate(`/notes/${note.id}`);
    },
  });
}
