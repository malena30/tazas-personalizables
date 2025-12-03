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
    // Advanced Text Props
    stroke?: string;
    onStrokeChange: (color: string) => void;
    strokeWidth?: number;
    onStrokeWidthChange: (width: number) => void;
    shadowColor?: string;
    onShadowColorChange: (color: string) => void;
    shadowBlur?: number;
    onShadowBlurChange: (blur: number) => void;
}

type Tab = 'producto' | 'capas' | 'imagen' | 'texto' | null;

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
    stroke,
    onStrokeChange,
    strokeWidth,
    onStrokeWidthChange,
    shadowColor,
    onShadowColorChange,
    shadowBlur,
    onShadowBlurChange
}: ToolbarProps) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState<Tab>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result as string;
                onAddImage(imageUrl);
            };
            reader.readAsDataURL(file);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleTabClick = (tab: Tab) => {
        if (activeTab === tab) {
            setActiveTab(null);
        } else {
            setActiveTab(tab);
        }
    };

    const tabs: { id: Tab; label: string; icon: string }[] = [
        { id: 'producto', label: 'Producto', icon: '☕' },
        { id: 'capas', label: 'Capas', icon: '📚' },
        { id: 'imagen', label: 'Imagen', icon: '🖼️' },
        { id: 'texto', label: 'Texto', icon: 'T' }
    ];

    return (
        <div className="flex gap-0">
            {/* Barra lateral de iconos */}
            <div className="w-16 bg-[var(--background)] border border-[var(--border)] rounded-l-lg flex flex-col">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        title={tab.label}
                        className={`h-16 w-full flex flex-col items-center justify-center gap-1 border-b border-[var(--border)] transition-colors ${activeTab === tab.id
                            ? 'bg-[var(--accent)] text-[var(--foreground)]'
                            : 'bg-[var(--background)] text-[var(--foreground)] opacity-60 hover:opacity-100 hover:bg-[var(--hover-bg)]'
                            }`}
                    >
                        <span className="text-2xl">{tab.icon}</span>
                        <span className="text-xs font-text">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Panel lateral */}
            {activeTab && (
                <aside className="w-80 bg-[var(--background)] border-t border-r border-b border-[var(--border)] rounded-r-lg flex flex-col">
                    <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
                        <h2 className="text-lg font-title font-semibold text-[var(--foreground)]">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h2>
                        <button
                            onClick={() => setActiveTab(null)}
                            className="text-[var(--foreground)] opacity-60 hover:opacity-100 text-xl"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-6 space-y-4 flex-1 overflow-y-auto" style={{ maxHeight: '80vh' }}>
                        {/* TAB: Producto */}
                        {activeTab === 'producto' && (
                            <>
                                <div>
                                    <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-2">
                                        Color del Producto
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

                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        💡 Arrastrá la taza con el mouse para rotarla
                                    </p>
                                </div>
                            </>
                        )}

                        {/* TAB: Capas */}
                        {activeTab === 'capas' && (
                            <>
                                {hasSelection ? (
                                    <>
                                        <div className="p-4 bg-[var(--accent)] bg-opacity-10 border border-[var(--accent)] rounded-lg">
                                            <p className="text-sm font-semibold text-[var(--foreground)]">
                                                ✅ Elemento seleccionado
                                            </p>
                                            <p className="text-xs text-[var(--foreground)] opacity-70 mt-1">
                                                Organizá el orden de tus elementos
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-2">
                                                Organizar Orden
                                            </h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={onBringToFront}
                                                    className="px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded font-text text-sm hover:bg-[var(--hover-bg)] transition-colors text-[var(--foreground)]"
                                                >
                                                    ⬆️ Traer al frente
                                                </button>
                                                <button
                                                    onClick={onSendToBack}
                                                    className="px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded font-text text-sm hover:bg-[var(--hover-bg)] transition-colors text-[var(--foreground)]"
                                                >
                                                    ⬇️ Enviar atrás
                                                </button>
                                            </div>
                                        </div>

                                        <hr className="border-[var(--border)]" />

                                        <div>
                                            <h3 className="text-sm font-title font-semibold text-red-600 mb-2">
                                                Eliminar Elemento
                                            </h3>
                                            <button
                                                onClick={onDelete}
                                                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-text font-semibold hover:bg-red-700 transition-colors"
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-sm text-yellow-800">
                                            💡 Seleccioná un elemento en la taza para organizarlo
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* TAB: Imagen */}
                        {activeTab === 'imagen' && (
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

                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800 text-center">
                                        💡 Hacé click en la imagen para seleccionarla y moverla
                                    </p>
                                </div>
                            </>
                        )}

                        {/* TAB: Texto */}
                        {activeTab === 'texto' && (
                            <>
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

                                <hr className="border-[var(--border)]" />

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

                                <hr className="border-[var(--border)]" />

                                {/* Borde (Stroke) */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-title font-semibold text-[var(--foreground)]">
                                            Borde
                                        </h3>
                                        <input
                                            type="checkbox"
                                            checked={!!stroke}
                                            onChange={(e) => onStrokeChange(e.target.checked ? '#000000' : '')}
                                            disabled={!hasSelection}
                                            className="w-4 h-4 rounded border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)]"
                                        />
                                    </div>
                                    {stroke && (
                                        <div className="space-y-2 pl-2 border-l-2 border-[var(--border)]">
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={stroke}
                                                    onChange={(e) => onStrokeChange(e.target.value)}
                                                    className="w-8 h-8 rounded border border-[var(--border)] cursor-pointer"
                                                />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="10"
                                                    step="0.5"
                                                    value={strokeWidth || 0}
                                                    onChange={(e) => onStrokeWidthChange(parseFloat(e.target.value))}
                                                    className="flex-1"
                                                />
                                            </div>
                                            <p className="text-xs text-right font-mono text-[var(--foreground)] opacity-70">
                                                Grosor: {strokeWidth}px
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Sombra (Shadow) */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-title font-semibold text-[var(--foreground)]">
                                            Sombra
                                        </h3>
                                        <input
                                            type="checkbox"
                                            checked={!!shadowColor}
                                            onChange={(e) => onShadowColorChange(e.target.checked ? '#000000' : '')}
                                            disabled={!hasSelection}
                                            className="w-4 h-4 rounded border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)]"
                                        />
                                    </div>
                                    {shadowColor && (
                                        <div className="space-y-2 pl-2 border-l-2 border-[var(--border)]">
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={shadowColor}
                                                    onChange={(e) => onShadowColorChange(e.target.value)}
                                                    className="w-8 h-8 rounded border border-[var(--border)] cursor-pointer"
                                                />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="20"
                                                    value={shadowBlur || 0}
                                                    onChange={(e) => onShadowBlurChange(parseInt(e.target.value))}
                                                    className="flex-1"
                                                />
                                            </div>
                                            <p className="text-xs text-right font-mono text-[var(--foreground)] opacity-70">
                                                Difuminado: {shadowBlur}px
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {!hasSelection && (
                                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-sm text-yellow-800">
                                            💡 Agregá un texto y seleccionalo para editarlo
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </aside>
            )
            }
        </div >
    );
}
