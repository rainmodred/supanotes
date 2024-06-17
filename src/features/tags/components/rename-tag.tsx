import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/components/ui/multiple-selector';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth';
import { ITag } from '@/lib/types';
import { Ellipsis, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useFetcher } from 'react-router-dom';

interface Props {
  tag: ITag;
}
export function RenameTag({ tag }: Props) {
  const fetcher = useFetcher();

  const [value, setValue] = useState(tag.name);
  const debouncedTagName = useDebounce(value, 500);
  const isNameChanged = useRef(false);

  const { session } = useAuth();

  const formRef = useRef<HTMLFormElement | null>(null);
  const [open, setOpen] = useState(false);

  const { submit } = fetcher;
  useEffect(() => {
    if (!formRef.current || !open || !isNameChanged.current) {
      return;
    }

    const formData = new FormData(formRef.current);
    formData.append('intent', 'rename-tag');
    const name = formData.get('name');
    if (typeof name === 'string') {
      if (name === '') {
        return;
      }
    }

    console.log(Object.fromEntries(formData));
    submit(formData, { method: 'post' });
  }, [debouncedTagName, open, submit]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <Ellipsis size="12" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Name</DropdownMenuLabel>

        <fetcher.Form ref={formRef}>
          <input name="user_id" defaultValue={session?.user.id} type="hidden" />
          <input name="id" defaultValue={tag.id} type="hidden" />
          <Input
            className="my-2"
            name="name"
            value={value}
            onChange={e => {
              setValue(e.target.value);
              isNameChanged.current = true;
            }}
          />
          <Separator className="mb-2" />
          <Button variant="outline" className="flex w-full justify-start">
            <Trash2 size="16" /> Delete
          </Button>
        </fetcher.Form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
