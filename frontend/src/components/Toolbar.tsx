"use client";

import { useRef } from "react";
import Image from "next/image";
import { MugCoverage, ImageFilters } from "@/types/customizer";
import {
    LuCoffee,
    LuLayers,
    LuImage,
    LuType,
    LuSticker,
    LuLayoutTemplate,
    LuGripVertical,
    LuTrash2,
    LuUpload,
    LuPlus,
    LuMinus,
    LuPencil,
    LuChevronUp,
    LuChevronDown
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
        <div className="flex h-full w-full max-w-[450px] border-r border-[var(--border)] overflow-hidden bg-[var(--background)]">
            {/* Sidebar de iconos - Izquierda */}
            <aside className="w-20 border-r border-[var(--border)] flex flex-col items-center py-6 gap-6 bg-white shrink-0">
                {tabs.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id)}
                        className={`group relative flex flex-col items-center gap-1.5 transition-all ${activeTab === item.id
                            ? "text-[var(--accent)]"
                            : "text-gray-400 hover:text-gray-600"
                            }`}
                        title={item.label}
                    >
                        <div className={`p-3 rounded-2xl transition-all ${activeTab === item.id
                            ? "bg-[var(--accent)]/10 scale-110"
                            : "group-hover:bg-gray-50"
                            }`}>
                            <div className={activeTab === item.id ? "stroke-[2.5px]" : "stroke-[2px]"}>
                                {item.icon}
                            </div>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-wider transition-opacity ${activeTab === item.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            }`}>
                            {item.label}
                        </span>
                        {activeTab === item.id && (
                            <div className="absolute -right-[1px] top-1/2 -translate-y-1/2 w-[3px] h-8 bg-[var(--accent)] rounded-l-full" />
                        )}
                    </button>
                ))}
            </aside>

            {/* Panel de contenido - Derecha */}
            {activeTab && (
                <aside className="flex-1 flex flex-col min-w-[320px] overflow-hidden bg-gray-50/50 backdrop-blur-sm animate-in slide-in-from-left-4 duration-300">
                    <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)] bg-white/50 flex-shrink-0">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                            Editor — {tabs.find(t => t.id === activeTab)?.label}
                        </h2>
                        <button
                            onClick={() => onTabChange(null)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <LuMinus size={16} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {/* TAB: Producto */}
                        {activeTab === 'producto' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-1">
                                        Color de la Taza
                                    </h3>
                                    <div className="grid grid-cols-5 gap-3">
                                        {[
                                            { name: 'Pure White', value: '#FFFFFF' },
                                            { name: 'Deep Black', value: '#000000' },
                                            { name: 'Vibrant Red', value: '#FF0000' },
                                            { name: 'Electric Blue', value: '#0000FF' },
                                            { name: 'Forest Green', value: '#008000' },
                                            { name: 'Modern Yellow', value: '#FFFF00' },
                                            { name: 'Soft Pink', value: '#FFC0CB' },
                                            { name: 'Bright Orange', value: '#FFA500' },
                                            { name: 'Royal Purple', value: '#800080' },
                                            { name: 'Navy Blue', value: '#000080' },
                                        ].map((color) => (
                                            <button
                                                key={color.value}
                                                onClick={() => onMugColorChange(color.value)}
                                                className={`aspect-square rounded-2xl border-2 transition-all hover:scale-110 active:scale-90 ${mugColor === color.value
                                                    ? 'border-[var(--accent)] ring-4 ring-[var(--accent)]/20 shadow-lg'
                                                    : 'border-white shadow-sm ring-1 ring-black/5'
                                                    }`}
                                                style={{ backgroundColor: color.value }}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                </section>

                                <div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

                                <div className="p-5 bg-blue-50/50 backdrop-blur-sm border border-blue-100 rounded-3xl flex items-center gap-4 group">
                                    <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:rotate-12 transition-transform">
                                        <LuCoffee className="text-blue-500" size={20} />
                                    </div>
                                    <p className="text-xs font-bold text-blue-900/60 leading-relaxed uppercase tracking-wide">
                                        Arrastrá la taza en el área 3D para ver todos los ángulos.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* TAB: Capas */}
                        {activeTab === 'capas' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-1">
                                        Jerarquía de Diseño
                                    </h3>
                                    <div className="flex gap-2 mb-4">
                                        <button
                                            onClick={onBringToFront}
                                            disabled={!selectedId}
                                            className="flex-1 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-500 disabled:opacity-50 transition-all shadow-sm"
                                        >
                                            <LuChevronUp size={16} className="inline mr-1" /> Al Frente
                                        </button>
                                        <button
                                            onClick={onSendToBack}
                                            disabled={!selectedId}
                                            className="flex-1 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-500 disabled:opacity-50 transition-all shadow-sm"
                                        >
                                            <LuChevronDown size={16} className="inline mr-1" /> Al Fondo
                                        </button>
                                    </div>

                                    {elements.length > 0 ? (
                                        <div className="space-y-3">
                                            {[...elements].reverse().map((element, index) => (
                                                <div
                                                    key={element.id}
                                                    draggable
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData('text/plain', (elements.length - 1 - index).toString());
                                                        e.currentTarget.style.opacity = '0.4';
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
                                                    className={`group flex items-center justify-between p-4 rounded-3xl border-2 cursor-pointer transition-all ${selectedId === element.id
                                                        ? 'bg-blue-50 border-blue-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
                                                        : 'bg-white border-transparent hover:border-gray-200 shadow-sm'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-gray-300 cursor-grab active:cursor-grabbing hover:text-gray-500 transition-colors">
                                                            <LuGripVertical size={20} />
                                                        </div>

                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${selectedId === element.id ? 'bg-white shadow-sm' : 'bg-gray-50 group-hover:bg-white group-hover:shadow-sm'
                                                            }`}>
                                                            {element.type === 'text' ? <LuType size={20} className="text-gray-600" /> : element.type === 'emoji' ? element.emoji : <LuImage size={20} className="text-gray-600" />}
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-black text-gray-900 truncate max-w-[140px] tracking-tight">
                                                                {element.type === 'text' ? (element.content || 'Sin texto') : element.type === 'image' ? 'Ilustración' : 'Emoji'}
                                                            </span>
                                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                                Capa {elements.length - index}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onSelectElement(element.id);
                                                            onDelete();
                                                        }}
                                                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                                                        title="Eliminar capa"
                                                    >
                                                        <LuTrash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16 px-6 bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem]">
                                            <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                                <LuCoffee size={32} className="text-gray-200" />
                                            </div>
                                            <h4 className="text-sm font-black text-gray-900 mb-1">Tu diseño está vacío</h4>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                                Agregá texto o imágenes.
                                            </p>
                                        </div>
                                    )}
                                </section>
                            </div>
                        )}

                        {/* TAB: Imagen */}
                        {activeTab === 'imagen' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-1">
                                        Multimedia
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
                                        className="w-full bg-[var(--foreground)] text-[var(--background)] px-6 py-5 rounded-[2rem] font-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/5"
                                    >
                                        <div className="p-2 bg-white/10 rounded-xl">
                                            <LuUpload size={20} />
                                        </div>
                                        SUBIR IMAGEN
                                    </button>
                                </section>

                                {hasSelection && (
                                    <>
                                        <div className="h-px bg-[var(--border)]" />
                                        <section>
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-1">
                                                Cobertura
                                            </h3>
                                            <div className="grid grid-cols-1 gap-3">
                                                {[
                                                    { id: 'front', label: 'Solo Frente' },
                                                    { id: 'front-back', label: 'Frente y Atrás' },
                                                    { id: 'full', label: 'Toda la Vuelta' }
                                                ].map(option => (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => onMugCoverageChange(option.id as MugCoverage)}
                                                        className={`px-5 py-4 rounded-2xl border-2 text-sm font-black transition-all ${mugCoverage === option.id
                                                            ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-sm'
                                                            : 'bg-white border-transparent text-gray-400 hover:border-gray-100 hover:text-gray-600'
                                                            }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </section>

                                        <div className="h-px bg-[var(--border)]" />
                                        <section>
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 ml-1">
                                                Filtros Pro
                                            </h3>
                                            <div className="space-y-8">
                                                {[
                                                    { label: 'Brillo', key: 'brightness', min: 0, max: 200, default: 100 },
                                                    { label: 'Contraste', key: 'contrast', min: 0, max: 200, default: 100 },
                                                    { label: 'Saturación', key: 'saturate', min: 0, max: 200, default: 100 },
                                                    { label: 'B&N', key: 'grayscale', min: 0, max: 100, default: 0 },
                                                    { label: 'Sepia', key: 'sepia', min: 0, max: 100, default: 0 }
                                                ].map(filter => (
                                                    <div key={filter.key}>
                                                        <div className="flex justify-between items-center mb-3">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{filter.label}</label>
                                                            <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                                                {(imageFilters as any)?.[filter.key] ?? filter.default}%
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min={filter.min}
                                                            max={filter.max}
                                                            value={(imageFilters as any)?.[filter.key] ?? filter.default}
                                                            onChange={(e) => onImageFiltersChange({ ...imageFilters, [filter.key]: parseInt(e.target.value) })}
                                                            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                        />
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => onImageFiltersChange({})}
                                                    className="w-full py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-500 transition-colors"
                                                >
                                                    Restablecer filtros
                                                </button>
                                            </div>
                                        </section>
                                    </>
                                )}
                            </div>
                        )}

                        {/* TAB: Texto */}
                        {activeTab === 'texto' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-1">
                                        Tipografía y Estilo
                                    </h3>
                                    <div className="space-y-6">
                                        <button
                                            onClick={onAddText}
                                            className="w-full bg-[var(--foreground)] text-[var(--background)] px-6 py-5 rounded-[2rem] font-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/5"
                                        >
                                            <div className="p-2 bg-white/10 rounded-xl">
                                                <LuPlus size={20} />
                                            </div>
                                            NUEVO TEXTO
                                        </button>

                                        {hasSelection && (
                                            <div className="space-y-8 animate-in fade-in duration-500 transition-all">
                                                {/* Color */}
                                                <div>
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Color del Texto</label>
                                                    <div className="flex gap-3">
                                                        <input
                                                            type="color"
                                                            value={textColor}
                                                            onChange={(e) => onTextColorChange(e.target.value)}
                                                            className="w-14 h-14 rounded-2xl border-2 border-white shadow-sm ring-1 ring-black/5 cursor-pointer"
                                                        />
                                                        <div className="flex-1 bg-white border border-gray-100 rounded-2xl px-4 flex items-center font-mono text-sm text-gray-500 shadow-sm">
                                                            {textColor.toUpperCase()}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Fuente */}
                                                <div>
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Fuente</label>
                                                    <select
                                                        value={fontFamily}
                                                        onChange={(e) => onFontFamilyChange(e.target.value)}
                                                        className="w-full h-14 px-5 bg-white border border-gray-100 rounded-2xl font-black text-sm text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
                                                        style={{ fontFamily }}
                                                    >
                                                        {['Inter', 'Roboto', 'Montserrat', 'Pacifico', 'Bebas Neue', 'Permanent Marker'].map(font => (
                                                            <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="grid grid-cols-2 gap-6">
                                                    {/* Tamaño */}
                                                    <div>
                                                        <div className="flex justify-between items-center mb-3">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tamaño</label>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="range"
                                                                min="12"
                                                                max="120"
                                                                value={fontSize}
                                                                onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
                                                                className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                            />
                                                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md min-w-[35px] text-center">{fontSize}</span>
                                                        </div>
                                                    </div>

                                                    {/* Curvatura */}
                                                    <div>
                                                        <div className="flex justify-between items-center mb-3">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Arco</label>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="range"
                                                                min="-100"
                                                                max="100"
                                                                value={curvature || 0}
                                                                onChange={(e) => onCurvatureChange(parseInt(e.target.value))}
                                                                className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                            />
                                                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md min-w-[35px] text-center">{curvature}°</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="h-px bg-gray-100" />

                                                {/* Advanced Tab: Stroke & Shadow */}
                                                <div className="space-y-6">
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                                        <LuPencil size={12} /> Efectos Especiales
                                                    </h4>

                                                    {/* Contorno (Stroke) */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">Contorno</label>
                                                            <input
                                                                type="color"
                                                                value={stroke || "#000000"}
                                                                onChange={(e) => onStrokeChange(e.target.value)}
                                                                className="w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-black/5 cursor-pointer"
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="10"
                                                                step="0.5"
                                                                value={strokeWidth || 0}
                                                                onChange={(e) => onStrokeWidthChange(parseFloat(e.target.value))}
                                                                className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                            />
                                                            <span className="text-[10px] font-bold text-gray-400 min-w-[20px]">{strokeWidth}px</span>
                                                        </div>
                                                    </div>

                                                    {/* Sombra (Shadow) */}
                                                    <div className="space-y-4 p-4 bg-white/40 rounded-3xl border border-white shadow-sm">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">Sombra</label>
                                                            <input
                                                                type="color"
                                                                value={shadowColor || "#000000"}
                                                                onChange={(e) => onShadowColorChange(e.target.value)}
                                                                className="w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-black/5 cursor-pointer"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <span className="text-[9px] font-black text-gray-400 uppercase">Difuminado</span>
                                                                <input
                                                                    type="range"
                                                                    min="0"
                                                                    max="20"
                                                                    value={shadowBlur || 0}
                                                                    onChange={(e) => onShadowBlurChange(parseInt(e.target.value))}
                                                                    className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-400"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <span className="text-[9px] font-black text-gray-400 uppercase">Opacidad</span>
                                                                <input
                                                                    type="range"
                                                                    min="0"
                                                                    max="1"
                                                                    step="0.1"
                                                                    value={shadowOpacity || 0}
                                                                    onChange={(e) => onShadowOpacityChange(parseFloat(e.target.value))}
                                                                    className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-400"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* TAB: Stickers */}
                        {activeTab === 'stickers' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-1">
                                        Ilustraciones Premium
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { id: 'cat', url: '/stickers/cat.png', name: 'Gatito' },
                                            { id: 'mug', url: '/stickers/mug.png', name: 'Taza' },
                                            { id: 'heart', url: '/stickers/heart.png', name: 'Corazón' },
                                            { id: 'rocket', url: '/stickers/rocket.png', name: 'Cohete' },
                                        ].map(sticker => (
                                            <button
                                                key={sticker.id}
                                                onClick={() => onAddImage(sticker.url)}
                                                className="aspect-square bg-white border border-gray-100 rounded-3xl hover:border-blue-500 hover:shadow-[0_12px_40px_rgba(59,130,246,0.15)] hover:-translate-y-2 transition-all p-4 flex items-center justify-center group"
                                            >
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        src={sticker.url}
                                                        alt={sticker.name}
                                                        fill
                                                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-1">
                                        Emojis Rápidos
                                    </h3>
                                    <div className="grid grid-cols-6 gap-2">
                                        {['😀', '😍', '🎉', '❤️', '⭐', '✨', '🎁', '🎂', '☕', '🌟', '💖', '👑', '🌈', '🔥', '💪', '🎨', '🌸', '🦋'].map(emoji => (
                                            <button
                                                key={emoji}
                                                onClick={() => onAddEmoji(emoji)}
                                                className="aspect-square bg-white border border-gray-50 rounded-2xl hover:bg-white hover:border-blue-500 hover:shadow-lg transition-all text-2xl flex items-center justify-center hover:scale-125 active:scale-90"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* TAB: Plantillas */}
                        {activeTab === 'plantillas' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 ml-1">
                                        Diseños Maestros
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            { id: 'happy-birthday', title: 'Celebración', desc: 'Cumpleaños y fiestas', icon: '🎉', color: 'from-pink-500 to-rose-500' },
                                            { id: 'love-you', title: 'Romance', desc: 'San Valentín y aniversarios', icon: '❤️', color: 'from-red-500 to-orange-500' },
                                            { id: 'coffee-lover', title: 'Coffee Time', desc: 'Para amantes del café', icon: '☕', color: 'from-amber-600 to-orange-600' },
                                            { id: 'motivational', title: 'Energía', desc: 'Frases que inspiran', icon: '💪', color: 'from-blue-600 to-cyan-600' }
                                        ].map(template => (
                                            <button
                                                key={template.id}
                                                onClick={() => onLoadTemplate(template.id)}
                                                className="group relative w-full p-1 rounded-[2.5rem] bg-white border border-gray-100 hover:border-transparent hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all overflow-hidden"
                                            >
                                                <div className="flex items-center gap-5 p-4 rounded-[2.2rem] transition-colors group-hover:bg-gray-50/50">
                                                    <div className={`w-16 h-16 rounded-[1.8rem] bg-gradient-to-br ${template.color} flex items-center justify-center text-3xl shadow-lg ring-4 ring-white`}>
                                                        {template.icon}
                                                    </div>
                                                    <div className="text-left">
                                                        <h4 className="font-black text-gray-900 tracking-tight">{template.title}</h4>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{template.desc}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>

                    {activeTab && hasSelection && (
                        <div className="p-6 border-t border-gray-100 bg-white/50 flex-shrink-0">
                            <button
                                onClick={onDelete}
                                className="w-full py-4 border-2 border-dashed border-red-200 text-red-500 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-50 hover:border-red-500 transition-all flex items-center justify-center gap-3"
                            >
                                <LuTrash2 size={16} /> ELIMINAR SELECCIÓN
                            </button>
                        </div>
                    )}
                </aside>
            )}
        </div>
    );
}
