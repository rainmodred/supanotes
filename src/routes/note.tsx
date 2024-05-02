import { Editor } from '@/components/editor';
import { deleteNote, fetchNote, updateNote } from '@/lib/supabase';
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
import { INote } from '@/lib/types';

export const action =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    const { intent, ...rest } = updates;
    console.log('note action', updates, intent);

    const noteId = rest.id.toString();
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
  const initialData = useLoaderData();
  const params = useParams();
  const { data: note } = useQuery({
    ...noteQuery(params.noteId!),
    initialData,
  });

  return <Editor note={note} />;
}
