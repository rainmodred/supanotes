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
import { z } from 'zod';

const schema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('select-tag'),
    tagName: z.string(),
    tagId: z.string(),
    userId: z.string(),
  }),
  z.object({
    intent: z.literal('unselect-tag'),
    tagName: z.string(),
    tagId: z.string(),
    userId: z.string(),
  }),
  z.object({
    intent: z.literal('create-tag'),
    tagName: z.string(),
    userId: z.string(),
  }),
  z.object({
    intent: z.literal('update-note'),
    userId: z.string(),
    title: z.string(),
    body: z.string(),
  }),
  z.object({
    intent: z.literal('delete-note'),
    userId: z.string(),
  }),
]);

export const action =
  (queryClient: QueryClient) =>
  async ({ request, params }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    const payload = schema.parse(updates);

    if (!params.noteId) {
      throw new Error('noteId not found');
    }

    const noteId = params.noteId;
    const { queryKey: noteQueryKey } = noteQuery(noteId, queryClient);
    if (payload.intent === 'update-note') {
      const returnedNote = await updateNote({
        title: payload.title,
        body: payload.body,
        noteId,
      });
      queryClient.setQueryData<INote>(noteQueryKey, oldData => {
        if (oldData) {
          return {
            ...oldData,
            created_at: returnedNote.created_at,
            updated_at: returnedNote.updated_at,
          };
        }
      });
      return { ok: true };
    }
    if (payload.intent === 'delete-note') {
      console.log('payload', payload);
      await deleteNote(noteId);

      queryClient.removeQueries({
        queryKey: noteQueryKey,
      });

      queryClient.setQueryData<INote[]>(notesQuery.queryKey, oldData =>
        oldData?.filter(note => note.id !== noteId),
      );

      //demo userId
      if (payload.userId === 'b5018bc7-5a21-40f4-8866-b4dc0a9a7eae') {
        return redirect('/demo');
      }

      return redirect(`/notes`);
    }

    if (payload.intent === 'create-tag') {
      const returnedTag = await createTag(payload.tagName, payload.userId);

      queryClient.setQueryData<ITag[]>(tagsQuery.queryKey, oldData => {
        if (oldData) {
          return [...oldData, returnedTag];
        }
        return [returnedTag];
      });
      queryClient.setQueryData<INote>(noteQueryKey, oldData => {
        if (oldData) {
          return { ...oldData, tags: [...oldData.tags, returnedTag] };
        }
        return oldData;
      });

      await addTag(noteId, returnedTag?.id);
      return { ok: true };
    }

    if (payload.intent === 'select-tag') {
      await addTag(noteId, payload.tagId);

      queryClient.setQueryData<INote[]>(notesQuery.queryKey, oldData => {
        if (oldData) {
          return oldData.map(note => {
            if (note.id === noteId) {
              return {
                ...note,
                tags: [
                  ...note.tags,
                  { id: payload.tagId, name: payload.tagName },
                ],
              };
            }
            return note;
          });
        }
      });
      queryClient.invalidateQueries(noteQuery(noteId, queryClient));

      return { ok: true };
    }

    if (payload.intent === 'unselect-tag') {
      await removeTag(noteId, payload.tagId);

      queryClient.setQueryData<INote[]>(notesQuery.queryKey, oldData => {
        if (oldData) {
          return oldData.map(note => {
            if (note.id === noteId) {
              return {
                ...note,
                tags: note.tags.filter(tag => tag.id === payload.tagId),
              };
            }
            return note;
          });
        }
      });
      queryClient.invalidateQueries(noteQuery(noteId, queryClient));
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

interface DeferredLoaderData {
  note: Promise<INote>;
}

export function Note() {
  const initialData = useLoaderData() as DeferredLoaderData;

  return (
    <Suspense
      fallback={Array.from({ length: 5 }).map((_, i) => {
        return <Skeleton key={`st-${i}`} className="mb-2 h-[20px]" />;
      })}
    >
      <Await resolve={initialData.note}>
        {note => {
          return <Editor note={note} key={note.id} />;
        }}
      </Await>
    </Suspense>
  );
}
