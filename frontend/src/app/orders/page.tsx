"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getOrders, OrderResponse } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">Pagado</span>;
            case "pending":
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase">Pendiente</span>;
            case "failed":
                return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">Fallido</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase">{status}</span>;
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-[var(--background)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[var(--background)]">
            <div className="max-w-5xl mx-auto px-6">
                <h1 className="text-4xl font-title font-extrabold text-[var(--foreground)] mb-8">Mis Pedidos</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 text-center shadow-sm border border-[var(--border)]">
                        <div className="text-6xl mb-4">📦</div>
                        <h2 className="text-2xl font-title font-bold mb-2">No tienes pedidos aún</h2>
                        <p className="text-gray-500 mb-8">¡Personaliza tu primera taza y haz tu pedido hoy!</p>
                        <Link
                            href="/customizer"
                            className="px-8 py-3 bg-[var(--accent)] text-[var(--foreground)] rounded-xl font-bold hover:opacity-90 transition-opacity"
                        >
                            Ir al Personalizador
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-[var(--border)]"
                            >
                                {/* Header de la Orden */}
                                <div className="bg-gray-50 dark:bg-zinc-800/50 p-6 border-b border-[var(--border)] flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Pedido #{order.id.slice(0, 8)}</p>
                                        <p className="text-sm font-medium">{new Date(order.created_at).toLocaleDateString()} a las {new Date(order.created_at).toLocaleTimeString()}</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total</p>
                                            <p className="text-lg font-mono font-bold">${order.total_amount.toLocaleString()}</p>
                                        </div>
                                        {getStatusBadge(order.status)}
                                    </div>
                                </div>

                                {/* Items de la Orden */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-[var(--border)]">
                                                    {item.design?.thumbnail ? (
                                                        <img
                                                            src={item.design.thumbnail}
                                                            alt={item.design.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-2xl">☕</div>
                                                    )}
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="font-bold text-[var(--foreground)]">
                                                        {item.design?.name || "Taza Personalizada"}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                                    <p className="text-sm font-mono">${item.price.toLocaleString()} c/u</p>
                                                </div>
                                                {item.design_id && (
                                                    <Link
                                                        href={`/customizer?load=${item.design_id}`}
                                                        className="text-sm text-[var(--accent)] font-bold hover:underline"
                                                    >
                                                        Ver Diseño
                                                    </Link>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer de la Orden (Acciones) */}
                                    {order.status === "pending" && order.checkout_url && (
                                        <div className="mt-6 pt-6 border-t border-[var(--border)] flex justify-end">
                                            <a
                                                href={order.checkout_url}
                                                className="px-6 py-2 bg-[#009EE3] text-white rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                                            >
                                                Pagar con Mercado Pago
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
