import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { supabase } from './supabase';
import { Session } from '@supabase/supabase-js';

export async function signUpNewUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { data, error };
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

interface AuthContextType {
  session: Session | null;
  setSession: (value: Session) => void;
  logout: () => void;
  demoLogout: () => void;
  isDemo: boolean;
}
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const demoLogout = useCallback(async () => {
    if (session?.user.email === 'demo@example.com') {
      await supabase.auth.signOut();
    }
  }, [session?.user.email]);

  const isDemo = session?.user.email === 'demo@example.com';

  return (
    <AuthContext.Provider
      value={{ session, setSession, logout, demoLogout, isDemo }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
}
