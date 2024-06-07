import { supabase } from '@/lib/supabase';
import { INote } from '@/lib/types';

export async function createNote({
  title,
  body,
  user_id,
}: Omit<INote, 'id' | 'created_at' | 'updated_at'> & { user_id: string }) {
  const { data, error } = await supabase
    .from('notes')
    .insert([{ title, body, user_id }])
    .select()
    .returns<INote[]>();
  if (error) {
    throw error;
  }
  return data.at(0)!;
}
