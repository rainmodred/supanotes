import { supabase } from '@/lib/supabase';
import { ITag } from '@/lib/types';

export async function updateTag({
  id,
  name,
  user_id,
}: {
  id: string;
  name: string;
  user_id: string;
}) {
  const { data, error } = await supabase
    .from('tags')
    .update({ id, name, user_id })
    .eq('id', id)
    .select()
    .returns<ITag[]>();
  if (error) {
    throw error;
  }
  return data.at(0)!;
}
