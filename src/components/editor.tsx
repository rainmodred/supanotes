import Markdown from 'react-markdown';
import { Input } from './ui/input';
import { Pencil, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { Textarea } from './ui/textarea';

export function Editor() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'read' | 'edit'>('edit');
  const [title, setTitle] = useState();

  function changeMode() {
    setMode(mode === 'edit' ? 'read' : 'edit');
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex ">
        <Input
          placeholder="title"
          value={title}
          // onChange={e => setTitle(e.target.value)}
        />
        <Button size="icon" variant="outline" onClick={changeMode}>
          {mode === 'edit' && <Pencil />}
          {mode === 'read' && <Eye />}
        </Button>
      </div>
      <div className="h-full ">
        {mode === 'edit' && (
          <Textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="h-full w-full resize-none border-none p-4 focus-visible:border-none focus-visible:outline-none "
            autoComplete="off"
          ></Textarea>
        )}
        {mode === 'read' && <Markdown className="p-4">{text}</Markdown>}
      </div>
    </div>
  );
}
