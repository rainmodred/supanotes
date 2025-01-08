import { supabase } from '@/lib/supabase';
import { ITag } from '@/lib/types';
import { useSuspenseQuery } from '@tanstack/react-query';

export const tagsQuery = {
  queryKey: ['tags'],
  queryFn: () => fetchTags(),
};

export function useTags() {
  return useSuspenseQuery({ ...tagsQuery });
}

async function fetchTags() {
  const { data, error } = await supabase
    .from('tags')
    .select(`id, name`)
    .returns<ITag[]>();
  if (error) {
    throw error;
  }
  return data;
}
