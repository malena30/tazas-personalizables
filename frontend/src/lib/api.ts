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
        throw new Error(error.detail || 'Error al registrarse');
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
        throw new Error(error.detail || 'Error al iniciar sesión');
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
