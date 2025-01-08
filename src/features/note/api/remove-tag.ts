import { notesQuery } from '@/features/notes/api/get-notes';
import { supabase } from '@/lib/supabase';
import { INote } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noteQuery } from './get-note';

export async function removeTag({
  noteId,
  tagId,
}: {
  noteId: string;
  tagId: string;
}) {
  const { data, error } = await supabase
    .from('notes_tags')
    .delete()
    .eq('note_id', noteId)
    .eq('tag_id', tagId)
    .select(`note_id, tag_id`);
  if (error) {
    throw error;
  }
  const { note_id, tag_id } = data.at(0)!;
  return { noteId: note_id, tagId: tag_id };
}

export function useRemoveTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeTag,
    onSuccess: ({ noteId, tagId }) => {
      queryClient.setQueryData<INote[]>(notesQuery.queryKey, oldData => {
        if (oldData) {
          return oldData.map(note => {
            if (note.id === noteId) {
              return {
                ...note,
                tags: note.tags.filter(tag => tag.id === tagId),
              };
            }
            return note;
          });
        }
      });
      queryClient.invalidateQueries(noteQuery(noteId));
    },
  });
}
