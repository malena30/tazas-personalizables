"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { MugCoverage, ImageFilters } from "@/types/customizer";
import {
    LuCoffee,
    LuLayers,
    LuImage,
    LuType,
    LuSticker,
    LuLayoutTemplate,
    LuX,
    LuGripVertical,
    LuTrash2,
    LuUpload,
    LuTrash,
    LuPlus,
    LuChevronUp,
    LuChevronDown,
    LuBox,
    LuPencil
} from "react-icons/lu";

interface ToolbarProps {
    onAddImage: (imageUrl: string) => void;
    onAddText: () => void;
    onAddEmoji: (emoji: string) => void;
    onLoadTemplate: (templateId: string) => void;
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
    activeTab: 'producto' | 'capas' | 'imagen' | 'texto' | 'stickers' | 'plantillas' | null;
    onTabChange: (tab: 'producto' | 'capas' | 'imagen' | 'texto' | 'stickers' | 'plantillas' | null) => void;
    curvature?: number;
    onCurvatureChange: (curvature: number) => void;
    mugCoverage: MugCoverage;
    onMugCoverageChange: (coverage: MugCoverage) => void;
    imageFilters?: ImageFilters;
    onImageFiltersChange: (filters: any) => void;
    elements: any[];
    onReorderElements: (newElements: any[]) => void;
    onSelectElement: (id: string) => void;
    selectedId: string | null;
}

type Tab = 'producto' | 'capas' | 'imagen' | 'texto' | 'stickers' | 'plantillas' | null;

export default function Toolbar({
    onAddImage,
    onAddText,
    onAddEmoji,
    onLoadTemplate,
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
    onCurvatureChange,
    mugCoverage,
    onMugCoverageChange,
    imageFilters,
    onImageFiltersChange,
    elements,
    onReorderElements,
    onSelectElement,
    selectedId
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

    const tabs: { id: Tab; label: string; icon: any }[] = [
        { id: 'producto', label: 'Producto', icon: <LuCoffee size={24} /> },
        { id: 'capas', label: 'Capas', icon: <LuLayers size={24} /> },
        { id: 'imagen', label: 'Imagen', icon: <LuImage size={24} /> },
        { id: 'texto', label: 'Texto', icon: <LuType size={24} /> },
        { id: 'stickers', label: 'Stickers', icon: <LuSticker size={24} /> },
        { id: 'plantillas', label: 'Plantillas', icon: <LuLayoutTemplate size={24} /> }
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
                        <span className="flex items-center justify-center">{tab.icon}</span>
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
                                <LuX />
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
                                    <div className="grid grid-cols-5 gap-2">
                                        {[
                                            { name: 'Blanco', value: '#FFFFFF' },
                                            { name: 'Negro', value: '#000000' },
                                            { name: 'Rojo', value: '#FF0000' },
                                            { name: 'Azul', value: '#0000FF' },
                                            { name: 'Verde', value: '#008000' },
                                            { name: 'Amarillo', value: '#FFFF00' },
                                            { name: 'Rosa', value: '#FFC0CB' },
                                            { name: 'Naranja', value: '#FFA500' },
                                            { name: 'Violeta', value: '#800080' },
                                            { name: 'Marino', value: '#000080' },
                                        ].map((color) => (
                                            <button
                                                key={color.value}
                                                onClick={() => onMugColorChange(color.value)}
                                                className={`w-8 h-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${mugColor === color.value ? 'border-blue-500 scale-110 ring-2 ring-blue-200' : 'border-gray-200'
                                                    }`}
                                                style={{ backgroundColor: color.value }}
                                                title={color.name}
                                                aria-label={`Seleccionar color ${color.name}`}
                                            />
                                        ))}
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
                            <div className="space-y-4">
                                {elements.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        {[...elements].reverse().map((element, index) => (
                                            <div
                                                key={element.id}
                                                draggable
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData('text/plain', (elements.length - 1 - index).toString());
                                                    e.currentTarget.style.opacity = '0.5';
                                                }}
                                                onDragEnd={(e) => {
                                                    e.currentTarget.style.opacity = '1';
                                                }}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                                                    const toIndex = elements.length - 1 - index;
                                                    if (fromIndex !== toIndex) {
                                                        const newElements = [...elements];
                                                        const [movedItem] = newElements.splice(fromIndex, 1);
                                                        newElements.splice(toIndex, 0, movedItem);
                                                        onReorderElements(newElements);
                                                    }
                                                }}
                                                onClick={() => onSelectElement(element.id)}
                                                className={`group flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedId === element.id
                                                    ? 'bg-[var(--accent)] bg-opacity-10 border-[var(--accent)] shadow-sm'
                                                    : 'bg-white border-[var(--border)] hover:border-[var(--accent)] hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {/* Drag Handle */}
                                                    <div className="text-gray-400 cursor-grab active:cursor-grabbing">
                                                        <LuGripVertical size={18} />
                                                    </div>

                                                    {/* Type Icon */}
                                                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-lg">
                                                        {element.type === 'text' ? <LuType size={16} /> : element.type === 'emoji' ? element.emoji : <LuImage size={16} />}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-[var(--foreground)] truncate max-w-[120px]">
                                                            {element.type === 'text' ? element.content : element.type === 'image' ? 'Imagen' : 'Emoji'}
                                                        </span>
                                                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                                                            Capa {elements.length - index}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onSelectElement(element.id);
                                                            onDelete();
                                                        }}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                        title="Eliminar capa"
                                                    >
                                                        <LuTrash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 px-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
                                        <LuBox size={32} className="mx-auto mb-2 text-gray-300" />
                                        <p className="text-sm text-gray-500 font-text">
                                            No hay capas todavía.<br />Agregá algún elemento para empezar.
                                        </p>
                                    </div>
                                )}

                                {elements.length > 1 && (
                                    <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold mt-4">
                                        💡 Arrastrá para reordenar
                                    </p>
                                )}
                            </div>
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
                                        <LuUpload size={20} /> Subir Imagen
                                    </button>
                                </div>

                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800 text-center">
                                        💡 Hacé click en la imagen para seleccionarla y moverla
                                    </p>
                                </div>

                                {hasSelection && (
                                    <div className="mt-4">
                                        <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-2">
                                            Cobertura
                                        </h3>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => onMugCoverageChange('front')}
                                                className={`px-3 py-2 rounded border text-sm font-text transition-colors ${mugCoverage === 'front'
                                                    ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--foreground)]'
                                                    : 'bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)]'
                                                    }`}
                                            >
                                                Solo Frente
                                            </button>
                                            <button
                                                onClick={() => onMugCoverageChange('front-back')}
                                                className={`px-3 py-2 rounded border text-sm font-text transition-colors ${mugCoverage === 'front-back'
                                                    ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--foreground)]'
                                                    : 'bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)]'
                                                    }`}
                                            >
                                                Frente y Atrás
                                            </button>
                                            <button
                                                onClick={() => onMugCoverageChange('full')}
                                                className={`px-3 py-2 rounded border text-sm font-text transition-colors ${mugCoverage === 'full'
                                                    ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--foreground)]'
                                                    : 'bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)]'
                                                    }`}
                                            >
                                                Toda la Vuelta
                                            </button>
                                        </div>

                                        {/* Filtros de Imagen */}
                                        <div className="mt-6 space-y-4">
                                            <h3 className="text-sm font-title font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2">
                                                Filtros de Imagen
                                            </h3>

                                            {/* Grayscale */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs font-semibold text-[var(--foreground)]">
                                                    <label>Blanco y Negro</label>
                                                    <span>{imageFilters?.grayscale || 0}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={imageFilters?.grayscale || 0}
                                                    onChange={(e) => onImageFiltersChange({ ...imageFilters, grayscale: parseInt(e.target.value) })}
                                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                                                />
                                            </div>

                                            {/* Sepia */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs font-semibold text-[var(--foreground)]">
                                                    <label>Sepia</label>
                                                    <span>{imageFilters?.sepia || 0}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={imageFilters?.sepia || 0}
                                                    onChange={(e) => onImageFiltersChange({ ...imageFilters, sepia: parseInt(e.target.value) })}
                                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                                                />
                                            </div>

                                            {/* Brightness */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs font-semibold text-[var(--foreground)]">
                                                    <label>Brillo</label>
                                                    <span>{imageFilters?.brightness || 100}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="200"
                                                    value={imageFilters?.brightness || 100}
                                                    onChange={(e) => onImageFiltersChange({ ...imageFilters, brightness: parseInt(e.target.value) })}
                                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                                                />
                                            </div>

                                            {/* Contrast */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs font-semibold text-[var(--foreground)]">
                                                    <label>Contraste</label>
                                                    <span>{imageFilters?.contrast || 100}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="200"
                                                    value={imageFilters?.contrast || 100}
                                                    onChange={(e) => onImageFiltersChange({ ...imageFilters, contrast: parseInt(e.target.value) })}
                                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                                                />
                                            </div>

                                            {/* Saturate */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs font-semibold text-[var(--foreground)]">
                                                    <label>Saturación</label>
                                                    <span>{imageFilters?.saturate || 100}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="200"
                                                    value={imageFilters?.saturate || 100}
                                                    onChange={(e) => onImageFiltersChange({ ...imageFilters, saturate: parseInt(e.target.value) })}
                                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                                                />
                                            </div>

                                            <button
                                                onClick={() => onImageFiltersChange({
                                                    grayscale: 0,
                                                    sepia: 0,
                                                    brightness: 100,
                                                    contrast: 100,
                                                    saturate: 100
                                                })}
                                                className="w-full py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                Restablecer Filtros
                                            </button>
                                        </div>
                                    </div>
                                )}
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
                                        <LuPencil size={18} /> Agregar Texto
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
                                        <option value="Lobster" style={{ fontFamily: 'Lobster' }}>Lobster</option>
                                        <option value="Abril Fatface" style={{ fontFamily: 'Abril Fatface' }}>Abril Fatface</option>
                                        <option value="Comfortaa" style={{ fontFamily: 'Comfortaa' }}>Comfortaa</option>
                                        <option value="Caveat" style={{ fontFamily: 'Caveat' }}>Caveat</option>
                                        <option value="Permanent Marker" style={{ fontFamily: 'Permanent Marker' }}>Permanent Marker</option>
                                        <option value="Righteous" style={{ fontFamily: 'Righteous' }}>Righteous</option>
                                        <option value="Fredoka One" style={{ fontFamily: 'Fredoka One' }}>Fredoka One</option>
                                        <option value="Cinzel" style={{ fontFamily: 'Cinzel' }}>Cinzel</option>
                                    </select>
                                </div>

                                <hr className="border-[var(--border)]" />

                                {hasSelection && (
                                    <div className="mt-4">
                                        <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-2">
                                            Cobertura
                                        </h3>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => onMugCoverageChange('front')}
                                                className={`px-3 py-2 rounded border text-sm font-text transition-colors ${mugCoverage === 'front'
                                                    ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--foreground)]'
                                                    : 'bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)]'
                                                    }`}
                                            >
                                                Solo Frente
                                            </button>
                                            <button
                                                onClick={() => onMugCoverageChange('front-back')}
                                                className={`px-3 py-2 rounded border text-sm font-text transition-colors ${mugCoverage === 'front-back'
                                                    ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--foreground)]'
                                                    : 'bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)]'
                                                    }`}
                                            >
                                                Frente y Atrás
                                            </button>
                                            <button
                                                onClick={() => onMugCoverageChange('full')}
                                                className={`px-3 py-2 rounded border text-sm font-text transition-colors ${mugCoverage === 'full'
                                                    ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--foreground)]'
                                                    : 'bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)]'
                                                    }`}
                                            >
                                                Toda la Vuelta
                                            </button>
                                        </div>
                                    </div>
                                )}

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

                        {/* TAB: Stickers */}
                        {activeTab === 'stickers' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-3 inline-flex items-center gap-2">
                                        <LuSticker size={18} /> Stickers Ilustrados
                                    </h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { id: 'cat', url: '/stickers/cat.png', name: 'Gatito' },
                                            { id: 'mug', url: '/stickers/mug.png', name: 'Taza' },
                                            { id: 'heart', url: '/stickers/heart.png', name: 'Corazón' },
                                            { id: 'rocket', url: '/stickers/rocket.png', name: 'Cohete' },
                                        ].map(sticker => (
                                            <button
                                                key={sticker.id}
                                                onClick={() => onAddImage(sticker.url)}
                                                className="aspect-square bg-white border border-[var(--border)] rounded-lg hover:border-[var(--accent)] hover:shadow-md transition-all p-2 flex items-center justify-center group"
                                                title={sticker.name}
                                            >
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        src={sticker.url}
                                                        alt={sticker.name}
                                                        fill
                                                        className="object-contain group-hover:scale-110 transition-transform"
                                                    />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <hr className="border-[var(--border)]" />

                                <div>
                                    <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-3 inline-flex items-center gap-2">
                                        <LuPlus size={18} /> Emojis Rápidos
                                    </h3>
                                    <div className="grid grid-cols-6 gap-2">
                                        {['😀', '😍', '🎉', '❤️', '⭐', '✨', '🎁', '🎂', '☕', '🌟', '💖', '👑', '🌈', '🔥', '💪', '🎨', '🌸', '🦋', '☀️', '🌙', '🎵', '📸', '✓', '→'].map(emoji => (
                                            <button
                                                key={emoji}
                                                onClick={() => onAddEmoji(emoji)}
                                                className="aspect-square bg-[var(--accent)] bg-opacity-10 border border-[var(--border)] rounded-lg hover:bg-opacity-20 transition-colors text-2xl flex items-center justify-center"
                                                title="Click para agregar"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: Plantillas */}
                        {activeTab === 'plantillas' && (
                            <>
                                <div>
                                    <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-3 inline-flex items-center gap-2">
                                        <LuLayoutTemplate size={18} /> Diseños Prediseñados
                                    </h3>
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => onLoadTemplate('happy-birthday')}
                                            className="w-full p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border border-[var(--border)] rounded-lg hover:shadow-md transition-all text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-4xl">🎉</div>
                                                <div>
                                                    <h4 className="font-semibold text-[var(--foreground)]">Feliz Cumpleaños</h4>
                                                    <p className="text-sm opacity-70">Celebración colorida</p>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => onLoadTemplate('love-you')}
                                            className="w-full p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-[var(--border)] rounded-lg hover:shadow-md transition-all text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-4xl">❤️</div>
                                                <div>
                                                    <h4 className="font-semibold text-[var(--foreground)]">Te Amo</h4>
                                                    <p className="text-sm opacity-70">Romántico</p>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => onLoadTemplate('best-mom')}
                                            className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-[var(--border)] rounded-lg hover:shadow-md transition-all text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-4xl">👑</div>
                                                <div>
                                                    <h4 className="font-semibold text-[var(--foreground)]">Mejor Mamá</h4>
                                                    <p className="text-sm opacity-70">Para mamá</p>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => onLoadTemplate('coffee-lover')}
                                            className="w-full p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-[var(--border)] rounded-lg hover:shadow-md transition-all text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-4xl">☕</div>
                                                <div>
                                                    <h4 className="font-semibold text-[var(--foreground)]">Coffee Lover</h4>
                                                    <p className="text-sm opacity-70">Para cafeteros</p>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => onLoadTemplate('motivational')}
                                            className="w-full p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-[var(--border)] rounded-lg hover:shadow-md transition-all text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-4xl">💪</div>
                                                <div>
                                                    <h4 className="font-semibold text-[var(--foreground)]">Motivacional</h4>
                                                    <p className="text-sm opacity-70">Inspirador</p>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Botón de eliminar al final del contenido */}
                        {hasSelection && (
                            <div className="pt-4 mt-4 border-t border-[var(--border)]">
                                <button
                                    onClick={onDelete}
                                    className="w-full py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-text font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <LuTrash2 size={18} /> Eliminar Elemento
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
