"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '@/lib/api';

function ResetPasswordForm() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (!token) {
            setError('Token de recuperación no encontrado. Solicitá un nuevo enlace.');
            return;
        }

        setLoading(true);

        try {
            await resetPassword(token, newPassword);
            setSuccess(true);
            setTimeout(() => router.push('/login'), 3000);
        } catch (err: any) {
            setError(err.message || 'Error al restablecer contraseña');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="border rounded-2xl shadow-xl p-8 text-center" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(212,163,115,0.2)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
                    ⚠️
                </div>
                <h1 className="text-2xl font-title font-bold mb-2" style={{ color: '#1a1a1a' }}>
                    Enlace inválido
                </h1>
                <p className="text-sm mb-6" style={{ color: '#888888' }}>
                    El enlace de recuperación no es válido o ha expirado. Por favor, solicitá uno nuevo.
                </p>
                <Link
                    href="/forgot-password"
                    className="inline-block px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: '#D4A373' }}
                >
                    Solicitar nuevo enlace
                </Link>
            </div>
        );
    }

    return (
        <div className="border rounded-2xl shadow-xl p-8" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(212,163,115,0.2)' }}>
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl" style={{ backgroundColor: 'rgba(212,163,115,0.1)' }}>
                    🔒
                </div>
                <h1 className="text-3xl font-title font-bold mb-2" style={{ color: '#1a1a1a' }}>
                    Nueva Contraseña
                </h1>
                <p className="font-text" style={{ color: '#888888' }}>
                    Elegí una nueva contraseña segura para tu cuenta.
                </p>
            </div>

            {success ? (
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
                        ✅
                    </div>
                    <div>
                        <p className="font-bold text-lg mb-2" style={{ color: '#1a1a1a' }}>¡Contraseña actualizada!</p>
                        <p className="text-sm" style={{ color: '#888888' }}>
                            Tu contraseña se ha restablecido correctamente. Serás redirigido al login en unos segundos...
                        </p>
                    </div>
                    <Link
                        href="/login"
                        className="inline-block px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: '#D4A373' }}
                    >
                        Iniciar Sesión
                    </Link>
                </div>
            ) : (
                <>
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-text">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-semibold mb-1 font-text" style={{ color: '#333333' }}>
                                Nueva Contraseña
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D4A373] focus:border-transparent font-text"
                                style={{ borderColor: 'rgba(212,163,115,0.3)', backgroundColor: '#faf7f2' }}
                                placeholder="••••••••"
                            />
                            <ul className="mt-2 space-y-1">
                                <li className="text-[10px] flex items-center gap-1" style={{ color: '#999999' }}>
                                    • Mínimo 8 caracteres
                                </li>
                                <li className="text-[10px] flex items-center gap-1" style={{ color: '#999999' }}>
                                    • Al menos una mayúscula
                                </li>
                                <li className="text-[10px] flex items-center gap-1" style={{ color: '#999999' }}>
                                    • Al menos un número
                                </li>
                                <li className="text-[10px] flex items-center gap-1" style={{ color: '#999999' }}>
                                    • Al menos un carácter especial (@$!%*?&)
                                </li>
                            </ul>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-1 font-text" style={{ color: '#333333' }}>
                                Confirmar Contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D4A373] focus:border-transparent font-text"
                                style={{ borderColor: 'rgba(212,163,115,0.3)', backgroundColor: '#faf7f2' }}
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg font-semibold font-text text-white transition-all hover:opacity-90 disabled:opacity-50"
                            style={{ backgroundColor: '#D4A373' }}
                        >
                            {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/login" className="text-sm hover:underline font-text" style={{ color: '#D4A373' }}>
                            ← Volver a Iniciar Sesión
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-20" style={{ backgroundColor: '#faf7f2' }}>
            <div className="max-w-md w-full">
                <Suspense fallback={<div className="text-center" style={{ color: '#888888' }}>Cargando...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
