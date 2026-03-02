"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '@/lib/api';
import { LuLock, LuEye, LuEyeOff, LuCheck, LuInfo, LuArrowLeft } from 'react-icons/lu';

function ResetPasswordForm() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4 text-3xl text-red-500">
                    <LuInfo size={32} />
                </div>
                <h1 className="text-2xl font-title font-bold mb-2 text-[var(--foreground)]">
                    Enlace inválido
                </h1>
                <p className="text-sm mb-6 text-[var(--foreground)] opacity-60 font-medium font-text">
                    El enlace de recuperación no es válido o ha expirado. Por favor, solicitá uno nuevo.
                </p>
                <Link
                    href="/forgot-password"
                    className="inline-block px-8 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#D4A373]/20"
                    style={{ backgroundColor: '#D4A373' }}
                >
                    Solicitar nuevo enlace
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="w-16 h-16 rounded-2xl bg-[#D4A373]/10 flex items-center justify-center mx-auto mb-6 text-[#D4A373]">
                    <LuLock size={32} />
                </div>
                <h1 className="text-3xl font-title font-bold mb-2 text-[var(--foreground)]">
                    Nueva Contraseña
                </h1>
                <p className="font-text text-[var(--foreground)] opacity-60 font-medium">
                    Elegí una nueva contraseña segura para tu cuenta.
                </p>
            </div>

            {success ? (
                <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto text-green-500">
                        <LuCheck size={48} />
                    </div>
                    <div>
                        <p className="font-title font-bold text-xl mb-2 text-[var(--foreground)]">¡Contraseña actualizada!</p>
                        <p className="text-sm text-[var(--foreground)] opacity-60 font-medium font-text">
                            Tu contraseña se ha restablecido correctamente. Serás redirigido al login en unos segundos...
                        </p>
                    </div>
                    <Link
                        href="/login"
                        className="inline-block px-8 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#D4A373]/20 w-full"
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
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="newPassword" className="block text-xs font-black uppercase tracking-widest mb-2 ml-1 text-[var(--foreground)] opacity-50">
                                    Nueva Contraseña
                                </label>
                                <div className="relative group">
                                    <input
                                        id="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        className="w-full px-5 py-3 bg-[var(--background)] border border-[var(--border)] rounded-2xl focus:ring-4 focus:ring-[#D4A373]/10 focus:border-[#D4A373] text-[var(--foreground)] outline-none transition-all font-text text-sm"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[var(--foreground)] opacity-30 hover:opacity-100 transition-all rounded-lg"
                                    >
                                        {showPassword ? <LuEye size={18} /> : <LuEyeOff size={18} />}
                                    </button>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-2 ml-1">
                                    {[
                                        { label: "Mínimo 8 caracteres", met: newPassword.length >= 8 },
                                        { label: "Una mayúscula", met: /[A-Z]/.test(newPassword) },
                                        { label: "Un número", met: /[0-9]/.test(newPassword) },
                                        { label: "Carácter especial", met: /[@$!%*?&]/.test(newPassword) },
                                    ].map((rule) => (
                                        <div key={rule.label} className={`text-[10px] font-bold flex items-center gap-1.5 transition-colors ${rule.met ? 'text-green-500' : 'text-[var(--foreground)] opacity-30'}`}>
                                            <div className={`w-1 h-1 rounded-full ${rule.met ? 'bg-green-500' : 'bg-current opacity-30'}`} />
                                            {rule.label}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-xs font-black uppercase tracking-widest mb-2 ml-1 text-[var(--foreground)] opacity-50">
                                    Confirmar Contraseña
                                </label>
                                <div className="relative group">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        className="w-full px-5 py-3 bg-[var(--background)] border border-[var(--border)] rounded-2xl focus:ring-4 focus:ring-[#D4A373]/10 focus:border-[#D4A373] text-[var(--foreground)] outline-none transition-all font-text text-sm"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[var(--foreground)] opacity-30 hover:opacity-100 transition-all rounded-lg"
                                    >
                                        {showConfirmPassword ? <LuEye size={18} /> : <LuEyeOff size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-2xl font-bold font-text text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg shadow-[#D4A373]/25 mt-4 group"
                            style={{ backgroundColor: '#D4A373' }}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Actualizando...
                                </div>
                            ) : (
                                "Restablecer Contraseña"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link href="/login" className="text-xs font-black uppercase tracking-widest text-[#D4A373] hover:opacity-70 transition-all flex items-center justify-center gap-2">
                            <LuArrowLeft size={14} />
                            Volver a Iniciar Sesión
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-[var(--background)]">
            <div className="max-w-md w-full">
                <Suspense fallback={<div className="text-center font-bold text-[var(--foreground)] opacity-50 uppercase tracking-widest animate-pulse">Cargando...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
