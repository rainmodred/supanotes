import { Input } from '@/components/ui/input';
import { useDebounce } from '@/components/ui/multiple-selector';
import { useEffect, useRef, useState } from 'react';
import { useUpdateNote } from '../api/update-note';

interface Props {
  id: string;
  initialTile: string;
}

export function Title({ id, initialTile }: Props) {
  const [title, setTitle] = useState(initialTile);
  const debouncedTitle = useDebounce(title, 500);
  const isTitleChanged = useRef(false);

  const { mutate } = useUpdateNote();

  useEffect(() => {
    if (!isTitleChanged.current) {
      return;
    }

    mutate({ id, title: debouncedTitle });
  }, [debouncedTitle, mutate, id]);

  return (
    <Input
      name="title"
      placeholder="title"
      value={title}
      onChange={e => {
        setTitle(e.target.value);
        isTitleChanged.current = true;
      }}
    />
  );
}
