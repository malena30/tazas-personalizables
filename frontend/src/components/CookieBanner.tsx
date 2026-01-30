"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LuCookie, LuX } from 'react-icons/lu';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[100] animate-in slide-in-from-bottom-10 duration-700">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-[var(--border)] flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shrink-0">
                        <LuCookie size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-[var(--foreground)] text-lg mb-1">¿Aceptas una cookie? 🍪</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            Utilizamos cookies para mejorar tu experiencia y analizar el tráfico. Al continuar navegando, aceptas nuestra <Link href="/privacy" className="text-blue-600 hover:underline">Política de Privacidad</Link>.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <LuX size={18} />
                    </button>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={acceptCookies}
                        className="flex-1 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Aceptar Todo
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-2xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all"
                    >
                        Configurar
                    </button>
                </div>
            </div>
        </div>
    );
}
