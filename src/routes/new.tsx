import { ActionFunctionArgs, json, redirect } from 'react-router-dom';
import { Editor } from '@/components/editor';
import { createNote } from '@/lib/supabase';
import { QueryClient } from '@tanstack/react-query';
import { notesQuery } from './notes';
import { noteQuery } from './note';

export const action =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const values = Object.fromEntries(formData);
    const intent = formData.get('intent');
    console.log('intent', intent);

    console.log('new route action: ', { values });
    if (intent === 'save') {
      const note = await createNote(values);

      queryClient.setQueryData(noteQuery(note.id).queryKey, note);
      queryClient.setQueryData(notesQuery.queryKey, oldData => [
        ...oldData,
        {
          id: note.id,
          title: note.title,
        },
      ]);
      return redirect(`/notes/${note.id}`);
    }

    throw json({ message: 'Invalid intent' }, { status: 400 });
  };

export function NewNote() {
  return <Editor />;
}
