import { Editor } from '@/components/editor';
import {
  addTagToNote,
  createTag,
  deleteNote,
  deleteTagFromNote,
  fetchNote,
  updateNote,
} from '@/lib/supabase';
import { QueryClient, useQuery } from '@tanstack/react-query';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
  useLoaderData,
  useParams,
} from 'react-router-dom';
import { notesQuery } from './notes';
import { INote, ITag } from '@/lib/types';
import { tagsQuery } from '@/features/tags/api/get-tags';

export const action =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    const { intent, ...rest } = updates;
    console.log('note action', updates, intent);

    const noteId = rest.note_id.toString();
    if (intent === 'save') {
      const updatedNote = await updateNote(rest);
      await queryClient.setQueryData(noteQuery(noteId).queryKey, updatedNote);
      return { ok: true };
    }
    if (intent === 'delete') {
      const { error } = await deleteNote(noteId);
      if (error) {
        throw json({ message: 'Delete error' }, { status: 404 });
      }
      queryClient.removeQueries({
        queryKey: noteQuery(noteId).queryKey,
      });

      queryClient.setQueryData<INote[]>(notesQuery.queryKey, oldData =>
        oldData?.filter(note => note.id !== rest.id),
      );

      return redirect(`/notes`);
    }

    if (intent === 'create-tag') {
      const returnedTag = await createTag(rest.tagName, rest.user_id);
      if (!returnedTag) {
        return { ok: false };
      }

      queryClient.setQueryData<ITag[]>(tagsQuery.queryKey, oldData => {
        if (oldData) {
          return [...oldData, returnedTag];
        }
        return [returnedTag];
      });
      queryClient.setQueryData<INote>(noteQuery(noteId).queryKey, oldData => {
        if (oldData) {
          return { ...oldData, tags: [...oldData.tags, returnedTag] };
        }
        return oldData;
      });

      await addTagToNote(noteId, returnedTag?.id);
      return { ok: true };
    }

    if (intent === 'select-tag') {
      await addTagToNote(noteId, rest.tag_id);

      return { ok: true };
    }

    if (intent === 'unselect-tag') {
      await deleteTagFromNote(noteId, rest.tag_id);
      queryClient.setQueryData<INote>(noteQuery(noteId).queryKey, oldData => {
        if (oldData) {
          return {
            ...oldData,
            tags: oldData.tags.filter(tag => tag.id !== rest.tag_id),
          };
        }
      });
      return { ok: true };
    }

    throw json({ message: 'Invalid intent' }, { status: 400 });
  };

export const noteQuery = (noteId: string) => ({
  queryKey: ['notes', noteId],
  queryFn: async () => fetchNote(noteId),
});

export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const query = noteQuery(params.noteId!);
    const data = await queryClient.fetchQuery({ ...query });
    console.log('note loader', data);

    if (!data) throw new Response('', { status: 404 });
    return data;
  };

export function Note() {
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >;
  const params = useParams();
  const { data: note } = useQuery({
    ...noteQuery(params.noteId!),
    initialData,
  });

  return <Editor note={note} />;
}
