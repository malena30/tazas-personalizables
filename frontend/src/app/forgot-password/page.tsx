"use client";

import { useState } from 'react';
import Link from 'next/link';
import { requestPasswordReset } from '@/lib/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await requestPasswordReset(email);
            setSent(true);
        } catch (err: any) {
            setError(err.message || 'Error al enviar solicitud');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-20" style={{ backgroundColor: '#faf7f2' }}>
            <div className="max-w-md w-full">
                <div className="border rounded-2xl shadow-xl p-8" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(212,163,115,0.2)' }}>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl" style={{ backgroundColor: 'rgba(212,163,115,0.1)' }}>
                            🔑
                        </div>
                        <h1 className="text-3xl font-title font-bold mb-2" style={{ color: '#1a1a1a' }}>
                            Recuperar Contraseña
                        </h1>
                        <p className="font-text" style={{ color: '#888888' }}>
                            Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña.
                        </p>
                    </div>

                    {sent ? (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
                                ✉️
                            </div>
                            <div>
                                <p className="font-bold text-lg mb-2" style={{ color: '#1a1a1a' }}>¡Correo enviado!</p>
                                <p className="text-sm" style={{ color: '#888888' }}>
                                    Si el email está registrado, recibirás un enlace de recuperación. Revisá tu bandeja de entrada y la carpeta de spam.
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className="inline-block px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                                style={{ backgroundColor: '#D4A373' }}
                            >
                                Volver a Iniciar Sesión
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
                                    <label htmlFor="email" className="block text-sm font-semibold mb-1 font-text" style={{ color: '#333333' }}>
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D4A373] focus:border-transparent font-text"
                                        style={{ borderColor: 'rgba(212,163,115,0.3)', backgroundColor: '#faf7f2' }}
                                        placeholder="tu@email.com"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 rounded-lg font-semibold font-text text-white transition-all hover:opacity-90 disabled:opacity-50"
                                    style={{ backgroundColor: '#D4A373' }}
                                >
                                    {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
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
            </div>
        </div>
    );
}
