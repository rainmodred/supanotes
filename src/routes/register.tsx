import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ActionFunctionArgs,
  Form,
  Link,
  useActionData,
} from 'react-router-dom';
import { LoginActionData, LoginSchema } from './login';
import { useAuth } from '@/components/auth-provider';
import { signUpNewUser } from '@/lib/supabase';
import { PasswordInput } from '@/components/ui/password-input';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  const result = LoginSchema.safeParse({ email, password });
  if (!result.success) {
    return { success: false, error: result.error.flatten() };
  }

  const { data, error } = await signUpNewUser(
    result?.data?.email,
    result?.data?.password,
  );
  if (error) {
    return { success: false, error };
  }
  return { success: true, data, error };
}

export function Register() {
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
          <CardTitle className="text-xl">Sign Up</CardTitle>
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
                  placeholder="m@example.com"
                />
                {emailError && (
                  <p className="text-xs font-medium text-destructive">
                    {emailError}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div>
                <PasswordInput name="password" id="password" />
                {passwordError && (
                  <p className="text-xs font-medium text-destructive">
                    {passwordError}
                  </p>
                )}
                {apiError && (
                  <p className="text-xs font-medium text-destructive">
                    {apiError}
                  </p>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
