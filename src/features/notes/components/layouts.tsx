import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CreateTag } from '@/features/tags/components/create-tag';
import { TagsList } from '@/features/tags/components/tags-list';
import { ITag, INote } from '@/lib/types';
import { useLocation, Outlet } from 'react-router';
import { MobileSidebar } from './mobile-sidebar';
import { NotesHeader } from './notes-header';
import { NotesList } from './notes-list';
import { Settings } from './settings';
import { TagsHeader } from '@/features/tags/components/tags-header';

export function MobileLayout({
  tags,
  notes,
}: {
  tags: Promise<ITag[]>;
  notes: Promise<INote[]>;
}) {
  const location = useLocation();
  //show selected note
  if (location.pathname !== '/notes') {
    return (
      <div className="h-full py-2">
        <Outlet />
      </div>
    );
  } else {
    //show notes list and tags sidebar
    return (
      <SidebarProvider>
        <MobileSidebar tags={tags} />
        <div className="flex h-full w-full flex-col py-4">
          <NotesHeader>
            <SidebarTrigger />
          </NotesHeader>
          <NotesList notes={notes} />
        </div>
      </SidebarProvider>
    );
  }
}

export function DesktopLayout({
  tags,
  notes,
}: {
  tags: Promise<ITag[]>;
  notes: Promise<INote[]>;
}) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen rounded-lg border"
    >
      <ResizablePanel defaultSize={15} collapsible>
        <div className="flex h-full flex-col py-4">
          <TagsHeader />
          <CreateTag />
          <TagsList tags={tags} />
          <Settings />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25} collapsible>
        <div className="flex h-full flex-col py-4">
          <NotesHeader />
          <NotesList notes={notes} />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={60} collapsible>
        <div className="h-full py-4">
          <Outlet />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
