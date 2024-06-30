import { useFetcher } from 'react-router-dom';
import { useCallback, useRef, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { INote, ITag } from '@/lib/types';
import { EditorControls } from './editor-controls';
import { TagSelector } from './tag-selector';
import { Title } from './title';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

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
      }
      if (field === 'body') {
        formData.append('body', value);
      }

      formData.append('intent', 'update-note');
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
    <div className="flex h-full flex-col">
      <div className="h-full ">
        <fetcher.Form method="post" className="h-full" ref={formRef}>
          <div className="flex flex-col">
            {session && (
              <input name="userId" value={session?.user.id} type="hidden" />
            )}
            <div className="mb-1 flex gap-1">
              <Title initialTile={note?.title ?? ''} onUpdate={handleUpdate} />
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
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
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
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </fetcher.Form>
      </div>
    </div>
  );
}
