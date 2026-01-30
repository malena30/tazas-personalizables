"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { CanvasElement, ImageElement, TextElement, EmojiElement, MugCoverage } from "@/types/customizer";
import Toolbar from "@/components/Toolbar";
import DesignLibrary from "@/components/DesignLibrary";
import { useCartStore } from "@/store/cartStore";
import { saveDesign, updateDesign, Design } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { templates } from "@/data/templates";
import { LuFolderHeart, LuSave, LuShoppingCart, LuShoppingBag, LuCircleCheck } from "react-icons/lu";
// Importación dinámica de Mug3DViewer para evitar errores de SSR con Three.js y Konva
const Mug3DViewer = dynamic(() => import("@/components/Mug3DViewer"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-600 font-semibold">Cargando visor 3D...</p>
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

    // Estado para la pestaña activa del toolbar
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

    // Generar ID único
    const generateId = () => `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Agregar imagen
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
        setActiveTab('imagen'); // Auto-abrir pestaña imagen
    };

    // Agregar texto
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
        setActiveTab('texto'); // Auto-abrir pestaña texto
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
            // Confirmar si hay elementos actuales
            if (elements.length > 0) {
                if (!confirm("¿Deseas cargar esta plantilla? Se reemplazará tu diseño actual.")) {
                    return;
                }
            }

            // Cargar elementos de la plantilla con nuevos IDs para evitar duplicados
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

    // Eliminar elemento seleccionado
    const handleDeleteElement = () => {
        if (selectedId) {
            setElements(elements.filter(el => el.id !== selectedId));
            setSelectedId(null);
        }
    };

    // Traer al frente
    const handleBringToFront = () => {
        if (!selectedId) return;
        const maxZIndex = Math.max(...elements.map(el => el.zIndex), 0);
        setElements(elements.map(el =>
            el.id === selectedId ? { ...el, zIndex: maxZIndex + 1 } : el
        ));
    };

    // Enviar atrás
    const handleSendToBack = () => {
        if (!selectedId) return;
        const minZIndex = Math.min(...elements.map(el => el.zIndex), 0);
        setElements(elements.map(el =>
            el.id === selectedId ? { ...el, zIndex: minZIndex - 1 } : el
        ));
    };

    // Actualizar elemento (cuando se modifica en el canvas)
    const handleUpdateElement = (updatedElement: CanvasElement) => {
        setElements(elements.map(el =>
            el.id === updatedElement.id ? updatedElement : el
        ));
    };

    // Sincronizar propiedades del elemento seleccionado
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

    // Sincronizar estados locales cuando cambia la selección
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



    // Agregar al carrito
    const handleAddToCart = () => {
        if (canvasRef.current) {
            // Exportar diseño como imagen
            const uri = canvasRef.current.toDataURL({
                pixelRatio: 3,
                mimeType: 'image/png',
            });

            // Agregar al carrito
            addToCart({
                id: Date.now().toString(), // ID único basado en timestamp
                name: "Taza Personalizada",
                price: 3500, // Precio de la taza personalizada
                image: uri, // Imagen del diseño
                description: `Taza personalizada con ${elements.length} elemento(s)`,
                designId: currentDesignId || undefined
            });

            // Mostrar tooltip de confirmación
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 3000);
        }
    };

    // Guardar diseño
    const handleSaveDesign = async () => {
        if (!user) {
            // Si no está logueado, guardar temporalmente y redirigir
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
            // Generar thumbnail (opcional)
            let thumbnail = undefined;
            try {
                thumbnail = canvasRef.current?.toDataURL?.({
                    pixelRatio: 1,
                    mimeType: 'image/png',
                });
            } catch (err) {
                // Ignore thumbnail generation error
            }

            const designData = {
                name: designName,
                mug_color: mugColor,
                elements: elements,
                thumbnail: thumbnail,
            };

            if (currentDesignId) {
                // Actualizar diseño existente
                await updateDesign(currentDesignId, designData);
                alert('Diseño actualizado exitosamente!');
            } else {
                // Crear nuevo diseño
                const saved = await saveDesign(designData);
                setCurrentDesignId(saved.id);
                alert('Diseño guardado exitosamente!');
            }

            setShowSaveModal(false);
            setDesignName('');
        } catch (error) {
            alert('Error al guardar el diseño');
        }
    };

    // Cargar diseño
    const handleLoadDesign = (design: Design) => {
        setElements(design.elements);
        setMugColor(design.mug_color);
        setCurrentDesignId(design.id);
        setDesignName(design.name);
        setSelectedId(null);
    };

    // Restaurar diseño pendiente tras login
    useEffect(() => {
        const pending = localStorage.getItem('pending_design');
        if (pending) {
            try {
                const design = JSON.parse(pending);
                setElements(design.elements || []);
                setMugColor(design.mug_color || "#FFFFFF");
                setDesignName(design.name || "");
                // Limpiar para que no se restaure cada vez que refresca
                localStorage.removeItem('pending_design');

                // Si ahora está logueado, abrir el modal de guardado automáticamente
                if (user) {
                    setShowSaveModal(true);
                }
            } catch (e) {
                // Ignore parsing error
            }
        }
    }, [user]); // Re-ejecutar cuando el usuario se loguea

    return (
        <main className="w-full min-h-screen bg-[var(--background)] py-8 overflow-x-hidden">
            <div className="max-w-full mx-auto px-2 lg:px-4">
                <h1 className="text-2xl lg:text-3xl font-title font-bold text-[var(--foreground)] mb-4 lg:mb-8">
                    Diseñá tu Taza Personalizada
                </h1>

                <div className="flex gap-2 lg:gap-4 overflow-x-hidden">
                    {/* Panel de herramientas - Izquierda (ancho flexible) */}
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
                                // Reparar zIndex basado en la nueva posición del array
                                const updated = newElements.map((el, i) => ({ ...el, zIndex: i }));
                                setElements(updated);
                            }}
                            onSelectElement={setSelectedId}
                            selectedId={selectedId}
                        />
                    )}

                    {/* Visor 3D de la Taza - Centro */}
                    <div className={`flex-1 relative ${isExpanded ? 'fixed inset-0 top-0 z-[100] bg-[var(--background)] flex items-center justify-center' : ''}`} style={isExpanded ? { paddingTop: '64px' } : {}}>
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

                        {/* Información del diseño (solo visible si no está expandido) */}
                        {!isExpanded && (
                            <div className="mt-4 p-4 bg-[var(--background)] border border-[var(--border)] rounded-lg">
                                <p className="text-sm font-text text-[var(--foreground)]">
                                    <span className="font-semibold">Elementos:</span> {elements.length} |
                                    <span className="font-semibold ml-2">Seleccionado:</span> {selectedId || 'Ninguno'}
                                </p>
                                {selectedId && (
                                    <p className="text-xs text-[var(--foreground)] opacity-70 mt-2 font-text">
                                        💡 Tip: Arrastrá para mover, usa los controles de las esquinas para redimensionar
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer fijo - Botón Agregar al Carrito */}
            {!isExpanded && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border)] shadow-lg z-50">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowLibrary(true)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-text font-semibold transition-colors"
                            >
                                <LuFolderHeart size={18} /> Mis Diseños
                            </button>
                            <button
                                onClick={() => setShowSaveModal(true)}
                                disabled={elements.length === 0}
                                className={`px-4 py-2 rounded-lg font-text font-semibold transition-colors ${elements.length > 0
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <LuSave size={18} /> Guardar
                            </button>
                            <div className="flex items-center gap-2">
                                <LuShoppingCart size={24} className="text-[var(--accent)]" />
                                <div>
                                    <p className="text-lg font-title font-bold text-[var(--foreground)]">$3.500</p>
                                    <p className="text-xs text-[var(--foreground)] opacity-60">Taza personalizada</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={elements.length === 0}
                            className={`px-8 py-3 rounded-lg font-text font-semibold transition-all text-base ${elements.length > 0
                                ? 'bg-[var(--accent)] text-[var(--foreground)] hover:opacity-90 cursor-pointer shadow-md hover:shadow-lg'
                                : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <LuShoppingBag size={20} />
                                Añadir al carrito
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {/* Tooltip de confirmación */}
            {showTooltip && (
                <div className="fixed bottom-24 right-8 bg-[var(--accent)] text-[var(--foreground)] px-6 py-4 rounded-lg shadow-lg font-text font-semibold animate-slide-up flex items-center gap-3 z-50">
                    <LuCircleCheck className="h-4 w-4 text-[var(--accent)]" />
                    ¡Taza agregada al carrito! ($3.500)
                </div>
            )}

            {/* Modal para guardar diseño */}
            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-title font-bold text-gray-900 mb-4">Guardar Diseño</h2>
                        <input
                            type="text"
                            placeholder="Nombre del diseño"
                            value={designName}
                            onChange={(e) => setDesignName(e.target.value)}
                            style={{ color: '#111827' }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 font-text"
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveDesign()}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-text font-semibold"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveDesign}
                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-text font-semibold"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de biblioteca de diseños */}
            <DesignLibrary
                isOpen={showLibrary}
                onClose={() => setShowLibrary(false)}
                onLoadDesign={handleLoadDesign}
            />
        </main>
    );
}
