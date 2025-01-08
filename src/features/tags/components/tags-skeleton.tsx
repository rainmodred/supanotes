import { Skeleton } from '@/components/ui/skeleton';

export function TagListSkeleton() {
  return (
    <div className="h-full px-2" data-testid="loading-tags">
      {Array.from({ length: 20 }).map((_, i) => {
        return <Skeleton key={`st-${i}`} className="mb-2 h-[20px]" />;
      })}
    </div>
  );
}
