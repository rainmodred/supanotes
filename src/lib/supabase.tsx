import { createClient } from '@supabase/supabase-js';
import { Navigate } from 'react-router-dom';

const url = import.meta.env.VITE_URL;
const anonKey = import.meta.env.VITE_ANON_KEY;
if (!url || !anonKey) {
  throw new Error('Invalid env');
}
const supabase = createClient(url, anonKey);

async function signUpNewUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  console.log('signup', data, error);
  if (data) {
    return <Navigate to="/notes" />;
  }
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

export async function addNote(title: string, body: string, id: string) {
  try {
    const { data } = await supabase
      .from('notes')
      .insert([{ title, body, user_id: id }])
      .select();
    return data;
  } catch (error) {
    console.log('error', error);
  }
}
export const fetchNotes = async setState => {
  try {
    const { data } = await supabase.from('notes').select('*');
    console.log(data);
    if (setState) setState(data);
    return data;
  } catch (error) {
    console.log('error', error);
  }
};

export { supabase, signUpNewUser, signInWithEmail };
