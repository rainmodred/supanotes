import { supabase } from '@/lib/supabase';

export async function removeTag(note_id: string, tag_id: string) {
  const { error } = await supabase
    .from('notes_tags')
    .delete()
    .eq('note_id', note_id)
    .eq('tag_id', tag_id);
  if (error) {
    throw error;
  }
}
