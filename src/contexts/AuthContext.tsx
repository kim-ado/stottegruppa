import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthContextType } from '../types/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/me', {
                    credentials: 'include',
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                }
            } catch (err) {
                console.error('Auth check failed:', err);
            }
        };
        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const userData = await response.json();
            setUser(userData);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (username: string, email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, email, password }),
            });
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            const userData = await response.json();
            setUser(userData);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Registration failed';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            setUser(null);
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
