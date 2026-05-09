import { QueryClient } from '@tanstack/react-query';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // TODO(student): staleTime / refetchOnWindowFocus 정책을 결정하세요.
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

export const queryClient: QueryClient = createQueryClient();
