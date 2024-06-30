import { supabase } from '@/lib/supabase';
import { ITag } from '@/lib/types';

export async function updateTag({ id, name }: { id: string; name: string }) {
  const { data, error } = await supabase
    .from('tags')
    .update({ id, name })
    .eq('id', id)
    .select()
    .returns<ITag[]>();
  if (error) {
    throw error;
  }
  return data.at(0)!;
}
