import { supabase } from '@/lib/supabase';
import { INote } from '@/lib/types';

export async function createNote({
  title,
  userId,
}: {
  title: string;
  userId: string;
}) {
  const { data, error } = await supabase
    .from('notes')
    .insert([{ title, user_id: userId }])
    .select()
    .returns<INote[]>();
  if (error) {
    throw error;
  }
  return data.at(0)!;
}
