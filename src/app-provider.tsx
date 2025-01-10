import { AuthProvider } from './lib/auth';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/react-query';
import { ThemeProvider } from './components/theme-provider';
import { Session } from '@supabase/supabase-js';

export function AppProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession?: Session;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialSession={initialSession}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          {children}
        </ThemeProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
