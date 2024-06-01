import { useAuth } from '@/components/auth-provider';
import { ModeToggle } from '@/components/mode-toggle';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { createTag, fetchNotes, fetchTags } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { QueryClient, useQueries } from '@tanstack/react-query';
import { Folder, Hash, LogOut, Notebook, Plus, Trash } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';
import {
  ActionFunctionArgs,
  Link,
  Outlet,
  useFetcher,
  useLoaderData,
} from 'react-router-dom';

export const action =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const newTag = formData.get('addedTag');
    const userId = formData.get('user_id');

    if (newTag && userId) {
      newTag.toString().trim();
      await createTag(newTag.toString().trim(), userId.toString());
    }
    return null;
  };

export const tagsQuery = {
  queryKey: ['tags'],
  queryFn: () => fetchTags(),
};

export const notesQuery = {
  queryKey: ['notes'],
  queryFn: () => fetchNotes(),
};

export const loader = (queryClient: QueryClient) => async () => {
  const tags = await queryClient.fetchQuery({ ...tagsQuery });
  const notes = await queryClient.fetchQuery({ ...notesQuery });
  return { notes, tags };
};

export function Notes() {
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >;
  const [notesResult, tagsResult] = useQueries({
    queries: [
      { ...notesQuery, initialData: initialData.notes },
      { ...tagsQuery, initialData: initialData.tags },
    ],
  });
  const { data: notes } = notesResult;
  const { data: tags } = tagsResult;

  const [selectedTag, setSelectedTag] = useState('all');

  function handleTagSelect(tagId: string) {
    setSelectedTag(tagId);
  }

  const ref = useRef<ImperativePanelHandle>(null);
  const editorPanel = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 720px)');
    if (mql.matches) {
      const panel = editorPanel.current;
      panel?.collapse();
    }
  }, []);

  const collapsePanel = () => {
    const panel = ref.current;
    if (!panel) {
      return;
    }
    if (panel.isCollapsed()) {
      panel.expand();
    } else if (panel.isExpanded()) {
      panel.collapse();
    }
  };

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
      <ResizablePanel defaultSize={15} collapsible ref={ref}>
        <div className="h-full py-4">
          <div className="flex h-full flex-col items-start">
            {/*TODO: active */}
            <Button
              variant="outline"
              className="flex w-full justify-start gap-2 border-none bg-slate-200"
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

            <TagForm />
            <ScrollArea className="h-full w-full">
              {tags &&
                tags.map(tag => {
                  return (
                    <Button
                      key={tag.id}
                      variant="outline"
                      className="flex w-full justify-start gap-2 border-none"
                      onClick={() => handleTagSelect('all')}
                    >
                      <Hash size="16px" />
                      {tag.name}
                    </Button>
                  );
                })}
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

          <div className="px-4">
            <Input className="mb-6" placeholder="Search note or #tag" />
          </div>
          <ScrollArea className="h-full">
            {notes &&
              notes.map(note => {
                return (
                  <Link
                    key={note.id}
                    to={note.id.toString()}
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'flex w-full justify-start gap-2 border-none',
                    )}
                  >
                    {note.title}
                  </Link>
                );
              })}
          </ScrollArea>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={65} collapsible ref={editorPanel}>
        <div className="h-full p-4">
          <Outlet />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function TagForm() {
  const fetcher = useFetcher();
  const [addingTag, setAddingTag] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const tagInputRef = useRef<HTMLInputElement | null>(null);

  const { session } = useAuth();

  function handleResetTag() {
    if (!formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);
    const newTag = formData.get('addedTag');
    //TODO: show error if tag already exists
    if (newTag) {
      fetcher.submit(formData, { method: 'post' });
    }

    formRef.current?.reset();
    setAddingTag(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) {
      return;
    }
    handleResetTag();
  }

  return (
    <>
      <div className="flex w-full items-center justify-between px-4 py-2">
        <span>Tags:</span>
        <Button
          onClick={() => {
            setAddingTag(true);
            tagInputRef?.current?.focus();
          }}
          size="icon"
          variant="ghost"
        >
          <Plus size="16px" />
        </Button>
      </div>

      {addingTag && (
        <fetcher.Form
          method="post"
          className={cn(
            'flex w-full items-center gap-2 px-4 py-2',
            !addingTag && 'opacity-0',
          )}
          ref={formRef}
          onSubmit={e => handleSubmit(e)}
        >
          <Hash size="16px" />
          <input name="user_id" defaultValue={session?.user.id} type="hidden" />
          <Input
            placeholder="Tag name"
            name="addedTag"
            ref={tagInputRef}
            onBlur={handleResetTag}
          />
        </fetcher.Form>
      )}
    </>
  );
}
