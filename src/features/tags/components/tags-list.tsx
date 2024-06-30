import { Button } from '@/components/ui/button';
import { Hash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { Await, useFetchers } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { EditTag } from './edit-tag';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/spinner';

interface Props {
  selectedTagName: string | null;
  onTagSelect: (tagName: string) => void;
  tags: Promise<unknown>;
}

export function TagsList({ selectedTagName, onTagSelect, tags }: Props) {
  //WTF
  const fetchers = useFetchers();
  const tagFetchers = fetchers
    .filter(fetcher => {
      const intent = fetcher.formData?.get('intent');

      return (
        (fetcher.formAction?.startsWith('/notes') && intent === 'create-tag') ||
        intent === 'delete-tag' ||
        intent === 'rename-tag'
      );
    })
    .map(({ formData }) => {
      return {
        id: formData?.get('id') || '1',
        name: formData?.get('name'),
        intent: formData?.get('intent'),
      };
    });

  return (
    <Suspense
      fallback={
        <div className="px-2" data-testid="loading-tags">
          {Array.from({ length: 20 }).map((_, i) => {
            return <Skeleton key={`st-${i}`} className="mb-2 h-[20px]" />;
          })}
        </div>
      }
    >
      <Await resolve={tags}>
        {tags => {
          // console.log('tags:', tags);
          return (
            <ScrollArea className="h-full w-full ">
              <ul className="m-0">
                {[
                  ...tags,
                  // Optimistic create tag
                  ...tagFetchers.filter(
                    fetcher =>
                      fetcher.intent !== 'rename-tag' &&
                      fetcher.intent !== 'delete-tag',
                  ),
                ].map(tag => {
                  const isDeleting = tagFetchers.some(
                    fetcher =>
                      fetcher.intent === 'delete-tag' && fetcher.id === tag.id,
                  );
                  return (
                    <li
                      key={tag.id}
                      className={cn(
                        `mt-0 flex w-full items-center justify-between gap-2 px-2 pr-1`,
                        {
                          'bg-slate-200': selectedTagName === tag.name,
                          'opacity-30': isDeleting,
                        },
                      )}
                    >
                      <Button
                        variant="ghost"
                        className={`hover:none flex w-full grow justify-start gap-2 border-none bg-inherit px-0
                    py-0`}
                        onClick={() => onTagSelect(tag.name)}
                      >
                        <Hash size="16px" className="shrink-0" />
                        <span className="overflow-hidden text-ellipsis">
                          {tag.name}
                        </span>
                      </Button>

                      {/* Not working, action works but loader is not called */}
                      {/* {!isDeleting && <EditTag tag={tag} />} */}

                      {/* 
                        tag.id === '1' optimistic create
                        TODO: Change tag.id for something better 
                      */}
                      {tag.id === '1' && (
                        <Spinner size="md" data-testid="loading" />
                      )}

                      <EditTag tag={tag} hidden={isDeleting} />
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          );
        }}
      </Await>
    </Suspense>
  );
}
