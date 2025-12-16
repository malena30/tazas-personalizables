"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser, User } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Cargar token y usuario del localStorage al iniciar
    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem('auth_token');
            if (savedToken) {
                try {
                    // Verificar token con el backend
                    const userData = await getCurrentUser(savedToken);
                    setToken(savedToken);
                    setUser(userData);
                } catch (error) {
                    console.warn('Sesión expirada o inválida:', error);
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_user');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const data = await loginUser({ username, password });
            const accessToken = data.access_token;

            // Obtener datos del usuario
            const userData = await getCurrentUser(accessToken);

            setUser(userData);
            setToken(accessToken);
            localStorage.setItem('auth_token', accessToken);
            localStorage.setItem('auth_user', JSON.stringify(userData));
        } catch (error: any) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            await registerUser({ username, email, password });
            // Auto login después del registro
            await login(username, password);
        } catch (error: any) {
            console.error('Register error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
