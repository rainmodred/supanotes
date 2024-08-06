import {
  ActionFunctionArgs,
  Form,
  Link,
  useActionData,
} from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { signInWithEmail, useAuth } from '@/lib/auth';
import { Session, User } from '@supabase/supabase-js';
import { PasswordInput } from '@/components/ui/password-input';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  const result = LoginSchema.safeParse({ email, password });
  if (!result.success) {
    return { success: false, error: result.error.flatten() };
  }

  const { data, error } = await signInWithEmail(
    result.data.email,
    result.data.password,
  );
  if (error) {
    return { success: false, error };
  }
  return { success: true, data, error };
}

export interface LoginActionData {
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

export function Login() {
  const data = useActionData() as LoginActionData;
  const emailError = data?.error?.fieldErrors?.email?.at(0);
  const passwordError = data?.error?.fieldErrors?.password?.at(0);
  const apiError = data?.error?.message;
  const { setSession } = useAuth();

  if (data?.success) {
    setSession({ ...data?.data.session, user: data?.data.user });
  }

  return (
    <div className="flex h-full items-center">
      <Card className="mx-auto min-w-96 max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post" noValidate className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  aria-invalid={!!emailError}
                  aria-describedby="emailError"
                />
                {emailError && (
                  <p
                    data-testid="emailError"
                    role="alert"
                    aria-label={emailError}
                    id="emailError"
                    className="text-xs font-medium text-destructive"
                  >
                    {emailError}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div>
                <PasswordInput
                  name="password"
                  id="password"
                  aria-invalid={!!passwordError}
                  aria-describedby="passwordError"
                />
                {passwordError && (
                  <p
                    data-testid="passwordError"
                    role="alert"
                    aria-label={passwordError}
                    id="passwordError"
                    className="text-xs font-medium text-destructive"
                  >
                    {passwordError}
                  </p>
                )}
                {apiError && (
                  <p
                    role="alert"
                    aria-label={apiError}
                    className="text-xs font-medium text-destructive"
                  >
                    {apiError}
                  </p>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
