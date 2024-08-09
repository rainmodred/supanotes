import { useDebounce } from '@/components/ui/multiple-selector';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';

interface Props {
  initialBody: string;
  mode: 'edit' | 'read';
  onUpdate: (field: 'body', value: string) => void;
}

export function EditorBody({ initialBody, mode, onUpdate }: Props) {
  const [body, setBody] = useState(initialBody);
  const debouncedBody = useDebounce(body, 500);
  const isBodyChanged = useRef(false);

  const onChange = React.useCallback((val: string) => {
    setBody(val);
    isBodyChanged.current = true;
  }, []);

  useEffect(() => {
    if (!isBodyChanged.current) {
      return;
    }

    onUpdate('body', debouncedBody);
  }, [debouncedBody, onUpdate]);
  console.log('mode', mode, body);

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
          className="prose h-full dark:prose-invert"
          data-testid="codemirror"
        />
      ) : (
        <Markdown className="prose p-4 dark:prose-invert">{body}</Markdown>
      )}
    </div>
  );
}
