import { supabase } from '@/lib/supabase';

export async function deleteTag(id: string) {
  const { error } = await supabase.from('tags').delete().eq('id', id);
  if (error) {
    throw error;
  }
  return;
}
