import { Editor } from '@/features/note/components/editor';
import { QueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs, useParams } from 'react-router';
import { noteQuery } from '@/features/note/api/get-note';
import { Suspense } from 'react';
import NoteSkeleton from '@/features/note/components/note-skeleton';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    queryClient.ensureQueryData({ ...noteQuery(params.noteId!) });

    return null;
  };

export default function Note() {
  const { noteId } = useParams();

  return (
    <Suspense fallback={<NoteSkeleton />}>
      <Editor key={noteId} />
    </Suspense>
  );
}
