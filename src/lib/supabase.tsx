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

async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log('signIn', data, error);
  return { data, error };
}

export { supabase, signUpNewUser, signInWithEmail };
