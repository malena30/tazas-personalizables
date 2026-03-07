"use client";

import { useState, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || '/';
    const router = useRouter();
    const { login, register, user, loading: authLoading } = useAuth();

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (!authLoading && user) {
            router.push(redirectPath);
        }
    }, [user, authLoading, router, redirectPath]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(username, password);
            } else {
                if (!email) {
                    setError('El email es requerido para registrarse');
                    setLoading(false);
                    return;
                }
                await register(username, email, password);
            }
            router.push(redirectPath);
        } catch (err: any) {
            setError(err.message || 'Error al procesar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#faf7f2] border border-[#e5ddd3] rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-title font-bold mb-2" style={{ color: '#1a1a1a' }}>
                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h1>
                <p className="font-text" style={{ color: '#888888' }}>
                    {isLogin ? 'Ingresá a tu cuenta' : 'Registrate para empezar'}
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-text">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                    <label htmlFor="username" className="block text-sm font-semibold mb-1 font-text" style={{ color: '#333333' }}>
                        Usuario
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A373] focus:border-transparent font-text"
                        style={{ borderColor: 'rgba(212,163,115,0.3)', backgroundColor: '#ffffff', color: '#1a1a1a' }}
                        placeholder="tunombre"
                    />
                </div>

                {/* Email (solo para registro) */}
                {!isLogin && (
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold mb-1 font-text" style={{ color: '#333333' }}>
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A373] focus:border-transparent font-text"
                            style={{ borderColor: 'rgba(212,163,115,0.3)', backgroundColor: '#ffffff', color: '#1a1a1a' }}
                            placeholder="tu@email.com"
                        />
                    </div>
                )}

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold mb-1 font-text" style={{ color: '#333333' }}>
                        Contraseña
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-[#D4A373] focus:border-transparent font-text"
                            style={{ borderColor: 'rgba(212,163,115,0.3)', backgroundColor: '#ffffff', color: '#1a1a1a' }}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                            tabIndex={-1}
                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {!isLogin && (
                        <ul className="mt-3 space-y-1.5">
                            {[
                                { label: 'Mínimo 8 caracteres', ok: password.length >= 8 },
                                { label: 'Al menos una mayúscula', ok: /[A-Z]/.test(password) },
                                { label: 'Al menos un número', ok: /[0-9]/.test(password) },
                                { label: 'Al menos un símbolo (. , ! @ # $ % etc)', ok: /[^a-zA-Z0-9]/.test(password) },
                            ].map(({ label, ok }) => (
                                <li key={label} className="flex items-center gap-2 text-[11px] transition-colors duration-200"
                                    style={{ color: ok ? '#22c55e' : '#999999' }}>
                                    <span className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black border transition-all duration-200"
                                        style={{
                                            borderColor: ok ? '#22c55e' : '#cccccc',
                                            backgroundColor: ok ? '#22c55e' : 'transparent',
                                            color: ok ? 'white' : '#cccccc'
                                        }}>
                                        {ok ? '✓' : '·'}
                                    </span>
                                    {label}
                                </li>
                            ))}
                        </ul>
                    )}

                </div>

                {/* Forgot Password Link */}
                {isLogin && (
                    <div className="text-right">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-[#D4A373] hover:underline font-text"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-semibold font-text transition-all ${loading
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : 'bg-[#1a1a1a] text-white hover:opacity-90'
                        }`}
                >
                    {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                </button>
            </form>

            {/* Toggle Login/Register */}
            <div className="mt-6 text-center">
                <button
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                    }}
                    className="text-sm hover:underline font-text" style={{ color: '#888888' }}
                >
                    {isLogin ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Iniciá sesión'}
                </button>
            </div>

            {/* Back to Home */}
            <div className="mt-4 text-center">
                <Link href="/" className="text-sm hover:underline font-text" style={{ color: '#aaaaaa' }}>
                    ← Volver al inicio
                </Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4 pt-20">
            <div className="max-w-md w-full">
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
                        <p className="text-[var(--foreground)]/50 font-medium animate-pulse">Comprobando sesión...</p>
                    </div>
                }>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
