import { useDebounce } from '@/components/ui/multiple-selector';
import { useCallback, useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { useUpdateNote } from '../api/update-note';

interface Props {
  id: string;
  initialBody: string;
  mode: 'edit' | 'read';
}

export function EditorBody({ id, initialBody, mode }: Props) {
  const [body, setBody] = useState(initialBody);
  const debouncedBody = useDebounce(body, 500);
  const isBodyChanged = useRef(false);

  const { mutate } = useUpdateNote();

  const onChange = useCallback((val: string) => {
    setBody(val);
    isBodyChanged.current = true;
  }, []);

  useEffect(() => {
    if (!isBodyChanged.current) {
      return;
    }

    // onUpdate('body', debouncedBody);
    mutate({ id, body: debouncedBody });
  }, [debouncedBody, mutate, id]);

  return (
    <div className="flex-grow overflow-auto">
      {mode === 'edit' ? (
        <CodeMirror
          basicSetup={{ lineNumbers: false, foldGutter: false }}
          value={body}
          height="100%"
          extensions={[markdown({ base: markdownLanguage })]}
          onChange={onChange}
          theme={'none'}
          className="prose h-full max-w-full dark:prose-invert"
          data-testid="codemirror"
        />
      ) : (
        <Markdown className="prose p-4 dark:prose-invert">{body}</Markdown>
      )}
    </div>
  );
}
