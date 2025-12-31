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
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    Product,
    ProductCreate,
    ProductUpdate,
} from "@/lib/api";

export default function AdminPanel() {
    const { user } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "users" | "products">("dashboard");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Dashboard data
    const [stats, setStats] = useState<AdminStats | null>(null);

    // Orders data
    const [orders, setOrders] = useState<AdminOrderResponse[]>([]);
    const [orderFilter, setOrderFilter] = useState<string>("");

    // Users data
    const [users, setUsers] = useState<AdminUserResponse[]>([]);

    // Products data
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [productForm, setProductForm] = useState<ProductCreate>({
        name: "",
        description: "",
        price: 0,
        image_url: "",
        stock: 0,
        is_active: true
    });

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

            // Cargar productos
            const productsData = await getAllProducts();
            setProducts(productsData);

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

    const loadProducts = async () => {
        try {
            const productsData = await getAllProducts();
            setProducts(productsData);
        } catch (err: any) {
            alert(err.message || "Error al cargar productos");
        }
    };

    const handleCreateProduct = async () => {
        try {
            await createProduct(productForm);
            await loadProducts();
            setShowProductModal(false);
            resetProductForm();
        } catch (err: any) {
            alert(err.message || "Error al crear producto");
        }
    };

    const handleUpdateProduct = async () => {
        if (!editingProduct) return;
        try {
            const updateData: ProductUpdate = {
                name: productForm.name || undefined,
                description: productForm.description || undefined,
                price: productForm.price || undefined,
                image_url: productForm.image_url || undefined,
                stock: productForm.stock || undefined,
                is_active: productForm.is_active
            };
            await updateProduct(editingProduct.id, updateData);
            await loadProducts();
            setShowProductModal(false);
            setEditingProduct(null);
            resetProductForm();
        } catch (err: any) {
            alert(err.message || "Error al actualizar producto");
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;
        try {
            await deleteProduct(productId);
            await loadProducts();
        } catch (err: any) {
            alert(err.message || "Error al eliminar producto");
        }
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            description: product.description || "",
            price: product.price,
            image_url: product.image_url || "",
            stock: product.stock || 0,
            is_active: product.is_active
        });
        setShowProductModal(true);
    };

    const resetProductForm = () => {
        setProductForm({
            name: "",
            description: "",
            price: 0,
            image_url: "",
            stock: 0,
            is_active: true
        });
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
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`px-6 py-3 font-medium transition-all ${activeTab === "products"
                            ? "border-b-2 border-[var(--foreground)] text-[var(--foreground)]"
                            : "text-[var(--foreground)] opacity-60 hover:opacity-100"
                            }`}
                    >
                        Productos ({products.length})
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

                {/* Products Tab */}
                {activeTab === "products" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-title font-bold text-[var(--foreground)]">
                                Gestión de Productos
                            </h2>
                            <button
                                onClick={() => {
                                    setEditingProduct(null);
                                    resetProductForm();
                                    setShowProductModal(true);
                                }}
                                className="bg-[var(--accent)] text-[var(--foreground)] px-6 py-2 rounded-lg font-text font-semibold hover:opacity-90 transition-all shadow-sm"
                            >
                                + Nuevo Producto
                            </button>
                        </div>

                        <div className="overflow-x-auto bg-[var(--accent)] rounded-xl border border-[var(--border)]">
                            <table className="w-full">
                                <thead className="border-b border-[var(--border)]">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                                            Imagen
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                                            Nombre
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                                            Precio
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                                            Stock
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                                            Estado
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-medium text-[var(--foreground)]">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="border-b border-[var(--border)] hover:bg-[var(--background)]/50 transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="relative w-12 h-12 bg-white rounded border border-[var(--border)] overflow-hidden">
                                                    {p.image_url ? (
                                                        <img
                                                            src={p.image_url}
                                                            alt={p.name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[var(--foreground)] opacity-30">
                                                            🖼️
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-[var(--foreground)] font-medium">
                                                {p.name}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-[var(--foreground)] font-mono">
                                                ${p.price.toLocaleString("es-AR")}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-[var(--foreground)]">
                                                {p.stock}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {p.is_active ? (
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-medium">
                                                        Activo
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-full text-xs">
                                                        Inactivo
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(p)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(p.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Modal */}
            {showProductModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center sticky top-0 bg-[var(--background)] z-10">
                            <h3 className="text-xl font-title font-bold text-[var(--foreground)]">
                                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                            </h3>
                            <button
                                onClick={() => setShowProductModal(false)}
                                className="text-[var(--foreground)] opacity-50 hover:opacity-100 text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                    Imagen del Producto
                                </label>
                                <div className="flex items-center gap-6">
                                    <div className="relative w-32 h-32 bg-[var(--accent)] rounded-xl border border-[var(--border)] overflow-hidden flex items-center justify-center">
                                        {productForm.image_url ? (
                                            <img
                                                src={productForm.image_url}
                                                alt="Preview"
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <span className="text-4xl opacity-30">🖼️</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setProductForm({ ...productForm, image_url: reader.result as string });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            className="hidden"
                                            id="product-image-upload"
                                        />
                                        <label
                                            htmlFor="product-image-upload"
                                            className="inline-block bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] px-4 py-2 rounded-lg cursor-pointer hover:bg-[var(--hover-bg)] transition-colors"
                                        >
                                            Seleccionar Imagen
                                        </label>
                                        <p className="text-xs text-[var(--foreground)] opacity-50 mt-2">
                                            JPG, PNG o WEBP. Máx 5MB.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        value={productForm.name}
                                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
                                        placeholder="Ej: Taza Cerámica Blanca"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                        Precio ($)
                                    </label>
                                    <input
                                        type="number"
                                        value={productForm.price}
                                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--accent)] outline-none font-mono"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                        Stock
                                    </label>
                                    <input
                                        type="number"
                                        value={productForm.stock}
                                        onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--accent)] outline-none font-mono"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="flex items-end pb-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={productForm.is_active}
                                            onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })}
                                            className="w-5 h-5 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                                        />
                                        <span className="text-sm font-medium text-[var(--foreground)]">
                                            Producto Activo
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--accent)] outline-none min-h-[100px]"
                                    placeholder="Detalles del producto..."
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-[var(--border)] flex justify-end gap-4 sticky bottom-0 bg-[var(--background)] z-10">
                            <button
                                onClick={() => setShowProductModal(false)}
                                className="px-6 py-2 text-[var(--foreground)] opacity-70 hover:opacity-100 font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                                className="bg-[var(--accent)] text-[var(--foreground)] px-8 py-2 rounded-lg font-text font-semibold hover:opacity-90 transition-all shadow-sm"
                            >
                                {editingProduct ? "Guardar Cambios" : "Crear Producto"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
