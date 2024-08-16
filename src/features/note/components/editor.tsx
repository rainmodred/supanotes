import { useFetcher } from 'react-router-dom';
import { useCallback, useRef, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { INote, ITag } from '@/lib/types';
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
import { TitleInput } from './title-input';

interface Props {
  note: INote;
}

export function Editor({ note }: Props) {
  const { session } = useAuth();

  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [mode, setMode] = useState<'read' | 'edit'>('edit');
  const [open, setOpen] = useState(false);

  function changeMode() {
    setMode(mode === 'edit' ? 'read' : 'edit');
  }

  const { submit } = fetcher;
  const handleUpdate = useCallback(
    (field: 'title' | 'body', value: string) => {
      if (!formRef.current) {
        return;
      }
      const formData = new FormData(formRef.current);
      if (field === 'title') {
        formData.append('title', value);
        formData.append('intent', 'update-title');
      }
      if (field === 'body') {
        formData.append('body', value);
        formData.append('intent', 'update-body');
      }

      submit(formData, { method: 'post' });
    },
    [submit],
  );

  function handleTag({
    intent,
    tag,
  }:
    | { intent: 'create-tag'; tag: Omit<ITag, 'id'> }
    | { intent: 'select-tag' | 'unselect-tag'; tag: ITag }) {
    if (!session) {
      return;
    }
    const formData = new FormData();
    formData.append('tagName', tag.name);
    formData.append('userId', session.user.id);
    if (intent === 'select-tag' || intent === 'unselect-tag') {
      formData.append('tagId', tag.id);
    }

    formData.append('intent', intent);
    fetcher.submit(formData, { method: 'post' });
  }

  return (
    <fetcher.Form method="post" className="h-full" ref={formRef}>
      {session && (
        <input name="userId" value={session?.user.id} type="hidden" />
      )}

      <div className="flex h-full flex-col">
        <div className="px-2">
          <div className="mb-2 flex gap-2">
            <TitleInput initialTile={note.title} onUpdate={handleUpdate} />
            <EditorControls
              mode={mode}
              onChangeMode={changeMode}
              onDelete={() => setOpen(true)}
              isLoading={fetcher.state === 'submitting'}
            />
          </div>

          <TagSelector tags={note.tags} onTagChange={handleTag} />
        </div>
        <EditorBody
          initialBody={note?.body ?? ''}
          mode={mode}
          onUpdate={handleUpdate}
        />
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
                const formData = new FormData();
                formData.append('intent', 'delete-note');
                fetcher.submit(formData, { method: 'post' });
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </fetcher.Form>
  );
}
