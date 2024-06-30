import { useDebounce } from '@/components/ui/multiple-selector';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';

interface Props {
  initialBody: string;
  mode: 'edit' | 'read';
  onUpdate: (field: 'body', value: string) => void;
}

export function EditorBody({ initialBody, mode, onUpdate }: Props) {
  const [body, setBody] = useState(initialBody);
  const debouncedBody = useDebounce(body, 500);
  const isBodyChanged = useRef(false);

  useEffect(() => {
    if (!isBodyChanged.current) {
      return;
    }

    onUpdate('body', debouncedBody);
  }, [debouncedBody, onUpdate]);

  return (
    <>
      {mode ? (
        <Textarea
          name="body"
          value={body}
          onChange={e => {
            setBody(e.target.value);
            isBodyChanged.current = true;
          }}
          className="h-full w-full resize-none border-none p-4 focus-visible:border-none focus-visible:outline-none "
          autoComplete="off"
        />
      ) : (
        <Markdown className="p-4">{body}</Markdown>
      )}
    </>
  );
}
