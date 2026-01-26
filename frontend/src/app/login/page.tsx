"use client";

import { useState, Suspense } from 'react';
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

    const { login, register } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || '/customizer';

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
        <div className="bg-[var(--accent)] border border-[var(--border)] rounded-lg shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-title font-bold text-[var(--foreground)] mb-2">
                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h1>
                <p className="text-[var(--foreground)] opacity-70 font-text">
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
                    <label htmlFor="username" className="block text-sm font-semibold text-[var(--foreground)] mb-1 font-text">
                        Usuario
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--background)] text-[var(--foreground)] font-text"
                        placeholder="tunombre"
                    />
                </div>

                {/* Email (solo para registro) */}
                {!isLogin && (
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-[var(--foreground)] mb-1 font-text">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--background)] text-[var(--foreground)] font-text"
                            placeholder="tu@email.com"
                        />
                    </div>
                )}

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-[var(--foreground)] mb-1 font-text">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--background)] text-[var(--foreground)] font-text"
                        placeholder="••••••••"
                    />
                    {!isLogin && (
                        <ul className="mt-2 space-y-1">
                            <li className="text-[10px] text-[var(--foreground)] opacity-60 flex items-center gap-1">
                                • Mínimo 8 caracteres
                            </li>
                            <li className="text-[10px] text-[var(--foreground)] opacity-60 flex items-center gap-1">
                                • Al menos una mayúscula
                            </li>
                            <li className="text-[10px] text-[var(--foreground)] opacity-60 flex items-center gap-1">
                                • Al menos un número
                            </li>
                            <li className="text-[10px] text-[var(--foreground)] opacity-60 flex items-center gap-1">
                                • Al menos un carácter especial (@$!%*?&)
                            </li>
                        </ul>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-semibold font-text transition-all ${loading
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : 'bg-[var(--foreground)] text-[var(--background)] hover:opacity-90'
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
                    className="text-sm text-[var(--foreground)] opacity-80 hover:opacity-100 hover:underline font-text"
                >
                    {isLogin ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Iniciá sesión'}
                </button>
            </div>

            {/* Back to Home */}
            <div className="mt-4 text-center">
                <Link href="/" className="text-sm text-[var(--foreground)] opacity-70 hover:opacity-100 hover:underline font-text">
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
                <Suspense fallback={<div className="text-center text-[var(--foreground)]">Cargando...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
