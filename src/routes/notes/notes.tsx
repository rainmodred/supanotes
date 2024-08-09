import { ModeToggle } from '@/components/mode-toggle';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { noteQuery } from '@/features/note/api/get-note';
import { notesQuery } from '@/features/notes/api/get-notes';
import { NotesList } from '@/features/notes/components/notes-list';
import { createTag } from '@/features/tags/api/create-tag';
import { deleteTag } from '@/features/tags/api/delete-tag';
import { tagsQuery } from '@/features/tags/api/get-tags';
import { updateTag } from '@/features/tags/api/update-tag';
import { CreateTag } from '@/features/tags/components/create-tag';
import { TagsList } from '@/features/tags/components/tags-list';
import { useAuth } from '@/lib/auth';
import { queryClient } from '@/lib/react-query';
import { INote, ITag } from '@/lib/types';
import { cn } from '@/lib/utils';
import { QueryClient } from '@tanstack/react-query';
import { LogOut, Notebook, Plus } from 'lucide-react';
import { useState, useRef } from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';
import {
  ActionFunctionArgs,
  Link,
  Outlet,
  defer,
  useLoaderData,
} from 'react-router-dom';
import { z } from 'zod';

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
export const action =
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

export const loader = (queryClient: QueryClient) => async () => {
  return defer({
    notes: queryClient.fetchQuery({ ...notesQuery }),
    tags: queryClient.fetchQuery({ ...tagsQuery }),
  });
};

interface DeferredLoaderData {
  notes: Promise<INote[]>;
  tags: Promise<ITag[]>;
}

export function Notes() {
  const initialData = useLoaderData() as DeferredLoaderData;
  const [selectedTagName, setSelectedTagName] = useState<string | null>(null);
  const { logout } = useAuth();

  //TODO: mobile layout
  const ref = useRef<ImperativePanelHandle>(null);
  const editorPanel = useRef<ImperativePanelHandle>(null);

  // return <div data-testid="loading-tags">meow</div>;

  // useEffect(() => {
  //   const mql = window.matchMedia('(max-width: 720px)');
  //   if (mql.matches) {
  //     const panel = editorPanel.current;
  //     panel?.collapse();
  //   }
  // }, []);

  // const collapsePanel = () => {
  //   const panel = ref.current;
  //   if (!panel) {
  //     return;
  //   }
  //   if (panel.isCollapsed()) {
  //     panel.expand();
  //   } else if (panel.isExpanded()) {
  //     panel.collapse();
  //   }
  // };

  {
    /* <div className="flex flex-col items-center justify-start p-2">
  <Button onClick={collapsePanel} size="icon">
    <Folder />
  </Button>
  <Button size="icon">
    <LogOut />
  </Button>

  <ModeToggle />
</div> */
  }

  //TODO: create component for div inside resizepanel?
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen rounded-lg border"
    >
      <ResizablePanel defaultSize={20} collapsible ref={ref}>
        <div className="flex h-full flex-col py-2">
          <Button
            variant="outline"
            className={cn('flex w-full justify-start gap-2 border-none', {
              'bg-accent': selectedTagName,
            })}
            onClick={() => setSelectedTagName(null)}
          >
            <Notebook size="16" />
            Notes
          </Button>
          {/* <Button
                variant="outline"
                className="flex w-full justify-start gap-2 border-none"
                onClick={() => handleTagSelect('all')}
              >
                <Trash />
                Trash
              </Button> */}
          <CreateTag />
          <TagsList
            selectedTagName={selectedTagName}
            onTagSelect={setSelectedTagName}
            tags={initialData.tags}
          />
          <div className="flex items-center justify-between p-2">
            {/* <p>test@exampe.com</p> */}
            <ModeToggle />
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                logout();
                queryClient.clear();
              }}
            >
              <LogOut size="16" />
            </Button>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={20} collapsible ref={ref}>
        <div className="flex h-full flex-col py-2">
          <div className="flex items-center justify-between px-4 py-2">
            <p className="font-semibold">
              {selectedTagName === null ? 'Notes' : `# ${selectedTagName}`}
            </p>
            <Link
              to="new"
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
              data-testid="create-note"
            >
              <Plus size="16px" />
            </Link>
          </div>

          <NotesList
            selectedTagName={selectedTagName}
            notes={initialData.notes}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={60} collapsible ref={editorPanel}>
        <div className="h-full py-2">
          <Outlet />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
