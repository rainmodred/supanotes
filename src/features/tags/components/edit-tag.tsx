import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth';
import { ITag } from '@/lib/types';
import { Ellipsis, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useFetcher } from 'react-router-dom';

interface Props {
  tag: ITag;
  hidden: boolean;
}
export function EditTag({ tag, hidden }: Props) {
  const fetcher = useFetcher();

  const { session } = useAuth();

  const formRef = useRef<HTMLFormElement | null>(null);
  const [open, setOpen] = useState(false);

  function handleDelete() {
    if (!formRef.current || !session) {
      return;
    }

    const formData = new FormData(formRef.current);
    formData.append('intent', 'delete-tag');
    formData.append('id', tag.id);

    setOpen(false);
    fetcher.submit(formData, { method: 'delete' });
  }

  if (hidden) {
    return null;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" data-testid={`edit-${tag.name}`}>
          <Ellipsis size="12" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Name</DropdownMenuLabel>

        <fetcher.Form
          ref={formRef}
          method="post"
          onSubmit={e => {
            e.preventDefault();
            if (!formRef.current || !session) {
              return;
            }
            const formData = new FormData(formRef.current);
            formData.append('id', tag.id);
            formData.append('intent', 'rename-tag');
            fetcher.submit(formData, { method: 'post' });
          }}
        >
          <Input className="my-2" name="name" defaultValue={tag.name} />

          <Separator className="mb-2" />
          <Button
            variant="outline"
            className="flex w-full justify-start"
            type="button"
            onClick={handleDelete}
          >
            <Trash2 size="16" /> Delete
          </Button>
        </fetcher.Form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
