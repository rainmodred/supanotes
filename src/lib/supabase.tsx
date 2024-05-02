import { createClient } from '@supabase/supabase-js';

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

async function signInWithEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
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
}: {
  title: string;
  body: string;
  user_id: string;
}) {
  try {
    const { data } = await supabase
      .from('notes')
      .insert([{ title, body, user_id }])
      .select();
    return data.at(0);
  } catch (error) {
    console.log('error', error);
  }
}

async function updateNote({
  id,
  title,
  body,
  user_id,
}: {
  id: number;
  title: string;
  body: string;
  user_id: string;
}) {
  try {
    const { data } = await supabase
      .from('notes')
      .update({ id, title, body, user_id })
      .eq('id', id)
      .select();
    return data.at(0);
  } catch (error) {
    console.log('error', error);
  }
}

async function deleteNote(noteId: number) {
  try {
    return await supabase.from('notes').delete().eq('id', noteId);
  } catch (error) {
    console.log('error', error);
  }
}

async function fetchTags() {
  try {
    const { data } = await supabase.from('tags').select('*');
    console.log('fetchTags', data);
    return data;
  } catch (error) {
    console.log('error', error);
  }
}

async function createTag(name: string, userId: string) {
  try {
    const { data } = await supabase
      .from('tags')
      .insert([{ name, user_id: userId }]);
    console.log('createTag', data);
  } catch (error) {
    console.log('error', error);
  }
}

async function fetchNotes() {
  try {
    const { data } = await supabase.from('notes').select(`id, title`);
    console.log('fetchNotes', data);
    return data;
  } catch (error) {
    console.log('error', error);
  }
}

async function fetchNote(noteId: string) {
  try {
    const { data } = await supabase.from('notes').select().eq('id', noteId);
    console.log('fetchNote', data);
    return data.at(0);
  } catch (error) {
    console.log('error', error);
  }
}

export {
  supabase,
  signUpNewUser,
  signInWithEmail,
  fetchTags,
  fetchNotes,
  fetchNote,
  createTag,
  createNote,
  updateNote,
  deleteNote,
};
