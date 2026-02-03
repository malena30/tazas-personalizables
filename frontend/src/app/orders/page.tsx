"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getOrders, OrderResponse } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    LuShoppingBag,
    LuCalendar,
    LuCheck,
    LuClock,
    LuInfo,
    LuExternalLink,
    LuArrowRight,
    LuPackageOpen,
    LuCreditCard
} from "react-icons/lu";
import OrderSkeleton from "@/components/OrderSkeleton";
import Skeleton from "@/components/Skeleton";

export default function MyOrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login?redirect=/orders");
            return;
        }

        if (user) {
            fetchOrders();
        }
    }, [user, authLoading, router]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getOrders();
            setOrders(data);
        } catch (err: any) {
            setError(err.message || "Error al cargar los pedidos");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "paid":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <LuCheck size={10} />
                        Pagado
                    </span>
                );
            case "pending":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <LuClock size={10} />
                        Pendiente
                    </span>
                );
            case "failed":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <LuInfo size={10} />
                        Fallido
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {status}
                    </span>
                );
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pt-32 pb-20">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="mb-12">
                        <Skeleton width={200} height={40} className="mb-4" />
                        <Skeleton width={300} height={20} />
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <OrderSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pt-32 pb-20">
            <div className="max-w-5xl mx-auto px-6">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-[var(--foreground)] tracking-tight mb-2">
                        Mis Pedidos
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Gestiona y realiza el seguimiento de todas tus compras.
                    </p>
                </header>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 flex items-center gap-3">
                        <LuInfo />
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-[var(--cream)] dark:bg-zinc-900 rounded-3xl p-16 text-center shadow-sm border border-[var(--border)] animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400">
                            <LuShoppingBag size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">No tienes pedidos aún</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            ¡Personaliza tu primera taza y dale un toque único a tus mañanas!
                        </p>
                        <Link
                            href="/customizer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Comenzar a Diseñar
                            <LuArrowRight size={14} />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order, index) => (
                            <div
                                key={order.id}
                                className="bg-[var(--cream)] dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm border border-[var(--border)] hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-4 duration-500"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Header de la Orden */}
                                <div className="bg-gray-50/50 dark:bg-zinc-800/30 p-6 lg:p-8 border-b border-[var(--border)] flex flex-wrap justify-between items-center gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-[var(--border)]">
                                            <LuPackageOpen size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-0.5">Pedido</p>
                                            <p className="text-sm font-mono font-bold text-[var(--foreground)]">#{order.id.slice(0, 8).toUpperCase()}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-8">
                                        <div className="hidden sm:block">
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-0.5">Fecha</p>
                                            <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
                                                <LuCalendar size={12} className="text-gray-400" />
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-0.5">Total</p>
                                            <p className="text-xl font-black text-[var(--foreground)]">${order.total_amount.toLocaleString('es-AR')}</p>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Estado</p>
                                            {getStatusBadge(order.status)}
                                        </div>
                                    </div>
                                </div>

                                {/* Items de la Orden */}
                                <div className="p-6 lg:p-8">
                                    <div className="space-y-6">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-6 group">
                                                <div className="w-24 h-24 bg-gray-50 dark:bg-zinc-800 rounded-2xl overflow-hidden flex-shrink-0 border border-[var(--border)] group-hover:scale-105 transition-transform">
                                                    {item.design?.thumbnail ? (
                                                        <Image
                                                            src={item.design.thumbnail}
                                                            alt={item.design.name}
                                                            fill
                                                            className="object-contain p-2"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-3xl">☕</div>
                                                    )}
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-1">
                                                        {item.design?.name || "Taza Personalizada"}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                            Cantidad: {item.quantity}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="font-mono font-bold text-gray-700 dark:text-gray-300">
                                                            ${item.price.toLocaleString('es-AR')} c/u
                                                        </span>
                                                    </div>
                                                </div>
                                                {item.design_id && (
                                                    <Link
                                                        href={`/customizer?load=${item.design_id}`}
                                                        className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                                    >
                                                        Ver Diseño
                                                        <LuExternalLink size={10} />
                                                    </Link>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer de la Orden (Acciones) */}
                                    {order.status === "pending" && order.checkout_url && (
                                        <div className="mt-8 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                <LuCreditCard className="text-blue-500" />
                                                Tu pago está pendiente. Completa el proceso para recibir tu pedido.
                                            </p>
                                            <a
                                                href={order.checkout_url}
                                                className="w-full sm:w-auto px-8 py-3 bg-[#009EE3] text-white rounded-xl font-bold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                                            >
                                                Pagar con Mercado Pago
                                                <LuArrowRight size={14} />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
