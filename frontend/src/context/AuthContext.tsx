"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    username: string;
    email: string;
}

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
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('auth_user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        try {
            // TODO: Llamar al backend cuando esté implementado
            // Por ahora, simulamos el login
            const mockUser: User = {
                id: '1',
                username: username,
                email: `${username}@example.com`,
            };
            const mockToken = 'mock-jwt-token-' + Date.now();

            setUser(mockUser);
            setToken(mockToken);
            localStorage.setItem('auth_token', mockToken);
            localStorage.setItem('auth_user', JSON.stringify(mockUser));
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Error al iniciar sesión');
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            // TODO: Llamar al backend cuando esté implementado
            // Por ahora, simulamos el registro
            const mockUser: User = {
                id: '1',
                username: username,
                email: email,
            };
            const mockToken = 'mock-jwt-token-' + Date.now();

            setUser(mockUser);
            setToken(mockToken);
            localStorage.setItem('auth_token', mockToken);
            localStorage.setItem('auth_user', JSON.stringify(mockUser));
        } catch (error) {
            console.error('Register error:', error);
            throw new Error('Error al registrarse');
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
