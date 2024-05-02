import Markdown from 'react-markdown';
import { Input } from './ui/input';
import { Pencil, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { useFetcher } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Textarea } from './ui/textarea';
import { useAuth } from './auth-provider';

//TOOD: types
interface Props {
  note?: unknown;
}

export function Editor({ note }: Props) {
  const [title, setTitle] = useState(note?.title ?? '');
  const [body, setBody] = useState(note?.body ?? '');

  useEffect(() => {
    setTitle(note?.title ?? '');
    setBody(note?.body ?? '');
  }, [note]);

  const [mode, setMode] = useState<'read' | 'edit'>('edit');

  const fetcher = useFetcher();
  const { session } = useAuth();

  function changeMode() {
    setMode(mode === 'edit' ? 'read' : 'edit');
  }

  return (
    <div className="flex h-full flex-col">
      <div className="h-full ">
        <fetcher.Form method="post" className="h-full">
          <div className="flex">
            {session && (
              <input name="user_id" value={session?.user.id} type="hidden" />
            )}
            {note && <input name="id" value={note.id} type="hidden" />}
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
