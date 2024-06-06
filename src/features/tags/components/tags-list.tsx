import { Button } from '@/components/ui/button';
import { Hash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { Await, useFetchers } from 'react-router-dom';

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
        name: formData?.get('addedTag'),
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
          return [...tags, ...tagFetchers].map(tag => {
            return (
              <Button
                key={tag.id}
                variant="outline"
                className={`flex w-full justify-start gap-2 border-none ${selectedTagName === tag.name ? 'bg-slate-200' : ''}`}
                onClick={() => onTagSelect(tag.name)}
              >
                <Hash size="16px" />
                {tag.name}
              </Button>
            );
          });
        }}
      </Await>
    </Suspense>
  );
}
