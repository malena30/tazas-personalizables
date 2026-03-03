"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import {
    LuLayoutDashboard,
    LuWand,
    LuShoppingBag,
    LuUsers,
    LuPackage,
    LuActivity,
    LuPlus,
    LuSearch,
    LuEllipsisVertical,
    LuTrash2,
    LuPencil,
    LuCircleCheck,
    LuClock,
    LuInfo,
    LuArrowLeft,
    LuTrendingUp,
    LuSave,
    LuX
} from "react-icons/lu";

export default function AdminPanel() {
    const { user, loading: authLoading } = useAuth();
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
    const [showImageEditModal, setShowImageEditModal] = useState(false);
    const [productForm, setProductForm] = useState<ProductCreate>({
        name: "",
        slug: "",
        description: "",
        price: 0,
        image_url: "",
        gallery_urls: [],
        material: "",
        capacity: "",
        care_instructions: "",
        finish: "",
        stock: 0,
        image_fit: "contain",
        image_scale: 1.0,
        category: "frases",
        is_active: true
    });

    useEffect(() => {
        if (authLoading) return;

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
                slug: productForm.slug || undefined,
                description: productForm.description || undefined,
                price: productForm.price || undefined,
                image_url: productForm.image_url || undefined,
                gallery_urls: productForm.gallery_urls,
                material: productForm.material || undefined,
                capacity: productForm.capacity || undefined,
                care_instructions: productForm.care_instructions || undefined,
                finish: productForm.finish || undefined,
                stock: productForm.stock || undefined,
                image_fit: productForm.image_fit || undefined,
                image_scale: productForm.image_scale || undefined,
                category: productForm.category || undefined,
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
            slug: product.slug || "",
            description: product.description || "",
            price: product.price,
            image_url: product.image_url || "",
            gallery_urls: product.gallery_urls || [],
            material: product.material || "",
            capacity: product.capacity || "",
            care_instructions: product.care_instructions || "",
            finish: product.finish || "",
            stock: product.stock || 0,
            image_fit: product.image_fit || "contain",
            image_scale: product.image_scale || 1.0,
            category: product.category || "frases",
            is_active: product.is_active
        });
        setShowProductModal(true);
    };

    const resetProductForm = () => {
        setShowImageEditModal(false);
        setProductForm({
            name: "",
            slug: "",
            description: "",
            price: 0,
            image_url: "",
            gallery_urls: [],
            material: "",
            capacity: "",
            care_instructions: "",
            finish: "",
            stock: 0,
            image_fit: "contain",
            image_scale: 1.0,
            category: "frases",
            is_active: true
        });
    };

    if (!user || !user.is_admin) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-600/20 border-t-purple-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Cargando panel de control...</p>
                </div>
            </div>
        );
    }

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: <LuLayoutDashboard /> },
        { id: "orders", label: "Órdenes", icon: <LuShoppingBag /> },
        { id: "users", label: "Usuarios", icon: <LuUsers /> },
        { id: "products", label: "Productos", icon: <LuPackage /> },
    ];

    return (
        <div className="min-h-screen bg-cream flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--card)] border-r border-[var(--border)] hidden lg:flex flex-col sticky top-0 h-screen">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                            <LuTrendingUp size={20} />
                        </div>
                        <span className="text-xl font-bold text-[var(--foreground)] tracking-tight">AdminPanel</span>
                    </div>

                    <nav className="space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === item.id
                                    ? "bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 shadow-sm"
                                    : "text-[var(--foreground)] opacity-50 hover:opacity-100 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-[var(--border)]">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)] opacity-50 hover:opacity-100 hover:text-purple-600 transition-all"
                    >
                        <LuArrowLeft size={14} />
                        Volver a la tienda
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight capitalize">
                            {activeTab === 'dashboard' ? 'Resumen General' : menuItems.find(i => i.id === activeTab)?.label || activeTab}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {activeTab === 'dashboard' && 'Visualiza el rendimiento de tu negocio en tiempo real.'}
                            {activeTab === 'orders' && 'Gestiona y realiza seguimiento de todos los pedidos.'}
                            {activeTab === 'users' && 'Administra la base de datos de tus clientes.'}
                            {activeTab === 'products' && 'Controla tu inventario y catálogo de productos.'}
                        </p>
                    </div>


                </header>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 flex items-center gap-3">
                        <LuInfo />
                        {error}
                    </div>
                )}

                {/* Dashboard Tab */}
                {activeTab === "dashboard" && stats && (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Total Sales */}
                            <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                        <LuActivity size={20} />
                                    </div>
                                    <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                                        +12%
                                    </span>
                                </div>
                                <div className="text-sm font-black text-[var(--foreground)] opacity-50">Total Ventas</div>
                                <div className="text-3xl font-black text-[var(--foreground)] mt-1">
                                    ${stats.total_sales.toLocaleString('es-AR')}
                                </div>
                                <div className="text-xs text-[var(--foreground)] opacity-40 mt-4">
                                    De {stats.paid_orders} órdenes pagadas
                                </div>
                            </div>

                            {/* Total Orders */}
                            <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                        <LuShoppingBag size={20} />
                                    </div>
                                </div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Órdenes</div>
                                <div className="text-3xl font-black text-[var(--foreground)] mt-1">
                                    {stats.total_orders}
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                                        {stats.paid_orders} Pagadas
                                    </span>
                                    <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full">
                                        {stats.pending_orders} Pend.
                                    </span>
                                </div>
                            </div>

                            {/* Users */}
                            <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                        <LuUsers size={20} />
                                    </div>
                                </div>
                                <div className="text-sm font-black text-[var(--foreground)] opacity-50">Usuarios</div>
                                <div className="text-3xl font-black text-[var(--foreground)] mt-1">
                                    {stats.total_users}
                                </div>
                                <div className="text-xs text-[var(--foreground)] opacity-40 mt-4">
                                    Clientes registrados
                                </div>
                            </div>

                            {/* Designs */}
                            <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                                        <LuWand size={20} />
                                    </div>
                                </div>
                                <div className="text-sm font-black text-[var(--foreground)] opacity-50">Órdenes</div>
                                <div className="text-3xl font-black text-[var(--foreground)] mt-1">
                                    {stats.total_orders}
                                </div>
                                <div className="text-xs text-[var(--foreground)] opacity-40 mt-4">
                                    {stats.pending_orders} pendientes de pago
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Placeholder */}
                        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm p-8">
                            <h3 className="text-lg font-bold text-[var(--foreground)] mb-6">Actividad Reciente</h3>
                            <div className="space-y-6">
                                {orders.slice(0, 5).map((order) => (
                                    <div key={order.id} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2 h-2 rounded-full ${order.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                            <div>
                                                <p className="text-sm font-bold text-[var(--foreground)]">Nueva orden #{order.id.substring(0, 8)}</p>
                                                <p className="text-xs text-gray-500">{order.user?.username || 'Invitado'} • {new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold text-[var(--foreground)]">
                                            ${order.total_amount.toLocaleString('es-AR')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === "orders" && (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-cream p-4 rounded-2xl border border-[var(--border)] shadow-sm">
                            <div className="relative flex-1 w-full">
                                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por ID o usuario..."
                                    className="w-full pl-12 pr-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-[#D4A373] placeholder-[#D4A373]/50"
                                />
                            </div>
                            <select
                                value={orderFilter}
                                onChange={(e) => setOrderFilter(e.target.value)}
                                className="px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-[var(--border)] rounded-xl text-[#D4A373] outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">Todos los estados</option>
                                <option value="pending">Pendientes</option>
                                <option value="paid">Pagadas</option>
                                <option value="failed">Fallidas</option>
                            </select>
                        </div>

                        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--cream)] dark:bg-zinc-800/50 border-b border-[var(--border)]">
                                        <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-200 uppercase tracking-wider">Orden</th>
                                        <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-200 uppercase tracking-wider">Cliente</th>
                                        <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-200 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-200 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-200 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-200 uppercase tracking-wider text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {orders
                                        .filter((order) => !orderFilter || order.status === orderFilter)
                                        .map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-mono font-bold text-purple-600 dark:text-purple-400">
                                                        #{order.id.substring(0, 8)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">
                                                            {order.user?.username?.substring(0, 2).toUpperCase() || 'IN'}
                                                        </div>
                                                        <span className="text-sm font-medium text-[var(--foreground)]">
                                                            {order.user?.username || "Invitado"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-black text-[var(--foreground)]">
                                                        ${order.total_amount.toLocaleString('es-AR')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === "paid"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                        : order.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                        }`}>
                                                        {order.status === 'paid' && <LuCircleCheck size={10} />}
                                                        {order.status === 'pending' && <LuClock size={10} />}
                                                        {order.status === 'failed' && <LuInfo size={10} />}
                                                        {order.status === 'paid' ? 'Pagado' : order.status === 'pending' ? 'Pendiente' : 'Fallido'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[var(--foreground)] opacity-70">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                        className="text-xs bg-gray-50 dark:bg-zinc-800 border border-[var(--border)] rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-purple-500"
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
                    <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-[var(--border)]">
                                    <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-200 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-200 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-200 uppercase tracking-wider">Actividad</th>
                                    <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-200 uppercase tracking-wider">Rol</th>
                                    <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-200 uppercase tracking-wider">Registro</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                                                    {u.username.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-bold text-[var(--foreground)] opacity-90">{u.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><span className="text-sm font-semibold text-[var(--foreground)] opacity-80">{u.email}</span></td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-4 text-xs">
                                                <span className="flex items-center gap-1 text-[var(--foreground)] opacity-70">
                                                    <LuShoppingBag size={10} /> {u.order_count}
                                                </span>
                                                <span className="flex items-center gap-1 text-[var(--foreground)] opacity-70">
                                                    <LuWand size={10} /> {u.design_count}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.is_admin
                                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                                : "bg-gray-100 text-black dark:bg-gray-800 dark:text-gray-200"
                                                }`}>
                                                {u.is_admin ? "Administrador" : "Cliente"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--foreground)] opacity-70">
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
                        <div className="flex justify-between items-center bg-cream p-6 rounded-2xl border border-[var(--border)] shadow-sm">
                            <div>
                                <h2 className="text-xl font-bold text-[var(--foreground)]">Catálogo de Productos</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Gestiona los artículos disponibles en tu tienda.</p>
                            </div>
                            <button
                                onClick={() => {
                                    setEditingProduct(null);
                                    setProductForm({
                                        name: "",
                                        slug: "",
                                        description: "",
                                        price: 0,
                                        image_url: "",
                                        gallery_urls: [],
                                        material: "",
                                        capacity: "",
                                        care_instructions: "",
                                        finish: "",
                                        stock: 0,
                                        is_active: true
                                    });
                                    setShowProductModal(true);
                                }}
                                className="flex items-center gap-2 bg-[var(--accent)] text-[var(--background)] px-6 py-3 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[var(--accent)]/20"
                            >
                                <LuPlus size={18} />
                                Nuevo Producto
                            </button>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--cream)] dark:bg-zinc-800/50 border-b border-[var(--border)]">
                                        <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-200 uppercase tracking-wider">Producto</th>
                                        <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-200 uppercase tracking-wider">Precio</th>
                                        <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-200 uppercase tracking-wider">Stock</th>
                                        <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-200 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-200 uppercase tracking-wider text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {products
                                        .filter(p => p.slug !== 'taza-personalizada')
                                        .map((p) => (
                                            <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0 border border-[var(--border)] relative">
                                                            {p.image_url ? (
                                                                <Image src={p.image_url} alt={p.name} fill className="object-contain" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-xl">☕</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-[var(--foreground)]">{p.name}</p>
                                                            <p className="text-xs text-[var(--foreground)] opacity-60 truncate max-w-[200px]">{p.description || 'Sin descripción'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-black text-[var(--foreground)]">
                                                        ${p.price.toLocaleString('es-AR')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-sm font-bold ${p.stock && p.stock < 10 ? 'text-red-400' : 'text-[var(--foreground)]'}`}>
                                                        {p.stock} uds.
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.is_active
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                        : "bg-gray-100 text-black dark:bg-gray-800 dark:text-gray-400"
                                                        }`}>
                                                        {p.is_active ? "Activo" : "Inactivo"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => openEditModal(p)}
                                                            className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                                                            title="Editar"
                                                        >
                                                            <LuPencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(p.id)}
                                                            className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            <LuTrash2 size={16} />
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
            </main>

            {/* Product Modal */}
            {showProductModal && (
                <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-cream rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[var(--border)] animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b border-[var(--border)] flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
                                    {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Completa la información del catálogo.</p>
                            </div>
                            <button
                                onClick={() => setShowProductModal(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 transition-colors"
                            >
                                <LuX size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {/* Image Upload Section */}
                            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
                                <div className="relative w-40 h-40 bg-gray-50 dark:bg-zinc-800 rounded-2xl border-2 border-[var(--border)] flex items-center justify-center overflow-hidden group shadow-inner">
                                    {productForm.image_url ? (
                                        <Image
                                            src={productForm.image_url}
                                            alt="Preview"
                                            fill
                                            className={productForm.image_fit === 'cover' ? 'object-cover' : 'object-contain'}
                                            style={{ transform: productForm.image_scale ? `scale(${productForm.image_scale})` : 'scale(1)' }}
                                        />
                                    ) : (
                                        <div className="text-center p-4">
                                            <LuPackage className="mx-auto text-3xl text-gray-300 mb-2" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Sin Imagen</span>
                                        </div>
                                    )}

                                    {/* Edit Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 p-4 cursor-default">
                                        <label className="w-full py-2.5 bg-white text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-center cursor-pointer hover:bg-gray-100 transition-all shadow-lg active:scale-95">
                                            Cambiar Foto
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setProductForm({ ...productForm, image_url: reader.result as string, image_scale: 1.0 });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setShowImageEditModal(true);
                                            }}
                                            className="w-full py-2.5 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg active:scale-95"
                                        >
                                            Ajustar Imagen
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4 w-full">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre</label>
                                            <input
                                                type="text"
                                                value={productForm.name}
                                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                                className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 text-[#D4A373] placeholder-[#D4A373]/50 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                                placeholder="Ej: Taza Cerámica Premium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Colección</label>
                                            <select
                                                value={productForm.category}
                                                onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                                                className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 text-[#D4A373] focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                            >
                                                <option value="frases">Colección Frases</option>
                                                <option value="formas">Colección Formas</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Slug (URL)</label>
                                            <input
                                                type="text"
                                                value={productForm.slug}
                                                onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                                                className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 text-[#D4A373] placeholder-[#D4A373]/50 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                                placeholder="ej: taza-ceramica-premium"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Precio ($)</label>
                                            <input
                                                type="number"
                                                value={productForm.price}
                                                onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                                                className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 text-[#D4A373] placeholder-[#D4A373]/50 focus:ring-2 focus:ring-purple-500 outline-none font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stock</label>
                                            <input
                                                type="number"
                                                value={productForm.stock}
                                                onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                                                className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 text-[#D4A373] placeholder-[#D4A373]/50 focus:ring-2 focus:ring-purple-500 outline-none font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Descripción</label>
                                <textarea
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                    className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 text-[#D4A373] placeholder-[#D4A373]/50 focus:ring-2 focus:ring-purple-500 outline-none min-h-[80px] resize-none transition-all"
                                    placeholder="Describe las características del producto..."
                                />
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-black uppercase tracking-widest text-[var(--foreground)]">Detalles Técnicos</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Material</label>
                                        <input
                                            type="text"
                                            value={productForm.material}
                                            onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                                            className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-2 text-sm text-[#D4A373] placeholder-[#D4A373]/50 outline-none"
                                            placeholder="Cerámica Premium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Capacidad</label>
                                        <input
                                            type="text"
                                            value={productForm.capacity}
                                            onChange={(e) => setProductForm({ ...productForm, capacity: e.target.value })}
                                            className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-2 text-sm text-[#D4A373] placeholder-[#D4A373]/50 outline-none"
                                            placeholder="325ml / 11oz"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Acabado</label>
                                        <input
                                            type="text"
                                            value={productForm.finish}
                                            onChange={(e) => setProductForm({ ...productForm, finish: e.target.value })}
                                            className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-2 text-sm text-[#D4A373] placeholder-[#D4A373]/50 outline-none"
                                            placeholder="Brillante / Mate"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Cuidados</label>
                                        <input
                                            type="text"
                                            value={productForm.care_instructions}
                                            onChange={(e) => setProductForm({ ...productForm, care_instructions: e.target.value })}
                                            className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-2 text-sm text-[#D4A373] placeholder-[#D4A373]/50 outline-none"
                                            placeholder="Apto Microondas"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Galería de Imágenes (URLs separadas por coma)</label>
                                <textarea
                                    value={productForm.gallery_urls?.join(", ")}
                                    onChange={(e) => setProductForm({ ...productForm, gallery_urls: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                                    className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 text-[#D4A373] placeholder-[#D4A373]/50 focus:ring-2 focus:ring-purple-500 outline-none min-h-[60px] resize-none transition-all text-xs font-mono"
                                    placeholder="https://url1.jpg, https://url2.jpg..."
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[var(--border)]">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${productForm.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                                        <LuCircleCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[var(--foreground)]">Estado del Producto</p>
                                        <p className="text-xs text-gray-500">{productForm.is_active ? 'Visible en la tienda' : 'Oculto del catálogo'}</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={productForm.is_active}
                                        onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                                </label>
                            </div>
                        </div>

                        <div className="p-8 bg-white border-t border-[var(--border)] flex justify-end gap-4">
                            <button
                                onClick={() => setShowProductModal(false)}
                                className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-[var(--foreground)] transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                                className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:bg-purple-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {editingProduct ? "Guardar Cambios" : "Crear Producto"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Adjustment Sub-Modal */}
            {showImageEditModal && (
                <div className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm border border-[var(--border)] p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-lg font-black uppercase tracking-tight text-[var(--foreground)]">Ajustar Taza</h4>
                            <button
                                onClick={() => setShowImageEditModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <LuX size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Preview inside sub-modal */}
                            <div className="aspect-square w-full bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-[var(--border)] overflow-hidden relative flex items-center justify-center shadow-inner">
                                {productForm.image_url ? (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={productForm.image_url}
                                            alt="Preview"
                                            fill
                                            className={productForm.image_fit === 'cover' ? 'object-cover' : 'object-contain'}
                                            style={{ transform: productForm.image_scale ? `scale(${productForm.image_scale})` : 'scale(1)' }}
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center p-4">
                                        <LuPackage className="mx-auto text-3xl text-gray-300 mb-2" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Sin Imagen</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Modo de Ajuste</label>
                                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                                    <button
                                        onClick={() => setProductForm({ ...productForm, image_fit: 'contain' })}
                                        className={`py-2 text-[10px] font-bold rounded-lg transition-all ${productForm.image_fit === 'contain' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        CONTENER
                                    </button>
                                    <button
                                        onClick={() => setProductForm({ ...productForm, image_fit: 'cover' })}
                                        className={`py-2 text-[10px] font-bold rounded-lg transition-all ${productForm.image_fit === 'cover' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        CUBRIR
                                    </button>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Escala / Zoom</label>
                                    <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                                        {Math.round((productForm.image_scale || 1) * 50)}%
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    step="1"
                                    value={Math.round((productForm.image_scale || 1) * 50)}
                                    onChange={(e) => setProductForm({ ...productForm, image_scale: Number(e.target.value) / 50 })}
                                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                />
                                <div className="flex justify-between mt-2">
                                    <span className="text-[8px] text-gray-400 font-bold uppercase">0%</span>
                                    <span className="text-[8px] text-gray-400 font-bold uppercase">100%</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowImageEditModal(false)}
                                className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all shadow-xl shadow-black/5 active:scale-[0.98]"
                            >
                                Aplicar y Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

