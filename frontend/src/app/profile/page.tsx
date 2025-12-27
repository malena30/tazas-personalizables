"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
    updateUserProfile,
    getUserStats,
    Address,
    UserProfileUpdate,
    UserStats,
} from "@/lib/api";

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"info" | "addresses" | "stats">("info");
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

    useEffect(() => {
        if (!user) {
            router.push("/login?redirect=/profile");
            return;
        }

        // Inicializar datos del usuario
        setEmail(user.email);
        setPhone(user.phone || "");
        setAddresses(user.addresses || []);

        // Cargar estadísticas
        loadStats();
    }, [user, router]);

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
                        className={`px-6 py-3 font-medium transition-all ${activeTab === "info"
                                ? "border-b-2 border-[var(--foreground)] text-[var(--foreground)]"
                                : "text-[var(--foreground)] opacity-60 hover:opacity-100"
                            }`}
                    >
                        Información Personal
                    </button>
                    <button
                        onClick={() => setActiveTab("addresses")}
                        className={`px-6 py-3 font-medium transition-all ${activeTab === "addresses"
                                ? "border-b-2 border-[var(--foreground)] text-[var(--foreground)]"
                                : "text-[var(--foreground)] opacity-60 hover:opacity-100"
                            }`}
                    >
                        Direcciones ({addresses.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("stats")}
                        className={`px-6 py-3 font-medium transition-all ${activeTab === "stats"
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
