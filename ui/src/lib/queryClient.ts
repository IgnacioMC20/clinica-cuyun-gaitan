import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutos
            gcTime: 10 * 60 * 1000, // 10 minutos (renamed from cacheTime)
            retry: 3,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 1,
        },
    },
});
