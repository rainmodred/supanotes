import { MultipleSelector, Option } from '@/components/ui/multiple-selector';
import { tagsQuery } from '@/features/tags/api/get-tags';
import { ITag } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface Props {
  tags: ITag[];
  onTagChange: (
    data:
      | { intent: 'create-tag'; tag: Omit<ITag, 'id'> }
      | { intent: 'select-tag' | 'unselect-tag'; tag: ITag },
  ) => void;
}

function transformTags(tags: ITag[]) {
  return [
    ...(tags.map(({ id, name }) => ({
      id,
      label: name,
      value: name,
    })) ?? []),
  ];
}

export function TagSelector({ tags, onTagChange }: Props) {
  const { data: allTags } = useQuery({ ...tagsQuery });
  const [value, setValue] = useState<Option[]>(transformTags(tags));

  return (
    <div className="flex-grow">
      <MultipleSelector
        value={value}
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
          onTagChange({ intent: 'create-tag', tag: { name: value } });
        }}
        onSelect={option => {
          if (typeof option.id === 'string') {
            onTagChange({
              intent: 'select-tag',
              tag: { id: option.id, name: option.value },
            });
          }
        }}
        onUnselect={option => {
          if (typeof option.id === 'string') {
            onTagChange({
              intent: 'unselect-tag',
              tag: { id: option.id, name: option.value },
            });
          }
        }}
        placeholder="Tags..."
        creatable
      />
    </div>
  );
}
