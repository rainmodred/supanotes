import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import { useFetcher } from 'react-router-dom';
import { tagsQuery } from '../api/get-tags';

export function CreateTag() {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement | null>(null);
  const tagInputRef = useRef<HTMLInputElement | null>(null);
  const [formError, setFormError] = useState('');

  const { data: tags } = useQuery({ ...tagsQuery });

  const { session } = useAuth();

  function handleResetTag() {
    if (!formRef.current) {
      return;
    }

    formRef.current?.reset();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) {
      return;
    }

    const formData = new FormData(e.target);
    const newTag = formData.get('name');
    formData.append('intent', 'create-tag');
    formData.append('userId', session?.user.id);

    if (newTag) {
      if (tags?.some(tag => tag.name === newTag)) {
        setFormError('Tag already exists');
      } else {
        setFormError('');
        fetcher.submit(formData, { method: 'post' });
      }
    }
    handleResetTag();
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

      {
        <fetcher.Form
          method="post"
          className={cn('flex w-full items-center gap-2 px-4 pb-2')}
          ref={formRef}
          onSubmit={e => handleSubmit(e)}
        >
          <div className="w-full">
            <Input
              placeholder="Add tag"
              name="name"
              ref={tagInputRef}
              onBlur={handleResetTag}
            />
            <div className="px-2 py-2">
              {formError && (
                <p className="text-xs font-medium text-destructive">
                  {formError}
                </p>
              )}
            </div>
          </div>
        </fetcher.Form>
      }
    </>
  );
}
