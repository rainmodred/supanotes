import { supabase } from '@/lib/supabase';

export async function removeTag(noteId: string, tagId: string) {
  const { error } = await supabase
    .from('notes_tags')
    .delete()
    .eq('note_id', noteId)
    .eq('tag_id', tagId);
  if (error) {
    throw error;
  }
}
