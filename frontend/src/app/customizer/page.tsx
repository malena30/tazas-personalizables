"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { CanvasElement, ImageElement, TextElement, EmojiElement } from "@/types/customizer";
import Toolbar from "@/components/Toolbar";
import DesignLibrary from "@/components/DesignLibrary";
import { useCartStore } from "@/store/cartStore";
import { saveDesign, updateDesign, Design } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { templates } from "@/data/templates";
import { LuFolderHeart, LuSave, LuShoppingBag, LuCircleCheck, LuArrowLeft } from "react-icons/lu";

// Importación dinámica de Mug3DViewer para evitar errores de SSR con Three.js y Konva
const Mug3DViewer = dynamic(() => import("@/components/Mug3DViewer"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Iniciando Motor 3D</p>
            </div>
        </div>
    )
});

export default function CustomizerPage() {
    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [mugColor, setMugColor] = useState("#FFFFFF");
    const [textColor, setTextColor] = useState("#000000");
    const [fontSize, setFontSize] = useState(24);
    const [fontFamily, setFontFamily] = useState("Inter");

    // Estados para opciones avanzadas de texto
    const [stroke, setStroke] = useState<string>("");
    const [strokeWidth, setStrokeWidth] = useState<number>(0.5);
    const [shadowColor, setShadowColor] = useState<string>("");
    const [shadowBlur, setShadowBlur] = useState<number>(1);
    const [shadowOpacity, setShadowOpacity] = useState<number>(0.8);
    const [shadowOffsetX, setShadowOffsetX] = useState<number>(3);
    const [shadowOffsetY, setShadowOffsetY] = useState<number>(3);
    const [curvature, setCurvature] = useState<number>(0);

    const [activeTab, setActiveTab] = useState<'producto' | 'capas' | 'imagen' | 'texto' | 'stickers' | 'plantillas' | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [showLibrary, setShowLibrary] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [designName, setDesignName] = useState("");
    const [currentDesignId, setCurrentDesignId] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const canvasRef = useRef<any>(null);
    const addToCart = useCartStore((state) => state.addToCart);
    const { user } = useAuth();
    const router = useRouter();

    const generateId = () => `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const handleAddImage = (imageUrl: string) => {
        const newImage: ImageElement = {
            id: generateId(),
            type: 'image',
            url: imageUrl,
            position: { x: 100, y: 100 },
            size: { width: 150, height: 150 },
            rotation: 0,
            zIndex: elements.length,
            opacity: 1,
            coverage: 'front'
        };
        setElements([...elements, newImage]);
        setSelectedId(newImage.id);
        setActiveTab('imagen');
    };

    const handleAddText = () => {
        const newText: TextElement = {
            id: generateId(),
            type: 'text',
            content: 'Texto nuevo',
            position: { x: 150, y: 150 },
            fontSize: fontSize,
            fontFamily: 'Inter',
            color: textColor,
            rotation: 0,
            zIndex: elements.length,
            isBold: false,
            isItalic: false,
            curvature: 0,
            coverage: 'front'
        };
        setElements([...elements, newText]);
        setSelectedId(newText.id);
        setActiveTab('texto');
    };

    const handleAddEmoji = (emoji: string) => {
        const newEmoji: EmojiElement = {
            id: generateId(),
            type: 'emoji',
            emoji: emoji,
            fontSize: 60,
            position: { x: 200, y: 150 },
            rotation: 0,
            zIndex: elements.length,
            coverage: 'front'
        };
        setElements([...elements, newEmoji]);
        setSelectedId(newEmoji.id);
    };

    const handleLoadTemplate = (templateId: string) => {
        const template = templates.find(t => t.id === templateId);
        if (template) {
            if (elements.length > 0) {
                if (!confirm("¿Deseas cargar esta plantilla? Se reemplazará tu diseño actual.")) {
                    return;
                }
            }
            const newElements = template.elements.map(el => ({
                ...el,
                id: generateId()
            }));
            setElements(newElements);
            setMugColor(template.mugColor);
            setSelectedId(null);
            setActiveTab(null);
        }
    };

    const handleDeleteElement = () => {
        if (selectedId) {
            setElements(elements.filter(el => el.id !== selectedId));
            setSelectedId(null);
        }
    };

    const handleBringToFront = () => {
        if (!selectedId) return;
        const maxZIndex = Math.max(...elements.map(el => el.zIndex), 0);
        setElements(elements.map(el =>
            el.id === selectedId ? { ...el, zIndex: maxZIndex + 1 } : el
        ));
    };

    const handleSendToBack = () => {
        if (!selectedId) return;
        const minZIndex = Math.min(...elements.map(el => el.zIndex), 0);
        setElements(elements.map(el =>
            el.id === selectedId ? { ...el, zIndex: minZIndex - 1 } : el
        ));
    };

    const handleUpdateElement = (updatedElement: CanvasElement) => {
        setElements(elements.map(el =>
            el.id === updatedElement.id ? updatedElement : el
        ));
    };

    useEffect(() => {
        if (!selectedId) return;
        setElements(prev => prev.map(el => {
            if (el.id !== selectedId) return el;
            if (el.type === 'text') {
                return {
                    ...el,
                    color: textColor,
                    fontSize: fontSize,
                    fontFamily: fontFamily,
                    stroke: stroke || undefined,
                    strokeWidth: strokeWidth,
                    shadowColor: shadowColor || undefined,
                    shadowBlur: shadowBlur,
                    shadowOpacity: shadowOpacity,
                    shadowOffsetX: shadowOffsetX,
                    shadowOffsetY: shadowOffsetY,
                    curvature: curvature
                };
            }
            return el;
        }));
    }, [selectedId, textColor, fontSize, fontFamily, stroke, strokeWidth, shadowColor, shadowBlur, shadowOpacity, shadowOffsetX, shadowOffsetY, curvature]);

    useEffect(() => {
        if (!selectedId) return;
        const selectedElement = elements.find(el => el.id === selectedId);
        if (selectedElement) {
            if (selectedElement.type === 'text') {
                setTextColor(selectedElement.color || "#000000");
                setFontSize(selectedElement.fontSize || 24);
                setFontFamily(selectedElement.fontFamily || "Inter");
                setStroke(selectedElement.stroke || "");
                setStrokeWidth(selectedElement.strokeWidth || 1);
                setShadowColor(selectedElement.shadowColor || "");
                setShadowBlur(selectedElement.shadowBlur || 5);
                setShadowOpacity(selectedElement.shadowOpacity || 0.8);
                setShadowOffsetX(selectedElement.shadowOffsetX || 3);
                setShadowOffsetY(selectedElement.shadowOffsetY || 3);
                setCurvature(selectedElement.curvature || 0);
                setActiveTab('texto');
            } else if (selectedElement.type === 'image') {
                setActiveTab('imagen');
            }
        }
    }, [selectedId]);

    const handleAddToCart = () => {
        if (canvasRef.current) {
            const uri = canvasRef.current.toDataURL({
                pixelRatio: 3,
                mimeType: 'image/png',
            });
            addToCart({
                id: Date.now().toString(),
                name: "Taza Personalizada",
                price: 3500,
                image: uri,
                description: `Taza personalizada con ${elements.length} elemento(s)`,
                designId: currentDesignId || undefined
            });
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 3000);
        }
    };

    const handleSaveDesign = async () => {
        if (!user) {
            const pendingDesign = {
                mug_color: mugColor,
                elements: elements,
                name: designName || "Mi Diseño"
            };
            localStorage.setItem('pending_design', JSON.stringify(pendingDesign));
            router.push('/login?redirect=/customizer');
            return;
        }
        if (!designName.trim()) {
            alert('Por favor ingresa un nombre para el diseño');
            return;
        }
        try {
            let thumbnail = undefined;
            try {
                thumbnail = canvasRef.current?.toDataURL?.({
                    pixelRatio: 1,
                    mimeType: 'image/png',
                });
            } catch (err) { }
            const designData = {
                name: designName,
                mug_color: mugColor,
                elements: elements,
                thumbnail: thumbnail,
            };
            if (currentDesignId) {
                await updateDesign(currentDesignId, designData);
            } else {
                const saved = await saveDesign(designData);
                setCurrentDesignId(saved.id);
            }
            setShowSaveModal(false);
            setDesignName('');
        } catch (error) {
            alert('Error al guardar el diseño');
        }
    };

    const handleLoadDesign = (design: Design) => {
        setElements(design.elements);
        setMugColor(design.mug_color);
        setCurrentDesignId(design.id);
        setDesignName(design.name);
        setSelectedId(null);
    };

    useEffect(() => {
        const pending = localStorage.getItem('pending_design');
        if (pending) {
            try {
                const design = JSON.parse(pending);
                setElements(design.elements || []);
                setMugColor(design.mug_color || "#FFFFFF");
                setDesignName(design.name || "");
                localStorage.removeItem('pending_design');
                if (user) setShowSaveModal(true);
            } catch (e) { }
        }
    }, [user]);

    return (
        <main className="w-full h-screen bg-[var(--background)] overflow-hidden flex flex-col">
            <header className="h-16 flex-shrink-0 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-[var(--hover-bg)] rounded-full transition-colors text-[var(--foreground)]"
                        title="Volver"
                    >
                        <LuArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-title font-black text-[var(--foreground)] tracking-tight">
                        DISEÑÁ TU <span className="text-[var(--accent)]">TAZA</span>
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowLibrary(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[var(--foreground)] hover:bg-[var(--hover-bg)] rounded-xl transition-all"
                    >
                        <LuFolderHeart size={18} />
                        <span className="hidden sm:inline">Mis Diseños</span>
                    </button>
                    <button
                        onClick={() => setShowSaveModal(true)}
                        disabled={elements.length === 0}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-[var(--foreground)] text-[var(--background)] rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                        <LuSave size={18} />
                        <span>Guardar</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {!isExpanded && (
                    <Toolbar
                        onAddImage={handleAddImage}
                        onAddText={handleAddText}
                        onAddEmoji={handleAddEmoji}
                        onLoadTemplate={handleLoadTemplate}
                        onExport={handleAddToCart}
                        onDelete={handleDeleteElement}
                        onBringToFront={handleBringToFront}
                        onSendToBack={handleSendToBack}
                        mugColor={mugColor}
                        onMugColorChange={setMugColor}
                        textColor={textColor}
                        onTextColorChange={setTextColor}
                        fontSize={fontSize}
                        onFontSizeChange={setFontSize}
                        fontFamily={fontFamily}
                        onFontFamilyChange={setFontFamily}
                        hasSelection={selectedId !== null}
                        hasElements={elements.length > 0}
                        stroke={stroke}
                        onStrokeChange={setStroke}
                        strokeWidth={strokeWidth}
                        onStrokeWidthChange={setStrokeWidth}
                        shadowColor={shadowColor}
                        onShadowColorChange={setShadowColor}
                        shadowBlur={shadowBlur}
                        onShadowBlurChange={setShadowBlur}
                        shadowOpacity={shadowOpacity}
                        onShadowOpacityChange={setShadowOpacity}
                        shadowOffsetX={shadowOffsetX}
                        onShadowOffsetXChange={setShadowOffsetX}
                        shadowOffsetY={shadowOffsetY}
                        onShadowOffsetYChange={setShadowOffsetY}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        curvature={curvature}
                        onCurvatureChange={setCurvature}
                        mugCoverage={selectedId ? elements.find(el => el.id === selectedId)?.coverage || 'front' : 'front'}
                        onMugCoverageChange={(coverage) => {
                            if (selectedId) {
                                const el = elements.find(e => e.id === selectedId);
                                if (el) handleUpdateElement({ ...el, coverage });
                            }
                        }}
                        imageFilters={selectedId ? (elements.find(el => el.id === selectedId) as ImageElement)?.filters : undefined}
                        onImageFiltersChange={(filters) => {
                            if (selectedId) {
                                const el = elements.find(e => e.id === selectedId);
                                if (el && el.type === 'image') {
                                    handleUpdateElement({ ...el, filters });
                                }
                            }
                        }}
                        elements={elements}
                        onReorderElements={(newElements) => {
                            const updated = newElements.map((el, i) => ({ ...el, zIndex: i }));
                            setElements(updated);
                        }}
                        onSelectElement={setSelectedId}
                        selectedId={selectedId}
                    />
                )}

                <div className={`flex-1 relative flex flex-col ${isExpanded ? 'fixed inset-0 z-[100] bg-[var(--background)]' : ''}`}>
                    <div className="flex-1 relative">
                        <Mug3DViewer
                            ref={canvasRef}
                            elements={elements}
                            selectedId={selectedId}
                            onSelect={setSelectedId}
                            onUpdateElement={handleUpdateElement}
                            mugColor={mugColor}
                            isExpanded={isExpanded}
                            showCanvas={!isExpanded}
                            onToggleExpand={() => setIsExpanded(!isExpanded)}
                        />
                    </div>

                    {!isExpanded && (
                        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                            <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-white/70">
                                {elements.length} {elements.length === 1 ? 'Elemento' : 'Elementos'}
                            </div>
                            {selectedId && (
                                <div className="px-3 py-1.5 bg-[var(--accent)]/20 backdrop-blur-md border border-[var(--accent)]/30 rounded-full text-[10px] font-black uppercase tracking-widest text-[var(--accent)] animate-in fade-in slide-in-from-right-2">
                                    Editando selección
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {!isExpanded && (
                <footer className="h-20 flex-shrink-0 border-t border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md px-8 flex items-center justify-between z-50">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Precio Estimado</span>
                            <span className="text-2xl font-black text-[var(--foreground)]">$3.500</span>
                        </div>
                        <div className="h-8 w-px bg-[var(--border)] hidden sm:block"></div>
                        <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 font-medium">
                            <LuCircleCheck className="text-green-500" />
                            Calidad Premium Garantizada
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={elements.length === 0}
                        className={`group px-8 py-3.5 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl ${elements.length > 0
                                ? "bg-[var(--accent)] text-[var(--foreground)] hover:scale-[1.05] active:scale-[0.95] shadow-[var(--accent)]/20"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                            }`}
                    >
                        <LuShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
                        AÑADIR AL CARRITO
                    </button>
                </footer>
            )}

            {showTooltip && (
                <div className="fixed bottom-24 right-8 bg-[var(--accent)] text-[var(--foreground)] px-6 py-4 rounded-lg shadow-lg font-text font-semibold animate-slide-up flex items-center gap-3 z-50">
                    <LuCircleCheck className="h-4 w-4 text-[var(--accent)]" />
                    ¡Taza agregada al carrito! ($3.500)
                </div>
            )}

            {showSaveModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border border-[var(--border)] animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                                <LuSave size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Guardar Diseño</h2>
                                <p className="text-sm text-gray-500 font-medium">Dale un nombre único a tu creación</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">
                                    Nombre del Proyecto
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Taza Galáctica..."
                                    value={designName}
                                    onChange={(e) => setDesignName(e.target.value)}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all outline-none font-bold text-gray-900"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSaveDesign()}
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowSaveModal(false)}
                                    className="flex-1 px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl hover:bg-gray-200 font-black transition-all"
                                >
                                    CANCELAR
                                </button>
                                <button
                                    onClick={handleSaveDesign}
                                    className="flex-1 px-6 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-2xl hover:scale-105 transition-all font-black shadow-lg shadow-black/10"
                                >
                                    GUARDAR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <DesignLibrary
                isOpen={showLibrary}
                onClose={() => setShowLibrary(false)}
                onLoadDesign={handleLoadDesign}
            />
        </main>
    );
}
