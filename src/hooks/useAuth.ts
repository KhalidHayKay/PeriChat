// hooks/useAuth.ts - Focus on auth operations only
import { useState } from 'react';

import { login, register } from '../actions/auth';

const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (
        credentials: SignUpCredentials
    ): Promise<{ success: boolean; data?: any }> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await register(credentials);
            return { success: true, data };
        } catch (err: any) {
            setError(err.message);
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (
        email: string,
        password: string
    ): Promise<{ success: boolean; data?: any }> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await login(email, password);
            return { success: true, data };
        } catch (err: any) {
            setError(err.message);
            return { success: false };
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
