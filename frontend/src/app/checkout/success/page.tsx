"use client";

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');
    const clearCart = useCartStore((state) => state.clearCart);

    useEffect(() => {
        if (orderId) {
            clearCart();
        } else {
            // Si no hay orderId, redirigir al home
            router.push('/');
        }
    }, [orderId, clearCart, router]);

    if (!orderId) return null;

    return (
        <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✅</span>
            </div>

            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                ¡Gracias por tu compra!
            </h1>

            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Tu orden ha sido confirmada con éxito.
            </p>

            <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg mb-8">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Número de Orden</p>
                <p className="text-xl font-mono font-bold text-[var(--accent)]">{orderId}</p>
            </div>

            <div className="flex flex-col gap-3">
                <Link
                    href="/customizer"
                    className="w-full bg-[var(--accent)] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                    Crear otro diseño
                </Link>

                <Link
                    href="/"
                    className="w-full bg-zinc-200 dark:bg-zinc-700 text-[var(--foreground)] py-3 rounded-xl font-bold hover:opacity-80 transition-opacity"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
            <Suspense fallback={<div className="text-center text-[var(--foreground)]">Cargando...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
