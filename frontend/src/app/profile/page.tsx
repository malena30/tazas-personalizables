"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
    updateUserProfile,
    getUserStats,
    getOrders,
    Address,
    UserProfileUpdate,
    UserStats,
    OrderResponse,
} from "@/lib/api";

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"info" | "addresses" | "stats" | "orders">("info");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Personal Info
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Addresses
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [editingAddress, setEditingAddress] = useState<number | null>(null);
    const [newAddress, setNewAddress] = useState<Address>({
        name: "",
        street: "",
        city: "",
        state: "",
        postal_code: "",
        country: "Argentina",
        phone: "",
    });

    // Stats
    const [stats, setStats] = useState<UserStats | null>(null);
    const [orders, setOrders] = useState<OrderResponse[]>([]);

    useEffect(() => {
        if (!user) {
            router.push("/login?redirect=/profile");
            return;
        }

        // Inicializar datos del usuario
        setEmail(user.email);
        setPhone(user.phone || "");
        setAddresses(user.addresses || []);

        // Cargar datos adicionales
        loadStats();
        loadOrders();
    }, [user, router]);

    const loadOrders = async () => {
        try {
            const ordersData = await getOrders();
            setOrders(ordersData);
        } catch (err: any) {
            console.error("Error al cargar órdenes:", err);
        }
    };

    const loadStats = async () => {
        try {
            const statsData = await getUserStats();
            setStats(statsData);
        } catch (err: any) {
            console.error("Error al cargar estadísticas:", err);
        }
    };

    const handleUpdatePersonalInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validar contraseña si se está cambiando
        if (newPassword) {
            if (newPassword !== confirmPassword) {
                setError("Las contraseñas no coinciden");
                return;
            }
            if (!currentPassword) {
                setError("Debes ingresar tu contraseña actual para cambiarla");
                return;
            }
        }

        try {
            setLoading(true);
            const updateData: UserProfileUpdate = {
                email,
                phone,
            };

            if (newPassword) {
                updateData.current_password = currentPassword;
                updateData.new_password = newPassword;
            }

            await updateUserProfile(updateData);
            await refreshUser();

            setSuccess("Perfil actualizado correctamente");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setError(err.message || "Error al actualizar perfil");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAddresses = async () => {
        setError("");
        setSuccess("");

        try {
            setLoading(true);
            await updateUserProfile({ addresses });
            await refreshUser();
            setSuccess("Direcciones actualizadas correctamente");
            setEditingAddress(null);
        } catch (err: any) {
            setError(err.message || "Error al guardar direcciones");
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = () => {
        if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.postal_code) {
            setError("Por favor completa todos los campos obligatorios");
            return;
        }

        setAddresses([...addresses, { ...newAddress }]);
        setNewAddress({
            name: "",
            street: "",
            city: "",
            state: "",
            postal_code: "",
            country: "Argentina",
            phone: "",
        });
        setError("");
    };

    const handleDeleteAddress = (index: number) => {
        setAddresses(addresses.filter((_, i) => i !== index));
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[var(--background)] pt-20 px-6 pb-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-title font-bold text-[var(--foreground)]">
                        👤 Mi Perfil
                    </h1>
                    <p className="text-[var(--foreground)] opacity-70 mt-2">
                        Gestiona tu información personal y preferencias
                    </p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-700">
                        {success}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-[var(--border)]">
                    <button
                        onClick={() => setActiveTab("info")}
                        className={`px-6 py-3 font-medium transition-all whitespace-nowrap ${activeTab === "info"
                            ? "border-b-2 border-[var(--foreground)] text-[var(--foreground)]"
                            : "text-[var(--foreground)] opacity-60 hover:opacity-100"
                            }`}
                    >
                        Información Personal
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`px-6 py-3 font-medium transition-all whitespace-nowrap ${activeTab === "orders"
                            ? "border-b-2 border-[var(--foreground)] text-[var(--foreground)]"
                            : "text-[var(--foreground)] opacity-60 hover:opacity-100"
                            }`}
                    >
                        Mis Órdenes ({orders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("addresses")}
                        className={`px-6 py-3 font-medium transition-all whitespace-nowrap ${activeTab === "addresses"
                            ? "border-b-2 border-[var(--foreground)] text-[var(--foreground)]"
                            : "text-[var(--foreground)] opacity-60 hover:opacity-100"
                            }`}
                    >
                        Direcciones ({addresses.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("stats")}
                        className={`px-6 py-3 font-medium transition-all whitespace-nowrap ${activeTab === "stats"
                            ? "border-b-2 border-[var(--foreground)] text-[var(--foreground)]"
                            : "text-[var(--foreground)] opacity-60 hover:opacity-100"
                            }`}
                    >
                        Estadísticas
                    </button>
                </div>

                {/* Personal Info Tab */}
                {activeTab === "info" && (
                    <form onSubmit={handleUpdatePersonalInfo} className="bg-[var(--accent)] p-8 rounded-xl border border-[var(--border)]">
                        <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-6">
                            Información Personal
                        </h2>

                        <div className="space-y-6">
                            {/* Username (read-only) */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                    Usuario
                                </label>
                                <input
                                    type="text"
                                    value={user.username}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-[var(--border)] rounded-lg text-[var(--foreground)] opacity-60 cursor-not-allowed"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                    Teléfono (opcional)
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+54 9 11 1234-5678"
                                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {/* Change Password Section */}
                            <div className="pt-6 border-t border-[var(--border)]">
                                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                                    Cambiar Contraseña
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                            Contraseña Actual
                                        </label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                            Nueva Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                            Confirmar Nueva Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                )}

                {/* Orders Tab */}
                {activeTab === "orders" && (
                    <div className="space-y-6">
                        {orders.length === 0 ? (
                            <div className="bg-[var(--accent)] p-12 rounded-xl border border-[var(--border)] text-center">
                                <span className="text-6xl mb-4 block">📦</span>
                                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                                    No tienes órdenes todavía
                                </h3>
                                <p className="text-[var(--foreground)] opacity-60 mb-6">
                                    ¡Crea tu primer diseño y personaliza tu taza hoy mismo!
                                </p>
                                <button
                                    onClick={() => router.push("/customizer")}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                                >
                                    Ir al Personalizador
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="bg-[var(--accent)] rounded-xl border border-[var(--border)] overflow-hidden"
                                    >
                                        <div className="p-6 border-b border-[var(--border)] flex flex-wrap justify-between items-center gap-4">
                                            <div>
                                                <p className="text-xs font-mono text-[var(--foreground)] opacity-50 uppercase tracking-wider">
                                                    Orden #{order.id.substring(0, 8)}
                                                </p>
                                                <p className="text-sm text-[var(--foreground)] opacity-70 mt-1">
                                                    {new Date(order.created_at).toLocaleDateString("es-AR", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span
                                                    className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${order.status === "paid"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                        : order.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                                        }`}
                                                >
                                                    {order.status === "paid" ? "Pagado" : order.status === "pending" ? "Pendiente" : "Fallido"}
                                                </span>
                                                <p className="text-xl font-bold text-[var(--foreground)]">
                                                    ${order.total_amount.toLocaleString("es-AR")}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-[var(--background)]/30">
                                            <div className="space-y-4">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-4">
                                                        <div className="w-16 h-16 bg-white rounded-lg border border-[var(--border)] overflow-hidden flex-shrink-0">
                                                            {item.design?.thumbnail ? (
                                                                <img
                                                                    src={item.design.thumbnail}
                                                                    alt={item.design.name}
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                                                    ☕
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-[var(--foreground)]">
                                                                {item.design?.name || "Taza Personalizada"}
                                                            </p>
                                                            <p className="text-sm text-[var(--foreground)] opacity-60">
                                                                Cantidad: {item.quantity} × ${item.price.toLocaleString("es-AR")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {order.status === "pending" && order.checkout_url && (
                                                <div className="mt-6 pt-6 border-t border-[var(--border)] flex justify-end">
                                                    <a
                                                        href={order.checkout_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                                                    >
                                                        Pagar Ahora
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Addresses Tab */}
                {activeTab === "addresses" && (
                    <div className="space-y-6">
                        {/* Existing Addresses */}
                        {addresses.length > 0 && (
                            <div className="bg-[var(--accent)] p-8 rounded-xl border border-[var(--border)]">
                                <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-6">
                                    Mis Direcciones
                                </h2>

                                <div className="space-y-4">
                                    {addresses.map((addr, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-[var(--background)] border border-[var(--border)] rounded-lg flex justify-between items-start"
                                        >
                                            <div className="flex-1">
                                                <p className="font-semibold text-[var(--foreground)]">{addr.name}</p>
                                                <p className="text-sm text-[var(--foreground)] opacity-70 mt-1">
                                                    {addr.street}
                                                </p>
                                                <p className="text-sm text-[var(--foreground)] opacity-70">
                                                    {addr.city}, {addr.state} - CP: {addr.postal_code}
                                                </p>
                                                {addr.phone && (
                                                    <p className="text-sm text-[var(--foreground)] opacity-70">
                                                        Tel: {addr.phone}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleDeleteAddress(index)}
                                                className="text-red-600 hover:text-red-800 font-medium text-sm"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleSaveAddresses}
                                    disabled={loading}
                                    className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {loading ? "Guardando..." : "Guardar Direcciones"}
                                </button>
                            </div>
                        )}

                        {/* Add New Address */}
                        <div className="bg-[var(--accent)] p-8 rounded-xl border border-[var(--border)]">
                            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-6">
                                Agregar Nueva Dirección
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                        Nombre Destinatario *
                                    </label>
                                    <input
                                        type="text"
                                        value={newAddress.name}
                                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                        placeholder="Juan Pérez"
                                        className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                        Calle y Número *
                                    </label>
                                    <input
                                        type="text"
                                        value={newAddress.street}
                                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                        placeholder="Av. Corrientes 1234"
                                        className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                            Ciudad *
                                        </label>
                                        <input
                                            type="text"
                                            value={newAddress.city}
                                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                            placeholder="Buenos Aires"
                                            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                            Provincia *
                                        </label>
                                        <input
                                            type="text"
                                            value={newAddress.state}
                                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                            placeholder="CABA"
                                            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                            Código Postal *
                                        </label>
                                        <input
                                            type="text"
                                            value={newAddress.postal_code}
                                            onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                                            placeholder="C1000"
                                            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                            Teléfono
                                        </label>
                                        <input
                                            type="tel"
                                            value={newAddress.phone}
                                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                            placeholder="+54 11 1234-5678"
                                            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddAddress}
                                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
                                >
                                    ➕ Agregar Dirección
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Tab */}
                {activeTab === "stats" && stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Total Spent */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                            <div className="text-sm text-green-700 dark:text-green-300 font-medium mb-2">
                                Total Gastado
                            </div>
                            <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                                ${stats.total_spent.toFixed(2)}
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-400 mt-2">
                                En {stats.paid_orders} compras
                            </div>
                        </div>

                        {/* Total Orders */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                            <div className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">
                                Órdenes Totales
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

                        {/* Total Designs */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                            <div className="text-sm text-purple-700 dark:text-purple-300 font-medium mb-2">
                                Diseños Creados
                            </div>
                            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                                {stats.total_designs}
                            </div>
                            <div className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                                Tus creaciones
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
