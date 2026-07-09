import { useState } from 'react';

import type { AuthResponse } from '@/actions/response-types';
import { login, register } from '../actions/auth';

const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (
        credentials: SignUpCredentials
    ): Promise<{ success: boolean; data: AuthResponse | null }> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await register(credentials);
            return { success: true, data };
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Couldn't process request"
            );
            return { success: false, data: null };
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (
        email: string,
        password: string
    ): Promise<{ success: boolean; data: AuthResponse | null }> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await login(email, password);
            return { success: true, data };
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Couldn't process request"
            );
            return { success: false, data: null };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        handleRegister,
        handleLogin,
    };
};

export default useAuth;
