import { Button, buttonVariants } from '@/components/ui/button';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { notesQuery } from '@/features/notes/api/get-notes';
import { NotesList } from '@/features/notes/components/notes-list';
import { createTag } from '@/features/tags/api/create-tag';
import { deleteTag } from '@/features/tags/api/delete-tag';
import { tagsQuery } from '@/features/tags/api/get-tags';
import { updateTag } from '@/features/tags/api/update-tag';
import { CreateTag } from '@/features/tags/components/create-tag';
import { TagsList } from '@/features/tags/components/tags-list';
import { ITag } from '@/lib/types';
import { cn } from '@/lib/utils';
import { QueryClient } from '@tanstack/react-query';
import { Notebook, Plus } from 'lucide-react';
import { useState, useRef } from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';
import {
  ActionFunctionArgs,
  Link,
  Outlet,
  defer,
  useLoaderData,
} from 'react-router-dom';

export const action =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    const { intent, ...rest } = updates;
    console.log('note action', intent, rest);

    if (intent === 'rename-tag') {
      //TODO: handle error
      queryClient.setQueryData<ITag[]>(tagsQuery.queryKey, oldData => {
        if (oldData) {
          return oldData.map(tag =>
            tag.id === rest.id ? { ...tag, name: rest.name } : tag,
          );
        }
        return oldData;
      });
      await updateTag(rest);

      return { ok: true };
    }

    if (intent === 'create-tag') {
      // queryClient.setQueryData<ITag[]>(tagsQuery.queryKey, oldData => {
      //   if (oldData) {
      //     return [...oldData, { name: rest.name, id: rest.name }];
      //   }
      // });

      //TODO: Optimistic?
      const returnedTag = await createTag(rest.name, rest.user_id);
      queryClient.setQueryData<ITag[]>(tagsQuery.queryKey, oldData => {
        if (oldData) {
          return [...oldData, returnedTag];
        }
      });
      return { ok: true };
    }

    if (intent === 'delete-tag') {
      queryClient.setQueryData<ITag[]>(tagsQuery.queryKey, oldData => {
        if (oldData) {
          return oldData.filter(tag => tag.id !== rest.id);
        }
      });

      await deleteTag(rest.id);

      return { ok: true };
    }

    return null;
  };

export const loader = (queryClient: QueryClient) => async () => {
  console.log('note loader');
  return defer({
    notes: queryClient.fetchQuery({ ...notesQuery }),
    tags: queryClient.fetchQuery({ ...tagsQuery }),
  });
};

export function Notes() {
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >;
  const [selectedTagName, setSelectedTagName] = useState('all');

  function handleTagSelect(tagId: string) {
    setSelectedTagName(tagId);
  }

  //TODO: mobile layout
  const ref = useRef<ImperativePanelHandle>(null);
  const editorPanel = useRef<ImperativePanelHandle>(null);

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

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen rounded-lg border"
    >
      <ResizablePanel defaultSize={20} collapsible ref={ref}>
        <div className="h-full py-4">
          <div className="flex h-full flex-col items-start">
            <Button
              variant="outline"
              className={`flex w-full justify-start gap-2 border-none ${selectedTagName === 'all' ? 'bg-slate-200' : ''}`}
              onClick={() => handleTagSelect('all')}
            >
              <Notebook size="16px" />
              All Notes
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
            <ScrollArea className="h-full w-full ">
              <TagsList
                selectedTagName={selectedTagName}
                onTagSelect={handleTagSelect}
                tags={initialData.tags}
              />
            </ScrollArea>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={20} collapsible ref={ref}>
        <div className="h-full py-4 pb-32">
          <div className="flex items-center justify-between px-4 py-2">
            <p>Notes</p>
            <Link
              to="new"
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
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
        <div className="h-full p-4">
          <Outlet />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
