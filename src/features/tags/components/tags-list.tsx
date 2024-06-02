import { Button } from '@/components/ui/button';
import { Hash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { Await } from 'react-router-dom';

interface Props {
  selectedTagName: string;
  onTagSelect: (tagName: string) => void;
  getTags: Promise<unknown>;
}

export function TagsList({ selectedTagName, onTagSelect, getTags }: Props) {
  return (
    <Suspense
      fallback={Array.from({ length: 20 }).map((_, i) => {
        return <Skeleton key={`st-${i}`} className="mb-2 h-[20px]" />;
      })}
    >
      <Await resolve={getTags}>
        {tags => {
          return tags.map(tag => {
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
