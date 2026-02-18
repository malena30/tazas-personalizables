import { CanvasElement } from '@/types/customizer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper para obtener headers de autenticación
function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export interface Design {
    id: string;
    user_id?: string;
    name: string;
    mug_color: string;
    elements: CanvasElement[];
    thumbnail?: string;
    is_favorite?: boolean;
    created_at: string;
    updated_at: string;
}

export interface DesignCreate {
    name: string;
    mug_color: string;
    elements: CanvasElement[];
    thumbnail?: string;
}

export interface DesignUpdate {
    name?: string;
    mug_color?: string;
    elements?: CanvasElement[];
    thumbnail?: string;
}

export interface UserRegister {
    username: string;
    email: string;
    password: string;
}

export interface UserLogin {
    username: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    is_admin: boolean;
    phone?: string;
    avatar_url?: string;
    addresses?: Address[];
    created_at: string;
}

// --- AUTH FUNCTIONS ---

export async function registerUser(data: UserRegister): Promise<User> {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        let errorMessage = 'Error al registrarse';
        if (error.detail) {
            if (Array.isArray(error.detail)) {
                errorMessage = error.detail.map((err: any) => err.msg).join(', ');
            } else {
                errorMessage = error.detail;
            }
        }
        throw new Error(errorMessage);
    }
    return response.json();
}

export async function loginUser(data: UserLogin): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        let errorMessage = 'Error al iniciar sesión';
        if (error.detail) {
            if (Array.isArray(error.detail)) {
                errorMessage = error.detail.map((err: any) => err.msg).join(', ');
            } else {
                errorMessage = error.detail;
            }
        }
        throw new Error(errorMessage);
    }
    return response.json();
}

export async function getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Error al obtener usuario');
    return response.json();
}

// --- PASSWORD RESET FUNCTIONS ---

export async function requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error al solicitar recuperación');
    }
    return response.json();
}

export async function resetPassword(token: string, new_password: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password }),
    });
    if (!response.ok) {
        const error = await response.json();
        let errorMessage = 'Error al restablecer contraseña';
        if (error.detail) {
            if (Array.isArray(error.detail)) {
                errorMessage = error.detail.map((err: any) => err.msg).join(', ');
            } else {
                errorMessage = error.detail;
            }
        }
        throw new Error(errorMessage);
    }
    return response.json();
}

// --- DESIGN FUNCTIONS (PROTECTED) ---

// Crear nuevo diseño
export async function saveDesign(data: DesignCreate): Promise<Design> {
    const response = await fetch(`${API_URL}/api/designs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        if (response.status === 401) throw new Error('Debes iniciar sesión para guardar');
        throw new Error('Error al guardar el diseño');
    }

    return response.json();
}

// Listar diseños
export async function listDesigns(page: number = 0, limit: number = 20): Promise<Design[]> {
    const headers = getAuthHeaders();
    if (!headers.Authorization) return []; // Si no hay token, retornar lista vacía o lanzar error

    const response = await fetch(
        `${API_URL}/api/designs?skip=${page * limit}&limit=${limit}`,
        { headers }
    );

    if (!response.ok) {
        if (response.status === 401) throw new Error('Sesión expirada');
        throw new Error('Error al cargar los diseños');
    }

    return response.json();
}

// Obtener un diseño específico
export async function loadDesign(id: string): Promise<Design> {
    const response = await fetch(`${API_URL}/api/designs/${id}`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        if (response.status === 401) throw new Error('No tienes permiso para ver este diseño');
        throw new Error('Diseño no encontrado');
    }

    return response.json();
}

// Actualizar diseño
export async function updateDesign(id: string, data: DesignUpdate): Promise<Design> {
    const response = await fetch(`${API_URL}/api/designs/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        if (response.status === 401) throw new Error('No tienes permiso para editar este diseño');
        throw new Error('Error al actualizar el diseño');
    }

    return response.json();
}

// Eliminar diseño
export async function deleteDesign(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/designs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        if (response.status === 401) throw new Error('No tienes permiso para eliminar este diseño');
        throw new Error('Error al eliminar el diseño');
    }
}
// --- ORDER FUNCTIONS ---

export interface OrderItemCreate {
    design_id?: string;
    product_id?: string;
    quantity: number;
    price: number;
}

export interface OrderCreate {
    items: OrderItemCreate[];
    shipping_address: any;
    payment_method: string;
    total_amount: number;
}

export interface OrderItemResponse {
    id: string;
    design_id?: string;
    product_id?: string;
    quantity: number;
    price: number;
    design?: Design;
}

export interface OrderResponse {
    id: string;
    total_amount: number;
    status: string;
    shipping_address: any;
    payment_method: string;
    checkout_url?: string;
    created_at: string;
    items: OrderItemResponse[];
}

export async function createOrder(data: OrderCreate): Promise<OrderResponse> {
    const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        if (response.status === 401) throw new Error('Debes iniciar sesión para comprar');
        throw new Error('Error al crear la orden');
    }

    return response.json();
}

export async function getOrders(): Promise<OrderResponse[]> {
    const headers = getAuthHeaders();
    if (!headers.Authorization) return [];

    const response = await fetch(`${API_URL}/api/orders`, {
        headers
    });

    if (!response.ok) {
        throw new Error('Error al obtener historial de órdenes');
    }

    return response.json();
}

// --- ADMIN FUNCTIONS ---

export interface AdminStats {
    total_sales: number;
    total_orders: number;
    pending_orders: number;
    paid_orders: number;
    failed_orders: number;
    total_users: number;
    total_designs: number;
}

export interface AdminUserResponse {
    id: string;
    username: string;
    email: string;
    is_admin: boolean;
    created_at: string;
    order_count: number;
    design_count: number;
}

export interface AdminOrderResponse {
    id: string;
    user_id?: string;
    user?: User;
    total_amount: number;
    status: string;
    shipping_address: any;
    payment_method: string;
    checkout_url?: string;
    created_at: string;
    items: OrderItemResponse[];
}

export async function getAdminStats(): Promise<AdminStats> {
    const response = await fetch(`${API_URL}/api/admin/stats`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        if (response.status === 403) throw new Error('No tienes permisos de administrador');
        throw new Error('Error al obtener estadísticas');
    }

    return response.json();
}

export async function getAdminOrders(filters?: {
    status?: string;
    user_id?: string;
    skip?: number;
    limit?: number;
}): Promise<AdminOrderResponse[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status_filter', filters.status);
    if (filters?.user_id) params.append('user_id', filters.user_id);
    if (filters?.skip !== undefined) params.append('skip', filters.skip.toString());
    if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());

    const response = await fetch(
        `${API_URL}/api/admin/orders?${params.toString()}`,
        { headers: getAuthHeaders() }
    );

    if (!response.ok) {
        if (response.status === 403) throw new Error('No tienes permisos de administrador');
        throw new Error('Error al obtener órdenes');
    }

    return response.json();
}

export async function updateOrderStatus(orderId: string, status: string): Promise<OrderResponse> {
    const response = await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        if (response.status === 403) throw new Error('No tienes permisos de administrador');
        throw new Error('Error al actualizar estado de orden');
    }

    return response.json();
}

export async function getAdminUsers(skip: number = 0, limit: number = 50): Promise<AdminUserResponse[]> {
    const response = await fetch(
        `${API_URL}/api/admin/users?skip=${skip}&limit=${limit}`,
        { headers: getAuthHeaders() }
    );

    if (!response.ok) {
        if (response.status === 403) throw new Error('No tienes permisos de administrador');
        throw new Error('Error al obtener usuarios');
    }

    return response.json();
}

// --- PROFILE FUNCTIONS ---

export interface Address {
    name: string;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone?: string;
}

export interface UserProfileUpdate {
    email?: string;
    phone?: string;
    avatar_url?: string;
    addresses?: Address[];
    current_password?: string;
    new_password?: string;
}

export interface UserStats {
    total_spent: number;
    total_orders: number;
    paid_orders: number;
    pending_orders: number;
    failed_orders: number;
    total_designs: number;
}

export async function updateUserProfile(data: UserProfileUpdate): Promise<User> {
    const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error al actualizar perfil');
    }

    return response.json();
}

export async function getUserStats(): Promise<UserStats> {
    const response = await fetch(`${API_URL}/auth/profile/stats`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Error al obtener estadísticas');
    }

    return response.json();
}

export async function toggleFavoriteDesign(designId: string): Promise<Design> {
    const response = await fetch(`${API_URL}/api/designs/${designId}/favorite`, {
        method: 'PATCH',
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Error al actualizar favorito');
    }

    return response.json();
}

// --- PRODUCT API ---

export interface Product {
    id: string;
    name: string;
    slug?: string;
    description?: string;
    price: number;
    image_url?: string;
    gallery_urls?: string[];
    material?: string;
    capacity?: string;
    care_instructions?: string;
    finish?: string;
    stock?: number;
    image_fit?: 'contain' | 'cover';
    image_scale?: number;
    category?: 'frases' | 'formas';
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductCreate {
    name: string;
    slug?: string;
    description?: string;
    price: number;
    image_url?: string;
    gallery_urls?: string[];
    material?: string;
    capacity?: string;
    care_instructions?: string;
    finish?: string;
    stock?: number;
    image_fit?: 'contain' | 'cover';
    image_scale?: number;
    category?: 'frases' | 'formas';
    is_active?: boolean;
}

export interface ProductUpdate {
    name?: string;
    slug?: string;
    description?: string;
    price?: number;
    image_url?: string;
    gallery_urls?: string[];
    material?: string;
    capacity?: string;
    care_instructions?: string;
    finish?: string;
    stock?: number;
    image_fit?: 'contain' | 'cover';
    image_scale?: number;
    category?: 'frases' | 'formas';
    is_active?: boolean;
}

export async function getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/api/products`);

    if (!response.ok) {
        throw new Error('Error al obtener productos');
    }

    return response.json();
}

export async function getProduct(productId: string): Promise<Product> {
    const response = await fetch(`${API_URL}/api/products/${productId}`);

    if (!response.ok) {
        throw new Error('Error al obtener el producto');
    }

    return response.json();
}

export async function getProductBySlug(slug: string): Promise<Product> {
    const response = await fetch(`${API_URL}/api/products/slug/${slug}`);

    if (!response.ok) {
        throw new Error('Error al obtener el producto');
    }

    return response.json();
}

export async function getAllProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/api/products/all`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Error al obtener todos los productos');
    }

    return response.json();
}

export async function createProduct(product: ProductCreate): Promise<Product> {
    const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(product)
    });

    if (!response.ok) {
        throw new Error('Error al crear producto');
    }

    return response.json();
}

export async function updateProduct(productId: string, product: ProductUpdate): Promise<Product> {
    const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(product)
    });

    if (!response.ok) {
        throw new Error('Error al actualizar producto');
    }

    return response.json();
}

export async function deleteProduct(productId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Error al eliminar producto');
    }
}
