import Markdown from 'react-markdown';
import { Input } from '../../../components/ui/input';
import { Pencil, Eye } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useFetcher } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Textarea } from '../../../components/ui/textarea';
import { useAuth } from '../../../components/auth-provider';
import {
  MultipleSelector,
  Option,
  useDebounce,
} from '../../../components/ui/multiple-selector';
import { INote } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { tagsQuery } from '@/features/tags/api/get-tags';

interface Props {
  type: 'create' | 'edit';
  note?: INote;
}

export function Editor({ note, type }: Props) {
  const fetcher = useFetcher();
  const { session } = useAuth();
  const { data: allTags } = useQuery({ ...tagsQuery });
  const [value, setValue] = useState<Option[]>([]);
  const [title, setTitle] = useState(note?.title ?? '');
  const [body, setBody] = useState(note?.body ?? '');
  const debouncedBody = useDebounce(body, 500);
  const [mode, setMode] = useState<'read' | 'edit'>('edit');
  const formRef = useRef();

  const prevBody = useRef(note?.body);
  const [changed, setChanged] = useState(false);

  // console.log('EDITOR', { allTags, note });
  const { submit } = fetcher;
  useEffect(() => {
    if (!changed || type === 'create' || prevBody.current === debouncedBody) {
      return;
    }
    prevBody.current = debouncedBody;

    const formData = new FormData(formRef.current);
    formData.append('intent', 'save');
    submit(formData, { method: 'post' });
  }, [changed, submit, type, debouncedBody]);

  useEffect(() => {
    setTitle(note?.title ?? '');
    setBody(note?.body ?? '');

    setValue([
      ...(note?.tags?.map(({ id, name }) => ({
        id,
        label: name,
        value: name,
      })) ?? []),
    ]);
  }, [note]);

  function changeMode() {
    setMode(mode === 'edit' ? 'read' : 'edit');
  }

  function handleTag(
    intent: 'create-tag' | 'unselect-tag' | 'select-tag',
    value: string,
  ) {
    const formData = new FormData(formRef.current);
    if (intent === 'create-tag') {
      formData.append('tagName', value);
    }

    if (intent === 'select-tag' || intent === 'unselect-tag') {
      formData.append('tag_id', value);
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
              <input name="user_id" value={session?.user.id} type="hidden" />
            )}
            {note && <input name="note_id" value={note.id} type="hidden" />}
            <div className="mb-1 flex gap-1">
              <Input
                name="title"
                placeholder="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
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

              <Button variant="outline" name="intent" value="save">
                Save
              </Button>

              <Button variant="outline" name="intent" value="delete">
                Delete
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
                handleTag('create-tag', value);
              }}
              onSelect={option => {
                handleTag('select-tag', option.id);
              }}
              onUnselect={option => {
                handleTag('unselect-tag', option.id);
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
                setChanged(true);
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
