import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User;
    login: (data: any) => void;
    logout: () => void;
    getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const isTokenExpired = (): boolean => {
        const tokenMeta = localStorage.getItem('tokenMeta');
        if (!tokenMeta) return true;

        try {
            // const { expiration } = JSON.parse(tokenMeta);
            // return new Date() > new Date(expiration);
            return false;
        } catch {
            return true;
        }
    };

    const userData = localStorage.getItem('user');

    const getInitialAuthState = () => {
        const token = localStorage.getItem('authToken');
        return !!(token && userData) && !isTokenExpired();
    };

    const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuthState);
    const [user, setUser] = useState(JSON.parse(userData || 'null'));

    const login = (data: any) => {
        if (data && data.token) {
            localStorage.setItem('authToken', data.token.access);
            localStorage.setItem(
                'tokenMeta',
                JSON.stringify({
                    type: data.token.type,
                    expiration: data.token.expiration,
                })
            );
            localStorage.setItem('user', JSON.stringify(data.user));

            setUser(data.user);
            setIsAuthenticated(true);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenMeta');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
    };

    const getToken = () => localStorage.getItem('authToken');

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                login,
                logout,
                getToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
