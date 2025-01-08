import { notesQuery } from '@/features/notes/api/get-notes';
import { supabase } from '@/lib/supabase';
import { ITag, INote } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsQuery } from './get-tags';
import { noteQuery } from '@/features/note/api/get-note';

export async function deleteTag(id: string) {
  const { error } = await supabase.from('tags').delete().eq('id', id);
  if (error) {
    throw error;
  }
  return;
}

export function useDeleteTag(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.setQueryData<ITag[]>(tagsQuery.queryKey, oldData => {
        if (oldData) {
          return oldData.filter(tag => tag.id !== id);
        }
      });

      queryClient.setQueryData<INote[]>(notesQuery.queryKey, oldData => {
        //remove tag from note
        if (oldData) {
          for (const note of oldData) {
            if (note.tags.some(tag => tag.id === id)) {
              // queryClient.invalidateQueries(noteQuery(note.id));
              queryClient.setQueryData<INote>(
                noteQuery(note.id).queryKey,
                oldData => {
                  if (oldData) {
                    return {
                      ...oldData,
                      tags: oldData.tags.filter(tag => tag.id !== id),
                    };
                  }
                },
              );
            }
          }
          return oldData.map(note => {
            return {
              ...note,
              tags: note.tags.filter(tag => tag.id !== id),
            };
          });
        }
      });
    },
  });
}
