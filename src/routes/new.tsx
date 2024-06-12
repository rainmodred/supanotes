import { ActionFunctionArgs, json, redirect } from 'react-router-dom';
import { Editor } from '@/features/note/components/editor';
import { QueryClient } from '@tanstack/react-query';
import { notesQuery } from '@/features/notes/api/get-notes';
import { createNote } from '@/features/note/api/create-note';

export const action =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const values = Object.fromEntries(formData);
    const intent = formData.get('intent');

    console.log('new route action: ', { values });
    if (intent === 'create') {
      const note = await createNote(values);
      if (!note.title) {
        //TODO:
      }

      // queryClient.setQueryData(noteQuery(note.id, queryClient).queryKey, note);
      queryClient.setQueryData(notesQuery.queryKey, oldData => {
        if (oldData) {
          return [
            ...oldData,
            {
              id: note.id,
              title: note.title,
              body: note.body,
            },
          ];
        }
      });
      return redirect(`/notes/${note.id}`);
    }

    throw json({ message: 'Invalid intent' }, { status: 400 });
  };

export function NewNote() {
  return <Editor type="create" />;
}
