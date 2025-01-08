import { supabase } from '@/lib/supabase';
import { ITag } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsQuery } from './get-tags';

export async function createTag({
  name,
  userId,
}: {
  name: string;
  userId: string;
}) {
  const { data, error } = await supabase
    .from('tags')
    .insert({ name, user_id: userId })
    .select(`id, name`)
    .returns<ITag[]>();

  if (error) {
    throw error;
  }
  return data.at(0)!;
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTag,
    onSuccess: newTag => {
      queryClient.setQueryData<ITag[]>(tagsQuery.queryKey, oldData => {
        return [newTag, ...(oldData || [])];
      });
    },
  });
}
