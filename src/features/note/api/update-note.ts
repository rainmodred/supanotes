import { supabase } from '@/lib/supabase';
import { INote } from '@/lib/types';

export async function updateNote({
  noteId,
  title,
  body,
}: {
  noteId: string;
  title: string;
  body: string;
}) {
  const { data, error } = await supabase
    .from('notes')
    .update({ id: noteId, title, body })
    .eq('id', noteId)
    .select()
    .returns<INote[]>();
  if (error) {
    throw error;
  }
  return data.at(0)!;
}
