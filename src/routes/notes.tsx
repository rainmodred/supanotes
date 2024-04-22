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
import {
  Cross,
  Folder,
  Hash,
  LogOut,
  Notebook,
  Plus,
  Trash,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { Link, Outlet, useLoaderData } from 'react-router-dom';

export async function loader() {
  // const tags = await fetchTags();
  // const notes = await fetchNotes();
  // return { notes: {}, tags };
  return null;
}

export function Notes() {
  const { session } = useAuth();
  // const data = useLoaderData();
  const [notes, setNotes] = useState([]);

  const [selectedTag, setSelectedTag] = useState('all');

  function handleTagSelect(tagId: string) {
    setSelectedTag(tagId);
  }

  async function handleAddTag() {
    // await createTag('test-1', session?.user.id);
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
              <div className="flex w-full justify-between p-4">
                <span>Tags:</span>
                <Plus />
              </div>

              <Button
                variant="outline"
                className="flex w-full justify-start gap-2 border-none"
                onClick={() => handleTagSelect('all')}
              >
                <Hash />
                Tag 1
              </Button>

              <Button
                variant="outline"
                className="flex w-full justify-start gap-2 border-none"
                onClick={() => handleTagSelect('all')}
              >
                <Hash />
                Tag 2
              </Button>
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

              // className="flex w-full justify-start gap-2 border-none p-4"
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
    // <div className="space-y-4">
    //   <h1>Notes</h1>
    //   <form className="flex justify-center">
    //     <div>
    //       <div>
    //         <Label htmlFor="title">title</Label>
    //         <Input
    //           {...register('title')}
    //           id="title"
    //           type="text"
    //           placeholder="title"
    //         />
    //       </div>

    //       <div>
    //         <Label htmlFor="body">body</Label>
    //         <Input
    //           {...register('body')}
    //           id="body"
    //           type="text"
    //           placeholder="body"
    //         />
    //       </div>
    //       <Button
    //         onClick={handleSubmit(data => {
    //           const note = addNote(data.title, data.body, session.user.id);
    //           setNotes([...notes, note]);
    //         })}
    //       >
    //         Add Note
    //       </Button>
    //     </div>
    //   </form>
    //   <div className="flex gap-2">
    //     {notes.map(note => {
    //       return (
    //         <div
    //           className="px-4 py-1 border-solid border-2 rounded-md bg-gray-100"
    //           key={note.id}
    //         >
    //           <h3 className="text-2xl">{note.title}</h3>{' '}
    //           <p className="text-sm">{note.body}</p>
    //         </div>
    //       );
    //     })}
    //   </div>
    // </div>
  );
}
