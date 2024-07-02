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
import { useQuery } from '@tanstack/react-query';
import { Ellipsis, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useFetcher } from 'react-router-dom';
import { tagsQuery } from '../api/get-tags';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Props {
  tag: ITag;
  hidden: boolean;
}
export function EditTag({ tag, hidden }: Props) {
  const fetcher = useFetcher();

  const { session } = useAuth();

  const { data: tags } = useQuery({ ...tagsQuery });

  const formRef = useRef<HTMLFormElement | null>(null);
  const [formError, setFormError] = useState('');
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

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

            const renamedTag = formData.get('name');
            if (renamedTag) {
              if (tags?.some(tag => tag.name === renamedTag)) {
                setFormError('Tag already exists');
              } else {
                setFormError('');
                setOpen(false);
                fetcher.submit(formData, { method: 'post' });
              }
            }
          }}
        >
          <Input className="my-2" name="name" defaultValue={tag.name} />
          {formError && (
            <p className="text-xs font-medium text-destructive">{formError}</p>
          )}

          <Separator className="mb-2" />
          <Button
            variant="outline"
            className="flex w-full justify-start"
            type="button"
            onClick={() => setAlertOpen(true)}
          >
            <Trash2 size="16" /> Delete
          </Button>

          <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete tag {tag.name}?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                Are you sure you want to delete this tag?
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </fetcher.Form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
