import { notesQuery } from '@/features/notes/api/get-notes';
import { supabase } from '@/lib/supabase';
import { INote, ITag } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noteQuery } from './get-note';
import { createTag } from '@/features/tags/api/create-tag';
import { tagsQuery } from '@/features/tags/api/get-tags';

export async function addTag({
  noteId,
  tagId,
  name,
}: {
  noteId: string;
  tagId: string;
  name: string;
}) {
  const { data, error } = await supabase
    .from('notes_tags')
    .insert({ note_id: noteId, tag_id: tagId })
    .select(`note_id, tag_id`)
    .returns<{ note_id: string; tag_id: string }[]>();

  if (error) {
    throw error;
  }

  const { note_id, tag_id } = data.at(0)!;
  return { noteId: note_id, tag: { id: tag_id, name } };
}

export function useAddTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addTag,
    onSuccess: ({ noteId, tag }) => {
      queryClient.setQueryData<INote[]>(notesQuery.queryKey, oldData => {
        if (oldData) {
          return oldData.map(note => {
            if (note.id === noteId) {
              return {
                ...note,
                tags: [...note.tags, tag],
              };
            }
            return note;
          });
        }
      });

      queryClient.setQueryData<INote>(noteQuery(noteId).queryKey, oldData => {
        if (oldData) {
          return { ...oldData, tags: [...oldData.tags, tag] };
        }
      });
      // queryClient.invalidateQueries(noteQuery(noteId));
    },
  });
}

async function createAddTag({
  userId,
  noteId,
  name,
}: {
  userId: string;
  noteId: string;
  name: string;
}) {
  const tag = await createTag({ name, userId });
  const res = await addTag({ tagId: tag.id, noteId, name });
  return res;
}

export function useCreateAddTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAddTag,
    onSuccess: ({ noteId, tag }) => {
      queryClient.setQueryData<ITag[]>(tagsQuery.queryKey, oldData => {
        if (oldData) {
          return [...oldData, tag];
        }
        return [tag];
      });
      queryClient.setQueryData<INote>(noteQuery(noteId).queryKey, oldData => {
        if (oldData) {
          return { ...oldData, tags: [...oldData.tags, tag] };
        }
        return oldData;
      });

      queryClient.setQueryData<INote[]>(notesQuery.queryKey, oldData => {
        if (oldData) {
          return oldData.map(note => {
            if (note.id === noteId) {
              return {
                ...note,
                tags: [...note.tags, tag],
              };
            }
            return note;
          });
        }
      });
    },
  });
}
