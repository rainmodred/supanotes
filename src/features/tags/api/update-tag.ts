import { noteQuery } from '@/features/note/api/get-note';
import { notesQuery } from '@/features/notes/api/get-notes';
import { supabase } from '@/lib/supabase';
import { INote, ITag } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsQuery } from './get-tags';

export async function updateTag({ id, name }: { id: string; name: string }) {
  const { data, error } = await supabase
    .from('tags')
    .update({ id, name })
    .eq('id', id)
    .select()
    .returns<ITag[]>();
  if (error) {
    throw error;
  }
  return data.at(0)!;
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTag,
    onSuccess: renamedTag => {
      queryClient.setQueryData<ITag[]>(tagsQuery.queryKey, oldData => {
        if (oldData) {
          return oldData.map(tag =>
            tag.id === renamedTag.id ? { ...tag, name: renamedTag.name } : tag,
          );
        }
        return oldData;
      });

      queryClient.setQueryData<INote[]>(notesQuery.queryKey, oldData => {
        if (!oldData) return;

        const updatedNotes = oldData.map(note => {
          const { tags } = note;
          const hasRenamedTag = tags.some(tag => tag.id === renamedTag.id);

          if (hasRenamedTag) {
            queryClient.invalidateQueries(noteQuery(note.id));
          }

          const updatedTags = tags.map(tag =>
            tag.id === renamedTag.id ? { ...tag, name: renamedTag.name } : tag,
          );

          return {
            ...note,
            tags: updatedTags,
          };
        });

        return updatedNotes;
      });
    },
  });
}
