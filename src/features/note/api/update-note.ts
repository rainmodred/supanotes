import { supabase } from '@/lib/supabase';
import { INote } from '@/lib/types';

export async function updateNote({
  note_id,
  title,
  body,
  user_id,
}: {
  note_id: string;
  title: string;
  body: string;
  user_id: string;
}) {
  const { data, error } = await supabase
    .from('notes')
    .update({ id: note_id, title, body, user_id })
    .eq('id', note_id)
    .select()
    .returns<INote[]>();
  if (error) {
    throw error;
  }
  return data.at(0)!;
}
