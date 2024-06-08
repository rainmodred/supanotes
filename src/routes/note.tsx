import { Editor } from '@/features/note/components/editor';
import { QueryClient } from '@tanstack/react-query';
import {
  ActionFunctionArgs,
  Await,
  LoaderFunctionArgs,
  defer,
  json,
  redirect,
  useLoaderData,
} from 'react-router-dom';
import { INote, ITag } from '@/lib/types';
import { notesQuery } from '@/features/notes/api/get-notes';
import { noteQuery } from '@/features/note/api/get-note';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { createTag } from '@/features/tags/api/create-tag';
import { tagsQuery } from '@/features/tags/api/get-tags';
import { updateNote } from '@/features/note/api/update-note';
import { deleteNote } from '@/features/note/api/delete-note';
import { removeTag } from '@/features/note/api/remove-tag';
import { addTag } from '@/features/note/api/add-tag';

export const action =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    const { intent, ...rest } = updates;
    console.log('note action', updates, intent);

    const noteId = rest.note_id.toString();
    const { queryKey } = noteQuery(noteId, queryClient);
    if (intent === 'save') {
      const updatedNote = await updateNote(rest);
      await queryClient.setQueryData(queryKey, oldData => {
        return {
          ...oldData,
          body: updatedNote.body,
          updated_at: updatedNote.updated_at,
        };
      });
      return { ok: true };
    }
    if (intent === 'delete') {
      await deleteNote(noteId);
      queryClient.removeQueries({
        queryKey,
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
      queryClient.setQueryData<INote>(queryKey, oldData => {
        if (oldData) {
          return { ...oldData, tags: [...oldData.tags, returnedTag] };
        }
        return oldData;
      });

      await addTag(noteId, returnedTag?.id);
      return { ok: true };
    }

    if (intent === 'select-tag') {
      await addTag(noteId, rest.tag_id);

      return { ok: true };
    }

    if (intent === 'unselect-tag') {
      await removeTag(noteId, rest.tag_id);
      queryClient.setQueryData<INote>(queryKey, oldData => {
        if (oldData) {
          return {
            ...oldData,
            tags: oldData?.tags?.filter(tag => tag.id !== rest.tag_id),
          };
        }
      });
      return { ok: true };
    }

    throw json({ message: 'Invalid intent' }, { status: 400 });
  };

export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const query = noteQuery(params.noteId!, queryClient);
    return defer({ note: queryClient.fetchQuery({ ...query }) });
  };

export function Note() {
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >;

  return (
    <Suspense
      fallback={Array.from({ length: 5 }).map((_, i) => {
        return <Skeleton key={`st-${i}`} className="mb-2 h-[20px]" />;
      })}
    >
      <Await resolve={initialData.note}>
        {note => {
          return <Editor note={note} type="edit" />;
        }}
      </Await>
    </Suspense>
  );
}
