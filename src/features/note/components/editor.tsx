import { Link, useParams } from 'react-router';
import { useState } from 'react';
import { TagSelector } from './tag-selector';
import { EditorBody } from './editor-body';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EditorControls } from './editor-controls';
import { Title } from './title';
import { ChevronLeft } from 'lucide-react';
import { useNote } from '../api/get-note';
import { useDeleteNote } from '../api/delete-note';
import { useIsMutating } from '@tanstack/react-query';

export function Editor() {
  const { noteId: id } = useParams() as {
    noteId: string;
  };
  const { data: note } = useNote(id);

  const [mode, setMode] = useState<'read' | 'edit'>('edit');
  const [open, setOpen] = useState(false);

  const deleteNoteMutation = useDeleteNote();

  const isMutating = useIsMutating({ mutationKey: ['update-note'] });

  function changeMode() {
    setMode(mode === 'edit' ? 'read' : 'edit');
  }

  //TODO: FIXME
  if (!note) {
    return <p>send help</p>;
  }

  return (
    <div className="h-full">
      <div className="flex h-full flex-col">
        <div className="px-2">
          <div className="mb-2 flex items-center gap-2">
            <Link to="/notes">
              <ChevronLeft />
            </Link>
            <Title id={id} initialTile={note.title} />
            <EditorControls
              mode={mode}
              onChangeMode={changeMode}
              onDelete={() => setOpen(true)}
              isLoading={!!isMutating}
            />
          </div>

          <TagSelector id={id} noteTags={note.tags} />
        </div>
        <EditorBody id={id} initialBody={note?.body ?? ''} mode={mode} />
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete note {note.title}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteNoteMutation.mutate(id);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
