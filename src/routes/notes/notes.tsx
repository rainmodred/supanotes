import { notesQuery } from '@/features/notes/api/get-notes';
import { tagsQuery } from '@/features/tags/api/get-tags';
import { QueryClient } from '@tanstack/react-query';
import { useMediaQuery } from '@mantine/hooks';
import {
  DesktopLayout,
  MobileLayout,
} from '@/features/notes/components/layouts';
import { Spinner } from '@/components/spinner';

async function getNotes(queryClient: QueryClient) {
  const notes = await queryClient.fetchQuery({ ...notesQuery });

  for (const note of notes) {
    queryClient.setQueryData(['notes', note.id], note);
  }

  return notes;
}

export const clientLoader = (queryClient: QueryClient) => async () => {
  const promises = [
    queryClient.getQueryData(notesQuery.queryKey) ?? getNotes(queryClient),
    // queryClient.ensureQueryData(notesQuery),
    queryClient.ensureQueryData(tagsQuery),
  ];

  Promise.all(promises);
  return null;
};

export default function Notes() {
  const isMobile = useMediaQuery('(max-width: 48rem)');
  if (isMobile == undefined) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (isMobile) {
    return <MobileLayout />;
  }

  return <DesktopLayout />;
}
