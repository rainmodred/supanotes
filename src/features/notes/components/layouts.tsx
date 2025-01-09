import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TagsList } from '@/features/tags/components/tags-list';
import { useLocation, Outlet } from 'react-router';
import { MobileSidebar } from './mobile-sidebar';
import { NotesHeader } from './notes-header';
import { NotesList } from './notes-list';
import { Settings } from './settings';
import { TagsHeader } from '@/features/tags/components/tags-header';
import { Suspense } from 'react';
import { TagListSkeleton } from '@/features/tags/components/tags-skeleton';
import NotesSkeleton from './notes-skeleton';

export function MobileLayout() {
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
        <MobileSidebar />
        <div className="flex h-full w-full flex-col py-4">
          <NotesHeader>
            <SidebarTrigger />
          </NotesHeader>
          <NotesList />
        </div>
      </SidebarProvider>
    );
  }
}

export function DesktopLayout() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen rounded-lg border"
    >
      <ResizablePanel defaultSize={15} collapsible>
        <div className="flex h-full flex-col py-4">
          <TagsHeader />
          <Suspense fallback={<TagListSkeleton />}>
            <TagsList />
          </Suspense>
          <Settings />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25} collapsible>
        <div className="flex h-full flex-col py-4">
          <NotesHeader />
          <Suspense fallback={<NotesSkeleton />}>
            <NotesList />
          </Suspense>
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
