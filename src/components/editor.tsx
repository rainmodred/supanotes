import Markdown from 'react-markdown';
import { Input } from './ui/input';
import { Pencil, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { useFetcher } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Textarea } from './ui/textarea';
import { useAuth } from './auth-provider';
import { MultipleSelector, Option } from './ui/multiple-selector';
import { INote } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { tagsQuery } from '@/routes/notes';
import { createTag } from '@/lib/supabase';

//TOOD: types
interface Props {
  note?: INote | undefined;
}

export function Editor({ note }: Props) {
  const [value, setValue] = useState<Option[]>([]);
  const [title, setTitle] = useState(note?.title ?? '');
  const [body, setBody] = useState(note?.body ?? '');
  const { data: allTags } = useQuery({ ...tagsQuery });
  console.log('EDITOR', { allTags, note });

  const formRef = useRef();

  useEffect(() => {
    setTitle(note?.title ?? '');
    setBody(note?.body ?? '');

    setValue([
      ...(note?.tags.map(({ id, name }) => ({
        id,
        label: name,
        value: name,
      })) ?? []),
    ]);
  }, [note]);

  const [mode, setMode] = useState<'read' | 'edit'>('edit');

  const fetcher = useFetcher();
  const { session } = useAuth();

  function changeMode() {
    setMode(mode === 'edit' ? 'read' : 'edit');
  }

  // const options: Option[] = [
  //   ...(note?.tags.map(({ id, name }) => ({
  //     id,
  //     label: name,
  //     value: name,
  //   })) ?? []),
  // ];
  // console.log('options:', options);

  return (
    <div className="flex h-full flex-col">
      <div className="h-full ">
        <fetcher.Form method="post" className="h-full" ref={formRef.current}>
          <div className="flex">
            {session && (
              <input name="user_id" value={session?.user.id} type="hidden" />
            )}
            {note && <input name="note_id" value={note.id} type="hidden" />}
            <Input
              name="title"
              placeholder="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <MultipleSelector
              value={value}
              defaultOptions={
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
                //TOOD: remove formRef?
                const formData = new FormData(formRef.current);
                formData.append('tagName', value);
                formData.append('intent', 'create-tag');
                formData.append('user_id', session?.user.id);
                formData.append('note_id', note?.id);
                console.log('formData', Object.fromEntries(formData));
                fetcher.submit(formData, { method: 'post' });
              }}
              onSelect={value => {
                const formData = new FormData();
                formData.append('tag_id', value.id);
                formData.append('intent', 'select-tag');
                formData.append('user_id', session?.user.id);
                formData.append('note_id', note?.id);

                fetcher.submit(formData, { method: 'post' });

                console.log('onSelect', value);
              }}
              onUnselect={value => console.log('onUnselect', value)}
              placeholder="Tags..."
              creatable
              // emptyIndicator={
              //   <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
              //     no results found.
              //   </p>
              // }
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
          {mode === 'edit' && (
            <Textarea
              name="body"
              value={body}
              onChange={e => setBody(e.target.value)}
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
