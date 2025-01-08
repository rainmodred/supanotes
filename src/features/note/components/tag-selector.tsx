import { MultipleSelector, Option } from '@/components/ui/multiple-selector';
import { useTags } from '@/features/tags/api/get-tags';
import { ITag } from '@/lib/types';
import { useState } from 'react';
import { useAddTag, useCreateAddTag } from '../api/add-tag';
import { useRemoveTag } from '../api/remove-tag';
import { useAuth } from '@/lib/auth';

interface Props {
  id: string;
  noteTags: ITag[];
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

export function TagSelector({ id, noteTags }: Props) {
  const { data: tags } = useTags();
  const [value, setValue] = useState<Option[]>(transformTags(noteTags));

  const { session } = useAuth();

  const addTagMutation = useAddTag();
  const removeTagMutation = useRemoveTag();
  const createAddTagMutation = useCreateAddTag();

  return (
    <div>
      <MultipleSelector
        value={value}
        options={
          tags?.map(({ id, name }) => {
            return {
              id,
              label: name,
              value: name,
            };
          }) ?? []
        }
        onChange={setValue}
        onCreate={async option => {
          createAddTagMutation.mutate({
            noteId: id,
            userId: session!.user.id,
            name: option.value,
          });
        }}
        onSelect={option => {
          if (typeof option.id === 'string') {
            addTagMutation.mutate({
              noteId: id,
              tagId: option.id,
              name: option.value,
            });
          }
        }}
        onUnselect={option => {
          if (typeof option.id === 'string') {
            removeTagMutation.mutate({
              noteId: id,
              tagId: option.id,
            });
          }
        }}
        placeholder="Tags..."
        creatable
      />
    </div>
  );
}
