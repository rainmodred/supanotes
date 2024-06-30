import { HttpResponse, http } from 'msw';

// MSW don't work if import API_URL from @/lib/supabase
export const API_URL = import.meta.env.VITE_URL;
export const authHandlers = [
  http.post(`${API_URL}/auth/v1/token`, async ({ request }) => {
    // {"error":"invalid_grant","error_description":"Invalid login credentials"}

    try {
      const credentials = await request.json();
      console.log('credentials:', credentials);

      if (
        credentials?.email === 'test@example.com' &&
        credentials?.password === '123456'
      ) {
        return HttpResponse.json(
          {
            access_token:
              'eyJhbGciOiJIUzI1NiIsImtpZCI6IkZlVDFXQ1RJcVgzYmw5dk4iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzE5MDAwNDU3LCJpYXQiOjE3MTg5OTY4NTcsImlzcyI6Imh0dHBzOi8va2Jxa2Rod2xmamZ1d2tyeXV1aG8uc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImVjZDMxNDA5LTg1NGQtNDVhYy04ZmQ4LTI3ZjE3NWQxYjVkOCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnt9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzE4OTk2ODU3fV0sInNlc3Npb25faWQiOiJmYjIwZTIxMS1kZjdjLTQyYTktYmQ2MC04ZTBhNWViZmI2YTQiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.PvbnkkzD3nmhVhr-D0hdG2HRHOuXBm9xMxzxjg7W5Fk',
            token_type: 'bearer',
            expires_in: 3600,
            expires_at: 1719000457,
            refresh_token: '-jM0VN2JCKf4nSeGa_4Tug',
            user: {
              id: 'ecd31409-854d-45ac-8fd8-27f175d1b5d8',
              aud: 'authenticated',
              role: 'authenticated',
              email: 'test@example.com',
              email_confirmed_at: '2024-03-01T21:24:36.802983Z',
              phone: '',
              confirmed_at: '2024-03-01T21:24:36.802983Z',
              last_sign_in_at: '2024-06-21T19:07:37.650899779Z',
              app_metadata: {
                provider: 'email',
                providers: ['email'],
              },
              user_metadata: {},
              identities: [
                {
                  identity_id: '7a20dc57-902b-4e1f-95eb-4aac94106b61',
                  id: 'ecd31409-854d-45ac-8fd8-27f175d1b5d8',
                  user_id: 'ecd31409-854d-45ac-8fd8-27f175d1b5d8',
                  identity_data: {
                    email: 'test@example.com',
                    email_verified: false,
                    phone_verified: false,
                    sub: 'ecd31409-854d-45ac-8fd8-27f175d1b5d8',
                  },
                  provider: 'email',
                  last_sign_in_at: '2024-03-01T21:24:36.801009Z',
                  created_at: '2024-03-01T21:24:36.801067Z',
                  updated_at: '2024-03-01T21:24:36.801067Z',
                  email: 'test@example.com',
                },
              ],
              created_at: '2024-03-01T21:24:36.799342Z',
              updated_at: '2024-06-21T19:07:37.696158Z',
              is_anonymous: false,
            },
          },
          { status: 200 },
        );
      }
    } catch (error: any) {
      return HttpResponse.json(
        {
          error: 'invalid_grant',
          error_description: 'Invalid login credentials',
        },
        { status: 400 },
      );
    }
  }),
];
