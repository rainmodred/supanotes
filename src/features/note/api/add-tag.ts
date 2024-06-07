import { supabase } from '@/lib/supabase';

export async function addTag(note_id: string, tag_id: string) {
  const { data, error } = await supabase
    .from('notes_tags')
    .insert({ note_id, tag_id });
  if (error) {
    throw error;
  }

  return data;
}
