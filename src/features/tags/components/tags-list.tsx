import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { useCreateTag } from '../api/create-tag';
import { useTags } from '../api/get-tags';
import { TagsListItem } from './tag-item';
import { Plus } from 'lucide-react';

export function TagsList({ onSelect }: { onSelect?: () => void }) {
  const { session } = useAuth();
  const { data: tags } = useTags();

  const tagInputRef = useRef<HTMLInputElement | null>(null);
  const [formError, setFormError] = useState('');
  const [tagName, setTagName] = useState('');

  const createTagMutation = useCreateTag();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (tags?.some(tag => tag.name === tagName)) {
      setFormError('Tag already exists');
      return;
    }

    setFormError('');
    setTagName('');
    createTagMutation.mutate({ userId: session!.user.id, name: tagName });
  }

  return (
    <>
      <div className="flex w-full items-center justify-between px-4 py-1">
        <span>Tags:</span>
        <Button
          onClick={() => {
            tagInputRef?.current?.focus();
          }}
          size="icon"
          variant="ghost"
        >
          <Plus size="16px" />
        </Button>
      </div>

      <form
        method="post"
        className={cn('flex w-full items-center gap-2 px-4 pb-2')}
        onSubmit={handleSubmit}
      >
        <div className="w-full">
          <Input
            placeholder="Add tag"
            name="name"
            ref={tagInputRef}
            onBlur={() => setTagName('')}
            value={tagName}
            onChange={e => setTagName(e.target.value)}
          />
          <div className="px-2 py-2">
            {formError && (
              <p className="text-xs font-medium text-destructive">
                {formError}
              </p>
            )}
          </div>
        </div>
      </form>
      <ScrollArea className="h-full w-full">
        <ul className="m-0">
          {createTagMutation.isPending && (
            <TagsListItem
              tag={{
                name: createTagMutation.variables.name,
                id: createTagMutation.variables.name,
              }}
              isLoading={true}
            />
          )}
          {tags.map(tag => (
            <TagsListItem key={tag.id} tag={tag} onSelect={onSelect} />
          ))}
        </ul>
      </ScrollArea>
    </>
  );
}
