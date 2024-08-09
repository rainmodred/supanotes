import { Input } from '@/components/ui/input';
import { useDebounce } from '@/components/ui/multiple-selector';
import { useEffect, useRef, useState } from 'react';

interface Props {
  initialTile: string;
  onUpdate: (field: 'title', value: string) => void;
}
export function Title({ initialTile, onUpdate }: Props) {
  const [title, setTitle] = useState(initialTile);
  const debouncedTitle = useDebounce(title, 500);
  const isTitleChanged = useRef(false);

  useEffect(() => {
    if (!isTitleChanged.current) {
      return;
    }

    onUpdate('title', debouncedTitle);
  }, [debouncedTitle, onUpdate]);

  return (
    <Input
      name="title"
      placeholder="title"
      value={title}
      onChange={e => {
        setTitle(e.target.value);
        isTitleChanged.current = true;
      }}
      //prevent form submit with delete intent
      onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
    />
  );
}
