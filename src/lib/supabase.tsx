import { createClient } from '@supabase/supabase-js';
import { INote, ITag } from './types';

const url = import.meta.env.VITE_URL;
const anonKey = import.meta.env.VITE_ANON_KEY;
if (!url || !anonKey) {
  throw new Error('Invalid env');
}
const supabase = createClient(url, anonKey);

async function signUpNewUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  console.log('signup', data, error);
  return { data, error };
}

async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log('signIn', data, error);
  return { data, error };
}

async function createNote({
  title,
  body,
  user_id,
}: Omit<INote, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data } = await supabase
      .from('notes')
      .insert([{ title, body, user_id }])
      .select()
      .returns<INote[]>();
    return data?.at(0);
  } catch (error) {
    console.log('error', error);
  }
}

async function updateNote({
  id,
  title,
  body,
  user_id,
}: Omit<INote, 'created_at' | 'updated_at'>) {
  try {
    const { data } = await supabase
      .from('notes')
      .update({ id, title, body, user_id })
      .eq('id', id)
      .select()
      .returns<INote[]>();
    return data?.at(0);
  } catch (error) {
    console.log('error', error);
  }
}

async function deleteNote(noteId: string) {
  try {
    const res = supabase.from('notes').delete().eq('id', noteId);
    return res;
  } catch (error) {
    console.log('error', error);
    return { error };
  }
}

async function addTagToNote(note_id: string, tag_id: string) {
  try {
    await supabase.from('notes_tags').insert({ note_id, tag_id });

    //TODO: fixme, promise all
  } catch (error) {
    console.log('error', error);
  }
}

async function deleteTagFromNote(note_id: string, tag_id: string) {
  try {
    await supabase
      .from('notes_tags')
      .delete()
      .eq('note_id', note_id)
      .eq('tag_id', tag_id);

    //TODO: fixme, promise all
  } catch (error) {
    console.log('error', error);
  }
}

async function createTag(name: string, userId: string) {
  try {
    const { data } = await supabase
      .from('tags')
      .insert({ name, user_id: userId })
      .select(`id, name`)
      .returns<ITag[]>();
    console.log('createTag', data);
    return data?.at(0);
  } catch (error) {
    console.log('error', error);
  }
}

export {
  supabase,
  signUpNewUser,
  signInWithEmail,
  createTag,
  addTagToNote,
  deleteTagFromNote,
  createNote,
  updateNote,
  deleteNote,
};
