import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, type LoginRequest, type SignupRequest, type User } from '@/lib/api/auth';
import { toast } from 'sonner';

export function useMe() {
    return useQuery({
        queryKey: ['auth', 'me'],
        queryFn: authApi.getMe,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
            toast.success('Sesión iniciada exitosamente');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Error al iniciar sesión';
            toast.error(message);
        }
    });
}

export function useSignup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.signup,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
            toast.success('Cuenta creada exitosamente');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Error al crear la cuenta';
            toast.error(message);
        }
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
          queryClient.clear(); // Clear all cached data
          toast.success('Sesión cerrada exitosamente');
        },
        onError: (error: any) => {
          const message = error.response?.data?.message || 'Error al cerrar sesión';
          toast.error(message);
        }
    });
}

// Helper hook to get current user data
export function useCurrentUser(): User | null {
    const { data } = useMe();
    return data?.user || null;
}

// Helper hook to check if user is authenticated
export function useIsAuthenticated(): boolean {
    const { data, isLoading } = useMe();
    return !isLoading && !!data?.user;
}

// Helper hook to check if user has specific role
export function useHasRole(role: string): boolean {
    const user = useCurrentUser();
    return user?.role === role;
}

// Helper hook to check if user has any of the specified roles
export function useHasAnyRole(roles: string[]): boolean {
    const user = useCurrentUser();
    return user ? roles.includes(user.role) : false;
}