import { supabase } from '@/lib/supabase';

export async function addTag(noteId: string, tagId: string) {
  const { data, error } = await supabase
    .from('notes_tags')
    .insert({ note_id: noteId, tag_id: tagId });

  if (error) {
    throw error;
  }

  return data;
}
