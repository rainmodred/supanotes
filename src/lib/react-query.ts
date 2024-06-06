import { DefaultOptions, QueryClient } from '@tanstack/react-query';

export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: false,
    gcTime: 1000 * 60 * 60, //60min
  },
} satisfies DefaultOptions;

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});
