import { supabase } from '@/lib/supabase';

export async function deleteNote(noteId: string) {
  const { error } = await supabase.from('notes').delete().eq('id', noteId);
  if (error) {
    throw error;
  }
}
