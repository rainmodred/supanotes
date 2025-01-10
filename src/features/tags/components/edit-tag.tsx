import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ITag } from '@/lib/types';
import { Ellipsis, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTags } from '../api/get-tags';
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
import { useUpdateTag } from '../api/update-tag';
import { Spinner } from '@/components/spinner';
import { useDeleteTag } from '../api/delete-tag';

interface Props {
  tag: ITag;
  hidden: boolean;
}
export function EditTag({ tag, hidden }: Props) {
  const { data: tags } = useTags();

  const [formError, setFormError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [tagName, setTagName] = useState(tag.name);

  const updateMutation = useUpdateTag();
  const deleteMutation = useDeleteTag(tag.id);

  function handleDelete() {
    deleteMutation.mutate(tag.id, { onSuccess: () => setDropdownOpen(false) });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (tags?.some(tag => tag.name === tagName)) {
      setFormError('Tag already exists');
      return;
    }

    setFormError('');
    setDropdownOpen(false);
    updateMutation.mutate({ name: tagName, id: tag.id });
  }

  if (hidden) {
    return null;
  }

  if (updateMutation.isPending) {
    return <Spinner size="md" data-testid="loading" />;
  }

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            data-testid={`edit-${tag.name}`}
          >
            <Ellipsis size="12" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Name</DropdownMenuLabel>

          <form method="post" onSubmit={handleSubmit}>
            <Input
              className="my-2"
              name="name"
              value={tagName}
              onChange={e => setTagName(e.target.value)}
            />
            {formError && (
              <p className="text-xs font-medium text-destructive">
                {formError}
              </p>
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
          </form>
        </DropdownMenuContent>
      </DropdownMenu>

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
            <AlertDialogAction type="button" onClick={handleDelete}>
              {deleteMutation.isPending && (
                <Spinner size="sm" data-testid="loading" />
              )}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
