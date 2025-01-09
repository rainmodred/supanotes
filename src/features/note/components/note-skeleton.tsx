import { Skeleton } from '@/components/ui/skeleton';

export default function NoteSkeleton() {
  return (
    <>
      <Skeleton className="mb-2 h-[30px]" />
      {Array.from({ length: 5 }).map((_, i) => {
        return <Skeleton key={`st-${i}`} className="mb-2 h-[20px]" />;
      })}
    </>
  );
}
