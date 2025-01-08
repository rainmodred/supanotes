import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { TagsList } from '@/features/tags/components/tags-list';
import { Settings } from 'lucide-react';
import { TagsHeader } from '@/features/tags/components/tags-header';
import { TagListSkeleton } from '@/features/tags/components/tags-skeleton';
import { Suspense } from 'react';

export function MobileSidebar() {
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader className="py-0" />
      <SidebarContent>
        <SidebarMenu className="overflow-hidden">
          <div className="flex h-full flex-col py-4">
            <SidebarMenuButton asChild className="px-4">
              <TagsHeader onSelect={() => setOpenMobile(false)} />
            </SidebarMenuButton>
            <Suspense fallback={<TagListSkeleton />}>
              <TagsList onSelect={() => setOpenMobile(false)} />
            </Suspense>
          </div>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Settings />
      </SidebarFooter>
    </Sidebar>
  );
}
