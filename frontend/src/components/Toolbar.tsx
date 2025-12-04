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
    shadowOpacity?: number;
    onShadowOpacityChange: (opacity: number) => void;
    shadowOffsetX?: number;
    onShadowOffsetXChange: (offset: number) => void;
    shadowOffsetY?: number;
    onShadowOffsetYChange: (offset: number) => void;
    activeTab: 'producto' | 'capas' | 'imagen' | 'texto' | null;
    onTabChange: (tab: 'producto' | 'capas' | 'imagen' | 'texto' | null) => void;
    curvature?: number;
    onCurvatureChange: (curvature: number) => void;
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
    onShadowBlurChange,
    shadowOpacity,
    onShadowOpacityChange,
    shadowOffsetX,
    onShadowOffsetXChange,
    shadowOffsetY,
    onShadowOffsetYChange,
    activeTab,
    onTabChange,
    curvature,
    onCurvatureChange
}: ToolbarProps) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    // const [activeTab, setActiveTab] = useState<Tab>(null); // State lifted to page.tsx

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
            onTabChange(null);
        } else {
            onTabChange(tab);
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
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onTabChange(null)}
                                className="text-[var(--foreground)] opacity-60 hover:opacity-100 text-xl"
                            >
                                ✕
                            </button>
                        </div>
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

                                {/* Curvatura */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-title font-semibold text-[var(--foreground)]">
                                            Curvatura
                                        </h3>
                                        <span className="text-xs font-mono text-[var(--foreground)] opacity-70">
                                            {curvature || 0}°
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="-100"
                                        max="100"
                                        value={curvature || 0}
                                        onChange={(e) => onCurvatureChange(parseInt(e.target.value))}
                                        disabled={!hasSelection}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-[10px] text-[var(--foreground)] opacity-50 mt-1">
                                        <span>Concavo</span>
                                        <span>Plano</span>
                                        <span>Convexo</span>
                                    </div>
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
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    onStrokeChange('#000000');
                                                    onStrokeWidthChange(0.5);
                                                } else {
                                                    onStrokeChange('');
                                                }
                                            }}
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
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    onShadowColorChange('#000000');
                                                    onShadowBlurChange(1);
                                                    onShadowOpacityChange(0.8);
                                                    onShadowOffsetXChange(3);
                                                    onShadowOffsetYChange(3);
                                                } else {
                                                    onShadowColorChange('');
                                                }
                                            }}
                                            disabled={!hasSelection}
                                            className="w-4 h-4 rounded border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)]"
                                        />
                                    </div>
                                    {shadowColor && (
                                        <div className="space-y-3 pl-2 border-l-2 border-[var(--border)]">
                                            {/* Color */}
                                            <div>
                                                <label className="text-xs font-semibold text-[var(--foreground)] block mb-1">Color</label>
                                                <input
                                                    type="color"
                                                    value={shadowColor}
                                                    onChange={(e) => onShadowColorChange(e.target.value)}
                                                    className="w-full h-8 rounded border border-[var(--border)] cursor-pointer"
                                                />
                                            </div>

                                            {/* Intensidad */}
                                            <div>
                                                <label className="text-xs font-semibold text-[var(--foreground)] block mb-1">Intensidad</label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.1"
                                                    value={shadowOpacity || 0.8}
                                                    onChange={(e) => onShadowOpacityChange(parseFloat(e.target.value))}
                                                    className="w-full"
                                                />
                                                <p className="text-xs text-right font-mono text-[var(--foreground)] opacity-70 mt-1">
                                                    {Math.round((shadowOpacity || 0.8) * 100)}%
                                                </p>
                                            </div>

                                            {/* Difuminado */}
                                            <div>
                                                <label className="text-xs font-semibold text-[var(--foreground)] block mb-1">Difuminado</label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="20"
                                                    value={shadowBlur || 0}
                                                    onChange={(e) => onShadowBlurChange(parseInt(e.target.value))}
                                                    className="w-full"
                                                />
                                                <p className="text-xs text-right font-mono text-[var(--foreground)] opacity-70 mt-1">
                                                    {shadowBlur}px
                                                </p>
                                            </div>

                                            {/* Desplazamiento */}
                                            <div>
                                                <label className="text-xs font-semibold text-[var(--foreground)] block mb-1">Desplazamiento</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-xs text-[var(--foreground)] opacity-70">Horizontal</label>
                                                        <input
                                                            type="range"
                                                            min="-20"
                                                            max="20"
                                                            value={shadowOffsetX || 0}
                                                            onChange={(e) => onShadowOffsetXChange(parseInt(e.target.value))}
                                                            className="w-full"
                                                        />
                                                        <p className="text-xs text-center font-mono text-[var(--foreground)] opacity-70">
                                                            {shadowOffsetX}px
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-[var(--foreground)] opacity-70">Vertical</label>
                                                        <input
                                                            type="range"
                                                            min="-20"
                                                            max="20"
                                                            value={shadowOffsetY || 0}
                                                            onChange={(e) => onShadowOffsetYChange(parseInt(e.target.value))}
                                                            className="w-full"
                                                        />
                                                        <p className="text-xs text-center font-mono text-[var(--foreground)] opacity-70">
                                                            {shadowOffsetY}px
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
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
                        {/* Botón de eliminar al final del contenido */}
                        {hasSelection && (
                            <div className="pt-4 mt-4 border-t border-[var(--border)]">
                                <button
                                    onClick={onDelete}
                                    className="w-full py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-text font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    🗑️ Eliminar Elemento
                                </button>
                            </div>
                        )}
                    </div>
                </aside>
            )
            }
        </div >
    );
}
