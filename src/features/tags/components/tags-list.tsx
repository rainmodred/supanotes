import { Button } from '@/components/ui/button';
import { Hash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { Await, useFetchers } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { RenameTag } from './rename-tag';

interface Props {
  selectedTagName: string;
  onTagSelect: (tagName: string) => void;
  tags: Promise<unknown>;
}

export function TagsList({ selectedTagName, onTagSelect, tags }: Props) {
  //WTF
  const fetchers = useFetchers();
  const tagFetchers = fetchers
    .filter(fetcher => {
      return fetcher.formAction?.startsWith('/notes');
    })
    .map(({ formData }) => {
      return {
        id: '1',
        name: formData?.get('name'),
        intent: formData?.get('intent'),
      };
    });

  return (
    <Suspense
      fallback={
        <div className="px-2">
          {Array.from({ length: 20 }).map((_, i) => {
            return <Skeleton key={`st-${i}`} className="mb-2 h-[20px]" />;
          })}
        </div>
      }
    >
      <Await resolve={tags}>
        {tags => {
          return [
            ...tags,
            ...tagFetchers.filter(fetcher => fetcher.intent !== 'rename-tag'),
            // Don't show new tag on rename intent
          ].map(tag => {
            return (
              <div
                key={tag.id}
                className={cn(`grid w-full grid-cols-3 px-2 pr-1`, {
                  'bg-slate-200': selectedTagName === tag.name,
                })}
              >
                <Button
                  variant="outline"
                  className={`col-span-2 flex w-full justify-start gap-2 border-none bg-inherit px-0
                    py-0`}
                  onClick={() => onTagSelect(tag.name)}
                >
                  <Hash size="16px" className="shrink-0" />
                  <span className="overflow-hidden text-ellipsis">
                    {tag.name}
                  </span>
                </Button>
                <div className="place-self-end">
                  <RenameTag tag={tag} />
                </div>
              </div>
            );
          });
        }}
      </Await>
    </Suspense>
  );
}
