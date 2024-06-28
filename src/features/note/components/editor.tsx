import Markdown from 'react-markdown';
import { Input } from '../../../components/ui/input';
import { Pencil, Eye, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useFetcher } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Textarea } from '../../../components/ui/textarea';
import { useAuth } from '@/lib/auth';
import {
  MultipleSelector,
  Option,
  useDebounce,
} from '../../../components/ui/multiple-selector';
import { INote } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { tagsQuery } from '@/features/tags/api/get-tags';
import { cn } from '@/lib/utils';

interface Props {
  type: 'create-note' | 'edit';
  note?: INote;
}

function transformTags(note: INote | undefined) {
  return [
    ...(note?.tags?.map(({ id, name }) => ({
      id,
      label: name,
      value: name,
    })) ?? []),
  ];
}

export function Editor({ note, type: intent }: Props) {
  const fetcher = useFetcher();
  const { session } = useAuth();
  const { data: allTags } = useQuery({ ...tagsQuery });
  //set note tags to MultipleSelector
  const [value, setValue] = useState<Option[]>(transformTags(note));
  useEffect(() => {
    setValue(transformTags(note));
  }, [note]);

  const formRef = useRef<HTMLFormElement | null>(null);
  const [title, setTitle] = useState(note?.title ?? '');
  const debouncedTitle = useDebounce(title, 500);
  const isTitleChanged = useRef(false);

  const [body, setBody] = useState(note?.body ?? '');
  const debouncedBody = useDebounce(body, 500);
  const isBodyChanged = useRef(false);

  const [mode, setMode] = useState<'read' | 'edit'>('edit');

  const { submit } = fetcher;
  useEffect(() => {
    if (!formRef.current) {
      return;
    }

    if (!isTitleChanged.current && !isBodyChanged.current) {
      return;
    }

    const formData = new FormData(formRef.current);
    // if (!formData.get('title')) {
    //   //Show error?
    //   return;
    // }
    formData.append('intent', intent);
    console.log(intent, Object.fromEntries(formData), { intent });
    submit(formData, { method: 'post' });
  }, [
    debouncedTitle,
    debouncedBody,
    isTitleChanged,
    isBodyChanged,
    submit,
    intent,
  ]);

  function changeMode() {
    setMode(mode === 'edit' ? 'read' : 'edit');
  }

  function handleTag(
    intent: 'create-tag' | 'unselect-tag' | 'select-tag',
    { id, value }: { id: string; value: string },
  ) {
    if (!formRef.current) {
      return;
    }
    const formData = new FormData(formRef.current);
    if (intent === 'create-tag') {
      formData.append('tagName', value);
    }

    if (intent === 'select-tag' || intent === 'unselect-tag') {
      formData.append('tagId', id);
      formData.append('tagName', value);
    }

    formData.append('intent', intent);
    fetcher.submit(formData, { method: 'post' });
  }
  // console.log('fetcher', fetcher.state);

  return (
    <div className="flex h-full flex-col">
      <div className="h-full ">
        <fetcher.Form method="post" className="h-full" ref={formRef}>
          <div className="flex flex-col">
            {session && (
              <input name="userId" value={session?.user.id} type="hidden" />
            )}
            {note && <input name="noteId" value={note.id} type="hidden" />}
            <div className="mb-1 flex gap-1">
              <Input
                name="title"
                placeholder="title"
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  isTitleChanged.current = true;
                }}
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={changeMode}
              >
                {mode === 'edit' && <Pencil />}
                {mode === 'read' && <Eye />}
              </Button>
              <div className="flex h-10 w-10 items-center justify-center border border-input bg-background">
                <RefreshCw
                  data-testid="loading"
                  className={cn({
                    'animate-spin': fetcher.state === 'submitting',
                  })}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                name="intent"
                value="delete"
              >
                <Trash2 />
              </Button>
            </div>
            <MultipleSelector
              value={value}
              // defaultOptions={
              //   allTags?.map(({ id, name }) => {
              //     return {
              //       id,
              //       label: name,
              //       value: name,
              //     };
              //   }) ?? []
              // }
              options={
                allTags?.map(({ id, name }) => {
                  return {
                    id,
                    label: name,
                    value: name,
                  };
                }) ?? []
              }
              onChange={setValue}
              onCreate={async ({ value }) => {
                handleTag('create-tag', { value });
              }}
              //TODO: fix types
              onSelect={option => {
                handleTag('select-tag', { id: option.id, value: option.value });
              }}
              onUnselect={option => {
                handleTag('unselect-tag', { id: option.id });
              }}
              placeholder="Tags..."
              creatable
              // emptyIndicator={
              //   <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
              //     no results found.
              //   </p>
              // }
            />
          </div>
          {mode === 'edit' && (
            <Textarea
              name="body"
              value={body}
              onChange={e => {
                setBody(e.target.value);
                isBodyChanged.current = true;
              }}
              className="h-full w-full resize-none border-none p-4 focus-visible:border-none focus-visible:outline-none "
              autoComplete="off"
            ></Textarea>
          )}
          {mode === 'read' && <Markdown className="p-4">{body}</Markdown>}
        </fetcher.Form>
      </div>
    </div>
  );
}
