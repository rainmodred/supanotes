import { Session, User } from '@supabase/supabase-js';
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export interface ActionData {
  success: boolean;
  data: {
    session: Omit<Session, 'user'>;
    user: User;
  };
  error: z.typeToFlattenedError<
    {
      email: string;
      password: string;
    },
    string
  >;
}
