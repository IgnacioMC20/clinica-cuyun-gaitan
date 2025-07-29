import apiClient from './client';

export interface User {
    id: string;
    email: string;
    role: 'admin' | 'doctor' | 'nurse' | 'assistant';
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    role?: 'admin' | 'doctor' | 'nurse' | 'assistant';
}

export interface AuthResponse {
    message: string;
    user?: User;
}

export interface MeResponse {
    user: User;
}

export const authApi = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    },

    signup: async (userData: SignupRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/signup', userData);
        return response.data;
    },

    logout: async (): Promise<{ message: string }> => {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    },

    getMe: async (): Promise<MeResponse> => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    }
};

// Legacy exports for backward compatibility
export const login = authApi.login;
export const signup = authApi.signup;
export const logout = authApi.logout;
export const getMe = authApi.getMe;