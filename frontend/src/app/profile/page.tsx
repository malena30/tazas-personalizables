"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import {
    updateUserProfile,
    getUserStats,
    getOrders,
    listDesigns,
    deleteDesign,
    Address,
    Design,
    UserProfileUpdate,
    UserStats,
    OrderResponse,
} from "@/lib/api";
import {
    LuUser,
    LuMapPin,
    LuActivity,
    LuPalette,
    LuShoppingBag,
    LuLock,
    LuPlus,
    LuTrash2,
    LuPencil,
    LuExternalLink,
    LuChevronRight,
    LuSave,
    LuMail,
    LuPhone,
    LuInfo,
    LuCheck,
    LuHeart
} from "react-icons/lu";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { useFavoriteStore } from "@/store/favoriteStore";
import { useCartStore } from "@/store/cartStore";
import { getApiUrl } from "@/lib/api";
import ProfileSkeleton from "@/components/ProfileSkeleton";
import Skeleton from "@/components/Skeleton";

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab") as any;
    const [activeTab, setActiveTab] = useState<"info" | "addresses" | "stats" | "designs" | "orders" | "favorites">("info");
    const [loading, setLoading] = useState(false);
    const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
    const [favoritesLoading, setFavoritesLoading] = useState(false);
    const { token } = useAuth();
    const { favorites } = useFavoriteStore();
    const addToCart = useCartStore((state) => state.addToCart);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (tabParam && ["info", "addresses", "stats", "designs", "orders", "favorites"].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

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
    const [designs, setDesigns] = useState<Design[]>([]);

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
        loadDesigns();
        loadFavoriteProducts();
    }, [user, router, token]);

    const loadFavoriteProducts = async () => {
        if (!token) return;
        try {
            setFavoritesLoading(true);
            const res = await fetch(`${getApiUrl()}/api/favorites`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setFavoriteProducts(data);
            }
        } catch (error) {
            console.error("Error loading favorite products:", error);
        } finally {
            setFavoritesLoading(false);
        }
    };

    const loadDesigns = async () => {
        try {
            const designsData = await listDesigns();
            setDesigns(designsData);
        } catch (err: any) {
            // Error handled by UI or ignored
        }
    };

    const handleDeleteDesign = async (id: string) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este diseño?")) return;
        try {
            await deleteDesign(id);
            setDesigns(designs.filter(d => d.id !== id));
            loadStats(); // Actualizar contador de diseños
        } catch (err: any) {
            alert(err.message || "Error al eliminar diseño");
        }
    };

    const loadOrders = async () => {
        try {
            const ordersData = await getOrders();
            setOrders(ordersData);
        } catch (err: any) {
            // Error handled by UI or ignored
        }
    };

    const loadStats = async () => {
        try {
            const statsData = await getUserStats();
            setStats(statsData);
        } catch (err: any) {
            // Error handled by UI or ignored
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
        return (
            <div className="min-h-screen bg-cream pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <ProfileSkeleton />
                </div>
            </div>
        );
    }

    const menuItems = [
        { id: "info", label: "Información", icon: LuUser },
        { id: "addresses", label: "Direcciones", icon: LuMapPin, count: addresses.length },
        { id: "stats", label: "Estadísticas", icon: LuActivity },
        { id: "designs", label: "Mis Diseños", icon: LuPalette, count: designs.length },
        { id: "favorites", label: "Mis Favoritos", icon: LuHeart, count: favoriteProducts.length },
        { id: "orders", label: "Mis Pedidos", icon: LuShoppingBag, count: orders.length },
    ];

    return (
        <div className="min-h-screen bg-cream pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-[var(--foreground)] tracking-tight">
                        Mi Perfil
                    </h1>
                    <p className="text-[var(--foreground)] opacity-60 mt-2 font-medium">
                        Gestiona tu cuenta, direcciones y revisa tus creaciones.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <nav className="bg-[var(--card)] rounded-3xl p-2 md:p-3 border border-[var(--border)] shadow-sm sticky top-32 overflow-x-auto lg:overflow-x-visible no-scrollbar">
                            <div className="flex lg:flex-col gap-1 min-w-max lg:min-w-0">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id as any)}
                                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === item.id
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                            : "text-[var(--foreground)] opacity-50 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:opacity-100"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon size={18} />
                                            <span className="lg:inline">{item.label}</span>
                                        </div>
                                        {item.count !== undefined && (
                                            <span className={`ml-3 px-2 py-0.5 rounded-lg text-[10px] font-bold ${activeTab === item.id
                                                ? "bg-white/20 text-white"
                                                : "bg-[var(--foreground)]/10 text-[var(--foreground)] opacity-50"
                                                }`}>
                                                {item.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-grow">
                        {/* Alerts */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <LuInfo />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl text-green-600 dark:text-green-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <LuCheck />
                                {success}
                            </div>
                        )}

                        {/* Personal Info Tab */}
                        {activeTab === "info" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-[var(--cream)] dark:bg-zinc-900 rounded-3xl p-8 border border-[var(--border)] shadow-sm">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <LuUser size={20} />
                                        </div>
                                        <h2 className="text-xl font-bold text-[var(--foreground)]">
                                            Información Personal
                                        </h2>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12 pb-12 border-b border-[var(--border)]">
                                        <div className="relative group">
                                            <div className="w-32 h-32 rounded-[2.5rem] bg-gray-100 dark:bg-zinc-800 overflow-hidden border-4 border-white dark:border-zinc-900 shadow-xl group-hover:shadow-blue-500/20 transition-all duration-500">
                                                {user.avatar_url ? (
                                                    <Image src={user.avatar_url} alt={user.username} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-4xl font-black">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-[var(--border)] flex items-center justify-center cursor-pointer hover:scale-110 hover:bg-blue-600 hover:text-white transition-all duration-300 group-hover:rotate-12">
                                                <LuPencil size={14} />
                                                <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        // Aquí iría la lógica de subida. Por ahora simulamos con FileReader
                                                        const reader = new FileReader();
                                                        reader.onloadend = async () => {
                                                            try {
                                                                setLoading(true);
                                                                await updateUserProfile({ avatar_url: reader.result as string });
                                                                await refreshUser();
                                                                setSuccess("Avatar actualizado correctamente");
                                                            } catch (err: any) {
                                                                setError(err.message || "Error al actualizar avatar");
                                                            } finally {
                                                                setLoading(false);
                                                            }
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }} />
                                            </label>
                                        </div>
                                        <div className="text-center md:text-left">
                                            <h3 className="text-2xl font-black text-[var(--foreground)]">{user.username}</h3>
                                            <p className="text-[var(--foreground)] opacity-60 font-medium">{user.email}</p>
                                            <div className="flex items-center gap-2 mt-3 justify-center md:justify-start">
                                                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100 dark:border-blue-900/30">
                                                    Cliente Premium
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleUpdatePersonalInfo} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Email */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-[var(--foreground)] opacity-50 uppercase tracking-widest ml-1">
                                                    Email
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                        <LuMail size={14} />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                                    />
                                                </div>
                                            </div>

                                            {/* Phone */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-[var(--foreground)] opacity-50 uppercase tracking-widest ml-1">
                                                    Teléfono
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                        <LuPhone size={14} />
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        placeholder="+54 9 11 1234-5678"
                                                        className="w-full pl-10 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Change Password Section */}
                                        <div className="pt-8 mt-8 border-t border-[var(--border)]">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                                    <LuLock size={18} />
                                                </div>
                                                <h3 className="text-lg font-bold text-[var(--foreground)]">
                                                    Seguridad
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-[var(--foreground)] opacity-50 uppercase tracking-widest ml-1">
                                                        Contraseña Actual
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-[var(--foreground)] opacity-50 uppercase tracking-widest ml-1">
                                                        Nueva Contraseña
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-[var(--foreground)] opacity-50 uppercase tracking-widest ml-1">
                                                        Confirmar Nueva
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25"
                                            >
                                                {loading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <LuSave size={16} />
                                                )}
                                                Guardar Cambios
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === "orders" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {orders.length === 0 ? (
                                    <div className="bg-[var(--cream)] dark:bg-zinc-900 p-12 rounded-3xl border border-[var(--border)] text-center shadow-sm">
                                        <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <LuShoppingBag size={32} className="text-gray-300" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                                            No tienes órdenes todavía
                                        </h3>
                                        <p className="text-[var(--foreground)] opacity-60 mb-8 max-w-sm mx-auto font-medium">
                                            ¡Crea tu primer diseño y personaliza tu taza hoy mismo!
                                        </p>
                                        <button
                                            onClick={() => router.push("/customizer")}
                                            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
                                        >
                                            Ir al Personalizador
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-[var(--card)] rounded-3xl p-8 border border-[var(--border)] shadow-sm">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                                    <LuShoppingBag size={20} />
                                                </div>
                                                <h2 className="text-xl font-bold text-[var(--foreground)]">
                                                    Mis Pedidos
                                                </h2>
                                            </div>
                                            <button
                                                onClick={() => router.push("/orders")}
                                                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                Ver todos los detalles
                                                <LuExternalLink size={12} />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {orders.slice(0, 3).map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 border border-[var(--border)] rounded-2xl hover:border-blue-500/30 transition-all cursor-pointer"
                                                    onClick={() => router.push("/orders")}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-[var(--cream)] dark:bg-zinc-900 rounded-xl flex items-center justify-center border border-[var(--border)]">
                                                            <LuShoppingBag className="text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-[var(--foreground)]">
                                                                Orden #{order.id.substring(0, 8)}
                                                            </p>
                                                            <p className="text-xs text-[var(--foreground)] opacity-50 font-medium">
                                                                {new Date(order.created_at).toLocaleDateString()} • {order.items.length} items
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-right">
                                                        <div>
                                                            <p className="text-sm font-bold text-[var(--foreground)]">
                                                                ${order.total_amount.toLocaleString()}
                                                            </p>
                                                            <p className={`text-[10px] font-bold uppercase tracking-wider ${order.status === 'paid' ? 'text-green-500' : 'text-amber-500'
                                                                }`}>
                                                                {order.status === 'paid' ? 'Pagado' : 'Pendiente'}
                                                            </p>
                                                        </div>
                                                        <LuChevronRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                                                    </div>
                                                </div>
                                            ))}
                                            {orders.length > 3 && (
                                                <p className="text-center text-xs text-gray-400 pt-2">
                                                    Y otros {orders.length - 3} pedidos más...
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === "addresses" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Existing Addresses */}
                                <div className="bg-[var(--cream)] dark:bg-zinc-900 rounded-3xl p-8 border border-[var(--border)] shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                                <LuMapPin size={20} />
                                            </div>
                                            <h2 className="text-xl font-bold text-[var(--foreground)]">
                                                Mis Direcciones
                                            </h2>
                                        </div>
                                    </div>

                                    {addresses.length === 0 ? (
                                        <div className="text-center py-10 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-[var(--border)]">
                                            <p className="text-gray-400 text-sm">No tienes direcciones guardadas.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {addresses.map((addr, index) => (
                                                <div
                                                    key={index}
                                                    className="p-5 bg-gray-50 dark:bg-zinc-800/50 border border-[var(--border)] rounded-2xl flex justify-between items-start group hover:border-blue-500/30 transition-all"
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-bold text-[var(--foreground)] text-sm">{addr.name}</p>
                                                        <p className="text-xs text-[var(--foreground)] opacity-60 mt-2 leading-relaxed font-medium">
                                                            {addr.street}<br />
                                                            {addr.city}, {addr.state}<br />
                                                            CP: {addr.postal_code}
                                                        </p>
                                                        {addr.phone && (
                                                            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-3 flex items-center gap-1">
                                                                <LuPhone size={8} />
                                                                {addr.phone}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteAddress(index)}
                                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <LuTrash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {addresses.length > 0 && (
                                        <div className="mt-8 flex justify-end">
                                            <button
                                                onClick={handleSaveAddresses}
                                                disabled={loading}
                                                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25"
                                            >
                                                {loading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <LuSave size={16} />
                                                )}
                                                Guardar Cambios
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Add New Address */}
                                <div className="bg-[var(--cream)] dark:bg-zinc-900 rounded-3xl p-8 border border-[var(--border)] shadow-sm">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                                            <LuPlus size={18} />
                                        </div>
                                        <h2 className="text-xl font-bold text-[var(--foreground)]">
                                            Agregar Nueva Dirección
                                        </h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                                                    Nombre Destinatario *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newAddress.name}
                                                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                                    placeholder="Juan Pérez"
                                                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                                                    Calle y Número *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newAddress.street}
                                                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                                    placeholder="Av. Corrientes 1234"
                                                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                                                    Ciudad *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newAddress.city}
                                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                    placeholder="Buenos Aires"
                                                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                                                    Provincia *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newAddress.state}
                                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                    placeholder="CABA"
                                                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                                                    Código Postal *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newAddress.postal_code}
                                                    onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                                                    placeholder="C1000"
                                                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                                                    Teléfono
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={newAddress.phone}
                                                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                    placeholder="+54 11 1234-5678"
                                                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleAddAddress}
                                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 dark:bg-zinc-800 text-white rounded-2xl font-bold hover:bg-black dark:hover:bg-zinc-700 transition-all"
                                        >
                                            <LuPlus size={14} />
                                            Agregar a mi lista
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stats Tab */}
                        {activeTab === "stats" && stats && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Total Spent */}
                                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-3xl text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden group">
                                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                        <LuActivity size={120} />
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-2">Total Gastado</p>
                                        <h3 className="text-3xl font-bold mb-4">${stats.total_spent.toLocaleString()}</h3>
                                        <div className="flex items-center gap-2 text-xs text-emerald-100/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                                            En {stats.paid_orders} compras exitosas
                                        </div>
                                    </div>
                                </div>

                                {/* Total Orders */}
                                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-3xl text-white shadow-lg shadow-blue-500/20 relative overflow-hidden group">
                                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                        <LuShoppingBag size={120} />
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-2">Órdenes Totales</p>
                                        <h3 className="text-3xl font-bold mb-4">{stats.total_orders}</h3>
                                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                                            <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-green-400" /> {stats.paid_orders} Pagadas</span>
                                            <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-amber-400" /> {stats.pending_orders} Pendientes</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Designs */}
                                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-8 rounded-3xl text-white shadow-lg shadow-purple-500/20 relative overflow-hidden group">
                                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                        <LuPalette size={120} />
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-purple-100 text-xs font-bold uppercase tracking-wider mb-2">Diseños Creados</p>
                                        <h3 className="text-3xl font-bold mb-4">{stats.total_designs}</h3>
                                        <p className="text-xs text-purple-100/80">Tus creaciones personalizadas</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Designs Tab */}
                        {activeTab === ("designs" as any) && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-600 dark:text-pink-400">
                                            <LuPalette size={20} />
                                        </div>
                                        <h2 className="text-xl font-bold text-[var(--foreground)]">
                                            Mis Diseños Guardados
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => router.push("/customizer")}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 text-sm"
                                    >
                                        <LuPlus size={12} />
                                        Crear Nuevo
                                    </button>
                                </div>

                                {designs.length === 0 ? (
                                    <div className="bg-[var(--cream)] dark:bg-zinc-900 p-12 rounded-3xl border border-[var(--border)] text-center shadow-sm">
                                        <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <LuPalette size={32} className="text-gray-300" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                                            Aún no tienes diseños guardados
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                                            ¡Empieza a crear tus propias tazas personalizadas y guárdalas aquí!
                                        </p>
                                        <button
                                            onClick={() => router.push("/customizer")}
                                            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
                                        >
                                            Ir al Personalizador
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {designs.map((design) => (
                                            <div
                                                key={design.id}
                                                className="group bg-[var(--cream)] dark:bg-zinc-900 rounded-3xl border border-[var(--border)] overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/30 transition-all duration-300"
                                            >
                                                <div className="aspect-square bg-gray-50 dark:bg-zinc-800 relative flex items-center justify-center p-6 overflow-hidden">
                                                    {design.thumbnail ? (
                                                        <Image
                                                            src={design.thumbnail}
                                                            alt={design.name}
                                                            fill
                                                            className="object-contain group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="text-6xl opacity-20">☕</div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                                        <button
                                                            onClick={() => router.push(`/customizer?load=${design.id}`)}
                                                            className="p-3 bg-white text-blue-600 rounded-2xl hover:bg-blue-50 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg"
                                                            title="Editar diseño"
                                                        >
                                                            <LuPencil size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteDesign(design.id)}
                                                            className="p-3 bg-white text-red-600 rounded-2xl hover:bg-red-50 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 shadow-lg"
                                                            title="Eliminar diseño"
                                                        >
                                                            <LuTrash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="font-bold text-[var(--foreground)] truncate text-sm">
                                                        {design.name}
                                                    </h3>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                        {new Date(design.created_at).toLocaleDateString("es-AR", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric"
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {/* Favorites Tab */}
                        {activeTab === "favorites" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                                        <LuHeart size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold text-[var(--foreground)]">
                                        Mis Favoritos
                                    </h2>
                                </div>

                                {favoritesLoading ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="h-64 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded-3xl" />
                                        ))}
                                    </div>
                                ) : favoriteProducts.length === 0 ? (
                                    <div className="bg-[var(--cream)] dark:bg-zinc-900 p-12 rounded-3xl border border-[var(--border)] text-center shadow-sm">
                                        <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <LuHeart size={32} className="text-gray-300" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                                            Tu lista de favoritos está vacía
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                                            ¿Aún no encontraste tu taza ideal? Explorá nuestras colecciones y marcá con un ❤️ lo que más te guste.
                                        </p>
                                        <button
                                            onClick={() => router.push("/products")}
                                            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
                                        >
                                            Explorar Tienda
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {favoriteProducts.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                id={product.id}
                                                slug={product.slug}
                                                name={product.name}
                                                price={product.price}
                                                image={product.image_url}
                                                description={product.description || ""}
                                                image_fit={product.image_fit}
                                                image_scale={product.image_scale}
                                                onAddToCart={() => addToCart({
                                                    id: product.id,
                                                    name: product.name,
                                                    description: product.description || "",
                                                    price: product.price,
                                                    image: product.image_url || "",
                                                    quantity: 1
                                                })}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </main>

                </div>
            </div>
        </div>
    );
}
