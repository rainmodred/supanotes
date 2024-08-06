import { ActionFunctionArgs, Form, redirect } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { notesQuery } from '@/features/notes/api/get-notes';
import { createNote } from '@/features/note/api/create-note';
import { z } from 'zod';
import { INote } from '@/lib/types';
import { useAuth } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const scheme = z.object({ title: z.string(), userId: z.string() });
export const action =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    const { title, userId } = scheme.parse(updates);

    const note = await createNote({ title, userId });
    queryClient.setQueryData<INote[]>(notesQuery.queryKey, oldData => {
      if (oldData) {
        return [...oldData, { ...note }];
      }
    });
    const url = new URL(request.url).pathname.split('/')[1];
    return redirect(`/${url}/${note.id}`);
  };

export function NewNote() {
  const { session } = useAuth();
  return (
    <div className="flex h-full flex-col">
      <Form method="post" className="h-full">
        <div className="mb-1 flex gap-1">
          {session && (
            <input name="userId" value={session?.user.id} type="hidden" />
          )}
          <Input name="title" placeholder="title" required />
          <Button variant="default" className="shrink-0">
            Create Note
          </Button>
        </div>
      </Form>
    </div>
  );
}
