import { Skeleton } from '@/components/ui/skeleton';

export default function NotesSkeleton() {
  return (
    <div className="px-2" data-testid="loading-notes">
      {Array.from({ length: 20 }).map((_, i) => {
        return <Skeleton key={`st-${i}`} className="mb-2 h-[20px]" />;
      })}
    </div>
  );
}
