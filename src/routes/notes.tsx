import { useAuth } from '@/components/auth-provider';
import { ModeToggle } from '@/components/mode-toggle';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { createTag, fetchNotes, fetchTags } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import clsx from 'clsx';
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

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const newTag = formData.get('addedTag');
  const userId = formData.get('user_id');

  if (newTag && userId) {
    console.log('action', newTag, userId);
    newTag.toString().trim();
    const result = await createTag(newTag.toString().trim(), userId.toString());
  }
  return null;
}

export async function loader() {
  const tags = await fetchTags();
  // const notes = await fetchNotes();
  return { notes: {}, tags };
  // return null;
}

export function Notes() {
  const data = useLoaderData();
  const [notes, setNotes] = useState([]);
  console.log(data);

  const [selectedTag, setSelectedTag] = useState('all');

  function handleTagSelect(tagId: string) {
    setSelectedTag(tagId);
  }

  // useEffect(() => {
  //   fetchNotes(setNotes);
  // }, []);

  // if (!session) {
  //   return <Navigate to="/login" replace />;
  // }

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

  return (
    <div className="flex">
      <div className="flex flex-col items-center justify-start p-2">
        <Button onClick={collapsePanel} size="icon">
          <Folder />
        </Button>
        <Button size="icon">
          <LogOut />
        </Button>

        <ModeToggle />
      </div>
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-screen  rounded-lg border"
      >
        <ResizablePanel defaultSize={15} collapsible ref={ref}>
          <div className="py-4">
            <div className="flex flex-col items-start">
              {/*TODO: active */}
              <Button
                variant="outline"
                className="flex w-full justify-start gap-2 border-none bg-slate-200"
                onClick={() => handleTagSelect('all')}
              >
                <Notebook />
                All Notes
              </Button>
              <Button
                variant="outline"
                className="flex w-full justify-start gap-2 border-none"
                onClick={() => handleTagSelect('all')}
              >
                <Trash />
                Trash
              </Button>

              <TagForm />
              {data.tags.map(tag => {
                return (
                  <Button
                    key={tag.id}
                    variant="outline"
                    className="flex w-full justify-start gap-2 border-none"
                    onClick={() => handleTagSelect('all')}
                  >
                    <Hash />
                    {tag.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={20} collapsible ref={ref}>
          <div className="py-4">
            <Input className="mb-6" placeholder="Search note or #tag" />

            <Link
              to="note1Id"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'flex w-full justify-start gap-2 border-none',
              )}
            >
              Note 1
            </Link>

            <Link
              to="note2Id"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'flex w-full justify-start gap-2 border-none',
              )}
            >
              Note 2
            </Link>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={65} collapsible ref={editorPanel}>
          <div className="h-full p-4">
            <Outlet />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
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
      <div className="flex w-full justify-between p-4">
        <span>Tags:</span>
        <Button
          onClick={() => {
            setAddingTag(true);
            tagInputRef?.current?.focus();
          }}
          size="icon"
          variant="outline"
        >
          <Plus />
        </Button>
      </div>

      <fetcher.Form
        method="post"
        className={cn(
          'flex w-full items-center gap-2 px-4 py-2',
          !addingTag && 'opacity-0',
        )}
        ref={formRef}
        onSubmit={e => handleSubmit(e)}
      >
        <Hash />
        <input name="user_id" defaultValue={session?.user.id} type="hidden" />
        <Input name="addedTag" ref={tagInputRef} onBlur={handleResetTag} />
      </fetcher.Form>
    </>
  );
}
