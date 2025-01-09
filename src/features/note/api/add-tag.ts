import { notesQuery } from '@/features/notes/api/get-notes';
import { supabase } from '@/lib/supabase';
import { INote, ITag } from '@/lib/types';
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { noteQuery } from './get-note';
import { createTag, updateTagsCache } from '@/features/tags/api/create-tag';

function updateNoteTagsCache(
  queryClient: QueryClient,
  noteId: string,
  tag: ITag,
) {
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
}

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
    mutationKey: ['update-note'],
    mutationFn: addTag,
    onSuccess: ({ noteId, tag }) => {
      updateNoteTagsCache(queryClient, noteId, tag);
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
    mutationKey: ['update-note'],
    mutationFn: createAddTag,
    onSuccess: ({ noteId, tag }) => {
      updateTagsCache(queryClient, tag);
      updateNoteTagsCache(queryClient, noteId, tag);
    },
  });
}
