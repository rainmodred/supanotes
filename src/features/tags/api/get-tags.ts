import { supabase } from '@/lib/supabase';
import { ITag } from '@/lib/types';

export const tagsQuery = {
  queryKey: ['tags'],
  queryFn: () => fetchTags(),
};

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
