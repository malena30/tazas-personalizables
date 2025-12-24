"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
    getAdminStats,
    getAdminOrders,
    getAdminUsers,
    updateOrderStatus,
    AdminStats,
    AdminOrderResponse,
    AdminUserResponse,
} from "@/lib/api";

export default function AdminPanel() {
    const { user } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "users">("dashboard");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Dashboard data
    const [stats, setStats] = useState<AdminStats | null>(null);

    // Orders data
    const [orders, setOrders] = useState<AdminOrderResponse[]>([]);
    const [orderFilter, setOrderFilter] = useState<string>("");

    // Users data
    const [users, setUsers] = useState<AdminUserResponse[]>([]);

    useEffect(() => {
        if (!user) {
            router.push("/login?redirect=/admin");
            return;
        }
        if (!user.is_admin) {
            router.push("/");
            return;
        }

        loadData();
    }, [user, router]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            // Cargar estadísticas
            const statsData = await getAdminStats();
            setStats(statsData);

            // Cargar órdenes
            const ordersData = await getAdminOrders();
            setOrders(ordersData);

            // Cargar usuarios
            const usersData = await getAdminUsers();
            setUsers(usersData);

            setLoading(false);
        } catch (err: any) {
            setError(err.message || "Error al cargar datos del panel");
            setLoading(false);
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            // Recargar órdenes
            const ordersData = await getAdminOrders();
            setOrders(ordersData);
        } catch (err: any) {
            alert(err.message || "Error al actualizar estado");
        }
    };

    if (!user || !user.is_admin) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--background)] pt-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-[var(--foreground)]">Cargando panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] pt-20 px-6 pb-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-title font-bold text-[var(--foreground)]">
                        📊 Panel de Administración
                    </h1>
                    <p className="text-[var(--foreground)] opacity-70 mt-2">
                        Gestiona órdenes, usuarios y estadísticas de tu negocio
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-[var(--border)]">
                    <button
                        onClick={() => setActiveTab("dashboard")}
                        className={`px-6 py-3 font-medium transition-all ${activeTab === "dashboard"
                                ? "border-b-2 border-[var(--foreground)] text-[var(--foreground)]"
                                : "text-[var(--foreground)] opacity-60 hover:opacity-100"
                            }`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`px-6 py-3 font-medium transition-all ${activeTab === "orders"
                                ? "border-b-2 border-[var(--foreground)] text-[var(--foreground)]"
                                : "text-[var(--foreground)] opacity-60 hover:opacity-100"
                            }`}
                    >
                        Órdenes ({stats?.total_orders || 0})
                    </button>
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`px-6 py-3 font-medium transition-all ${activeTab === "users"
                                ? "border-b-2 border-[var(--foreground)] text-[var(--foreground)]"
                                : "text-[var(--foreground)] opacity-60 hover:opacity-100"
                            }`}
                    >
                        Usuarios ({stats?.total_users || 0})
                    </button>
                </div>

                {/* Dashboard Tab */}
                {activeTab === "dashboard" && stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Sales */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                            <div className="text-sm text-green-700 dark:text-green-300 font-medium mb-2">
                                Total Ventas
                            </div>
                            <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                                ${stats.total_sales.toFixed(2)}
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-400 mt-2">
                                De {stats.paid_orders} órdenes pagadas
                            </div>
                        </div>

                        {/* Total Orders */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                            <div className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">
                                Total Órdenes
                            </div>
                            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                                {stats.total_orders}
                            </div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex gap-2">
                                <span>✅ {stats.paid_orders}</span>
                                <span>⏳ {stats.pending_orders}</span>
                                <span>❌ {stats.failed_orders}</span>
                            </div>
                        </div>

                        {/* Users */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                            <div className="text-sm text-purple-700 dark:text-purple-300 font-medium mb-2">
                                Usuarios
                            </div>
                            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                                {stats.total_users}
                            </div>
                            <div className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                                Registrados
                            </div>
                        </div>

                        {/* Designs */}
                        <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
                            <div className="text-sm text-orange-700 dark:text-orange-300 font-medium mb-2">
                                Diseños
                            </div>
                            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                                {stats.total_designs}
                            </div>
                            <div className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                                Creados
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === "orders" && (
                    <div>
                        {/* Filter */}
                        <div className="mb-6 flex gap-4">
                            <select
                                value={orderFilter}
                                onChange={(e) => setOrderFilter(e.target.value)}
                                className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)]"
                            >
                                <option value="">Todas las órdenes</option>
                                <option value="pending">Pendientes</option>
                                <option value="paid">Pagadas</option>
                                <option value="failed">Fallidas</option>
                            </select>
                        </div>

                        {/* Orders Table */}
                        <div className="overflow-x-auto bg-[var(--accent)] rounded-xl border border-[var(--border)]">
                            <table className="w-full">
                                <thead className="border-b border-[var(--border)]">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                                            ID
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                                            Usuario
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                                            Total
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                                            Estado
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                                            Fecha
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders
                                        .filter((order) => !orderFilter || order.status === orderFilter)
                                        .map((order) => (
                                            <tr
                                                key={order.id}
                                                className="border-b border-[var(--border)] hover:bg-[var(--background)]/50 transition-colors"
                                            >
                                                <td className="px-4 py-3 text-sm text-[var(--foreground)] font-mono">
                                                    {order.id.substring(0, 8)}...
                                                </td>
                                                <td className="px-4 py-3 text-sm text-[var(--foreground)]">
                                                    {order.user?.username || "N/A"}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-[var(--foreground)] font-semibold">
                                                    ${order.total_amount.toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "paid"
                                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                                : order.status === "pending"
                                                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                                            }`}
                                                    >
                                                        {order.status === "paid"
                                                            ? "Pagado"
                                                            : order.status === "pending"
                                                                ? "Pendiente"
                                                                : "Fallido"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-[var(--foreground)] opacity-70">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) =>
                                                            handleUpdateOrderStatus(order.id, e.target.value)
                                                        }
                                                        className="px-3 py-1 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] text-xs"
                                                    >
                                                        <option value="pending">Pendiente</option>
                                                        <option value="paid">Pagado</option>
                                                        <option value="failed">Fallido</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === "users" && (
                    <div className="overflow-x-auto bg-[var(--accent)] rounded-xl border border-[var(--border)]">
                        <table className="w-full">
                            <thead className="border-b border-[var(--border)]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                                        Usuario
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                                        Órdenes
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                                        Diseños
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                                        Admin
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                                        Registro
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr
                                        key={u.id}
                                        className="border-b border-[var(--border)] hover:bg-[var(--background)]/50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-sm text-[var(--foreground)] font-medium">
                                            {u.username}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[var(--foreground)] opacity-70">
                                            {u.email}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[var(--foreground)]">
                                            {u.order_count}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[var(--foreground)]">
                                            {u.design_count}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {u.is_admin ? (
                                                <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-xs font-medium">
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-full text-xs">
                                                    Usuario
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[var(--foreground)] opacity-70">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
