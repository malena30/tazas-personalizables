"use client";

import { useRef, useState } from "react";

interface ToolbarProps {
    onAddImage: (imageUrl: string) => void;
    onAddText: () => void;
    onExport: () => void;
    onDelete: () => void;
    onBringToFront: () => void;
    onSendToBack: () => void;
    mugColor: string;
    onMugColorChange: (color: string) => void;
    textColor: string;
    onTextColorChange: (color: string) => void;
    fontSize: number;
    onFontSizeChange: (size: number) => void;
    fontFamily: string;
    onFontFamilyChange: (font: string) => void;
    hasSelection: boolean;
    hasElements: boolean;
    mugRotation: number;
    onRotateMug: (direction: 'left' | 'right') => void;
}

type Tab = 'elementos' | 'texto' | 'taza';

export default function Toolbar({
    onAddImage,
    onAddText,
    onExport,
    onDelete,
    onBringToFront,
    onSendToBack,
    mugColor,
    onMugColorChange,
    textColor,
    onTextColorChange,
    fontSize,
    onFontSizeChange,
    fontFamily,
    onFontFamilyChange,
    hasSelection,
    hasElements,
    mugRotation,
    onRotateMug
}: ToolbarProps) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState<Tab>('elementos');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result as string;
                onAddImage(imageUrl);
            };
            reader.readAsDataURL(file);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const tabs: { id: Tab; label: string; icon: string }[] = [
        { id: 'elementos', label: 'Elementos', icon: '📝' },
        { id: 'texto', label: 'Texto', icon: '🔤' },
        { id: 'taza', label: 'Taza', icon: '☕' }
    ];

    return (
        <aside className="lg:col-span-1 bg-[var(--background)] border border-[var(--border)] rounded-lg overflow-hidden h-fit flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-[var(--border)]">
                <h2 className="text-xl font-title font-semibold text-[var(--foreground)]">
                    Herramientas
                </h2>
            </div>

            {/* Tabs Navigation */}
            <div className="grid grid-cols-3 border-b border-[var(--border)]">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-2 py-3 font-text text-sm font-medium transition-colors flex flex-col items-center gap-1 ${activeTab === tab.id
                                ? 'bg-[var(--accent)] text-[var(--foreground)] border-b-2 border-[var(--foreground)]'
                                : 'bg-[var(--background)] text-[var(--foreground)] opacity-60 hover:opacity-100'
                            }`}
                    >
                        <span className="text-lg">{tab.icon}</span>
                        <span className="text-xs">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 space-y-4 flex-1" style={{ minHeight: '350px', maxHeight: '450px', overflowY: 'auto' }}>

                {/* TAB: Elementos */}
                {activeTab === 'elementos' && (
                    <>
                        <div>
                            <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-2">
                                Agregar Imagen
                            </h3>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full bg-[var(--accent)] text-[var(--foreground)] px-4 py-3 rounded-lg font-text font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                                📷 Subir Imagen
                            </button>
                        </div>

                        <div>
                            <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-2">
                                Agregar Texto
                            </h3>
                            <button
                                onClick={onAddText}
                                className="w-full bg-[var(--accent)] text-[var(--foreground)] px-4 py-3 rounded-lg font-text font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                                ✏️ Agregar Texto
                            </button>
                        </div>

                        {hasSelection && (
                            <>
                                <hr className="border-[var(--border)]" />
                                <div>
                                    <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-2">
                                        Elemento Seleccionado
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={onBringToFront}
                                            className="px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded font-text text-sm hover:bg-[var(--hover-bg)] transition-colors text-[var(--foreground)]"
                                        >
                                            ⬆️ Al frente
                                        </button>
                                        <button
                                            onClick={onSendToBack}
                                            className="px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded font-text text-sm hover:bg-[var(--hover-bg)] transition-colors text-[var(--foreground)]"
                                        >
                                            ⬇️ Atrás
                                        </button>
                                    </div>
                                    <button
                                        onClick={onDelete}
                                        className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded-lg font-text font-semibold hover:bg-red-700 transition-colors"
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* TAB: Texto */}
                {activeTab === 'texto' && (
                    <>
                        <div>
                            <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-2">
                                Color de Texto
                            </h3>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={textColor}
                                    onChange={(e) => onTextColorChange(e.target.value)}
                                    disabled={!hasSelection}
                                    className="w-12 h-12 rounded border-2 border-[var(--border)] cursor-pointer disabled:opacity-50"
                                />
                                <input
                                    type="text"
                                    value={textColor}
                                    onChange={(e) => onTextColorChange(e.target.value)}
                                    disabled={!hasSelection}
                                    className="flex-1 px-3 py-2 font-mono text-sm bg-[var(--background)] border border-[var(--border)] rounded text-[var(--foreground)] disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-2">
                                Tamaño de Texto
                            </h3>
                            <input
                                type="range"
                                min="12"
                                max="72"
                                value={fontSize}
                                onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
                                disabled={!hasSelection}
                                className="w-full disabled:opacity-50"
                            />
                            <p className="text-sm font-mono text-[var(--foreground)] mt-1">
                                {fontSize}px
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-2">
                                Tipografía
                            </h3>
                            <select
                                value={fontFamily}
                                onChange={(e) => onFontFamilyChange(e.target.value)}
                                disabled={!hasSelection}
                                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded font-text text-sm text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ fontFamily }}
                            >
                                <option value="Inter" style={{ fontFamily: 'Inter' }}>Inter</option>
                                <option value="Roboto" style={{ fontFamily: 'Roboto' }}>Roboto</option>
                                <option value="Montserrat" style={{ fontFamily: 'Montserrat' }}>Montserrat</option>
                                <option value="Playfair Display" style={{ fontFamily: 'Playfair Display' }}>Playfair Display</option>
                                <option value="Pacifico" style={{ fontFamily: 'Pacifico' }}>Pacifico</option>
                                <option value="Dancing Script" style={{ fontFamily: 'Dancing Script' }}>Dancing Script</option>
                                <option value="Bebas Neue" style={{ fontFamily: 'Bebas Neue' }}>Bebas Neue</option>
                                <option value="Oswald" style={{ fontFamily: 'Oswald' }}>Oswald</option>
                            </select>
                        </div>

                        {!hasSelection && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                    💡 Seleccioná un texto para editar sus propiedades
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* TAB: Taza */}
                {activeTab === 'taza' && (
                    <>
                        <div>
                            <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-2">
                                Color de Taza
                            </h3>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={mugColor}
                                    onChange={(e) => onMugColorChange(e.target.value)}
                                    className="w-12 h-12 rounded border-2 border-[var(--border)] cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={mugColor}
                                    onChange={(e) => onMugColorChange(e.target.value)}
                                    className="flex-1 px-3 py-2 font-mono text-sm bg-[var(--background)] border border-[var(--border)] rounded text-[var(--foreground)]"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-2">
                                Rotar Vista 3D
                            </h3>
                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={() => onRotateMug('left')}
                                    className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded font-text text-sm hover:bg-[var(--hover-bg)] transition-colors text-[var(--foreground)]"
                                >
                                    ← Izquierda
                                </button>
                                <div className="px-3 py-2 bg-[var(--accent)] text-[var(--foreground)] rounded font-mono text-sm font-semibold">
                                    {mugRotation}°
                                </div>
                                <button
                                    onClick={() => onRotateMug('right')}
                                    className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded font-text text-sm hover:bg-[var(--hover-bg)] transition-colors text-[var(--foreground)]"
                                >
                                    Derecha →
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                💡 Girá la taza para ver cómo se ve tu diseño desde diferentes ángulos
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Footer Fixed - Botón Finalizar */}
            <div className="p-4 border-t border-[var(--border)] bg-[var(--background)]">
                <button
                    onClick={onExport}
                    disabled={!hasElements}
                    className={`w-full px-4 py-4 rounded-lg font-text font-semibold transition-all flex items-center justify-center gap-2 text-base ${hasElements
                        ? 'bg-[var(--accent)] text-[var(--foreground)] hover:opacity-90 cursor-pointer shadow-md hover:shadow-lg'
                        : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
                        }`}
                >
                    🛒 Agregar al Carrito ($3.500)
                </button>
                {!hasElements && (
                    <p className="text-xs text-center mt-2 text-red-600">
                        Agregá al menos un elemento
                    </p>
                )}
            </div>
        </aside>
    );
}
