import { noteQuery } from '@/features/note/api/get-note';
import { notesQuery } from '@/features/notes/api/get-notes';
import { createTag } from '@/features/tags/api/create-tag';
import { deleteTag } from '@/features/tags/api/delete-tag';
import { tagsQuery } from '@/features/tags/api/get-tags';
import { updateTag } from '@/features/tags/api/update-tag';
import { INote, ITag } from '@/lib/types';
import { QueryClient } from '@tanstack/react-query';
import { ActionFunctionArgs, useLoaderData } from 'react-router';
import { useMediaQuery } from '@mantine/hooks';
import { z } from 'zod';
import {
  DesktopLayout,
  MobileLayout,
} from '@/features/notes/components/layouts';

const schema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('rename-tag'),
    id: z.string(),
    name: z.string(),
  }),
  z.object({
    intent: z.literal('delete-tag'),
    id: z.string(),
    name: z.string(),
  }),
  z.object({
    intent: z.literal('create-tag'),
    name: z.string(),
    userId: z.string(),
  }),
]);

export const clientAction =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    const payload = schema.parse(updates);

    if (payload.intent === 'rename-tag') {
      queryClient.setQueryData<ITag[]>(tagsQuery.queryKey, oldData => {
        if (oldData) {
          return oldData.map(tag =>
            tag.id === payload.id ? { ...tag, name: payload.name } : tag,
          );
        }
        return oldData;
      });

      //send help
      queryClient.setQueryData<INote[]>(notesQuery.queryKey, oldData => {
        if (oldData) {
          for (const note of oldData) {
            if (note.tags.some(tag => tag.id === payload.id)) {
              queryClient.invalidateQueries(noteQuery(note.id, queryClient));
            }
          }

          return oldData.map(note => {
            return {
              ...note,
              tags: note.tags.map(tag =>
                tag.id === payload.id ? { ...tag, name: payload.name } : tag,
              ),
            };
          });
        }
      });

      await updateTag({ id: payload.id, name: payload.name });

      return { ok: true };
    }

    if (payload.intent === 'create-tag') {
      const returnedTag = await createTag(payload.name, payload.userId);

      queryClient.setQueryData<ITag[]>(tagsQuery.queryKey, oldData => {
        if (oldData) {
          return [...oldData, returnedTag];
        }
        return [returnedTag];
      });
      return { ok: true };
    }

    if (payload.intent === 'delete-tag') {
      queryClient.setQueryData<ITag[]>(tagsQuery.queryKey, oldData => {
        if (oldData) {
          return oldData.filter(tag => tag.id !== payload.id);
        }
      });

      queryClient.setQueryData<INote[]>(notesQuery.queryKey, oldData => {
        if (oldData) {
          for (const note of oldData) {
            if (note.tags.some(tag => tag.id === payload.id)) {
              queryClient.invalidateQueries(noteQuery(note.id, queryClient));
            }
          }

          return oldData.map(note => {
            return {
              ...note,
              tags: note.tags.filter(tag => tag.id !== payload.id),
            };
          });
        }
      });

      await deleteTag(payload.id);

      return { ok: true };
    }

    throw new Error('Invalid intent');
  };

export const clientLoader = (queryClient: QueryClient) => async () => {
  return {
    notes: queryClient.fetchQuery({ ...notesQuery }),
    tags: queryClient.fetchQuery({ ...tagsQuery }),
  };
};

interface DeferredLoaderData {
  notes: Promise<INote[]>;
  tags: Promise<ITag[]>;
}

export default function Notes() {
  const initialData = useLoaderData() as DeferredLoaderData;

  const isMobile = useMediaQuery('(max-width: 48rem)');

  if (isMobile) {
    return <MobileLayout tags={initialData.tags} notes={initialData.notes} />;
  }

  return <DesktopLayout tags={initialData.tags} notes={initialData.notes} />;
}
