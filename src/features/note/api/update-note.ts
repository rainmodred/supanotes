import { supabase } from '@/lib/supabase';
import { INote } from '@/lib/types';

export async function updateNote({
  noteId,
  title,
  body,
  userId,
}: {
  noteId: string;
  title: string;
  body: string;
  userId: string;
}) {
  const { data, error } = await supabase
    .from('notes')
    .update({ id: noteId, title, body, user_id: userId })
    .eq('id', noteId)
    .select()
    .returns<INote[]>();
  if (error) {
    throw error;
  }
  return data.at(0)!;
}
