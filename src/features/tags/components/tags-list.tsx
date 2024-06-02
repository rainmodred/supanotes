import { Button } from '@/components/ui/button';
import { ITag } from '@/lib/types';
import { Hash } from 'lucide-react';

interface Props {
  tags: ITag[];
  selectedTagName: string;
  onTagSelect: (tagName: string) => void;
}

export function TagsList({ tags, selectedTagName, onTagSelect }: Props) {
  return (
    <>
      {tags.map(tag => {
        return (
          <Button
            key={tag.id}
            variant="outline"
            className={`flex w-full justify-start gap-2 border-none ${selectedTagName === tag.name ? 'bg-slate-200' : ''}`}
            onClick={() => onTagSelect(tag.name)}
          >
            <Hash size="16px" />
            {tag.name}
          </Button>
        );
      })}
    </>
  );
}
