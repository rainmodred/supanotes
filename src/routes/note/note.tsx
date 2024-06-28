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

    const noteId = rest.noteId.toString();
    const { queryKey } = noteQuery(noteId, queryClient);
    if (intent === 'edit') {
      const returnedNote = await updateNote(rest);
      await queryClient.setQueryData(queryKey, oldData => {
        if (oldData) {
          return {
            ...oldData,
            body: returnedNote.body,
            updated_at: returnedNote.updated_at,
          };
        }
      });
      return { ok: true };
    }
    if (intent === 'delete') {
      await deleteNote(noteId);
      queryClient.removeQueries({
        queryKey,
      });

      queryClient.setQueryData<INote[]>(notesQuery.queryKey, oldData =>
        oldData?.filter(note => note.id !== noteId),
      );

      return redirect(`/notes`);
    }

    if (intent === 'create-tag') {
      const returnedTag = await createTag(rest.tagName, rest.userId);
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
      console.log('select-tag', rest);
      //TODO: handle error
      await addTag(noteId, rest.tagId);

      queryClient.setQueryData<INote[]>(notesQuery.queryKey, oldData => {
        if (oldData) {
          return oldData.map(note => {
            if (note.id === noteId) {
              return {
                ...note,
                tags: [...note.tags, { id: rest.tagId, name: rest.tagName }],
              };
            }
            return note;
          });
        }
      });
      queryClient.invalidateQueries(noteQuery(noteId, queryClient));

      return { ok: true };
    }

    if (intent === 'unselect-tag') {
      await removeTag(noteId, rest.tagId);

      queryClient.setQueryData<INote[]>(notesQuery.queryKey, oldData => {
        if (oldData) {
          return oldData.map(note => {
            if (note.id === noteId) {
              return {
                ...note,
                tags: note.tags.filter(tag => tag.id === rest.tagId),
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
    console.log('params loader', params);
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
          return <Editor note={note} type="edit" key={note.id} />;
        }}
      </Await>
    </Suspense>
  );
}
