import { supabase } from '@/lib/supabase';
import { ITag } from '@/lib/types';

export const tagsQuery = {
  queryKey: ['tags'],
  queryFn: () => fetchTags(),
};

async function fetchTags() {
  try {
    const { data } = await supabase
      .from('tags')
      .select(`id, name`)
      .returns<ITag[]>();
    console.log('fetchTags', data);
    return data;
  } catch (error) {
    console.log('error', error);
  }
}
