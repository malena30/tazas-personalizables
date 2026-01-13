"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { listDesigns, deleteDesign, toggleFavoriteDesign, Design } from '@/lib/api';

interface DesignLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onLoadDesign: (design: Design) => void;
}

export default function DesignLibrary({ isOpen, onClose, onLoadDesign }: DesignLibraryProps) {
    const [designs, setDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

    // Cargar diseños cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            loadDesigns();
        }
    }, [isOpen]);

    const loadDesigns = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await listDesigns();
            setDesigns(data);
        } catch (err) {
            setError('Error al cargar los diseños');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = async (id: string) => {
        try {
            const updatedDesign = await toggleFavoriteDesign(id);
            setDesigns(designs.map(d => d.id === id ? updatedDesign : d));
        } catch (err) {
            console.error('Error toggling favorite:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este diseño?')) return;

        try {
            await deleteDesign(id);
            setDesigns(designs.filter(d => d.id !== id));
        } catch (err) {
            alert('Error al eliminar el diseño');
            console.error(err);
        }
    };

    const handleLoad = (design: Design) => {
        onLoadDesign(design);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-title font-bold text-gray-900">Mis Diseños</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${showOnlyFavorites
                                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                                }`}
                        >
                            {showOnlyFavorites ? '★ Solo Favoritos' : '☆ Mostrar Todos'}
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Cargando diseños...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-12">
                            <p className="text-red-500">{error}</p>
                            <button
                                onClick={loadDesigns}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Reintentar
                            </button>
                        </div>
                    )}

                    {!loading && !error && designs.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No tienes diseños guardados</p>
                        </div>
                    )}

                    {!loading && !error && designs.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {designs
                                .filter(d => !showOnlyFavorites || d.is_favorite)
                                .map((design) => (
                                    <div
                                        key={design.id}
                                        className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        {/* Thumbnail */}
                                        <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                                            {design.thumbnail ? (
                                                <Image
                                                    src={design.thumbnail}
                                                    alt={design.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="text-gray-400 text-4xl">🖼️</div>
                                            )}

                                            {/* Favorite Toggle Overlay */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleFavorite(design.id);
                                                }}
                                                className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${design.is_favorite
                                                    ? 'bg-yellow-400 text-white'
                                                    : 'bg-white/80 text-gray-400 hover:text-yellow-500'
                                                    }`}
                                            >
                                                {design.is_favorite ? '★' : '☆'}
                                            </button>
                                        </div>

                                        {/* Info */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {design.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Date(design.updated_at).toLocaleDateString()}
                                            </p>

                                            {/* Actions */}
                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={() => handleLoad(design)}
                                                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-semibold"
                                                >
                                                    Cargar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(design.id)}
                                                    className="px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 text-sm font-semibold"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
