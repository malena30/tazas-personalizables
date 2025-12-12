import { CanvasElement } from '@/types/customizer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

// Crear nuevo diseño
export async function saveDesign(data: DesignCreate): Promise<Design> {
    const response = await fetch(`${API_URL}/api/designs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error al guardar el diseño');
    }

    return response.json();
}

// Listar diseños
export async function listDesigns(page: number = 0, limit: number = 20): Promise<Design[]> {
    const response = await fetch(
        `${API_URL}/api/designs?skip=${page * limit}&limit=${limit}`
    );

    if (!response.ok) {
        throw new Error('Error al cargar los diseños');
    }

    return response.json();
}

// Obtener un diseño específico
export async function loadDesign(id: string): Promise<Design> {
    const response = await fetch(`${API_URL}/api/designs/${id}`);

    if (!response.ok) {
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
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error al actualizar el diseño');
    }

    return response.json();
}

// Eliminar diseño
export async function deleteDesign(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/designs/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Error al eliminar el diseño');
    }
}
