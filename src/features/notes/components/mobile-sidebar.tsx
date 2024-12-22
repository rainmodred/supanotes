import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { CreateTag } from '@/features/tags/components/create-tag';
import { TagsList } from '@/features/tags/components/tags-list';
import { Settings } from 'lucide-react';
import { ITag } from '@/lib/types';
import { TagsHeader } from '@/features/tags/components/tags-header';

export function MobileSidebar({ tags }: { tags: Promise<ITag[]> }) {
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
            <CreateTag />
            <TagsList tags={tags} onSelect={() => setOpenMobile(false)} />
          </div>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Settings />
      </SidebarFooter>
    </Sidebar>
  );
}
