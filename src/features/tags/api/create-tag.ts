import { supabase } from '@/lib/supabase';
import { ITag } from '@/lib/types';

export async function createTag(name: string, userId: string) {
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
